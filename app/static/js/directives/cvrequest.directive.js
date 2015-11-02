'use strict';

angular.module('lion.guardians.cvrequest.directive', [])

.directive('cvrequest', function($uibModal) {
    return {
        transclude: true,
        restrict: 'EA',
        scope : true ,
        template:  '<button class="btn btn-default" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i>Request CV</button>',
        scope: {
          //requestCV: '&requestCV',
          useTemplateUrl: '@',
          useCtrl: '@',
          formSize: '@',
          imagesetId: '='
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
                imagesetId: function () {
                  return scope.imagesetId;
                }
              }
            });
            modalInstance.result.then(function (result) {
              //scope.imagesetId = items;
              //scope.requestCV(items);
              console.log('Modal ok ' + result);
            }, function () {
              console.log('Modal dismissed at: ' + new Date());
            });
          };
        }
    };
})
