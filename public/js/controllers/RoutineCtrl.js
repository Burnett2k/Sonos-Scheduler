// public/js/controllers/RoutineCtrl.js
angular.module('RoutineCtrl', []).controller('RoutineController', function($scope, Routine) {

    $scope.tagline = 'Nothing beats a pocket protector!';

    $scope.routines = [];

    Routine.get().then(function(res) {

    	$scope.routines = res.data;
    })

    $scope.createRoutine = function() {

        var routineArray = new Array($scope.newRoutineDayOfWeek);
    	var json = {
    		"name": $scope.newRoutineName,
    		"hour": $scope.newRoutineHour,
    		"minute": $scope.newRoutineMinute,
    		"dayOfWeek": routineArray
    	};
    	
    	console.log(json);
		Routine.create(json).then(function(res) {
	    	console.log("routine saved");
	    })
    };
    $scope.deleteRoutine = function(routine) {
        Routine.delete(routine._id).then(function(res) {
            console.log("routine deleted");
        })
    };
});