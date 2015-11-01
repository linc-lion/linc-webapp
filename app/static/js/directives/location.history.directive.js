'use strict';

angular.module('lion.guardians.location.history.directive', [])

.directive('locationHistory', function($uibModal) {
    return {
        transclude: true,
        restrict: 'EA',
        template: '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-location-pin"></i> POSITION ON MAP</a></p>',
        scope: {
          useTemplateUrl: '@',
          useCtrl: '@',
          formSize: '@'
        },
        link: function(scope, element, attrs) {
          scope.show = function(){
            var modalInstance = $uibModal.open({
              animation: true,
              backdrop: true,
              templateUrl: scope.useTemplateUrl,
              controller:  scope.useCtrl,
              size: scope.formSize,
              resolve: {
                modalOptions: function () {
                  return scope.modalOptions;
                }
              }
            });
            modalInstance.result.then(function (result) {
              console.log('Modal ok' + result);
            }, function () {
              console.log('Modal dismissed at: ' + new Date());
            });
          };
        }
    };
});
