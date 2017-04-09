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
	$scope.wodLogs = [];
	
	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var sunday = new Date(today.setDate(today.getDate()-today.getDay()));
	var saturday = new Date(today.setDate(today.getDate()-today.getDay()+6));

	$scope.firstDay = sunday.getMonth() + 1 + "/" + sunday.getDate() + "/" + sunday.getFullYear();
	$scope.lastDay =  saturday.getMonth() + 1 + "/" + saturday.getDate() + "/" +saturday.getFullYear();

    Wod.get().then(function(res) {
    	$scope.wods = res.data;
    });	

    WodLog.get().then(function(res) {
    	$scope.wodLogs = res.data;
    	console.log($scope.wodLogs);
    });

	$scope.toggleButtonState = function(wod) {
		console.log("id = " + wod._id);
		//check if id exists in array. if it does, remove it. if it doesn't add it.
		if ($.inArray(wod._id, $scope.activeButtons) > -1) {
			console.log("it is in array so we will delete");

			//delete
			$scope.activeButtons.splice($scope.activeButtons.indexOf(wod._id));
			deleteWodLog(wod);


		} else {
			console.log("not in array so adding");
			$scope.activeButtons.push(wod._id);
			createWodLog(wod);
		}

		console.log($scope.activeButtons);
	};

//todo need to call one method from ng-click that handles all of the logic of saving / deleting and setting the active / inactive buttons.

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

    createWodLog = function(wod) {
    	var json = {
    		"wodId": wod._id,
    	    "wodName" : wod.wodName,
		    "timeCompleted": new Date()
    	};

    	//todo move adding to the array after the db save maybe?
        WodLog.create(json).then(function(res) {
            $scope.wodLogs.push(res.data.wodLog);
            console.log("wod log saved");
        });
    }

    deleteWodLog = function(wod) {
    	//todo move adding to the array after the db save maybe?
    	$scope.wodLogs.forEach( function (wodLog)
		{
			console.log("entering loop");

			if (wod._id === wodLog.wodId) {
				
		 	   var wodId = wodLog.wodId;
		 	   console.log("found a match");
		 	    WodLog.delete(wodLog._id).then(function(res) {
	 	    		$scope.wodLogs.splice($scope.wodLogs.indexOf(wodLog._id));
    				console.log("deleted");
				});
			}
		});
    }

}]);	