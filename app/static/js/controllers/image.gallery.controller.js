'use strict';

angular.module('lion.guardians.image.gallery.controller', ['lion.guardians.image.gallery.directive'])

.controller('ImageGalleryCtrl', ['$scope', '$window', '$uibModalInstance', 'NotificationFactory', 'optionsSet', 'gallery', function($scope, $window, $uibModalInstance, NotificationFactory, optionsSet, gallery) {

  //$scope.optionsSet = optionsSet;
  $scope.gallery = gallery.images;
  //$scope.optionsSet.isMetadata = false;
  $scope.imagesetId = optionsSet.id;
  var titles = {}; titles['lions'] = 'Lions'; titles['imagesets'] = 'Image Sets';

  $scope.HasFilter = true;
  $scope.ShowIsCover = true;


  /*$scope.optionsSet.data = { id: 4, name: 'leão 1', age: 13,
                               thumbnail: "/static/images/square-small/lion1.jpg",
                               gender: 'male', organization: 'Lion Guardians',
                               hasResults: true, pending: false, primary: true,
                               verified: true, selected: false};*/

  // Title
  $scope.title = 'Image Gallery ' + ' (Imageset - ' + optionsSet.id + ')';
  $scope.content = 'Image Gallery<br />Contents!';

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

  // Selects
  $scope.FilterSel = {Type: 'cv', isPublic: true, isPrivate: true, isCover: false};
  $scope.Selected = {Type: 'cv', isPublic: true, isCover: false};

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
  // Pagination
  // Calc initial Itens per Page
  $scope.itemsPerPage = Math.min(9, $scope.gallery.length);
  // Recalc Itens per page on click properties or image types
  $scope.calc_itemspage = function (){
    $scope.itemsPerPage = Math.min(9, $scope.filtered_gallery.length);
  }
  // Increase Page Numbers on click
  $scope.increase_pages= function (){
    var diff = $scope.filtered_gallery.length - $scope.itemsPerPage;
    $scope.itemsPerPage += Math.min(9, diff);
  }
  // Calc Count of Selected Images
  var calc_selected_count = function (){
    var results = _.filter($scope.filtered_gallery, function(photo){
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
          $scope.Selected.isPublic = photo.is_public;
          $scope.Selected.Type = photo.type;
          $scope.Selected.isCover = photo.cover;
        }
        else{
          var photo1 = _.filter($scope.gallery, function(photo){
            return photo.select == true;
          });
          $scope.Selected.Type = photo1[0].type;
          $scope.Selected.isPublic = photo1[0].is_public;
          $scope.Selected.isCover = photo1[0].cover;
        }
        console.log("Set Properties");
      }
      else{
        $scope.Selected.Type = "";
        $scope.Selected.isPublic = true;
        $scope.Selected.isCover = false;
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
      $scope.paginated_gallery.forEach(function(photo, index){
        photo.select = val;
        if(!index){
          type = photo.type;
          ispublic = photo.is_public;
          iscover = photo.cover;
        }
      });
      if(calc_selected_count()>1){
        $scope.Selected.Type = "";
        $scope.Selected.isPublic = true;
        $scope.Selected.isCover = false;
      }
    }
    else{
      $scope.gallery.forEach(function(photo, index){
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
    if(!$scope.Selected.isPublic)
     $scope.Selected.isCover = false;
    $scope.Update();
  }
  $scope.Update = function(){
    alert('Update');
    console.log($scope.Selected);
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
        return value.type == type;
    });
    return filtered;
  };
})

.filter('CoverFilter', function(){
  return function(input, cover) {
    if(!cover) return input;
    var filtered = _.filter(input, function(value){
        return value.cover == cover;
    });
    return filtered;
  };
})

.filter('PropertiesFilter', function(){
  return function(input, properties) {
    var filtered = _.filter(input, function(value){
        var name = 'Public';
        if(!value.is_public) name = 'Private';
        return (_.result(_.find(properties, {'name': name}), 'checked'));
    });
    return filtered;
  };
})

;
