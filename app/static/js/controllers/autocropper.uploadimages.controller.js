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

angular.module('linc.autocropper.uploadimages.controller', []).controller(
'AutoCropperUploadImagesCtrl', ['$http', '$scope', '$window', '$cookies', '$uibModalInstance', 'AutoCropperServices', '$bsTooltip', 'FileUploader', 'NotificationFactory', 'options', function ($http, $scope, $window, $cookies, $uibModalInstance, AutoCropperServices, $bsTooltip, FileUploader, NotificationFactory, options) {

  function resizeImage(fileItem, maxSizeInPixels) {
		console.info("fileItem before resize:");
		console.info({ ...fileItem });
    var reader = new FileReader();
    reader.onload = function(event) {
      var img = new Image();
      img.onload = function() {
        // Check if the image needs resizing
        var width = img.width;
        var height = img.height;
        if (width > maxSizeInPixels || height > maxSizeInPixels) {
          // Resize the image
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          if (width > height) {
            height = Math.round(height * maxSizeInPixels / width);
            width = maxSizeInPixels;
          } else {
            width = Math.round(width * maxSizeInPixels / height);
            height = maxSizeInPixels;
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

	        // Convert the resized image back to a File object
          canvas.toBlob(function(blob) {
            var resizedFile = new File([blob], fileItem.name, {
              type: fileItem.type,
              lastModified: Date.now()
            });

            // Update the fileItem with the resized file
            fileItem._file = resizedFile;
            fileItem.file = resizedFile;
          }, fileItem.type);

          NotificationFactory.info({
            title: "Upload",
            message: `To stay within image size limit of ${maxSizeInPixels}px per side, image was resized from ${img.width}px by ${img.height}px to ${width}px by ${height}px`,
            position: "right", // right, left, center
            duration: 10000     // milisecond
          });
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(fileItem._file || fileItem.file);
		console.info("fileItem after resize:");
		console.info(fileItem);
  }

  $scope.imagesetId = options.imagesetId;
  $scope.isNew = options.isNew;

  $scope.image_coords = {};

  var titles = {}; titles['lions'] = 'Lion'; titles['imagesets'] = 'Image Set';
  $scope.title = 'Upload Images';
  $scope.content = 'Upload Images<br />Contents!';

    $scope.UpdateCoords = function(result, item)
    {
      $scope.image_coords[item.file.name] = result;
    }

  $scope.RunAutoCropper = function (item, onSuccess) {
    $scope.onSucess = onSuccess;


    if ( !(item.file.name in $scope.image_coords) ) {
      uploader.uploadItem(item);
    }
    else{
      $scope.onSucess();
    }


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


  $scope.Default = {isPublic: true, Tags: [], isCover: ''};

  var uploader = $scope.uploader = new FileUploader({
    url: '/autocropper',
  });

  uploader.onSuccessItem = function (fileItem, response, status, headers) {
    console.info('onSuccessItem', fileItem, response, status, headers);
    $scope.UpdateCoords(response.data.bounding_box_coords, fileItem);
    fileItem.progress = 200;
    $scope.onSucess();
  };

  // FILTERS
  uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif'.indexOf(type) !== -1;
    }
  });


  // CALLBACKS
  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
  };

  uploader.onAfterAddingFile = function(fileItem) {
    // check if file exceeds max allowed size

    var maxSizeInMB = 20;
    var maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (fileItem.file.size > maxSizeInBytes) {
        // Display an error message to the user
        NotificationFactory.error({
          title: "Upload Error",
          message: `File ${fileItem.file.name} exceeds maximum allowable file size of ${maxSizeInMB} MB. Please modify image quality, format, or dimensions to reduce size.`,
          position: 'right', // right, left, center
          duration: 10000   // milisecond
        });
        // Remove the file from the queue
        uploader.removeFromQueue(fileItem);
        return;
    }

    // make filename unique with date
    let date = new Date().getTime();
    let filename = fileItem.file.name;
    fileItem.file.name = date + '_' + filename;

    var maxtam = 20
    if(fileItem.file.name.match(".xml")){
        console.log("Arquivo xml inserido na lista: " + fileItem.file.name)
        maxtam=100
    }

    if(filename.length>maxtam){
        fileItem.nickname = (filename || "").substring(1, 10) + ' ... '  +  (filename || "").substring(filename.length-8, filename.length)
        fileItem.show_name = false;
        fileItem.tooltip = {'title': 'filename: ' + filename, 'checked': true};
    }
    else{
        fileItem.nickname = filename;
        fileItem.show_name = true;
        fileItem.tooltip = {'title': '', 'checked': true};
    }

    // Resize image dimensions if needed
    const maxSizeInPixels = 5000;
    resizeImage(fileItem, maxSizeInPixels);
  };
  $scope.enable_Upload = false;
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
    if(this.getNotUploadedItems().length)
      $scope.enable_Upload = true;
  };

  uploader.onBeforeUploadItem = function(item) {
    console.info('onBeforeUploadItem', item);

    var xsrfcookie = $cookies.get('_xsrf');
    item.headers = {'X-XSRFToken' : xsrfcookie};

    var formData = [{'image_tags' : _.map(item.Tags,'value')},
                    {'is_public': item.isPublic},
                    {'image_set_id': $scope.imagesetId},
                    {'iscover': ($scope.Default.isCover == item.$$hashKey)}];

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
    if($scope.SucessItems.length>0){
      if($scope.SucessItems.length==1){
        message = "Image (" + $scope.SucessItems[0].name + ") uploaded with success.<br>";
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

  $scope.enable_Upload = false;

  $scope.remove_item = function(item){
    item.remove();

    if (item.nickname in $scope.image_coords)
    {
        delete $scope.image_coords[item.nickname];
    }

    if(!uploader.getNotUploadedItems().length)
      $scope.enable_Upload = false;
  };
  $scope.remove_all_items = function(item){
    uploader.clearQueue();

    Object.keys($scope.image_coords).forEach(key => delete $scope.image_coords[key]);

    if(!uploader.getNotUploadedItems().length)
      $scope.enable_Upload = false;
  };


}])
