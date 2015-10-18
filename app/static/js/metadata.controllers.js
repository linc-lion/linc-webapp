'use strict';

angular.module('lion.guardians.metadata.controllers', [])

.controller('EditMetadataCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {
  //$scope.modal = {title: 'Metadata', content: 'Form'};
 function MyController($scope) {
    $scope.title = 'Metadata';
    $scope.content = 'Form';
  }
  MyController.$inject = ['$scope'];
  var myModal = $modal({controller: MyController, templateUrl: 'metadata', show: false});

  $scope.showModal = function () {
    myModal.$promise.then(myModal.show);
  };

  $scope.hideModal = function ($hide) {
    myModal.$promise.then($hide);
    $window.history.back();
  };

  $scope.Cancel = function ($hide) {
    myModal.$promise.then($hide);
    $window.history.back();
  };

  $scope.Save = function ($hide) {
    myModal.$promise.then($hide);
    $window.history.back();
  };

}])
