// LINC is an open source shared database and facial recognition
// system that allows for collaboration in wildlife monitoring.
// Copyright (C) 2016  Wildlifeguardians
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For more information or to contact visit linclion.org or email tech@linclion.org
'use strict';

angular.module('linc.image.gallery.controller', ['linc.image.gallery.directive'])

.controller('ImageGalleryCtrl', ['$scope', '$timeout', '$sce', '$window', '$uibModal', '$uibModalInstance', 'LincServices', 'NotificationFactory', 'optionsSet', 'gallery', function($scope, $timeout, $sce, $window, $uibModal, $uibModalInstance, LincServices, NotificationFactory, optionsSet, gallery) {

  // Tmp
  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };
  function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i=0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };
  // Order
  $scope.ListOfOrderBy = [
    { id: 0, predicate: 'name', reverse: false, label: '<span>Name <i class="icon icon-sort-alpha-asc"></i></span>'},
    { id: 1, predicate: 'name', reverse: true,  label: '<span>Name <i class="icon icon-sort-alpha-desc"></i></span>'},
    { id: 2, predicate: 'date', reverse: false, label: '<span>Date <i class="icon icon-sort-numeric-asc"></i></span>'},
    { id: 3, predicate: 'date', reverse: true,  label: '<span>Date <i class="icon icon-sort-numberic-desc"></i></span>'},
    { id: 4, predicate: 'type', reverse: false, label: '<span>Type <i class="icon icon-sort-alpha-asc"></i></span>'},
    { id: 5, predicate: 'type', reverse: true,  label: '<span>Type <i class="icon icon-sort-alpha-desc"></i></span>'}
  ];
  $scope.person = {selected : undefined};

  // $scope.ListOfOrderBy = [
  //   {id: 0, predicate: 'name', reverse: false, label: '<span>Name <i class="icon icon-sort-alpha-asc"></i></span>'},
  //   {id: 1, predicate: 'name', reverse: true,  label: '<span>Name <i class="icon icon-sort-alpha-desc"></i></span>'},
  //   {id: 2, predicate: 'date', reverse: false, label: '<span>Date <i class="icon icon-sort-numeric-asc"></i></span>'},
  //   {id: 3, predicate: 'date', reverse: true,  label: '<span>Date <i class="icon icon-sort-numberic-desc"></i></span>'},
  //   {id: 4, predicate: 'type', reverse: false, label: '<span>Type <i class="icon icon-sort-alpha-asc"></i></span>'},
  //   {id: 5, predicate: 'type', reverse: true,  label: '<span>Type <i class="icon icon-sort-alpha-desc"></i></span>'}
  // ];
  $scope.Order = {by: $scope.ListOfOrderBy[0]};

  $scope.gallery = _.map(gallery.images, function(element, index) {
    var data = randomDate(new Date(2000, 0, 1), new Date());
    //var name = Math.random().toString(36).substr(2, 10);
    var name = makeid();
    var texto = 'Name: ' + name + '<br> date: ' + data.toLocaleString(); 
    var tooltip = {'title': texto, 'checked': true};
    return _.extend({}, element, {'select': false, 'tooltip': tooltip, 'name': name, 'date': data});
  });

  $scope.imagesetId = optionsSet.id;

  var titles = {}; titles['lions'] = 'Lions'; titles['imagesets'] = 'Image Sets';

  // download image
  $scope.download_view = false;
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
    $scope.itemsPerPage = Math.max(100, $scope.itemsPerPage);
    $scope.FilterSel.Type = 'all';
    $scope.FilterSel.isCover = false;
    $scope.Properties[0].checked = true;
    $scope.Properties[0].checked = true;
    $scope.isViewFilter = true;
    $scope.Selecteds = [];
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

    $scope.download_view = true;
    $uibModalInstance.freeze(true);
    LincServices.Download(data).then(function(res_data){
      var blob = res_data.blob;
      var fileName = (res_data.fileName || "").substring(res_data.fileName.lastIndexOf('/')+1) || 'images.zip';
      saveAs(blob, fileName);
      $scope.download_view = false;
      $uibModalInstance.freeze(false);
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
          templateUrl: 'Dialog.Delete.tmpl.html',
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
          $scope.UpdateGallery();
        },
        function(error){
          if($scope.debug || (error.status != 401 && error.status != 403)){
            NotificationFactory.error({
              title: "Error", message: $scope.ErrorMessage,
              position: 'right', // right, left, center
              duration: 5000   // milisecond
            });
          }
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
    $scope.itemsPerPage = Math.min(100, $scope.gallery.length);
    Reset_Filters();
  };
  // Click in Photo - Show Big Image
  $scope.show_photo = function(url){
    var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
    win.focus();
  }

  // carousel image
  $scope.image_view = false;
  $scope.carousel = {active: -1, interval: 500000, noWrapSlides: false, no_transition : false};

  $scope.show_image_view = function(photo, index){
    $scope.carousel.active = index;
    $scope.image_view = true;
  }

  var hidepromise = null;
  $scope.hide_image_view = function(){
    if(hidepromise) return;
    hidepromise = $timeout(function() {
      $timeout.cancel(hidepromise);
      hidepromise = null;
      $scope.image_view = false;
      $scope.carousel.active = -1;
     }, 250);
  }

  // The panzoom config model can be used to override default configuration values
  $scope.panzoomConfig = {
      zoomLevels: 12,
      neutralZoomLevel: 5,
      scalePerZoomLevel: 1.5,
      initialPanX: 200,
      zoomOnDoubleClick: true,
      //zoomToFitZoomLevelFactor: 1
  };

  // The panzoom model should initialle be empty; it is initialized by the <panzoom>
  // directive. It can be used to read the current state of pan and zoom. Also, it will
  // contain methods for manipulating this state.
  $scope.panzoomModel = {};

  $scope.show_zoom = function(url){
    $timeout.cancel(hidepromise);
    hidepromise = null;
    $scope.zoom_view = true;
    $scope.image_view = false;
    $scope.panzoomModel.photo = url;
  }
  $scope.hide_zoom = function(){
    $scope.zoom_view = false;
    $scope.image_view = true;
  }

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
  $scope.itemsPerPage = Math.min(100, $scope.gallery.length);
  // Recalc Itens per page on click properties or image types
  $scope.calc_itemspage = function (){
    $scope.itemsPerPage = Math.min(100, $scope.filtered_gallery.length);
  }
  // Increase Page Numbers on click
  $scope.increase_pages= function (){
    var diff = $scope.filtered_gallery.length - $scope.itemsPerPage;
    $scope.itemsPerPage += Math.min(100, diff);
  }
  // Click on the images check mark
  var lastSelIndex = -1;
  $scope.Select_Image = function ($event, photo, index){
    var shiftKey = $event.shiftKey;
    if(shiftKey && lastSelIndex>=0){
      var first = Math.min(lastSelIndex, index);
      var second = Math.max(lastSelIndex, index);
      console.log('first: ' + first);
      console.log('second: ' + second);
      for(var i = first; i <= second; i++){
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
      if($scope.showPrivated)
        $scope.Change_Tab('edit');
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
      if($scope.showPrivated)
        $scope.Change_Tab('edit');
    }
    else{
      $scope.Selected.Type = 'cv';
      $scope.Selected.isPublic = true;
      $scope.Selected.isCover = false;
      $scope.Change_Tab('filter');
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
      LincServices.SetMainImagenId($scope.imagesetId, data, function(result){
        _.forEach($scope.paginated_gallery, function(photo, index) {
          if(image == photo){
            photo.cover = (data.main_image_id == null) ? false : true;
          }
          else{
            photo.cover = false;
          }
        });
        Reset_Filters();
        $scope.UpdateGallery();
        NotificationFactory.success({
          title: "Select", message: "Cover Image was Selected",
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
      },
      function(error){
        if($scope.debug || (error.status != 401 && error.status != 403)){
          NotificationFactory.error({
            title: "Error", message: "Unable to Select Cover Image",
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        }
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
            LincServices.SetMainImagenId($scope.imagesetId, data, function(result){
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
        $scope.UpdateGallery();
        NotificationFactory.success({
          title: "Update", message: "All Images have been updated",
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        Reset_Filters();
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
        $scope.UpdateGallery();
      });
    }
  };

  $scope.UpdateImages = function () {
    LincServices.getImageGallery($scope.imagesetId).then(function (data) {
      gallery = data;
      $scope.gallery = gallery.images;
      $scope.imagesetId = optionsSet.id;
      $scope.itemsPerPage = Math.min(100, $scope.gallery.length);
      console.log('updated: ' + $scope.ImagesChanged);
    });
    $scope.UpdateGallery();
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

;
