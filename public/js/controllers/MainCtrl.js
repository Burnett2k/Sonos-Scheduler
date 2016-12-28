// public/js/controllers/MainCtrl.js
var myApp = angular.module('MainCtrl', []);

myApp.controller('MainController', ['$scope', '$http', function($scope, $http) {

	$scope.previousTrack = function () {
		$http.get('http://localhost:5005/master%20room/previous').
       	then(function (response) { 
       		$scope.sonosResult = response.data.status;
        }, function (response) {
        	console.log(response);
       		$scope.sonosResult = 'error';
        });
	};
	$scope.pauseSonos = function () {
		$http.get('http://localhost:5005/master%20room/pause').
       	then(function (response) { 
       		$scope.sonosResult = response.data.status;
        }, function (response) {
       		$scope.sonosResult = 'error';
        });
	};
	$scope.playSonos = function() {
		$http.get('http://localhost:5005/master%20room/play').
		then(function (response) { 
	   		$scope.sonosResult = response.data.status;
	    }, function (response) {
		   	$scope.sonosResult = 'error';
	   });
	};
	$scope.nextTrack = function () {
		$http.get('http://localhost:5005/master%20room/next').
       	then(function (response) { 
       		$scope.sonosResult = response.data.status;
        }, function (response) {
       		$scope.sonosResult = 'error';
        });
	};
	$scope.sayCommand = function(speechText) {
		if (speechText) {
			$http.get('http://localhost:5005/master%20room/say/' + speechText).
	       	then(function (response) { 
	       		$scope.sonosResult = response.data.status;
	        }, function (response) {
	       		$scope.sonosResult = 'error';
	        });
       }
	};
	$scope.searchMusic = function(musicSearchText) {
		console.log("searching for songs by " + musicSearchText);
		if (musicSearchText) {
			$http.get('http://localhost:5005/master%20room/musicsearch/spotify/song/' + musicSearchText).
	       	then(function (response) { 
	       		$scope.sonosResult = response.data.status;
	        }, function (response) {
	       		$scope.sonosResult = 'error';
	        });
       }
	};
	$scope.increaseVolume = function() {
		adjustVolume('+5');
	};
	$scope.decreaseVolume = function() {
		adjustVolume('-5');
	};
	adjustVolume = function(increment) {
		
		console.log("adjusting volume by " + increment);
		$http.get('http://localhost:5005/master%20room/volume/' + increment).
       	then(function (response) { 
       		$scope.sonosResult = response.data.status;
        }, function (response) {
       		$scope.sonosResult = 'error'; 
        });
	};

	$scope.brightenLights = function() {
		//todo add actual code to toggle lights
		adjustLights(5);
	};
	$scope.dimLights = function() {
		adjustLights(-5);
	}
	adjustLights = function(increment) {
		console.log("adjusting lights by " + increment);
		$scope.hueResult = "success";
	}

    $scope.tagline = 'Sonos Controls';   

}]);