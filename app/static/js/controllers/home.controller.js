
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
  $scope.goto_imageset = function () {
    $state.go("imageset");
  }
  $scope.goto_lion = function () {
    $state.go("lion");
  }
}]);
