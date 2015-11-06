'use strict';

angular.module('lion.guardians.image.gallery.controller', ['lion.guardians.image.gallery.directive'])

.controller('ImageGalleryCtrl', ['$scope', '$window', '$uibModalInstance', 'optionsSet', function($scope, $window, $uibModalInstance, optionsSet) {

  $scope.optionsSet = optionsSet;
  $scope.optionsSet.isMetadata = false;
  $scope.HasFilter = true;
  $scope.ShowIsCover = true;

  $scope.Properties = [{'name': 'Public', 'checked': true},
                       {'name': 'Private', 'checked': true}];

  $scope.Selected = {Type: 'all', Cover: false};

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
  $scope.Select_All = function (val) {
    $scope.photos.forEach(function(photo){
      photo.select = val;
    });
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
  $scope.ImageType = {'cv': 'CV Image', 'full-body': 'Full Body', 'whisker': 'Whisker',
                      'main-id': 'Main Id', 'markings': 'Markings'};

  $scope.Image_Types = [{key: 'all', label: 'All'},{key: 'cv', label: 'CV Image'},
                       {key:'full-body', label:'Full Body'}, {key:'whisker', label:'Whisker'},
                       {key:'main-id',label:'Main Id'}, {key:'markings',label:'Markings'}];

  $scope.photos = [ { id: 1, name: 'leão 1', age: 13, url: '/static/images/medium/lion1.jpg',
                      isPublic: true, isCover: true, image_type: 'cv'},
                    { id: 2, name: 'leão 2', age: 12, url: '/static/images/medium/lion2.jpeg',
                      isPublic: false, isCover: false, image_type: 'cv'},
                    { id: 3, name: 'leão 3', age: 14, url: '/static/images/medium/lion3.jpeg',
                      isPublic: true, isCover: false, image_type: 'whisker'},
                    { id: 4, name: 'leão 4', age: 15, url: '/static/images/medium/lion4.jpg',
                      isPublic: false, isCover: false, image_type: 'markings'},
                    { id: 5, name: 'leão 5', age: 8, url: '/static/images/medium/lion5.jpg',
                      isPublic: false, isCover: false, image_type: 'markings'},
                    { id: 6, name: 'leão 6', age: 9, url: '/static/images/medium/lion6.jpeg',
                      isPublic: true, isCover: false, image_type: 'markings'},
                    { id: 7, name: 'leão 7', age: 6, url: '/static/images/medium/lion7.jpeg',
                      isPublic: false, isCover: false, image_type: 'cv'},
                    { id: 8, name: 'leão 8', age: 2, url: '/static/images/medium/lion8.jpeg',
                      isPublic: true, isCover: false, image_type: 'whisker'},
                    { id: 9, name: 'leão 9', age: 7, url: '/static/images/medium/lion9.jpg',
                      isPublic: true, isCover: false, image_type: 'main-id'},
                    { id: 10, name: 'leão 10', age: 10, url: '/static/images/medium/lion10.jpeg',
                      isPublic: false, isCover: false, image_type: 'full-body'}];

    $scope.show_photo = function(url){
        var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
        win.focus();
    }


    $scope.set_panel = function (selected, id){

      console.log(selected);
      $scope.selected_photos = _.filter($scope.photos, function(photo){
        return photo.select == true;
      });

      $scope.HasFilter = !$scope.selected_photos.length;

      if($scope.selected_photos.length==1){
        var photo_id = _.findIndex($scope.photos, {'id': id});
        $scope.Selected.Cover = $scope.photos[photo_id].isCover;
        $scope.ShowIsCover = true;
        $scope.Properties[1].checked = $scope.photos[id].isPublic;
      }
      else if($scope.selected_photos.length>1){
        $scope.Selected.Cover = false;
        $scope.ShowIsCover = false;
      }
      if(!selected && !$scope.selected_photos.length){
        $scope.Selected.Cover = false;
        $scope.ShowIsCover = true;
      }
      console.log($scope.selected_photos);

      /*index_selected = _.findIndex($scope.photos, function(photo) {
        return photo.selected == true;
      });
      _.forEach($scope.photos, function(photo) {
        photo.selected = false;
      });
      var index = _.indexOf($scope.lions, _.find($scope.lions, {id: id}));
      $scope.lions[index].selected = true;*/
    };
    $scope.radio_check = function(id){
      if(!$scope.HasFilter){
        if(!id)
          $scope.Properties[id+1].checked = !$scope.Properties[id].checked;
        else
          $scope.Properties[id-1].checked = !$scope.Properties[id].checked;
      }
    }

}])

// FILTERS

.filter('PropertiesFilter', function(){
  return function(input, properties, HasFilter) {
    if(!HasFilter) return input;
    var filtered = _.filter(input, function(value){
        var name = 'Public';
        if(!value.isPublic) name = 'Private';
        return (_.result(_.find(properties, {'name': name}), 'checked'));
    });
    return filtered;
  };
})

.filter('TypeFilter', function(){
  return function(input, type, HasFilter) {
    if(!HasFilter) return input;
    if(type == 'all') return input;
    var filtered = _.filter(input, function(value){
        return value.image_type == type;
    });
    return filtered;
  };
})

.filter('CoverFilter', function(){
  return function(input, cover, HasFilter) {
    if(!HasFilter) return input;
    if(!cover) return input;
    var filtered = _.filter(input, function(value){
        return value.isCover == cover;
    });
    return filtered;
  };
})

;
