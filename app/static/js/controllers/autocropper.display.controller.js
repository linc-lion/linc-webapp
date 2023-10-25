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

angular.module('linc.upload.autoimages.display.controller', [])

.controller('AutoUploadImagesDisplayCtrl', ['$http', '$scope', '$state', '$window', '$cookies', '$uibModalInstance', 'AutoCropperServices', '$bsTooltip', 'FileUploader', 'NotificationFactory', 'options', function ($http, $scope, $state ,$window, $cookies, $uibModalInstance, AutoCropperServices, $bsTooltip, FileUploader, NotificationFactory, options) {

	$scope.imagesetId = options.imagesetId;
	$scope.isNew = options.isNew;

    $scope.image_coords = options.imageCoords;
    $scope.imagesData = options.imagesData;

	var titles = {}; titles['lions'] = 'Lion'; titles['imagesets'] = 'Image Set';
	$scope.title = 'Upload Images';
	$scope.content = 'Upload Images<br />Contents!';

    $scope.UpdateCoords = function(result, item)
    {
      $scope.image_coords[item.nickname] = result;
    }


	$scope.GoBack = function () {
	 	$uibModalInstance.dismiss('cancel');
	};
	$scope.Cancel = function () {
	 	$uibModalInstance.dismiss('cancel');
	};
	$scope.Finish = function () {
	 	$uibModalInstance.close('finish');
	};

	$scope.OnSelect = function($item, Tags,listOfTags) {
		UpdateTags(Tags, listOfTags);
	};
	$scope.OnRemove = function($item, Tags,listOfTags) {
		UpdateTags(Tags, listOfTags);
	};

  var UpdateTags = function (Tags, ListOfTags){
    var disabled_tag = _.difference(['whisker', 'whisker-left','whisker-right'],
      _.intersection(_.map(Tags,'value'),
          ['whisker', 'whisker-left','whisker-right']));
    if (disabled_tag.length == 3)
      disabled_tag = [];
    _.forEach(ListOfTags, function(tag){
        tag.disabled = _.includes(disabled_tag, tag.value);
    });
  };


	$scope.Properties = [
		{ value: true, label: "Public" },
		{ value: false, label: "Private" }
	];

	$scope.Default = {isPublic: true, Tags: [], isCover: ''};

	var uploader = $scope.uploader = new FileUploader({
		url: '/autocropper/upload',
		removeAfterUpload: false
	});

    $scope.enable_Upload = false;



  // CALLBACKS
  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
  };

  uploader.onBeforeUploadItem = function(item)
  {
    console.info('onBeforeUploadItem', item);

    // get original coordinates
    let current_item = $scope.imagesData.images_details[item.index - 1];
    // item.formData.push.apply(item.formData, [{'auto_cropper_coords' : JSON.stringify(current_item['auto_cropper_coords'])}]);


    let image_info = {
      'new_rect': [],
      'manual_coords': {},
      'auto_cropper_coords': current_item['auto_cropper_coords']

    };

    for (let image of $scope.imagesData.cropped_images) {
      if (image.item.file.name === current_item['item'].file.name) {
        if (image.actual_tags) {
          image_info['manual_coords'][image.actual_tags] = {
            'coords': image.coords,
            'image_tags': _.map(image.tags, 'value'),
            'actual_tags': image.actual_tags,
            'is_public': image.is_public,
            'iscover': ($scope.Default.isCover === image.$$hashKey)
          };
        } else {
          image_info['new_rect'].push({
            'coords': image.coords,
            'image_tags': _.map(image.tags, 'value'),
            'actual_tags': image.actual_tags,
            'is_public': image.is_public,
            'iscover': ($scope.Default.isCover === image.$$hashKey),
          })
        }

        }
    }

    item.formData.push.apply(item.formData, [{'manual_coords': JSON.stringify(image_info)}]);

    var xsrfcookie = $cookies.get('_xsrf');
    item.headers = {'X-XSRFToken' : xsrfcookie};

    var formData = [{'image_set_id': $scope.imagesetId},];

    Array.prototype.push.apply(item.formData, formData);

  };
  uploader.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
  };
  $scope.SucessItems = [];  $scope.Duplicateds = [];
  $scope.InvalidData = [];  $scope.ErrorItems = [];
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
      var photo = {'name': fileItem.file.name, 'status' : status, 'response': response}
      fileItem.progress = 200;
      $scope.SucessItems.push(photo);
      //fileItem.remove();
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
      var photo = {'name': fileItem.file.name, 'status' : status, 'response': response}
      if(status==409){
        $scope.Duplicateds.push(photo);
      }
      else if(status==400){
        $scope.InvalidData.push(photo);
      }
      else
        $scope.ErrorItems.push(photo);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
      if(!$scope.isNew)
        $scope.Update();
  };
  uploader.onCompleteAll = function() {
    if(!uploader.getNotUploadedItems().length)
      $scope.enable_Upload = false;


    var message = '';
    if($scope.SucessItems.length>0)
    {
      if($scope.SucessItems.length==1){
        message = "Images uploaded with success.<br>";
        message += "It's being processed now."
      }
      else{
        var items = 'Images (';
        _.forEach($scope.SucessItems, function(photo, i) {
          items += photo.name;
          if(i+1 < $scope.SucessItems.length)
           items += '<br>';
        });
        message = items + ") uploaded with success.<br>";
        message += "The images are being processed now."
      }
      NotificationFactory.success({
        title: "Upload", message: message,
        position: "right", // right, left, center
        duration: 5000     // milisecond
      });

      if ($state.current.name === 'imageset')
      {
        // $state.go($state.current, { id: $scope.imagesetId } , {reload: true});
        $state.reload();

      }
      else {
        $state.go("imageset", { id: $scope.imagesetId });

      }


    }
    if($scope.Duplicateds.length>0){
      var title = "Duplicate image"
      if($scope.Duplicateds.length==1){
        message = "The image (" + $scope.Duplicateds[0].name + ")<br>";
        message += "is already on base."
      }
      else{
        title = "Duplicate images"
        var items = 'The images (';
        _.forEach($scope.Duplicateds, function(photo, i) {
          items += photo.name;
          if(i+1 < $scope.Duplicateds.length)
           items += '<br>';
        });
        message = items + ")<br>";
        message += "already exists in the base."
      }
      if($scope.debug || ($scope.Duplicateds[0].status != 401 && $scope.Duplicateds[0].status != 403)){
        NotificationFactory.error({
          title: title, message: message,
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
    }
    if($scope.InvalidData.length>0){
      var title = "Invalid Data or Image"
      if($scope.InvalidData.length==1){
        message = "There is an error in the data or image <br> (" + $scope.InvalidData[0].name + ")<br>";
        message += "."
      }
      else{
        title = "Invalid Data or Image"
        var items = 'There are errors in the data or images <br>(';
        _.forEach($scope.InvalidData, function(photo, i) {
          items += photo.name;
          if(i+1 < $scope.InvalidData.length)
           items += '<br>';
        });
        message = items + ")";
      }
      if($scope.debug || ($scope.InvalidData[0].status != 401 && $scope.InvalidData[0].status != 403)){
        NotificationFactory.error({
          title: title, message: message,
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
    }
    if($scope.ErrorItems.length>0){
      var title = "Upload Error"
      if($scope.ErrorItems.length==1){
        message = "Error in processing image <br> (" + $scope.ErrorItems[0].name + ")<br>";
        message += "."
      }
      else{
        title = "Upload Errors"
        var items = 'Errors in processing of images <br>(';
        _.forEach($scope.ErrorItems, function(photo, i) {
          items += photo.name;
          if(i+1 < $scope.ErrorItems.length)
           items += '<br>';
        });
        message = items + ")";
      }
      if($scope.debug || ($scope.ErrorItems[0].status != 401 && $scope.ErrorItems[0].status != 403)){
        NotificationFactory.error({
          title: title, message: message,
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }


    }

  };

  $scope.calculateProgressBarWidth = function(imagesData, current) {
    let currentItemId = current.item;
    let filteredItems = imagesData.images_details.filter(function(current_item) {
        return current_item.item === currentItemId;
    });

    if (filteredItems.length > 0) {
        let index = imagesData.images_details.indexOf(filteredItems[0]);
        if (uploader.queue.length > 0){
          return uploader.queue[index].progress / 2;
        }
        return 0;

    }

    return 0; // Default width if no match is found
};


  $scope.upload_images = function (){

    console.log("uploading images");

    uploader.clearQueue();

    // add files to uploader queue
    for (let current_image of $scope.imagesData.images_details)
    {
       uploader.addToQueue(current_image.item._file);
    }

    // upload all files
    uploader.uploadAll();


  }

  $scope.enable_Upload = true;
  $scope.remove_item = function(item)
  {

    let index = $scope.imagesData.cropped_images.indexOf(item);
    if (index > -1) {
        $scope.imagesData.cropped_images.splice(index, 1);
    }

    if(!$scope.imagesData.cropped_images.length)
      $scope.enable_Upload = false;
  };

  $scope.remove_all_items = function(){

    $scope.imagesData.cropped_images.length = 0;
    if(!$scope.imagesData.cropped_images.length)
      $scope.enable_Upload = false;
  };


}])

.filter('tag_filter', function(){
	return function(input, organizations) {
		var filtered = _.filter(input, function(value){
				return (_.result(_.find(organizations, {'name': value.organization}), 'checked'));
		});
		return filtered;
	};
})