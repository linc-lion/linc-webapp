'use strict';

angular.module('lion.guardians.conservationists.controller', [])

.controller('ConservationistsCtrl', ['$scope','$state','$http','$cookies', function ($scope,$state,$http,$cookies) {

  $scope.orgs = '';
  var xsrfcookie = $cookies.get('_xsrf');
  var req = { method: 'GET',
                 url: '/users/conservationists',
                data: {},
             headers: { 'Content-Type': 'application/json', 'X-XSRFToken' : xsrfcookie},
              config: {}};
  $http(req).then(function(results){
    console.log(results.data.data);
    $scope.orgs = results.data.data;
   }, function(){
    $state.go("home");
  });
  //$scope.orgs = data;
}]);
