// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // nerds page that will use the NerdController
        .when('/routines', {
            templateUrl: 'views/routine.html',
            controller: 'RoutineController'
        });

    $locationProvider.html5Mode(true);

}]);