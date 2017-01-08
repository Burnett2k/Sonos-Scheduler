//required modules
var http = require('http');
var request = require('request');
var schedule = require('node-schedule');
var fs = require('fs');
var express = require('express');
var app = express();
var db  = require('mongoose');
var bodyParser     = require('body-parser');

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

function eveningRoutine() {
	var eveningRule = new schedule.RecurrenceRule();
	eveningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	eveningRule.minute = 30;
	eveningRule.hour = 21;
	var eveningRuleName = 'eveningRoutine';
	 
	var eveningRoutine = schedule.scheduleJob(eveningRuleName, eveningRule, function() {
		request({url: 'http://192.168.1.4/api/JFrRiCjcmLRcI8v7RLq1QEpQXZp4UyjXtdjylYyC/lights/1/state/', method: 'PUT', json: {"on":true, "bri":100}}, function(error, response, body) {
			handleResponse(error, response, body);
		})
		console.log("we hit the timer!!!");
		request('http://localhost:5005/master%20room/say/good evening sawyer. I hope you had a good day today! Please try and read a book or reflect on the day before bed', function (error, response, body) {
		 	handleResponse(error, response, body);
		})
		request('http://localhost:5005/master%20room/favorite/sleep', function (error, response, body) {
		  	handleResponse(error, response, body);
		})
		setTimeout(setShuffle.bind(null, 'on'), 1000);
		setTimeout(setVolume.bind(null, 15), 2000);
	})
}

function frontPorchLightOnRoutine() {
	var eveningRule = new schedule.RecurrenceRule();
	eveningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	eveningRule.minute = 30;
	eveningRule.hour = 18;
	var eveningRuleName = 'frontPorchLightOnRoutine';

	 
	var eveningRoutine = schedule.scheduleJob(eveningRuleName, eveningRule, function() {
		request({url: 'http://192.168.1.4/api/JFrRiCjcmLRcI8v7RLq1QEpQXZp4UyjXtdjylYyC/lights/2/state/', method: 'PUT', json: {"on":true, "bri":200}}, function(error, response, body) {
			handleResponse(error, response, body);
				console.log("turning on porch light");
		})
	})
}

function frontPorchLightOffRoutine() {
	var eveningRule = new schedule.RecurrenceRule();
	eveningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	eveningRule.minute = 30;
	eveningRule.hour = 4;
	var eveningRuleName = 'frontPorchLightOffRoutine';

	 
	var eveningRoutine = schedule.scheduleJob(eveningRuleName, eveningRule, function() {
		request({url: 'http://192.168.1.4/api/JFrRiCjcmLRcI8v7RLq1QEpQXZp4UyjXtdjylYyC/lights/2/state/', method: 'PUT', json: {"on":false}}, function(error, response, body) {
			handleResponse(error, response, body);
			console.log("turning off porch light");
		})
	})
}

function morningRoutine() {
	var morningRule = new schedule.RecurrenceRule();
	morningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	morningRule.minute = 00;
	morningRule.hour = 6;
	var morningRuleName = 'morningRoutine';
	 
	var morningRoutine = schedule.scheduleJob(morningRuleName, morningRule, function() {
		console.log("we hit the timer!!!");
		request({url: 'http://192.168.1.4/api/JFrRiCjcmLRcI8v7RLq1QEpQXZp4UyjXtdjylYyC/lights/1/state/', method: 'PUT', json: {"on":true, "bri":254}}, function(error, response, body) {
			handleResponse(error, response, body);
		})

		morningGreeting();

		setTimeout(getWeather, 10000);
		setTimeout(getQotd, 30000);

		setTimeout(playStarred, 40000);
		setTimeout(setShuffle.bind(null, 'on'), 60000);
		setTimeout(setVolume.bind(null, 20), 62000);
	})
}

function morningGreeting() {
	request('http://localhost:5005/master%20room/say/good morning sawyer. Please make sure to have a good day today!', function (error, response, body) {
			handleResponse(error, response, body);
		})
}
function setShuffle(setting) {
	request('http://localhost:5005/master%20room/shuffle/' + setting, function (error, response, body) {
			handleResponse(error, response, body);
		})
}
function setVolume(setting) {
	request('http://localhost:5005/master%20room/volume/' + setting, function (error, response, body) {
	  		handleResponse(error, response, body);
		})
}
function playStarred() {
	request('http://localhost:5005/master%20room/favorite/starred', function (error, response, body) {
			handleResponse(error, response, body);
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
		    		currentWeather = 'Current weather is ' + weatherOutput.currently.summary + '. Weekly weather is ' + weatherOutput.daily.summary + '. Temperature is ' + weatherOutput.currently.temperature + '. Precipitation chance is ' + weatherOutput.currently.precipProbability + '.';
					dailyForecast = "The daily Forecast is " + daily[i].summary;
				}
			}

			request(sayCommand + currentWeather + ' ' + dailyForecast, function (error, response, body) {
				handleResponse(error, response, body);
			})
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
