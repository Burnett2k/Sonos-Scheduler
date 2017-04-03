angular.module('WodLogService', []).factory('WodLog', ['$http', function($http) {

    return {
        // call to get all wods
        get : function() {
            return $http.get('/api/wodlogs');
        },

        // call to POST and create a new wod
        create : function(wodlogData) {
            return $http.post('/api/wodlogs', wodlogData);
        },

        // call to DELETE a wod
        delete : function(id) {
            return $http.delete('/api/wodlogs/' + id);
        }
    }       

}]);