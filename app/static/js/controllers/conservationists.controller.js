'use strict';

angular.module('lion.guardians.conservationists.controller', [])

.controller('ConservationistsCtrl', ['$scope', 'conservationists', function ($scope, conservationists) {
  $scope.orgs = conservationists;
}]);
