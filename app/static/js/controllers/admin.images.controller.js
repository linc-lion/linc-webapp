
'use strict';

angular.module('lion.guardians.admin.images.controller', [])

.controller('AdminImagesCtrl', ['$scope', function ($scope) {
  $scope.itemsPerPage = 100;
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.Image_Change = {'mode': '', 'label': 'Submit'};

  $scope.check_all = function (val){
    _.forEach($scope.images, function(image) {
      image.selected = val;
      if(image.selected){
        if(!_.some($scope.Selecteds, image))
          $scope.Selecteds.push(image);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, image);
      }
    });
  }
  $scope.Select_Image1 = function (image){
    if(mode!='') return;
    image.selected = !image.selected;
    $scope.Select_Image(image);
  }
  $scope.Select_Image = function (image){
    //image.selected = !image.selected;
    if(image.selected){
      if(!_.some($scope.Selecteds, image))
        $scope.Selecteds.push(image);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, image);
    }
    if($scope.Selecteds.length != $scope.images.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }

  $scope.Add_Image = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.images.unshift({ 'id': '', 'image_set_id': '', 'image_type': 'cv', 'is_public': true,
    'url': '', 'trashed': false, 'selected': true, 'change_mode': true });
    $scope.btn_submit = 'Add New';
    $scope.Image_Change = {'mode': mode, 'label': 'Submit'};
  };

  $scope.Edit_Image = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.Image_Change = {'mode': mode, 'label': 'Submit'};
    }
  }
  $scope.Cancel_Edit_Image = function(){
    if(mode == 'add'){
      _.remove($scope.images, function(image) {
        return image == $scope.images[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.Image_Change.mode = '';
  }

  $scope.Delete_Image = function() {

    $scope.Delete('Images')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (image){
        return {'id': image.id};
      }), 'id');

      $scope.LincApiServices.Images({'method': 'delete', 'image_id': data}).then(function(){
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

  $scope.Submit_Image = function(){
    if(mode == 'edit'){
      var image = $scope.Selecteds[0];
      var data = {'image_set_id': image.image_set_id,
                  'image_type': image.image_type,
                  'is_public': image.is_public,
                  'url': image.url,
                  'trashed': image.trashed };

      $scope.LincApiServices.Images({'method': 'put', 'image_id' : image.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Image Info', message: 'Image data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(image, image, response.data);
        image.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Image data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var image = $scope.Selecteds[0];
      var data = {'image_set_id': image.image_set_id,
                  'image_type': image.image_type,
                  'is_public': image.is_public,
                  'url': image.url,
                  'trashed': image.trashed };

      $scope.LincApiServices.Images({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Image Info', message: 'New Image successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(image, image, response.data);
        image.change_mode = false;
        image.selected = false;
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
  $scope.filtered_images = 0;
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };
  $scope.pageCount = function() {
    return Math.ceil($scope.filtered_images.length/$scope.itemsPerPage);
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
  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };
  $scope.nextPageDisabled = function() {
    return ($scope.currentPage === $scope.pageCount()-1 || !$scope.pageCount())? "disabled" : "";
  };
}])

;
