// public/js/controllers/RoutineCtrl.js
angular.module('RoutineCtrl', []).controller('RoutineController', function($scope, Routine) {

    $scope.tagline = 'Nothing beats a pocket protector!';

    $scope.routines = [];

    Routine.get().then(function(res) {
    	console.log("routine controller");
    	$scope.routines = res.data;
    })

    $scope.createRoutine = function() {
		Routine.create().then(function(res) {
	    	console.log("routine saved");
	    })
    };
});