'use strict';

angular.module('lion.guardians.image.gallery.controller', ['lion.guardians.image.gallery.directive'])

.controller('ImageGalleryCtrl', ['$scope', '$timeout', '$sce', '$window', '$uibModal', '$uibModalInstance', 'LincServices', 'NotificationFactory', 'optionsSet', 'gallery', function($scope, $timeout, $sce, $window, $uibModal, $uibModalInstance, LincServices, NotificationFactory, optionsSet, gallery) {

  $scope.gallery = _.map(gallery.images, function(element, index) {
    return _.extend({}, element, {'select': false});
  });

  $scope.imagesetId = optionsSet.id;

  var titles = {}; titles['lions'] = 'Lions'; titles['imagesets'] = 'Image Sets';

  $scope.image_view_url = "";
  $scope.image_view = false;
  $scope.isViewFilter = true;
  $scope.ShowIsCover = true;
  $scope.Selecteds = [];

  // Title
  $scope.title = 'Image Gallery ' + ' <h4 style="display:inline;">(Imageset - ' + optionsSet.id + ')</h4>';
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
  $scope.Properties = [{'name': 'Public', 'checked': true, 'value' : true},
                       {'name': 'Private', 'checked': true, 'value' : false}];

  // Selects
  $scope.FilterSel = {Type: 'all', isPublic: true, isPrivate: true, isCover: false};
  $scope.Selected = {Type: 'cv', isPublic: true, isCover: false};

  var Reset_Filters = function (){
    _.map($scope.Selecteds, function (photo){
      photo.select = false;
    });
    $scope.itemsPerPage = Math.max(9, $scope.itemsPerPage);
    $scope.FilterSel.Type = 'all';
    $scope.FilterSel.isCover = false;
    $scope.Properties[0].checked = true;
    $scope.Properties[0].checked = true;
    $scope.isViewFilter = true;
  }

  var check_selecteds = function(type){
    var contem = 0;
    if(type=="type"){
      var selecteds = _.pluck(_.map($scope.Selecteds, function (photo){
        return {'type': photo.type};
      }), 'type');
      _.forEach($scope.Selects, function(select) {
        if(_.includes(selecteds, select.type))
          contem++;
      });
      if(contem>1) return true;
      else return false;
    }
    if(type="properties"){
      var selecteds = _.pluck(_.map($scope.Selecteds, function (photo){
        return {'is_public': photo.is_public};
      }), 'is_public');

      if(_.includes(selecteds, true) && _.includes(selecteds, false))
        return true;
      else
        return false;
    }
  }

  // Button Save
  $scope.Save = function(){
    $uibModalInstance.close("salve");
  };

  $scope.Download = function () {
    var data = '?download=' +  _.pluck(_.map($scope.Selecteds, function (photo){
      return {'id': photo.id};
    }), 'id');

    LincServices.Download(data).then(function(res_data){
      var blob = res_data.blob;
      var fileName = (res_data.fileName || "").substring(res_data.fileName.lastIndexOf('/')+1) || 'images.zip';
      saveAs(blob, fileName);
    });
  };
  $scope.Close = function(){
    console.log("Close UploadImages");
    $uibModalInstance.close("close");
  }
  $scope.Delete = function (){
    $scope.delete_items =  _.map($scope.Selecteds, function(photo){
      return {'id': photo.id};
    });
    if(!$scope.delete_items.length){
      NotificationFactory.warning({
        title: "Delete", message: "No images selected to delete",
        position: "right", // right, left, center
        duration: 3000     // milisecond
      });
    }
    else {
      if($scope.delete_items.length==1){
        $scope.modalTitle = 'Delete Lion Image';
        $scope.modalMessage = 'Are you sure you want to delete the image?';
        $scope.SucessMessage = 'Image was successfully deleted.';
        $scope.ErrorMessage = 'Unable to delete the image.';
      }
      else{
        $scope.modalTitle = 'Delete Lions Images';
        $scope.modalMessage = 'Are you sure you want to delete the images?';
        $scope.SucessMessage = 'Images were successfully deleted.';
        $scope.ErrorMessage = 'Unable to delete the images.';
      }
      $scope.modalContent = 'Form';
      $scope.modalInstance = $uibModal.open({
          templateUrl: 'Delete.tmpl.html',
          scope:$scope
      });
      $scope.modalInstance.result.then(function (result) {
        LincServices.DeleteImages($scope.delete_items, function(result){
          NotificationFactory.success({
            title: "Delete", message: $scope.SucessMessage,
            position: "right", // right, left, center
            duration: 2000     // milisecond
          });
          Adjust_Gallery($scope.delete_items);
          LincServices.ClearImageGalleryCache(optionsSet.id);
        },
        function(error){
          NotificationFactory.error({
            title: "Error", message: $scope.ErrorMessage,
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        });
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

      $scope.ok = function (){
        $scope.modalInstance.close();
      }
      $scope.cancel = function(){
        $scope.modalInstance.dismiss();
      }
    }
  }
  var removed = [];
  // Adjust after delete images
  var Adjust_Gallery = function (items){
    _.forEach(items, function(item, i) {
      var remove = _.remove($scope.gallery, function(image) {
        return image.id == item.id;
      });
      removed.push(remove);
    });
    $scope.itemsPerPage = Math.min(9, $scope.gallery.length);
    Reset_Filters();
  };
  // Click in Photo - Show Big Image
  $scope.show_photo = function(url){
    var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
    win.focus();
  }

  //var carousel_idx = 0;
  $scope.show_image_view = function(photo, index){
    photo.active = true;
    $scope.image_view = true;
  }
  $scope.hide_image_view = function(){
    $scope.image_view = false;
  }

  $scope.carousel_interval = 500000;
  $scope.noWrapSlides = false;

  // Change tab
  $scope.Change_Tab = function(tab){
    if(tab=='filter'){
      $scope.isViewFilter=true;
    }
    else{
      $scope.isViewFilter=false;
    }
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
  // Click on the images check mark
  var lastSelIndex = -1;
  $scope.Select_Image = function (photo, index){
    var shiftKey = $window.event.shiftKey;
    if(shiftKey && lastSelIndex>=0){
      var first = Math.min(lastSelIndex, index);
      var second = Math.max(lastSelIndex, index);
      for(var i = first; i < second; i++){
        var image = $scope.paginated_gallery[i];
        image.select = photo.select;
        if(photo.select){
          if(!_.some($scope.Selecteds, image))
            $scope.Selecteds.push(image);
        }
        else {
          $scope.Selecteds = _.without($scope.Selecteds, image);
        }
      }
    }
    else{
      lastSelIndex = index;
      if(photo.select){
        if(!_.some($scope.Selecteds, photo))
          $scope.Selecteds.push(photo);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, photo);
      }
    }

    if($scope.Selecteds.length == 1){
      if(photo.select){
        $scope.Selected.isPublic = photo.is_public;
        $scope.Selected.Type = photo.type;
        $scope.Selected.isCover = photo.cover;
      }
      else{
        $scope.Selected.Type = $scope.Selecteds[0].type;
        $scope.Selected.isPublic = $scope.Selecteds[0].is_public;
        $scope.Selected.isCover = $scope.Selecteds[0].cover;
      }
      console.log("Set Properties");
    }
    else if($scope.Selecteds.length>1){
      if(check_selecteds("type"))
        $scope.Selected.Type = "";
      else {
        $scope.Selected.Type = $scope.Selecteds[0].type;
      }
      if(check_selecteds("properties"))
        $scope.Selected.isPublic = '';
      else {
        $scope.Selected.isPublic = $scope.Selecteds[0].is_public;
      }
      $scope.Selected.isCover = false;
    }
    else{
      $scope.Selected.Type = 'cv';
      $scope.Selected.isPublic = true;
      $scope.Selected.isCover = false;
    }
  }

  $scope.Select_All = function () {
    _.forEach($scope.paginated_gallery, function(photo, index) {
      photo.select = true;
      if(!_.some($scope.Selecteds, photo))
        $scope.Selecteds.push(photo);
    });
    if($scope.Selecteds.length>1){
      if(check_selecteds("type"))
        $scope.Selected.Type = "";
      else {
        $scope.Selected.Type = $scope.Selecteds[0].type;
      }
      if(check_selecteds("properties"))
        $scope.Selected.isPublic = '';
      else {
        $scope.Selected.isPublic = $scope.Selecteds[0].is_public;
      }
      $scope.Selected.isCover = false;
    }
  }
  $scope.UnSelect_All = function () {
    _.forEach($scope.gallery, function(photo, index) {
      photo.select = false;
    });
    $scope.Selecteds = [];
  }
  $scope.Change_Cover = function(){
    if($scope.Selecteds.length){
      var image = $scope.Selecteds[0];
      var data = {"main_image_id": $scope.Selected.isCover ? image.id : null};
      LincServices.SetMaiImagenId($scope.imagesetId, data, function(result){
        _.forEach($scope.paginated_gallery, function(photo, index) {
          if(image == photo){
            photo.cover = (data.main_image_id == null) ? false : true;
          }
          else{
            photo.cover = false;
          }
        });
        Reset_Filters();
        NotificationFactory.success({
          title: "Select", message: "Cover Image was Selected",
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
      },
      function(error){
        NotificationFactory.error({
          title: "Error", message: "Unable to Select Cover Image",
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }
  $scope.Change_isPublic = function(){
    if($scope.Selecteds.length && ($scope.Selected.isPublic != undefined)){
      var updated = [];
      _.forEach($scope.Selecteds, function(photo, index) {
        if($scope.Selected.isPublic != photo.is_public){
          updated.push({'index': index, 'image_id': photo.id, 'data': {'is_public': $scope.Selected.isPublic}});

          if(!$scope.Selected.isPublic && photo.cover){
            var data = {"main_image_id": null};
            LincServices.SetMaiImagenId($scope.imagesetId, data, function(result){
              photo.cover = false;
            });
          }
        }
      });
      LincServices.UpdateImages(updated, function(results){
        _.forEach(results, function(result, idx) {
          var data = { "is_public": result.is_public };
          var photo = _.find($scope.Selecteds, {'id': result.id});
          _.merge(photo, photo, data);
        });
        NotificationFactory.success({
          title: "Update", message: "All Images have been updated",
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        Reset_Filters();
      },
      function(error){
        NotificationFactory.error({
          title: "Error", message: "Unable to Update Image data",
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }
  $scope.Change_Type = function(){
    if($scope.Selecteds.length){
      var updated = [];
      _.forEach($scope.Selecteds, function(photo, index) {
        if($scope.Selected.Type != photo.type){
          updated.push({'index': index, 'image_id': photo.id, 'data': {'image_type': $scope.Selected.Type}});
        }
      });
      LincServices.UpdateImages(updated, function(results){
        _.forEach(results, function(result, idx) {
          var data = { "type": result.image_type };
          var photo = _.find($scope.Selecteds, {'id': result.id});
          _.merge(photo, photo, data);
        });
        NotificationFactory.success({
          title: "Update", message: "All Images have been updated",
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        Reset_Filters();
      },
      function(error){
        NotificationFactory.error({
          title: "Error", message: "Unable to Update Image data",
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  };

  $scope.UpdateImages = function () {
    LincServices.ClearImageGalleryCache($scope.imagesetId);
    LincServices.getImageGallery($scope.imagesetId).then(function (data) {
      gallery = data;
      $scope.gallery = gallery.images;
      $scope.imagesetId = optionsSet.id;
      $scope.itemsPerPage = Math.min(9, $scope.gallery.length);
      console.log('updated: ' + $scope.ImagesChanged);
    });
  };

}])

// FILTERS

.filter('unsafe', function($sce) {
  return $sce.trustAsHtml;
})

.filter('TypeFilter', function(){
  return function(input, type) {
    if(type == 'all') return input;
    var filtered = _.filter(input, function(value){
      //if(value.select==true) return true;
      return value.type == type;
    });
    return filtered;
  };
})

.filter('CoverFilter', function(){
  return function(input, cover) {
    if(!cover) return input;
    var filtered = _.filter(input, function(value){
      //if(value.select==true) return true;
      return value.cover == cover;
    });
    return filtered;
  };
})

.filter('PropertiesFilter', function(){
  return function(input, properties) {
    var filtered = _.filter(input, function(value){
      //if(value.select==true) return true;
      var name = 'Public';
      if(!value.is_public) name = 'Private';
      return (_.result(_.find(properties, {'name': name}), 'checked'));
    });
    return filtered;
  };
})

.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
})

.directive('scaleImage', function () {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      var parent = elm.parent().parent().parent().parent();
      scope.$watch(function () {
        return {
            maxWidth: parent.prop('offsetHeight'),
            maxHeight: parent.prop('offsetWidth') - 100,
            Width: elm[0].naturalWidth,
            Height: elm[0].naturalHeight
        };
      }, function (size) {
        var tRatio = size.Width / size.maxWidth;
        var tProportionalHeight =  size.Height / tRatio;

        var tRatio = size.Height / size.maxHeight
        var tProportionalWidth = size.Width / tRatio;

        if (tProportionalHeight > size.maxHeight){
          elm.css('height', size.maxHeight + 'px');
          elm.css('width', tProportionalHeight + 'px');
        }
        else{
          elm.css('width', size.maxWidth + 'px');
          elm.css('height', tProportionalHeight + 'px');
        }
      }, true);
    }
  };
});

;
