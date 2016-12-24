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

    $scope.tagline = 'Sonos Controls';   

}]);