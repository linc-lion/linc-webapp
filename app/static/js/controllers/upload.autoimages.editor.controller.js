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

angular.module('linc.autocropper.editor.controller', [])

.controller('AutoCropperEditorCtrl', ['$http', '$scope', '$window', '$cookies', '$uibModalInstance', 'AutoCropperServices', '$bsTooltip', 'FileUploader', 'NotificationFactory', 'options', function ($http, $scope, $window, $cookies, $uibModalInstance, AutoCropperServices, $bsTooltip, FileUploader, NotificationFactory, options) {


	$scope.imagesetId = options.imagesetId;
	$scope.isNew = options.isNew;
    $scope.existing_coords = options.coords;

	$scope.onModalOpen = options.onModalOpen; // Access the function from the resolved options


    $scope.RunCropperController = function()
    {

      if ($scope.existing_coords)
      {

         setTimeout(function () {
            $scope.initialize($scope.existing_coords);
          }, 100); // Adjust the delay as needed

      }
      // else {
      //
      //   AutoCropperServices.AutoCropper(item.file, function (response) {
      //
      //     console.log(response);
      //
      //     setTimeout(function () {
      //       $scope.initialize(response.bounding_box_coords);
      //     }, 100); // Adjust the delay as needed
      //
      //
      //   }, function (response) {
      //     console.log(response);
      //
      //   });
      //
      // }

    };

	$scope.RunCropperController();



	var titles = {}; titles['lions'] = 'Lion'; titles['imagesets'] = 'Image Set';
	$scope.title = 'Upload Images';
	$scope.content = 'Upload Images<br />Contents!';


	$scope.GoBack = function () {
	 	$uibModalInstance.dismiss('cancel');
	};
	$scope.Cancel = function () {
	 	$uibModalInstance.dismiss('cancel');
	};
	$scope.Finish = function ()
    {
      $uibModalInstance.close($scope.img_coords_details);
	};



	var uploader = $scope.uploader = new FileUploader({
		url: '/autocropper',
		removeAfterUpload: true
	});

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

    var maxtam = 20
    if(fileItem.file.name.match(".xml")){
        console.log("Arquivo xml inserido na lista: " + fileItem.file.name)
        maxtam=100
    }

    if(fileItem.file.name.length>maxtam){
        fileItem.nickname = (fileItem.file.name || "").substring(1, 10) + ' ... '  +  (fileItem.file.name || "").substring(fileItem.file.name.length-8, fileItem.file.name.length)
        fileItem.show_name = false;
        fileItem.tooltip = {'title': 'filename: ' + fileItem.file.name, 'checked': true};
    }
    else{
        fileItem.nickname = fileItem.file.name;
        fileItem.show_name = true;
        fileItem.tooltip = {'title': '', 'checked': true};
    }
};
  $scope.enable_Upload = false;
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
    if(this.getNotUploadedItems().length)
      $scope.enable_Upload = true;
  };



  $scope.enable_Upload = false;
  $scope.remove_item = function(item){
    item.remove();
    if(!uploader.getNotUploadedItems().length)
      $scope.enable_Upload = false;
  };
  $scope.remove_all_items = function(item){
    uploader.clearQueue();
    if(!uploader.getNotUploadedItems().length)
      $scope.enable_Upload = false;
  };


  var uploader_voc = $scope.uploader_voc = new FileUploader({
    url: '/images/uploadvoc/',
    removeAfterUpload: true
  });



}])
