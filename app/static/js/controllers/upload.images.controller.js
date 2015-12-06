'use strict';

angular.module('lion.guardians.upload.images.controller', ['lion.guardians.upload.images.directive', 'lion.guardians.thumbnail.directive'])

.controller('UploadImagesCtrl', ['$scope', '$window', '$cookies', '$uibModalInstance', '$bsTooltip', 'FileUploader', 'NotificationFactory', 'options', function ($scope, $window, $cookies, $uibModalInstance, $bsTooltip, FileUploader, NotificationFactory, options) {

  $scope.imagesetId = options.imagesetId;
  $scope.isNew = options.isNew;

  $scope.SucessItems = [];
  $scope.ErrorItems = [];
  var titles = {}; titles['lions'] = 'Lion'; titles['imagesets'] = 'Image Set';
  $scope.title = 'Upload Images';
  $scope.content = 'Upload Images<br />Contents!';

  $scope.GoBack = function () {
   $uibModalInstance.dismiss('cancel');
  };
  $scope.Cancel = function () {
   $uibModalInstance.dismiss('cancel');
  };
  $scope.Finish = function () {
   $uibModalInstance.close('finish');
  };

  $scope.Types = {'Images':[{"value":"cv","label":"CV Image"},{"value":"full-body","label":"Full Body"},
                            {"value":"whisker","label":"Whisker"}, {"value":"main-id","label":"Main Id"}, {"value":"markings","label":"Markings"}],
              'Properties':[{"value":true,"label":"Public"},{"value":false,"label":"Private"}]
  };
  $scope.Default = {isPublic: true, ImageType: 'cv', isCover: ''};

  var xsrfcookie = $cookies.get('_xsrf');
  var uploader = $scope.uploader = new FileUploader({
    url: '/images/upload',
    headers: {'X-XSRFToken' : xsrfcookie},
    config: {ignoreLoadingBar: false}
  });

  //$scope.headers = { 'Content-Type': 'application/json', 'X-XSRFToken' : xsrfcookie};
  // FILTERS
  uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  });
  //uploader.headers = {'Content-Type': 'application/json', 'X-XSRFToken' : xsrfcookie};
  // CALLBACKS
  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploader.onAfterAddingFile = function(fileItem) {

    if(fileItem.file.name.length>20){
      fileItem.nickname = (fileItem.file.name || "").substring(1, 10) + ' ... '  +  (fileItem.file.name || "").substring(fileItem.file.name.length-8, fileItem.file.name.length)
      fileItem.show_name = false;
      fileItem.tooltip = {'title': 'filename: ' + fileItem.file.name, 'checked': true};
    }
    else{
      fileItem.nickname = fileItem.file.name;
      fileItem.show_name = true;
      fileItem.tooltip = {'title': '', 'checked': true};
    }

    console.info('onAfterAddingFile', fileItem);
  };
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
    console.info('onBeforeUploadItem', item);

    var formData = [{'image_type' : item.ImageType},
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
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
      fileItem.remove();
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    var photo = {'name': fileItem.file.name, 'status' : status, 'response': response}
    if(status==200)
      $scope.SucessItems.push(photo);
    else
      $scope.ErrorItems.push(photo);

      console.info('onCompleteItem', fileItem, response, status, headers);
      if(!$scope.isNew)
        $scope.Update();
  };
  uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
    var message = '';
    if($scope.SucessItems.length>0){
      if($scope.SucessItems.length==1)
        message = "Image (" + $scope.SucessItems[0].name + ") uploaded with success";
      else{
        var items = 'Images (';
        _.forEach($scope.SucessItems, function(photo, i) {
          items += photo.name;
          if(i+1 < $scope.SucessItems.length)
           items += '<br>';
        });
        message = items + ") uploaded with success";
      }
      NotificationFactory.success({
        title: "Upload", message: message,
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
    }
    if($scope.ErrorItems.length>0){
      if($scope.ErrorItems.length==1)
        message = "Unable to upload image (" + $scope.ErrorItems[0].name + ").";
      else{
        var items = 'Unable to upload images (';
        _.forEach($scope.ErrorItems, function(photo, i) {
          items += photo.name;
          if(i+1 < $scope.ErrorItems.length)
           items += '<br>';
        });
        message = items + ").";
      }
      if($scope.debug || ($scope.ErrorItems[0].status != 401 && $scope.ErrorItems[0].status != 403)){
        NotificationFactory.error({
          title: "Error", message: message,
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
    }
  };

  console.info('uploader', uploader);
}])
