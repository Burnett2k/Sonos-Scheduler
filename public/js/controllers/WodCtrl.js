var myApp = angular.module('WodCtrl', []);

myApp.controller('WODController', ['$scope', '$http', function($scope, $http) {

	$scope.wod = 'Workout of the day is...';

}]);	