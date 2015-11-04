'use strict';

angular.module('lion.guardians.upload.images.controller', ['lion.guardians.upload.images.directive', 'lion.guardians.thumbnail.directive'])

.controller('UploadImagesCtrl', ['$scope', '$window', '$uibModalInstance', 'FileUploader', 'NotificationFactory', 'optionsSet', function ($scope, $window, $uibModalInstance, FileUploader, NotificationFactory, optionsSet) {

  $scope.optionsSet = optionsSet;

  $scope.isFromMetaData = optionsSet.isMetadata;

  var titles = {}; titles['lions'] = 'Lion'; titles['imagesets'] = 'Image Set';
  $scope.title = 'Upload Images ' + '(' + titles[$scope.optionsSet.type] + ')';
  $scope.content = 'Upload Images<br />Contents!';

  $scope.GoBack = function () {
   $uibModalInstance.dismiss('cancel');
  };
  $scope.Finish = function () {
    console.log("Option" + JSON.stringify($scope.optionsSet));
   $uibModalInstance.close('finish');
  };

  $scope.ImageTypes = [
                        {"value":"cv","label":"CV Image"},
                        {"value":"body","label":"Full Body"},
                        {"value":"whisker","label":"Whisker"},
                        {"value":"markings","label":"Markings"},
                        {"value":"id","label":"General Id"}
                      ];

  $scope.ImageProperties = [
                              {"value":"public","label":"Public"},
                              {"value":"private","label":"Private"}
                            ];

  var uploader = $scope.uploader = new FileUploader({
    url: 'https://angular-file-upload-cors-srv.appspot.com/upload'
  });

  // FILTERS
  uploader.filters.push({
    name: 'imageFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  });
  // CALLBACKS
  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
  };
  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);
  };
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
    //console.info('onBeforeUploadItem', item);
  /*  formData = [{
        selectedImageType: '$scope.selectedImageType',
        selectedProperties: '$scope.selectedProperties',
        selectedCover: '$scope.selectedCover'
    }];
    Array.prototype.push.apply(item.formData, formData);
    //item.formData.push(formData);*/
    /* Caso precise adicionar mais dados
    item.formData.push({selectedImageType: '$scope.selectedImageType',
    selectedProperties: '$scope.selectedProperties',
    selectedCover: '$scope.selectedCover'});
      console.log(item);
    */
  };
  uploader.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
      NotificationFactory.success({
        title: "Upload", message:'Images uploaded with success',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
  };

  console.info('uploader', uploader);
}])
