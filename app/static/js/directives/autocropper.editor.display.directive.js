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

angular.module('linc.autocropper.display.directive', [])

.directive('autoCropperDisplay', ['$uibModal', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template:  '<button type="submit" ng-disabled="enable_display_cropper()" class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="showModal()"><i class="icon icon-camera"> </i>Finish & Display All Cropped</button>',
    scope: {
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      imagesetId: '=',
      saveMetadataAction:'&',
      closeAction:'&',
      btnSubmit: '&',
      imageUpdated:'&',
      debug: '=',
      disableUpload: '=',
      imageCoords: '=',
      imagesQueue: '='
    },
    link: function(scope, element, attrs) {

      //we need to create images queue for cropper
      const imagesData = {};

      scope.enable_display_cropper = function(){


        if (!scope.imagesQueue || scope.imagesQueue.length <=0)
        {
          return true;
        }

        let count = 0;
        for (let i = 0; i < scope.imagesQueue.length; i++)
        {
            let image = scope.imagesQueue[i];
            if (image.file.name in scope.imageCoords && 'auto_cropper_coords' in scope.imageCoords[image.file.name])
            {
              count += 1;
            }

        }

        return count !== scope.imagesQueue.length;

      }

      scope.setup_cropped_images = function()
      {

        let ListOfTags = [
		{ disabled: false, id: 0, value: "cv", label: "CV Image" },
		{ disabled: false, id: 1, value: "main-id", label: "Main Id" },
		{ disabled: false, id: 3, value: "whisker-left", label: "Whisker Left" },
		{ disabled: false, id: 4, value: "whisker-right", label: "Whisker Right" },
		{ disabled: false, id: 2, value: "marking", label: "Marking" },
		{ disabled: false, id: 7, value: "whisker", label: "Whisker (Not used in algorithm)" },
		{ disabled: false, id: 6, value: "full-body", label: "Full Body" }
	];


        // all original image and its coordinates will be stored in this array
        imagesData['images_details'] = [];

        // all cropped images will be stored in this array
        imagesData['cropped_images'] = [];

        console.info("in editor display directive, about to start displaying...");

        for (let i = 0; i < scope.imagesQueue.length; i++)
        {
          let image = scope.imagesQueue[i];

          imagesData['images_details'].push({
            'item': image,
            'auto_cropper_coords': scope.imageCoords[image.file.name]['auto_cropper_coords'],
          });
          console.info(image.file.name);
          console.info(scope.imageCoords[image.file.name]['auto_cropper_coords']);

          // push same image to queue for each crop
            for (let key in scope.imageCoords[image.file.name]['manual_coords']) {

              let tags = angular.copy(ListOfTags)
              const existingTag = ListOfTags.find(tag => tag.value === scope.imageCoords[image.file.name]['manual_coords'][key]['mapped']);
              console.info(image);
                imagesData['cropped_images'].push({
                  'coords': scope.imageCoords[image.file.name]['manual_coords'][key]['coords'],
                  'tags': [existingTag],
                  'item': image,
                  'is_public': false,
                  'listOfTags': tags,
                  'actual_tags': key
                });
            }

            let count = scope.imageCoords[image.file.name]['new_rect_coords'].length;

            for (let j = 0; j < count; j++) {
              let tags = angular.copy(ListOfTags)
              const existingTag = ListOfTags.find(tag => tag.value === scope.imageCoords[image.file.name]['new_rect_coords'][j]['mapped']);


                imagesData['cropped_images'].push({
                  'coords' : scope.imageCoords[image.file.name]['new_rect_coords'][j]['coords'],
                  'tags': [existingTag],
                  'item': image,
                  'is_public': false,
                  'listOfTags': tags
                });
            }

        }

      }


      scope.showModal = function(){


        scope.setup_cropped_images();

        var modalScope = scope.$new();
          modalScope.debug = scope.debug;
          var modalInstance = $uibModal.open({
            animation: true,
            backdrop  : 'static',
            templateUrl: scope.useTemplateUrl,
            controller:  scope.useCtrl,
            size: scope.formSize,
            scope: modalScope,
            resolve: {
              options: function () {
                return ({
                  'isNew': true,
                  'imagesetId': scope.imagesetId,
                  'imageCoords': scope.imageCoords,
                  'imagesData': imagesData
                });
              }
            }
          });
          modalInstance.result.then(function (result) {
             scope.closeAction();
            console.log(result);
          }, function (result) {
            scope.closeAction();
          });
      }

    }
  };
}]);
