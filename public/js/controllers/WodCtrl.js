var myModule = angular.module('WodCtrl', []);

myModule.directive("toggleButtonClass", function() {
	return {
		link: function($scope, element, attr) {
      		element.on("click", function() {
        	element.toggleClass("btn-danger");
  		});
    	}
	}
})

myModule.controller('WODController', ['$scope', '$http', 'Wod', 'WodLog', function($scope, $http, Wod, WodLog) {

	//$scope.wod = 'Workout of the day is...';
	$scope.buttonClass = "btn-danger";
	$scope.activeButtons = [];
	$scope.wods = [];
	
	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var sunday = new Date(today.setDate(today.getDate()-today.getDay()));
	var saturday = new Date(today.setDate(today.getDate()-today.getDay()+6));

	$scope.firstDay = sunday.getMonth() + 1 + "/" + sunday.getDate() + "/" + sunday.getFullYear();
	$scope.lastDay =  saturday.getMonth() + 1 + "/" + saturday.getDate() + "/" +saturday.getFullYear();

    Wod.get().then(function(res) {
    	$scope.wods = res.data;
    });	

	$scope.toggleButtonState = function(id) {
		console.log("id = " + id);
		//check if id exists in array. if it does, remove it. if it doesn't add it.
		if ($.inArray(id, $scope.activeButtons) > -1) {
			console.log("it is in array so we will delete");

			//delete
			$scope.activeButtons.splice($scope.activeButtons.indexOf(id));

		} else {
			console.log("not in array so adding");
			$scope.activeButtons.push(id);
		}

		console.log($scope.activeButtons);
	};



    $scope.createWod = function() {

    	var json = {
    		"name": $scope.newWodName,
    		"description": $scope.newWodDescription,
    		"imgs": [ $scope.newWodImage1 ]
    	};

        Wod.create(json).then(function(res) {
            console.log("routine saved");
        });
    };

    $scope.createWodLog = function(wodId, wodLogName) {
    	var json = {
    		"wodId": wodId,
    	    "wodName" : wodLogName,
		    "timeCompleted": new Date()
    	};

        WodLog.create(json).then(function(res) {
            console.log("wod log saved");
        });
    }

    $scope.deleteWodLog = function(wod) {

    }

}]);	