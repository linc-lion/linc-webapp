angular.module('lion.guardians.services', [])

.factory('LincServices', ['$http', function($http) {

    var dataFactory = {};
    var urlBase = 'http://localhost:5080';

    // ImageSet list
    dataFactory.getImageSetList = function () {
        return $http.get('/imagesets/list');
    }
    // ImageSet list
    dataFactory.getOrganizationsList = function () {
        return $http.get('/organizations/list');
    }
    return dataFactory;
}]);
