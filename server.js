//required modules
var http = require('http');
var request = require('request');
var schedule = require('node-schedule');
var fs = require('fs');

//constants
const PORT=8080;
const settings = 'settings.json'; 
const darkSkyBaseURL = 'https://api.darksky.net/forecast/';
const darkSkyQueryString = '?units=auto';
const dailyQuoteBaseURL = 'http://quotes.rest/qod.json?category=inspire';
const sayCommand = 'http://localhost:5005/master%20room/say/';

//misc variables
var weatherOutput;
var currentWeather;
var dailyForecast;
var morningPrompt;
var logging = true;
var quoteOutput;
var qotd;
var fullweatherSpeech;


//read config. values from settings.json configuration file
var configuration = JSON.parse(
	fs.readFileSync(settings)
);

var requestURL = darkSkyBaseURL + configuration.darksky + '/' +  configuration.latitude + ',' + configuration.longitude + darkSkyQueryString;

//sending request to darksky api to get weather information
request(requestURL, function (error, response, body) {
	if (handleResponse(error, response, body)) {
		weatherOutput = JSON.parse(body);
		//console.log(weatherOutput);
	    currentWeather = 'Current weather is ' + weatherOutput.currently.summary + '. Temperature is ' + weatherOutput.currently.temperature + '. Precipitation chance is ' + weatherOutput.currently.precipProbability;
		dailyForecast = "The daily Forecast is " + weatherOutput.daily.summary;
		

		//sending request to get a daily quote
		request(dailyQuoteBaseURL, function (error, response, body) {
			if (handleResponse(error, response, body)) {
				quoteOutput = JSON.parse(body);

				//get first quote in array passed back
				qotd = 'quote of the day is.                   .' + quoteOutput.contents.quotes[0].quote;

				fullweatherSpeech = sayCommand + currentWeather + ' ' + dailyForecast + qotd + '/en-gb';
				request(fullweatherSpeech, function (error, response, body) {
					handleResponse(error, response, body);
				})
			}
		})
  	}	
});

//evening routine
//1. Say it is time to start getting ready for bed
//2. Put on some good music
var eveningRule = new schedule.RecurrenceRule();
eveningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
eveningRule.minute = 30;
eveningRule.hour = 21;
var eveningRuleName = 'evening';
 
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

//morning routine
//1. Play wake up greeting!
//2. Play weather
//3. Start playing good music
var morningRule = new schedule.RecurrenceRule();
morningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
morningRule.minute = 15;
morningRule.hour = 7;
var morningRuleName = 'morning';
 
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

//var jobs = schedule.scheduledJobs;
//console.log(schedule);
// for(var i in jobs)
// {
// 	console.log(jobs[i].name);
// 	console.log(jobs[i].nextInvocation());
// }
//Create a server
var server = http.createServer(handleRequest);

//callback to server when hitting
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

function handleResponse(error, response, body) {
  if (!error && response.statusCode == 200 && logging) {
    console.log(body);
    return true;
  }
}

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});