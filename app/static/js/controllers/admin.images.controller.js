
'use strict';

angular.module('lion.guardians.admin.images.controller', [])

.controller('AdminImagesCtrl', ['$scope', '$window', '$uibModal', function ($scope, $window, $uibModal) {

  $scope.itemsPerPage = 100;

  $scope.Selecteds = $scope.CleanBracket.images;
  $scope.Image_Mode  =  $scope.EmptyString.images;

  var check_selects = function (){
    var count = 0;
    $scope.all_selected = false;
    $scope.all_unselected = true;
    if($scope.paginated_images) count = $scope.paginated_images.length;
    if(count>0){
      if($scope.Selecteds.length == count)
        $scope.all_selected = true;
      if($scope.Selecteds.length)
        $scope.all_unselected = false;
    }
  }

  check_selects();

  $scope.check_all = function (val){
    if(val){
      _.forEach($scope.paginated_images, function(image) {
        image.selected = val;
        if(!_.some($scope.Selecteds, image))
          $scope.Selecteds.push(image);
      });
    }
    else{
      _.forEach($scope.images, function(image) {
        image.selected = val;
        $scope.Selecteds = _.without($scope.Selecteds, image);
      });
    }
    check_selects();
  }

  $scope.Select_Image1 = function (image){
    if($scope.Image_Mode != '') return;
    image.selected = !image.selected;
    $scope.Select_Image(image);
  }

  var lastSelId = -1;
  $scope.Select_Image = function (image){
    var shiftKey = $window.event.shiftKey;
    if(shiftKey && lastSelId>=0){
      var index0 = _.findIndex($scope.paginated_images, {'id': lastSelId});
      var index1 = _.findIndex($scope.paginated_images, {'id': image.id});
      var first = Math.min(index0, index1);
      var second = Math.max(index0, index1);
      for(var i = first; i < second; i++){
        var img = $scope.paginated_images[i];
        img.selected = image.selected;
        if(image.selected){
          if(!_.some($scope.Selecteds, img))
            $scope.Selecteds.push(img);
        }
        else {
          $scope.Selecteds = _.without($scope.Selecteds, img);
        }
      }
    }
    else{
      lastSelId = image.id;
      if(image.selected){
        if(!_.some($scope.Selecteds, image))
          $scope.Selecteds.push(image);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, image);
      }
    }
    check_selects();
  }

  var modal = null;
  $scope.Add_Image = function () {
    $scope.modalTitle = 'Add Image';
    $scope.showValidationMessages = false;
    $scope.image = {
      'url': '', 'image_type': 'cv', 'image_set_id': '',
      'is_public': true, 'trashed': false, 'selected': true
    };
    modal = $uibModal.open({
        templateUrl: 'Edit_Image.tmpl.html',
        scope:$scope
    });
    modal.result.then(function (result) {
      console.log("Add");
    }, function (){
      $scope.Image_Mode = '';
      console.log("add dismiss");
    });

    $scope.check_all(false);
    $scope.Image_Mode = 'add';
  };

  $scope.Edit_Image = function() {
    $scope.modalTitle = 'Edit Image';
    $scope.showValidationMessages = false;

    if($scope.Selecteds.length == 1){
      $scope.Image_Mode = 'edit';
      $scope.image = angular.copy($scope.Selecteds[0]);
      modal = $uibModal.open({
          templateUrl: 'Edit_Image.tmpl.html',
          scope:$scope
      });
      modal.result.then(function (result) {
        console.log("Edited");
      }, function (){
        $scope.Image_Mode = '';
        console.log("edit dismiss");
      });
    }
  }

  $scope.Cancel_Edit_Image = function(){
    modal.dismiss();
    $scope.Image_Mode = '';
  }

  $scope.Submit = function (valid){
    if(valid){
      modal.close();
      Submit_Image();
    }
    else {$scope.showValidationMessages = true;}
  }

  $scope.Delete_Image = function() {
    $scope.Delete('Images')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (image){
        return {'id': image.id};
      }), 'id');

      $scope.LincApiServices.Images({'method': 'delete', 'images_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'Images successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.images, function(image) {
            return image.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }

  $scope.image = {
    'url': '', 'image_type': 'cv', 'image_set_id': '',
    'is_public': true, 'trashed': false, 'selected': true
  };

  var Submit_Image = function(){
    if($scope.Image_Mode == 'edit'){
      var data = { 'url': $scope.image.url,
            'image_type': $scope.image.image_type,
          'image_set_id': $scope.image.image_set_id,
             'is_public': $scope.image.is_public,
               'trashed': $scope.image.trashed
      };
      $scope.LincApiServices.Images({'method': 'put', 'image_id' : $scope.image.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Image Info', message: 'Image data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        var image = $scope.Selecteds[0];
        _.merge(image, image, response.data);
        image.created_at = (image.created_at || "").substring(0,19);
        image.updated_at = (image.updated_at || "").substring(0,19);
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Image data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if($scope.Image_Mode == 'add'){
      var data = { 'url': $scope.image.url,
            'image_type': $scope.image.image_type,
          'image_set_id': $scope.image.image_set_id,
             'is_public': $scope.image.is_public,
               'trashed': $scope.image.trashed
      };
      $scope.LincApiServices.Images({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Image Info', message: 'New Image successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        var image = response.data;
        image.created_at = (image.created_at || "").substring(0,19);
        image.updated_at = (image.updated_at || "").substring(0,19);
        image.selected = true;
        $scope.images.push(image);
        $scope.Selecteds.push(image);
      },
      function(error){
        $scope.Notification.error({
          title: "Image", message: 'Fail to create new Image',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }

  $scope.show_photo = function(url){
    var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
    win.focus();
  }

  $scope.TypesLabel = [ {'type': 'cv', 'label': 'CV Image'},{'type': 'full-body', 'label': 'Full Body'},
                        {'type': 'whisker', 'label': 'Whisker'},{'type': 'main-id', 'label': 'Main Id'},
                        {'type': 'markings', 'label': 'Markings'}];

  // Order by
  $scope.reverse = false;
  $scope.predicate = 'id';
  $scope.PerPage = 50;
  $scope.currentPage = 0;
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };
  /*$scope.TotalItems = function(){
    var total = $scope.filtered_images? $scope.filtered_images.length : 0;
  }*/
  $scope.pageCount = function() {
    var total = $scope.filtered_images? $scope.filtered_images.length : 0;
    return Math.ceil(total/$scope.itemsPerPage);
  };
  $scope.setPage = function(n) {
    $scope.currentPage = n;
  };
  $scope.prevPage = function() {
    if ($scope.currentPage > 0)
      $scope.setPage($scope.currentPage - 1);
  };
  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()-1)
      $scope.setPage($scope.currentPage + 1);
  };
  $scope.firstPage = function() {
    $scope.setPage(0)
  };
  $scope.lastPage = function() {
    if ($scope.currentPage < $scope.pageCount()-1)
      $scope.setPage($scope.pageCount()-1);
  };
  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };
  $scope.nextPageDisabled = function() {
    return ($scope.currentPage === $scope.pageCount()-1 || !$scope.pageCount())? "disabled" : "";
  };
  $scope.range = function() {
    var rangeSize = Math.min(5, $scope.pageCount());
    var ret = [];
    var start = $scope.currentPage -3;
    if ( start < 0 ) start = 0;
    if ( start > $scope.pageCount()-(rangeSize-3) ) {
      start = $scope.pageCount()-rangeSize+1;
    }
    var max = Math.min(start+rangeSize,$scope.pageCount());
    for (var i=start; i<max; i++) {
      ret.push(i);
    }
    return ret;
  };
}])

;
