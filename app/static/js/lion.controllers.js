'use strict';

angular.module('lion.guardians.lions.controllers', ['lion.guardians.image.gallery.controllers',
                                                                       'lion.guardians.map.controllers',
                                                                       'lion.guardians.metadata.controllers'])

.controller('NewLionCtrl', ['$scope', function ($scope) {

}])

.controller('SearchLionCtrl', ['$scope', function ($scope) {

  $scope.lionRange = {
    min: 1,
    max: 10,
    ceil: 20,
    floor: 0
  };

  $scope.isCollapsed = true;

}]);
