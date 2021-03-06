// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // 
        .when('/routines', {
            templateUrl: 'views/routine.html',
            controller: 'RoutineController'
        })

        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);

}]);