angular.module('lion.guardians.services', [])

.factory('LincServices', ['$http', '$cacheFactory', '$q', function($http, $cacheFactory, $q) {

    var dataFactory = {};
    var urlBase = 'http://localhost:5080';
    var $httpcache = $cacheFactory.get('$http');
    // ImageSet list
    dataFactory.getImageSetList = function () {
      var cache = $httpcache.get('/imagesets/list');
      var deferred = $q.defer();
      if(cache){
        var responde = JSON.parse(cache[1]);
        deferred.resolve(responde);
      }
      else{
        $http.get('/imagesets/list', {cache: true})
        .success(function (response) {
          deferred.resolve(response);
        })
        .error(function (error) {
          deferred.reject(error);
        });
      }
      return deferred.promise;
    }
    // ImageSet list
    dataFactory.getOrganizationsList = function () {
      var cache = $httpcache.get('/organizations/list');
      var deferred = $q.defer();
      if(cache){
        var responde = JSON.parse(cache[1]);
        deferred.resolve(responde);
      }
      else{
        $http.get('/organizations/list', {cache: true})
        .success(function (response) {
          deferred.resolve(response);
        })
        .error(function (error) {
          deferred.reject(error);
        });
      }
      return deferred.promise;
    }
    // Lions list
    dataFactory.getLionsList = function () {
      var cache = $httpcache.get('/imagesets/list');
      var deferred = $q.defer();
      if(cache){
        var responde = JSON.parse(cache[1]);
        deferred.resolve(responde);
      }
      else{
        $http.get('/lions/list', {cache: true})
        .success(function (response) {
          deferred.resolve(response);
        })
        .error(function (error) {
          deferred.reject(error);
        });
      }
      return deferred.promise;
    }
    return dataFactory;
}]);
