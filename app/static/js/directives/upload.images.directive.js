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

angular.module('linc.upload.images.directive', [])

.directive('uploadImages', ['$uibModal', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template: function(element, attrs) {
      switch (attrs.type) {
        case 'new':
          return '<button ng-disabled="disableUpload" type="submit" class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="btnSubmit(metadataForm) && showNew()"><i class="icon icon-camera"> </i>Create & Add Images</button>';

        case 'precropped':
          return '<button ng-disabled="disableUpload" type="submit" class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="showOnly()"><i class="icon icon-camera"> </i>UPLOAD PRE-CROPPED PHOTOS</button>';

        default:
          return '<button class="btn btn-primary btn-block" ng-click="ShowOpen()">Upload images</button>';
      }
    },
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
      disableUpload: '='
    },
    link: function(scope, element, attrs) {

      scope.showOnly = function(){

        console.log(scope);
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
                return ({'isNew': true, 'imagesetId': scope.imagesetId});
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

      scope.showNew = function(){
        scope.saveMetadataAction().then(function (result) {
          var modalScope = scope.$new();
          modalScope.result = result;
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
                return ({'isNew': attrs.type == 'new', 'imagesetId': result.imagesetId});
              }
            }
          });
          modalInstance.result.then(function (result) {
             scope.closeAction();
            console.log(result);
          }, function (result) {
            scope.closeAction();
          });
        });
      },
      scope.ShowOpen = function(){
        var modalScope = scope.$new();
        modalScope.imagesChanged = false;
        modalScope.debug = scope.debug;
        var modalInstance = $uibModal.open({
          animation: true,
          backdrop  : 'static',
          templateUrl: scope.useTemplateUrl,
          controller:  scope.useCtrl,
          controllerAs: 'scope',
          bindToController: true,
          size: scope.formSize,
          scope: modalScope,
          resolve: {
            options: function () {
              return ({'isnew': attrs.type == 'new', 'imagesetId': scope.imagesetId});
            }
          }
        });
        modalScope.Update = function () {
          modalScope.imagesChanged = true;
        };
        modalInstance.result.then(function (result) {
          if(modalScope.imagesChanged)
            scope.imageUpdated();
          console.log(result);
        }, function (result) {
          if(modalScope.imagesChanged)
            scope.imageUpdated();
          console.log('Modal dismissed at:');
        });
      }
    }
  };
}]);
