'use strict';

angular.module('lion.guardians.image.gallery.controller', ['lion.guardians.image.gallery.directive'])

.controller('ImageGalleryCtrl', ['$scope', '$window', '$uibModalInstance', 'optionsSet', function($scope, $window, $uibModalInstance, optionsSet) {

  $scope.optionsSet = optionsSet;
  $scope.optionsSet.isMetadata = false;
  var titles = {}; titles['lions'] = 'Lions'; titles['imagesets'] = 'Image Sets';

  $scope.optionsSet.data = { id: 1, name: 'leão 1', age: 13, thumbnail: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false};



  // Title
  $scope.title = 'Image Gallery' + '(' + titles[optionsSet.type] + ')';
  $scope.content = 'Image Gallery<br />Contents!';

  $scope.Save = function(){
    $uibModalInstance.close("salve");
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.Close = function(){
    console.log("Close UploadImages");
    //$scope.metadataId = {id: 5};
    $uibModalInstance.close("close");
  }
  /*function create_zip() {
    var zip = new JSZip();
    zip.add("hello1.txt", "Hello First World\n");
    zip.add("hello2.txt", "Hello Second World\n");
    content = zip.generate();
    location.href = "data:application/zip;base64," + content;
  }*/
  /*$scope.Download = function(){
    $scope.selected_photos = _.filter($scope.photos, function(item) {
      return _.contains(true, item['selected']);
    });
  }*/
/*
  LincServices.getImages(optionsSet.type, optionsSet.data,function(images){
    $scope.photos = images;
  });
*/
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
