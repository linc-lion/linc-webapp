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

angular.module('linc.upload.autoimages.directive', [])

.directive('uploadAutoImages', ['$uibModal', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template:  '<button type="submit" class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="showOnly()"><i class="icon icon-camera"> </i>UPLOAD PRE-CROPPED PHOTOS</button>',
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


      //
      // scope.showCropper = function(file, coordinates){
      //
      //   scope.image = file._file;
      //    var modalScope = scope.$new();
      //     modalScope.debug = scope.debug;
      //     var modalInstance = $uibModal.open({
      //       animation: true,
      //       backdrop  : 'static',
      //       templateUrl: 'editimagescropper.html',
      //       controller:  scope.useCtrl,
      //       size: scope.formSize,
      //       scope: modalScope,
      //       resolve: {
      //         options: function () {
      //           return ({'item': file, 'coordinates': coordinates});
      //         }
      //       }
      //     });
      //
      //     modalInstance.opened.then(function () {
      //
      //         setTimeout(function () {
      //               scope.addimage();
      //         }, 100); // Adjust the delay as needed
      //     });
      //
      //
      //     modalInstance.result.then(function (result) {
      //        scope.closeAction();
      //       console.log(result);
      //     }, function (result) {
      //       scope.closeAction();
      //     });
      // }

      scope.showOnly = function(){

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

    }
  };
}]);
