'use strict';

angular.module('lion.guardians.image.gallery.controller', ['lion.guardians.image.gallery.directive'])

.controller('ImageGalleryCtrl', ['$scope', '$window', '$uibModalInstance',function($scope, $window, $uibModalInstance) {

  $scope.ok = function () {
    $uibModalInstance.close("ok");
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.title = 'Image Gallery';
  $scope.content = 'Image Gallery<br />Contents!';

  $scope.photos = [ { id: 1, name: 'leão 1', age: 13, url: "/static/images/medium/lion1.jpg" },
                    { id: 2, name: 'leão 2', age: 12, url: "/static/images/medium/lion2.jpeg" },
                    { id: 3, name: 'leão 3', age: 14, url: "/static/images/medium/lion3.jpeg" },
                    { id: 4, name: 'leão 4', age: 15, url: "/static/images/medium/lion4.jpg" },
                    { id: 5, name: 'leão 5', age: 8, url: "/static/images/medium/lion5.jpg" },
                    { id: 6, name: 'leão 6', age: 9, url: "/static/images/medium/lion6.jpeg" },
                    { id: 7, name: 'leão 7', age: 6, url: "/static/images/medium/lion7.jpeg" },
                    { id: 8, name: 'leão 8', age: 2, url: "/static/images/medium/lion8.jpeg" },
                    { id: 9, name: 'leão 9', age: 7, url: "/static/images/medium/lion9.jpg" },
                    { id: 10, name: 'leão 10', age: 10, url: "/static/images/medium/lion10.jpeg" }];

    $scope.show_photo = function(url){
        var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
        win.focus();
    }
}]);
