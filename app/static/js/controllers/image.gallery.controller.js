'use strict';

angular.module('lion.guardians.image.gallery.controller', ['lion.guardians.image.gallery.directive'])

.controller('ImageGalleryCtrl', ['$scope', '$window', '$uibModalInstance', 'optionsSet', function($scope, $window, $uibModalInstance, optionsSet) {

  $scope.optionsSet = optionsSet;
  $scope.optionsSet.isMetadata = false;
  var titles = {}; titles['lions'] = 'Lions'; titles['imagesets'] = 'Image Sets';

  $scope.optionsSet.data = { id: 1, name: 'leão 1', age: 13, thumbnail: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false};

  // Title
  $scope.title = 'Image Gallery';
  $scope.content = 'Image Gallery<br />Contents!';

  // Selects
  $scope.Selected = {Type: 'cv', isPublic: true, isCover: false};

  $scope.Type_Labels = {'cv': 'CV Image', 'full-body': 'Full Body', 'whisker': 'Whisker',
                   'main-id': 'Main Id', 'markings': 'Markings'};
  // Painel
  $scope.Type_Items = [{type: 'cv', label: 'CV Image'}, {type:'full-body', label:'Full Body'},
                       {type:'whisker', label:'Whisker'}, {type:'main-id',label:'Main Id'},
                       {type:'markings',label:'Markings'}];

 $scope.itemsPerPage = 9;
  //TEMPORARIO
  $scope.photos = [
    { id: 1, name: 'lion 1', age: 13, url: '/static/images/medium/lion1.jpg',
      isPublic: true, isCover: true, image_type: 'cv'},
    { id: 2, name: 'lion 2', age: 12, url: '/static/images/medium/lion2.jpeg',
      isPublic: false, isCover: false, image_type: 'cv'},
    { id: 3, name: 'lion 3', age: 14, url: '/static/images/medium/lion3.jpeg',
      isPublic: true, isCover: false, image_type: 'whisker'},
    { id: 4, name: 'lion 4', age: 15, url: '/static/images/medium/lion4.jpg',
      isPublic: false, isCover: false, image_type: 'markings'},
    { id: 5, name: 'lion 5', age: 8, url: '/static/images/medium/lion5.jpg',
      isPublic: false, isCover: false, image_type: 'markings'},
    { id: 6, name: 'lion 6', age: 9, url: '/static/images/medium/lion6.jpeg',
      isPublic: true, isCover: false, image_type: 'markings'},
    { id: 7, name: 'lion 7', age: 6, url: '/static/images/medium/lion7.jpeg',
      isPublic: false, isCover: false, image_type: 'cv'},
    { id: 8, name: 'lion 8', age: 2, url: '/static/images/medium/lion8.jpeg',
      isPublic: true, isCover: false, image_type: 'whisker'},
    { id: 9, name: 'lion 9', age: 7, url: '/static/images/medium/lion9.jpg',
      isPublic: true, isCover: false, image_type: 'main-id'},
    { id: 10, name: 'lion 10', age: 10, url: '/static/images/medium/lion10.jpeg',
      isPublic: false, isCover: false, image_type: 'full-body'},
    { id: 11, name: 'lion 11', age: 13, url: '/static/images/medium/lion1.jpg',
      isPublic: true, isCover: true, image_type: 'cv'},
    { id: 12, name: 'lion 12', age: 12, url: '/static/images/medium/lion2.jpeg',
      isPublic: false, isCover: false, image_type: 'cv'},
    { id: 13, name: 'lion 13', age: 14, url: '/static/images/medium/lion3.jpeg',
      isPublic: true, isCover: false, image_type: 'whisker'},
    { id: 14, name: 'lion 14', age: 15, url: '/static/images/medium/lion4.jpg',
      isPublic: false, isCover: false, image_type: 'markings'},
    { id: 15, name: 'lion 15', age: 8, url: '/static/images/medium/lion5.jpg',
      isPublic: false, isCover: false, image_type: 'markings'},
    { id: 16, name: 'lion 16', age: 9, url: '/static/images/medium/lion6.jpeg',
      isPublic: true, isCover: false, image_type: 'markings'},
    { id: 17, name: 'lion 17', age: 6, url: '/static/images/medium/lion7.jpeg',
      isPublic: false, isCover: false, image_type: 'cv'},
    { id: 18, name: 'lion 18', age: 2, url: '/static/images/medium/lion8.jpeg',
      isPublic: true, isCover: false, image_type: 'whisker'},
    { id: 19, name: 'lion 19', age: 7, url: '/static/images/medium/lion9.jpg',
      isPublic: true, isCover: false, image_type: 'main-id'},
    { id: 20, name: 'lion 20', age: 10, url: '/static/images/medium/lion10.jpeg',
      isPublic: false, isCover: false, image_type: 'full-body'}
  ];

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

  $scope.show_photo = function(url){
    var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
    win.focus();
  }
  $scope.count = function (){
    var results = _.filter($scope.photos, function(photo){
      return photo.select == true;
    });
    return results.length;
  }
  $scope.increase_pages= function (){
    var diff = $scope.photos.length - $scope.itemsPerPage;
    $scope.itemsPerPage += Math.min(9, diff);
  }
  $scope.Select_All = function (val) {
    if(val){
      $scope.paginated_photos.forEach(function(photo, index){
        photo.select = val;
      });
      $scope.Selected.Type = "";
      $scope.Selected.isPublic = true;
      $scope.Selected.isCover = false;
    }
    else{$scope.photos.forEach(function(photo, index){photo.select = val;});}
  }
  $scope.Update = function(){
    console.log("update");
  };
  $scope.Select_Properties = function (select, photo){
    if($scope.count()==1){
      if(select){
        $scope.Selected.Type = photo.image_type;
        $scope.Selected.isPublic = photo.isPublic;
        $scope.Selected.isCover = photo.isCover;
      }
      else{
        var photo1 = _.filter($scope.photos, function(photo){
          return photo.select == true;
        });
        $scope.Selected.Type = photo1[0].image_type;
        $scope.Selected.isPublic = photo1[0].isPublic;
        $scope.Selected.isCover = photo1[0].isCover;
      }
      console.log("Set Properties");
    }
    if($scope.count()>1){
      $scope.Selected.Type = "";
      $scope.Selected.isPublic = true;
      $scope.Selected.isCover = false;
      console.log("Unset Properties");
    }
  }
}])

;
