'use strict';

angular.module('lion.guardians.cvrequest.directive', [])

.directive('cvrequest', ['$uibModal', function($uibModal){
  return {
    transclude: true,
    restrict: 'EA',
    template: function(element, attrs) {
      switch (attrs.type) { //view selection. Put type='new' or type='search'
        case 'search':
          return '<button class="btn btn-default" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i>Request CV</button>';
          default:
            return '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i> Request CV</a></p>';
      }
    },
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
            },
            lions: function(LincServices) {
              return LincServices.Lions();
            },
            lion_filters: function(LincDataFactory) {
              return LincDataFactory.get_lions_cvreq_filters();
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
}]);
