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

angular.module('linc.upload.autoimages.display.directive', [])

.directive('uploadAutoImagesDisplay', ['$uibModal', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template:  '<button type="submit" class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="showOnly()"><i class="icon icon-camera"> </i>Finish & Display All Cropped</button>',
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

      	scope.ListOfTags = [
		{ disabled: false, id: 0, value: "cv", label: "CV Image" },
		{ disabled: false, id: 1, value: "main-id", label: "Main Id" },
		{ disabled: false, id: 3, value: "whisker-left", label: "Whisker Left" },
		{ disabled: false, id: 4, value: "whisker-right", label: "Whisker Right" },
		{ disabled: false, id: 2, value: "marking", label: "Marking" },
		{ disabled: false, id: 7, value: "whisker", label: "Whisker (Not used in algorithm)" },
		{ disabled: false, id: 6, value: "full-body", label: "Full Body" }
	];




      scope.showOnly = function(){

        //we need to create images queue for cropper
        const cropped_images = []



        for (var i = 0; i < scope.imagesQueue.length; i++)
        {
          let image = scope.imagesQueue[i];
          image.coordinates = scope.imageCoords[image.nickname];

          // push same image to queue for each crop
            for (let key in scope.imageCoords[image.nickname]['manual_coords']) {

              let tags = angular.copy(scope.ListOfTags)
              const existingTag = scope.ListOfTags.find(tag => tag.value === scope.imageCoords[image.nickname]['manual_coords'][key]['mapped']);

                cropped_images.push({
                  'coords': scope.imageCoords[image.nickname]['manual_coords'][key]['coords'],
                  'tags': [existingTag],
                  'item': image,
                  'listOfTags': tags,
                  'actual_tags': key
                });
            }

            let count = scope.imageCoords[image.nickname]['new_rect_coords'].length;

            for (let j = 0; j < count; j++) {
              let tags = angular.copy(scope.ListOfTags)
              const existingTag = scope.ListOfTags.find(tag => tag.value === scope.imageCoords[image.nickname]['new_rect_coords'][j]['mapped']);


                cropped_images.push({
                  'coords' : scope.imageCoords[image.nickname]['new_rect_coords'][j]['coords'],
                  'tags': [existingTag],
                  'item': image,
                  'listOfTags': tags
                });
            }

        }

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
                  'imagesQueue': cropped_images
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
