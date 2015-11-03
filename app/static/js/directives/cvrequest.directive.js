'use strict';

angular.module('lion.guardians.cvrequest.directive', [])

.directive('cvrequest', ['$uibModal', function($uibModal){
  return {
    transclude: true,
    restrict: 'EA',
    template:  '<button class="btn btn-default" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i>Request CV</button>',
    scope: {
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      imagesetId: '=',
      cvRequestSuccess:'&'
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
        modalInstance.result.then(function (cvrequest) {
          scope.cvRequestSuccess({imageset_Id: scope.imagesetId, request_Obj: cvrequest});
          console.log('Modal ok ' + cvrequest);
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      };
    }
  };
}])
