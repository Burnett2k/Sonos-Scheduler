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
	
	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var sunday = new Date(today.setDate(today.getDate()-today.getDay()));
	var saturday = new Date(today.setDate(today.getDate()-today.getDay()+6));

	$scope.firstDay = sunday.getMonth() + 1 + "/" + sunday.getDate() + "/" + sunday.getFullYear();
	$scope.lastDay =  saturday.getMonth() + 1 + "/" + saturday.getDate() + "/" +saturday.getFullYear();

	$scope.changeButtonClass = function() {
		console.log("changing button class");
		if ($scope.buttonClass === "btn-danger")  {

			$scope.buttonClass = 'btn-success';
		} else {
			$scope.buttonClass = 'btn-danger';
		}
	};

	$scope.wods = [
            {id: 1, key: 'ankles'}
            , {id: 2, key: 'wrist'}
            , {id: 3, key: 'shoulder'}
            , {id: 3, key: 'lower back'}
            , {id: 3, key: 'neck'}
    ];	

}]);	