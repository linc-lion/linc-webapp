'use strict';

angular.module('lion.guardians.image.gallery.controllers', [])
// Image Gallery Controller
.controller('ImageGalleryCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {
  //$scope.modal = {title: 'Image Gallery', content: 'Image Galleryl<br />Contents!'};
  function MyController($scope) {
    $scope.title = 'Image Gallery';
    $scope.content = 'Image Galleryl<br />Contents!';
  }
  MyController.$inject = ['$scope'];
  var myModal = $modal({controller: MyController, templateUrl: 'imagegallery', show: false});

  $scope.showModal = function () {
    myModal.$promise.then(myModal.show);
  };

  $scope.hideModal = function ($hide) {
    myModal.$promise.then($hide);
    $window.history.back();
  };

  $scope.photos = [
    {
      id: 1,
      name: 'leão 1',
      age: 14,
      url: "/static/images/medium/lion1.jpg"
    },
    {
      id: 2,
      name: 'leão 2',
      age: 14,
      url: "/static/images/medium/lion1.jpg"
    },
    {
      id: 3,
      name: 'leão 3',
      age: 14,
      url: "/static/images/medium/lion1.jpg"
    },
  ];

  /*$scope.photo_select = function($event, value){
    value=!value;
    $event.stopPropagation();
  }*/
  $scope.show_photo = function(url){
    var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
    win.focus();
  }
}])

.controller('CVResultsCtrl', ['$scope', '$modal', function ($scope, $modal) {
  $scope.modal = {title: 'CV Results', content: 'Form'};
  $scope.modal2 = {title: 'Lion Search', content: 'Search'};
}])
