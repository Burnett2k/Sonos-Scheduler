//Lets require/import the HTTP module
var http = require('http');
var request = require('request');
var schedule = require('node-schedule');

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}



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
	request('http://localhost:5005/master%20room/favorite/sleep', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body);
	  }
	})
	request('http://localhost:5005/master%20room/volume/15', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body);
	  }
	})
})


//morning routine
//1. Play wake up greeting!
//2. Play weather
//3. Start playing good music

var morningRule = new schedule.RecurrenceRule();
morningRule.dayOfWeek = [0, new schedule.Range(0, 6)];
morningRule.minute = 45;
morningRule.hour = 7;
var morningRuleName = 'morning';
 
var morningRoutine = schedule.scheduleJob(morningRuleName, morningRule, function() {
	console.log("we hit the timer!!!");
	request('http://localhost:5005/master%20room/favorite/starred', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body);
	  }
	})
	request('http://localhost:5005/master%20room/volume/35', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body);
	  }
	})
})

var jobs = schedule.scheduledJobs;
for(var i in jobs)
{
	console.log(jobs[i].name);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});