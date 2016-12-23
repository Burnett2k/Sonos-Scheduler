// public/js/controllers/MainCtrl.js
var myApp = angular.module('MainCtrl', []);

myApp.controller('MainController', ['$scope', '$http', function($scope, $http) {

	$scope.pauseSonos = function () {
		$http.get('http://localhost:5005/master%20room/pause')
       .then(function (response) { 
       		$scope.sonosResult = response.data;
       });

	};
	$scope.playSonos = function() {
		$http.get('http://localhost:5005/master%20room/play')
        .then(function (response) {
        	$scope.sonosResult = response.data;
    	});
	};


    $scope.tagline = 'Sonos Controls';   

}]);