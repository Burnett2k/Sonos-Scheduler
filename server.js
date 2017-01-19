//required modules
var http = require('http');
var request = require('request');
var schedule = require('node-schedule');
var fs = require('fs');
var express = require('express');
var app = express();
var db = require('mongoose');
var bodyParser = require('body-parser');

//bodyparser stuff
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.use('/', express.static(__dirname + '/public'));
require('./routes')(app);
exports = app;

//constants
const PORT=8080;
const settings = 'settings.json'; 
const darkSkyBaseURL = 'https://api.darksky.net/forecast/';
const darkSkyQueryString = '?units=us&language=en&exclude=[minutely,alerts,flags,hourly]';
const dailyQuoteBaseURL = 'http://quotes.rest/qod.json?category=inspire';
const sayCommand = 'http://localhost:5005/master%20room/say/';

//read config. values from settings.json configuration file
var configuration = JSON.parse(
	fs.readFileSync(settings)
);

db.Promise = global.Promise;
db.connect(configuration.mongoUrl);

//misc variables
var weatherOutput;
var currentWeather;
var dailyForecast;
var morningPrompt;
var logging = true;
var quoteOutput;
var qotd;
var fullweatherSpeech;
var currentDate = new Date();
var year = currentDate.getFullYear();
var month = currentDate.getMonth();
var day = currentDate.getDate();
var currentDateUNIX = new Date(year, month, day).getTime() / 1000;

eveningRoutine();
morningRoutine();
frontPorchLightOnRoutine();
frontPorchLightOffRoutine();

app.post('/createRoutine', function (req, res) {
	newRoutine(req, res);
	res.sendStatus(200);
});

function newRoutine(req) {
	console.log("adding routine to scheduler");
	var newRule = new schedule.RecurrenceRule();
	var newRuleName = req.body.name;

	//todo update to 
	newRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	newRule.minute = req.body.minute;
	newRule.hour = req.body.hour;
	newRule.message = req.body.message;
	
	schedule.scheduleJob(newRule, function() {
		//todo update to take a text parameter or something
		request('http://localhost:5005/master%20room/say/' + newRule.message, function (error, response, body) {
		 	handleResponse(error, response, body);
		 	console.log("timer was hit");
		})
	});
}

function eveningRoutine() {
	var eveningRule = new schedule.RecurrenceRule();
	eveningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	eveningRule.minute = 30;
	eveningRule.hour = 21;
	var eveningRuleName = 'eveningRoutine';
	 
	var eveningRoutine = schedule.scheduleJob(eveningRuleName, eveningRule, function() {
		console.log("evening routine starting");
		setLights({url: 'http://192.168.1.2/api/JFrRiCjcmLRcI8v7RLq1QEpQXZp4UyjXtdjylYyC/lights/1/state/', method: 'PUT', json: {"on":true, "bri":100}});
		playFavorite('sleep');
		setShuffle('on');
		setVolume(15);
		setTimeout(eveningGreeting, 10000);
	})
}

function frontPorchLightOnRoutine() {
	var eveningRule = new schedule.RecurrenceRule();
	eveningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	eveningRule.minute = 30;
	eveningRule.hour = 18;
	var eveningRuleName = 'frontPorchLightOnRoutine';
	var eveningRoutine = schedule.scheduleJob(eveningRuleName, eveningRule, function() {
		console.log("turning on front porch light");
		setLights({url: 'http://192.168.1.2/api/JFrRiCjcmLRcI8v7RLq1QEpQXZp4UyjXtdjylYyC/lights/2/state/', method: 'PUT', json: {"on":true, "bri":200}});
	})
}

function frontPorchLightOffRoutine() {
	var eveningRule = new schedule.RecurrenceRule();
	eveningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	eveningRule.minute = 30;
	eveningRule.hour = 4;
	var eveningRuleName = 'frontPorchLightOffRoutine';
	var eveningRoutine = schedule.scheduleJob(eveningRuleName, eveningRule, function() {
		console.log("turning off front porch light");
		setLights({url: 'http://192.168.1.2/api/JFrRiCjcmLRcI8v7RLq1QEpQXZp4UyjXtdjylYyC/lights/2/state/', method: 'PUT', json: {"on":false}});
	})	
}

function morningRoutine() {
	var morningRule = new schedule.RecurrenceRule();
	morningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	morningRule.minute = 00;
	morningRule.hour = 6;
	var morningRuleName = 'morningRoutine';
	var morningRoutine = schedule.scheduleJob(morningRuleName, morningRule, function() {
		console.log("morning routine starting");
		setLights({url: 'http://192.168.1.2/api/JFrRiCjcmLRcI8v7RLq1QEpQXZp4UyjXtdjylYyC/lights/1/state/', method: 'PUT', json: {"on":true, "bri":254}});
		playFavorite('starred');
		setShuffle('on');
		setVolume(20);
		morningGreeting();

		setTimeout(getWeather, 20000);
		setTimeout(getQotd, 60000);
	})
}

function morningGreeting() {
	request('http://localhost:5005/master%20room/say/good morning sawyer. Please make sure to have a good day today!', function (error, response, body) {
			if (handleResponse(error, response, body)) {
				console.log("successfully sent morning Greeting");	
			}
		})
}
function eveningGreeting() {
	request('http://localhost:5005/master%20room/say/good evening sawyer. I hope you had a good day today! Dont forget to finish your five minute journal and reflect on the days accomplishments', function (error, response, body) {
			if (handleResponse(error, response, body)) {
				console.log("successfully sent morning Greeting");	
			}
		})
}
function setShuffle(setting) {
	request('http://localhost:5005/master%20room/shuffle/' + setting, function (error, response, body) {
			if (handleResponse(error, response, body)) {
				console.log("successfully set shuffle");		
			}
		})
}
function setVolume(setting) {
	request('http://localhost:5005/master%20room/volume/' + setting, function (error, response, body) {
	  		if (handleResponse(error, response, body)) {
				console.log("successfully set volume to " + setting + ' on sonos');		
			}
		})
}
function playFavorite(playlist) {
	request('http://localhost:5005/master%20room/favorite/' + playlist, function (error, response, body) {
			if (handleResponse(error, response, body)) {
				console.log("successfully started " + playlist + " playlist.");
			}
		})
}
function textToSpeech(text) {
	request(sayCommand + text, function (error, response, body) {
		if (handleResponse(error, response, body)) {
			console.log("successfully sent text to sonos");
		}
	})
}
function setLights(settings) {
	request(settings, function(error, response, body) {
		if (handleResponse(error, response, body)) {
			console.log('successfully set lights');
		}
	})
}	


function getWeather() {
	var requestURL = darkSkyBaseURL + configuration.darksky + '/' +  configuration.latitude + ',' + configuration.longitude + darkSkyQueryString;
	//sending request to darksky api to get weather information
	console.log("getting weather");
	console.log("Hitting API for weather: " + requestURL);
	console.log("current UNIX time " + currentDateUNIX);
	request(requestURL, function (error, response, body) {
		if (handleResponse(error, response, body)) {
			weatherOutput = JSON.parse(body);
			var daily = weatherOutput.daily.data;
			
			for (var i = 0; i < daily.length; i++) {
				if (daily[i].time === currentDateUNIX) {
					console.log("found the proper daily routine");
					console.log(' daily weather ' + weatherOutput.daily);
		    		currentWeather = 'Current weather is ' + weatherOutput.currently.summary + '. Weekly weather is ' + weatherOutput.daily.summary + '. Temperature is ' + weatherOutput.currently.temperature + '. Precipitation chance is ' + weatherOutput.currently.precipProbability + '.';
					dailyForecast = "The daily Forecast is " + daily[i].summary;
					textToSpeech(currentWeather + ' ' + dailyForecast);
					break;
				}
			}

	  	}	
	})
}

function getQotd() {
	//sending request to get a daily quote
	console.log("getting qotd");
	console.log("Hitting PI for qotd: " + dailyQuoteBaseURL);
	request(dailyQuoteBaseURL, function (error, response, body) {

		if (handleResponse(error, response, body)) {
			quoteOutput = JSON.parse(body);

			//get first quote in array passed back
			qotd = 'quote of the day is by: ' + quoteOutput.contents.quotes[0].author + '. It is: ' + quoteOutput.contents.quotes[0].quote;
			//qotd is giving me issues so i've commented out its usage for now.
			fullweatherSpeech = sayCommand + qotd;
			
			request(fullweatherSpeech, function (error, response, body) {
				handleResponse(error, response, body);
			})
		}
	})
}

//var jobs = schedule.scheduledJobs;
//console.log(schedule);
// for(var i in jobs)
// {
// 	console.log(jobs[i].name);
// 	console.log(jobs[i].nextInvocation());
// }

app.listen(PORT);


function handleResponse(error, response, body) {
  if (!error && response.statusCode == 200 && logging) {
    console.log(body);
    return true;
  }
}
