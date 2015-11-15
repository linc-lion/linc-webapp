
'use strict';

angular.module('lion.guardians.home.controller', [])
// Home
.controller('HomeCtrl', ['$scope', '$state', function ($scope, $state) {
  $scope.options = { imageset: { type: 'imageset', edit: 'new' },
                        lions: { type: 'lion', edit: 'new'}};

  $scope.goto_imageset = function (Id) {
    $state.go("imageset", { id: Id });
  }
  $scope.goto_lion = function (Id) {
    $state.go("lion", { id: Id });
  }

}]);
