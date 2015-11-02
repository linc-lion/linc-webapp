
'use strict';

angular.module('lion.guardians.home.controller', [])
// Home
.controller('HomeCtrl', ['$scope', '$state', 'LincServices', function ($scope, $state, LincServices) {

  LincServices.getlists(['imagesets','lions','organizations'],function(dados){

  })
  //LincServices.getAlllists(function(dados){
  $scope.options = {imageset: { btn: {save:true, update:true},
                              title: 'Image Set Metadata'},
                       lions: { btn: {save:true, update:true},
                              title:'Lion Metadata'}
                   };
  //});
  $scope.goto_imageset = function (Id) {
    $state.go("imageset", { id: Id });
  }
  $scope.goto_lion = function (Id) {
    $state.go("lion", { id: Id });
  }
}]);
