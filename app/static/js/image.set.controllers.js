'use strict';

angular.module('lion.guardians.image.set.controllers', [])

.controller('NewImageSetCtrl', ['$scope', function ($scope) {

}])

.controller('SearchImageSetCtrl', ['$scope', function ($scope) {

  $scope.imageSetRange = {
    min: 1,
    max: 10,
    ceil: 20,
    floor: 0
  };

  $scope.isCollapsed = true;

}])
