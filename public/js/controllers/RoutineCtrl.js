// public/js/controllers/RoutineCtrl.js
var myModule = angular.module('RoutineCtrl', []);

myModule.controller('RoutineController', ['$scope', '$http', 'Routine', function($scope, $http, Routine) {

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

        //console.log(json);
        Routine.create(json).then(function(res) {
            console.log("routine saved");
        });
        
        $http.post('/createRoutine', JSON.stringify(json))
        .then(function() {
            console.log("success");
        })   // success
        .catch(function() {
            console.log("error");
        }); // error
    	

    };
    $scope.deleteRoutine = function(routine) {
        Routine.delete(routine._id).then(function(res) {
            var index = $scope.routines.indexOf(routine);
            $scope.routines.splice(index, 1);
            console.log("routine deleted");
        })
    };
}]);