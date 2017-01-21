// public/js/controllers/RoutineCtrl.js
var myModule = angular.module('RoutineCtrl', []);

myModule.controller('RoutineController', ['$scope', '$http', 'Routine', function($scope, $http, Routine) {

    $scope.tagline = 'Nothing beats a pocket protector!';

    $scope.routines = [];

    $scope.checkboxModel = {
        sunday : false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
    };   

    Routine.get().then(function(res) {
    	$scope.routines = res.data;
    })

    $scope.createRoutine = function() {

        var routineArray = new Array();

        if ($scope.checkboxModel.sunday) { 
            routineArray.push(0);
        };
        if ($scope.checkboxModel.monday) { 
            routineArray.push(1)
        };
        if ($scope.checkboxModel.tuesday) { 
            routineArray.push(2)
        };
        if ($scope.checkboxModel.wednesday) { 
            routineArray.push(3)
        };
        if ($scope.checkboxModel.thursday) { 
            routineArray.push(4)
        };
        if ($scope.checkboxModel.friday) { 
            routineArray.push(5)
        };
        if ($scope.checkboxModel.saturday) { 
            routineArray.push(6)
        };

    	var json = {
    		"name": $scope.newRoutineName,
    		"hour": $scope.newRoutineHour,
    		"minute": $scope.newRoutineMinute,
    		"dayOfWeek": routineArray,
            "message": $scope.newRoutineMessage
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