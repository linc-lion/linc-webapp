'use strict';

angular.module('lion.guardians.image.gallery.controller', ['lion.guardians.image.gallery.directive'])

.controller('ImageGalleryCtrl', ['$scope', '$window', '$uibModalInstance', 'NotificationFactory', 'optionsSet', function($scope, $window, $uibModalInstance, NotificationFactory, optionsSet) {

  $scope.optionsSet = optionsSet;
  $scope.optionsSet.isMetadata = false;
  var titles = {}; titles['lions'] = 'Lions'; titles['imagesets'] = 'Image Sets';

  $scope.HasFilter = true;
  $scope.ShowIsCover = true;

  $scope.optionsSet.data = { id: 4, name: 'leão 1', age: 13, thumbnail: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false};

  // Title
  $scope.title = 'Image Gallery';
  $scope.content = 'Image Gallery<br />Contents!';

  // Selects
  $scope.FilterSel = {Type: 'cv', isPublic: true, isPrivate: true, isCover: false};
  $scope.optionsSet.Selected = {Type: 'cv', isPublic: true, isCover: false};

  // Photo Caption
  $scope.Type_Labels = {'cv': 'CV Image', 'full-body': 'Full Body', 'whisker': 'Whisker',
                   'main-id': 'Main Id', 'markings': 'Markings'};
  // Painel - Labels
  $scope.Filters = [{type: 'all', label: 'All'}, {type: 'cv', label: 'CV Image'},
                    {type:'full-body', label:'Full Body'}, {type:'whisker', label:'Whisker'},
                    {type:'main-id',label:'Main Id'}, {type:'markings',label:'Markings'}];
  $scope.Selects = [{type: 'cv', label: 'CV Image'}, {type:'full-body', label:'Full Body'},
                    {type:'whisker', label:'Whisker'}, {type:'main-id',label:'Main Id'},
                    {type:'markings',label:'Markings'}];
  // Label properties
  $scope.Properties = [{'name': 'Public', 'checked': true},
                       {'name': 'Private', 'checked': true}];
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
  // Button Save
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
  // Click in Photo - Show Big Image
  $scope.show_photo = function(url){
    var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
    win.focus();
  }
  // Calc initial Itens per Page
  $scope.itemsPerPage = Math.min(9, $scope.photos.length);
  // Recalc Itens per page on click properties or image types
  $scope.calc_itemspage = function (){
    $scope.itemsPerPage = Math.min(9, $scope.filtered_photos.length);
  }
  // Increase Page Numbers on click
  $scope.increase_pages= function (){
    var diff = $scope.filtered_photos.length - $scope.itemsPerPage;
    $scope.itemsPerPage += Math.min(9, diff);
  }
  // Calc Count of Selected Images
  var calc_selected_count = function (){
    var results = _.filter($scope.filtered_photos, function(photo){
      return photo.select == true;
    });
    $scope.Selected_Count = results.length;
    return results.length;
  }
  // Click on the images check mark
  $scope.Image_Check = function (select, photo){
    if(!calc_selected_count()){
      $scope.HasFilter = true;
    }
    else {
      if($scope.Selected_Count == 1){
        if(select){
          $scope.optionsSet.Select.isPublic = photo.isPublic;
          $scope.optionsSet.Select.Type = photo.image_type;
          $scope.optionsSet.Select.isCover = photo.isCover;
        }
        else{
          var photo1 = _.filter($scope.photos, function(photo){
            return photo.select == true;
          });
          $scope.optionsSet.Select.Type = photo1[0].image_type;
          $scope.optionsSet.Select.isPublic = photo1[0].isPublic;
          $scope.optionsSet.Select.isCover = photo1[0].isCover;
        }
        console.log("Set Properties");
      }
      else{
        $scope.optionsSet.Select.Type = "";
        $scope.optionsSet.Select.isPublic = true;
        $scope.optionsSet.Select.isCover = false;
        console.log("Unset Properties");
      }
      $scope.HasFilter = false;
    }
  }

  $scope.Select_All = function (val) {
    if(val){
      var type = 'cv';
      var ispublic = true;
      var iscover = false;
      $scope.paginated_photos.forEach(function(photo, index){
        photo.select = val;
        if(!index){
          type = photo.image_type;
          ispublic = photo.isPublic;
          iscover = photo.isCover;
        }
      });
      if(calc_selected_count()>1){
        $scope.optionsSet.Select.Type = "";
        $scope.optionsSet.Select.isPublic = true;
        $scope.optionsSet.Select.isCover = false;
      }
    }
    else{
      $scope.photos.forEach(function(photo, index){
        photo.select = val;
      });
      $scope.Selected_Count = 0;
    }
    if($scope.Selected_Count)
      $scope.HasFilter = false;
    else {
      $scope.HasFilter = true;
    }
  }
  $scope.check_cover = function(){
    if(!$scope.optionsSet.Select.isPublic)
     $scope.optionsSet.Select.isCover = false;
    $scope.Update();
  }
  $scope.Update = function(){
    alert('Update');
  /*  console.log("update");
    NotificationFactory.success({
      title: "Success", message:'Images Updated with success',
      position: "right", // right, left, center
      duration: 2000     // milisecond
    });*/
  };
}])

// FILTERS

.filter('TypeFilter', function(){
  return function(input, type) {
    if(type == 'all') return input;
    var filtered = _.filter(input, function(value){
        return value.image_type == type;
    });
    return filtered;
  };
})

.filter('CoverFilter', function(){
  return function(input, cover) {
    if(!cover) return input;
    var filtered = _.filter(input, function(value){
        return value.isCover == cover;
    });
    return filtered;
  };
})

.filter('PropertiesFilter', function(){
  return function(input, properties) {
    var filtered = _.filter(input, function(value){
        var name = 'Public';
        if(!value.isPublic) name = 'Private';
        return (_.result(_.find(properties, {'name': name}), 'checked'));
    });
    return filtered;
  };
})

/*.filter('FilterCount', function(){
  return function(input, $scope) {
    $scope.itemsPerPage = Math.min(9, $scope.filtered1.length);
  }
  return input;
})*/
;
