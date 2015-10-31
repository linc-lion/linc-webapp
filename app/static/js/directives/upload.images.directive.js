'use strict';

angular.module('lion.guardians.upload.images.directive', [])

.directive('uploadImages', function($uibModal) {
    return {
        transclude: true,
        restrict: 'EA',
        template: '<a class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-camera"></i> Save & Upload Images</a>',
        scope: {
          closeAction: '&',
          useTemplateUrl: '@',
          useCtrl: '@',
          formSize: '@'
        },
        link: function(scope, element, attrs) {
          scope.dismiss = function() {
            console.log
          }
          scope.show = function(){
            var modalInstance = $uibModal.open({
              animation: true,
              backdrop: true,
              templateUrl: scope.useTemplateUrl,
              controller:  scope.useCtrl,
              size: scope.formSize,
              resolve: {
              }
            });
            modalInstance.result.then(function (result) {
               scope.closeAction();
              console.log(result);
            }, function (result) {
              console.log('Modal dismissed at: ' + result);
            });
          }
        }
    };
});
