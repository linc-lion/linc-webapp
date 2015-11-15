'use strict';

angular.module('lion.guardians.upload.images.directive', [])

.directive('uploadImages', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template: function(element, attrs) {
      switch (attrs.type) {
        case 'new':
          return '<a class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="showNew()"><i class="icon icon-camera"></i> Save & Add Images</a>';
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
      closeAction:'&'
    },
    link: function(scope, element, attrs) {
      scope.showNew = function(){
        scope.saveMetadataAction().then(function (result) {
          var modalInstance = $uibModal.open({
            animation: true,
            backdrop: true,
            templateUrl: scope.useTemplateUrl,
            controller:  scope.useCtrl,
            size: scope.formSize,
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
            console.log('Modal dismissed at: ' + result);
          });
        });
      },
      scope.ShowOpen = function(){
        var modalInstance = $uibModal.open({
          animation: true,
          backdrop: true,
          templateUrl: scope.useTemplateUrl,
          controller:  scope.useCtrl,
          size: scope.formSize,
          resolve: {
            options: function () {
              return ({'isnew': attrs.type == 'new', 'imagesetId': scope.imagesetId});
            }
          }
        });
        modalInstance.result.then(function (result) {
          console.log(result);
        }, function (result) {
          console.log('Modal dismissed at: ' + result);
        });
      }
    }
  };
});
