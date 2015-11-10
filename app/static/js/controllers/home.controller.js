
'use strict';

angular.module('lion.guardians.home.controller', [])
// Home
.controller('HomeCtrl', ['$scope', '$state', 'LincServices', function ($scope, $state, LincServices) {

  LincServices.getlists(['imagesets','lions','organizations'],function(dados){

  })

  $scope.options = { imageset: { type: 'imageset', edit: 'new' },
                        lions: { type: 'lion', edit: 'new'}};

  $scope.goto_imageset = function (Id) {
    $state.go("imageset", { id: Id });
  }
  $scope.goto_lion = function (Id) {
    $state.go("lion", { id: Id });
  }
}]);
