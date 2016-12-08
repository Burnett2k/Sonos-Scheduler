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



var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.minute = 31;
rule.hour = 21;
 
var eveningRoutine = schedule.scheduleJob(rule, function() {
	console.log("we hit the timer!!!");
	request('http://localhost:5005/resumeall', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body) // Show the HTML for the Google homepage.
	  }
	})
})

//morning routine
//1. Play wake up greeting!
//2. Play weather
//3. Start playing good music


//evening routine
//1. Say it is time to start getting ready for bed
//2. Put on some good music




//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});