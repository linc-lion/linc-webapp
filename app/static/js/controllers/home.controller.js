
'use strict';

angular.module('lion.guardians.home.controller', [])
// Home
.controller('HomeCtrl', ['$scope', '$state', function ($scope, $state) {
  $scope.goto_imageset = function () {
    $state.go("imageset");
  }
  $scope.goto_lion = function () {
    $state.go("lion");
  }
}]);
