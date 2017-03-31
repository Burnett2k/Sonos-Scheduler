var myApp = angular.module('WodCtrl', []);

myApp.directive("toggleButtonClass", function() {
	return {
		link: function($scope, element, attr) {
      		element.on("click", function() {
        	element.toggleClass("btn-danger");
  		});
    	}
	}
})

myApp.controller('WODController', ['$scope', '$http', function($scope, $http) {

	$scope.wod = 'Workout of the day is...';
	$scope.buttonClass = "btn-danger";
	$scope.activeButtons = [];
	
	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var sunday = new Date(today.setDate(today.getDate()-today.getDay()));
	var saturday = new Date(today.setDate(today.getDate()-today.getDay()+6));

	$scope.firstDay = sunday.getMonth() + 1 + "/" + sunday.getDate() + "/" + sunday.getFullYear();
	$scope.lastDay =  saturday.getMonth() + 1 + "/" + saturday.getDate() + "/" +saturday.getFullYear();

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

	$scope.wods = [
            {id: 0, key: 'ankles'}
            , {id: 1, key: 'wrist'}
            , {id: 2, key: 'shoulder'}
            , {id: 3, key: 'lower back'}
            , {id: 4, key: 'neck'}
    ];	

}]);	