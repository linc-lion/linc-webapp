'use strict';

angular.module('lion.guardians.upload.images.directive', [])

.directive('uploadImages', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template: function(element, attrs) {
      switch (attrs.type) {
        case 'metadata':
          return '<a class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-camera"></i> Save & Add Images</a>';
        default:
          return '<button class="btn btn-primary btn-block">Upload images</button>';
      }
    },
    scope: {
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      optionsSet: '=',
      saveMetadataAction:'&',
      closeAction:'&'
    },
    link: function(scope, element, attrs) {
      scope.show = function(){
        scope.saveMetadataAction().then(function (results) {
          var modalInstance = $uibModal.open({
            animation: true,
            backdrop: true,
            templateUrl: scope.useTemplateUrl,
            controller:  scope.useCtrl,
            size: scope.formSize,
            resolve: {
              optionsSet: function () {
                return scope.optionsSet;
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
      }
    }
  };
});
