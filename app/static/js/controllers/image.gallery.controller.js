'use strict';

angular.module('lion.guardians.image.gallery.controller', ['lion.guardians.image.gallery.directive'])

.controller('ImageGalleryCtrl', ['$scope', '$sce', '$window', '$uibModal', '$uibModalInstance', 'LincServices', 'NotificationFactory', 'optionsSet', 'gallery', function($scope, $sce, $window, $uibModal, $uibModalInstance, LincServices, NotificationFactory, optionsSet, gallery) {

  $scope.gallery = gallery.images;
  $scope.imagesetId = optionsSet.id;
  var titles = {}; titles['lions'] = 'Lions'; titles['imagesets'] = 'Image Sets';

  $scope.HasFilter = true;
  $scope.ShowIsCover = true;

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
  $scope.Properties = [{'name': 'Public', 'checked': true},
                       {'name': 'Private', 'checked': true}];

  // Selects
  $scope.FilterSel = {Type: 'cv', isPublic: true, isPrivate: true, isCover: false};
  $scope.Selected = {Type: 'cv', isPublic: true, isCover: false};

  // Button Save
  $scope.Save = function(){
    $uibModalInstance.close("salve");
  };

  $scope.Download = function () {
    var data = '?download=' + _.pluck(_.map(_.filter($scope.paginated_gallery, { 'select': true}), function (photo){
      return {'id': photo.id};
    }), 'id');

    LincServices.Download(data).then(function(res_data){
      var blob = res_data.blob;
      var fileName = res_data.fileName.substring(res_data.fileName.lastIndexOf('/')+1) || 'images.zip';
      saveAs(blob, fileName);
      /*var filename = result.filename;
      var filename = 'http://www.colorado.edu/conflict/peace/download/peace_essay.ZIP';
      var name = filename.substring(filename.lastIndexOf('/')+1);

      var file = new Blob([ filename ], {
        type : 'application/zip'
      });
      //trick to download store a file having its URL
      var fileURL = URL.createObjectURL(file);
      var a         = document.createElement('a');
      a.href        = fileURL;
      a.target      = '_blank';
      a.download    = 'yourfilename.zip';
      document.body.appendChild(a);
      a.click();*/


    //  var pom = document.createElement('a');
    //  pom.setAttribute('href', 'data:attachment/zip,' + encodeURI(filename));
    //  pom.setAttribute('target', '_blank');
    //  pom.setAttribute('download', name);

    /*  if (document.createEvent) {
          var event = document.createEvent('MouseEvents');
          event.initEvent('click', true, true);
          pom.dispatchEvent(event);
      }
      else {
          pom.click();
      }*/
    });
  };
  $scope.Close = function(){
    console.log("Close UploadImages");
    //$scope.metadataId = {id: 5};
    $uibModalInstance.close("close");
  }
  $scope.Delete = function (){

    $scope.delete_items =  _.map(_.filter($scope.paginated_gallery, { 'select': true}), function(photo){
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
  var Adjust_Gallery = function (items){

    items.forEach(function(item, i){
      var remove = _.remove($scope.gallery, function(image) {
        return image.id == item.id;
      });
      removed.push(remove);
    });
    $scope.itemsPerPage = Math.min(9, $scope.gallery.length);

    var results = _.filter($scope.gallery, function(photo){
      return photo.select == true;
    });
    $scope.Selected_Count = results.length;
    if(!results.length)
      $scope.HasFilter = true;
    else
      $scope.HasFilter = false;
  };
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
  $scope.lastSelIndex = -1;
  $scope.shiftKey = false;
  $scope.shift_selected = false;
  document.addEventListener('keydown', function (e) {
    if(e.shiftKey){
      $scope.shiftKey = true;
      angular.element(document).one("keyup", function (e) {
        $scope.shiftKey = false;
      });
    }
  });
  $scope.Image_Check = function (select, photo, index){
    if($scope.shiftKey && $scope.lastSelIndex>=0){
      var first = Math.min($scope.lastSelIndex, index);
      var second = Math.max($scope.lastSelIndex, index);
      //for(var i = $scope.lastSelIndex; i < index; i++){
      for(var i = first; i < second; i++){
        $scope.paginated_gallery[i].select = select;
        $scope.shift_selected = true;
      }
      //$scope.lastSelIndex = -1;
    }
    else{
      $scope.lastSelIndex = index;
    }

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
        $scope.Selected.isPublic = photo.is_public;
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

  $scope.Change_Cover = function(){
    var updated = {};
    $scope.paginated_gallery.forEach(function(photo, index){
      if(photo.select){
        if(photo.cover != $scope.Selected.isCover){
          updated = {'index': index,
            'data': {"main_image_id": $scope.Selected.isCover? photo.id : null}
          };
        }
      }
    });
    if(Object.keys(updated).length){
      LincServices.SetMaiImagenId($scope.imagesetId, updated.data, function(result){
        $scope.paginated_gallery.forEach(function(photo, index){
          if(index == updated.index){
            photo.cover = updated.data.main_image_id == null ? false : true;
          }
          else{
            photo.cover = false;
          }
          if(!$scope.Selected.isCover){
            photo.select = false;
            $scope.HasFilter = true;
          }
        });
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
    //if(!$scope.Selected.isPublic)
    //  $scope.Selected.isCover = false;
    var updated = [];
    $scope.paginated_gallery.forEach(function(photo, index){
      if(photo.select){
        if($scope.Selected.isPublic != photo.is_public)
          updated.push({'index': index, 'image_id': photo.id, 'data': {'is_public': $scope.Selected.isPublic}});
      }
    });
    if(updated.length==1){
      var update = updated[0];
      LincServices.UpdateImage(update.image_id , update.data, function(result){
        var data = { "is_public": result.is_public };
        var index = update.index;
        _.merge($scope.paginated_gallery[index], $scope.paginated_gallery[index], data);
        NotificationFactory.success({
          title: "Update", message: "Image was updated",
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        //var index = _.findIndex($scope.paginated_gallery, 'is_public', $scope.Selected.isPublic);
        //if(index == -1){
          $scope.paginated_gallery = _.map($scope.paginated_gallery, function(photo, index) {
            photo.select = false;
            return photo;
          });
          $scope.HasFilter = true;
        //}
      },
      function(error){
        NotificationFactory.error({
          title: "Error", message: "Unable to Update Image data",
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(updated.length>1){
      LincServices.UpdateImages(updated, function(results){
        _.forEach(results, function(result, idx) {
          var data = { "is_public": result.is_public };
          var index = updated[idx].index;
          _.merge($scope.paginated_gallery[index], $scope.paginated_gallery[index], data);
        });
        NotificationFactory.success({
          title: "Update", message: "All Images have been updated",
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.paginated_gallery = _.map($scope.paginated_gallery, function(photo, index) {
          photo.select = false;
          return photo;
        });
        $scope.HasFilter = true;
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
    var updated = [];
    $scope.paginated_gallery.forEach(function(photo, index){
      if(photo.select){
        if($scope.Selected.Type != photo.type)
          updated.push({'index': index, 'image_id': photo.id, 'data': {'image_type': $scope.Selected.Type}});
      }
    });
    if(updated.length==1){
      var update = updated[0];
      LincServices.UpdateImage(update.image_id , update.data, function(result){
        var data = { "type" : result.image_type };
        var index = update.index;
        _.merge($scope.paginated_gallery[index], $scope.paginated_gallery[index], data);
        NotificationFactory.success({
          title: "Update", message: "Image was updated",
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.paginated_gallery = _.map($scope.paginated_gallery, function(photo, index) {
          photo.select = false;
          return photo;
        });
        $scope.HasFilter = true;
        /*if(update.data.hasOwnProperty('image_type')){
          $scope.FilterSel.Type = update.data.image_type;
          $scope.itemsPerPage = 9;
        }*/
      },
      function(error){
        NotificationFactory.error({
          title: "Error", message: "Unable to Update Image data",
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(updated.length>1){
      LincServices.UpdateImages(updated, function(results){
        _.forEach(results, function(result, idx) {
          var data = { "type" : result.image_type };
          var index = updated[idx].index;
          _.merge($scope.paginated_gallery[index], $scope.paginated_gallery[index], data);
        });
        NotificationFactory.success({
          title: "Update", message: "All Images have been updated",
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.paginated_gallery = _.map($scope.paginated_gallery, function(photo, index) {
          photo.select = false;
          return photo;
        });
        $scope.HasFilter = true;
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

.filter('unsafe', function($sce) {
  return $sce.trustAsHtml;
})

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

/*$scope.OpenUpload = function(){
  var modalInstance;
  var modalScope = $scope.$new();
  modalScope.ok = function () {
    modalInstance.close(modalScope.selected);
  };

  modalInstance = $uibModal.open({
    animation: true,
    backdrop: true,
    templateUrl: "uploadimages.html",
    controller:  "UploadImagesCtrl",
    scope: modalScope,
    //controllerAs: 'scope',
    //bindToController: true,
    size: "lg",
    resolve: {
      options: function () {
        return ({'isnew': false, 'imagesetId': optionsSet.id});
      }
    }
  });
  modalInstance.result.then(function (result) {
    console.log(result);
  }, function (result) {
    console.log('Modal dismissed at: ' + result);
  });
}*/
