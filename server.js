//required modules
var http = require('http');
var request = require('request');
var schedule = require('node-schedule');
var fs = require('fs');
var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/public'));


//constants
const PORT=8080;
const settings = 'settings.json'; 
const darkSkyBaseURL = 'https://api.darksky.net/forecast/';
const darkSkyQueryString = '?units=us&language=en&exclude=[minutely,alerts,flags,hourly]';
const dailyQuoteBaseURL = 'http://quotes.rest/qod.json?category=inspire';
const sayCommand = 'http://localhost:5005/master%20room/say/';

//misc variables


var weatherOutput;
var currentWeather;
var dailyForecast;
var morningPrompt;
var logging = false;
var quoteOutput;
var qotd;
var fullweatherSpeech;
var currentDate = new Date();
var year = currentDate.getFullYear();
var month = currentDate.getMonth();
var day = currentDate.getDate();
var currentDateUNIX = new Date(year, month, day).getTime() / 1000;

//read config. values from settings.json configuration file

var configuration = JSON.parse(
	fs.readFileSync(settings)
);

var requestURL = darkSkyBaseURL + configuration.darksky + '/' +  configuration.latitude + ',' + configuration.longitude + darkSkyQueryString;


getWeather();
eveningRoutine();
morningRoutine();



function getWeather() {
	//sending request to darksky api to get weather information
	console.log("getting weather");
	request(requestURL, function (error, response, body) {
		if (handleResponse(error, response, body)) {
			weatherOutput = JSON.parse(body);
			var daily = weatherOutput.daily.data;
			console.log(daily);
			for (var i = 0; i < daily.length; i++) {
				if (daily[i].time === currentDateUNIX) {
		    		currentWeather = 'Current weather is ' + weatherOutput.currently.summary + '. Weekly weather is ' + weatherOutput.daily.summary + '. Temperature is ' + weatherOutput.currently.temperature + '. Precipitation chance is ' + weatherOutput.currently.precipProbability + '.';
					dailyForecast = "The daily Forecast is " + daily[i].summary;
				}
			}

			//sending request to get a daily quote
			// request(dailyQuoteBaseURL, function (error, response, body) {
			// 	if (handleResponse(error, response, body)) {
			// 		quoteOutput = JSON.parse(body);

			// 		//get first quote in array passed back
			// 		qotd = 'quote of the day is.                   .' + quoteOutput.contents.quotes[0].quote;
			// 		//qotd is giving me issues so i've commented out its usage for now.
			// 		fullweatherSpeech = sayCommand + currentWeather + ' ' + dailyForecast + '/en-gb';
					
			// 		request(fullweatherSpeech, function (error, response, body) {
			// 			handleResponse(error, response, body);
			// 		})
			// 	}
			// })
	  	}	
	})
}


function eveningRoutine() {
	//evening routine
	//1. Say it is time to start getting ready for bed
	//2. Put on some good music
	var eveningRule = new schedule.RecurrenceRule();
	eveningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	eveningRule.minute = 30;
	eveningRule.hour = 21;
	var eveningRuleName = 'evening';
	console.log("creating evening routine");
	 
	var eveningRoutine = schedule.scheduleJob(eveningRuleName, eveningRule, function() {
		console.log("we hit the timer!!!");
		request('http://localhost:5005/master%20room/say/good evening sawyer. I hope you had a good day today!/en-au', function (error, response, body) {
		 	handleResponse(error, response, body);
		})
		request('http://localhost:5005/master%20room/favorite/sleep', function (error, response, body) {
		  	handleResponse(error, response, body);
		})
		request('http://localhost:5005/master%20room/volume/15', function (error, response, body) {
		 	handleResponse(error, response, body);
		})
	})
}

function morningRoutine() {
	var morningRule = new schedule.RecurrenceRule();
	morningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
	morningRule.minute = 15;
	morningRule.hour = 6;
	var morningRuleName = 'morning';
	console.log("creating morning routine");
	 
	var morningRoutine = schedule.scheduleJob(morningRuleName, morningRule, function() {
		console.log("we hit the timer!!!");
		request('http://localhost:5005/master%20room/say/good morning sawyer. Please make sure to have a good day today!/en-au', function (error, response, body) {
			handleResponse(error, response, body);
		})
		request('http://localhost:5005/master%20room/favorite/starred', function (error, response, body) {
			handleResponse(error, response, body);
		})
		request('http://localhost:5005/master%20room/shuffle/on', function (error, response, body) {
			handleResponse(error, response, body);
		})
		request('http://localhost:5005/master%20room/volume/35', function (error, response, body) {
	  		handleResponse(error, response, body);
		})
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

app.get('/', function (req, res) {
	console.log("hello");
	res.sendfile('index.html');
});
