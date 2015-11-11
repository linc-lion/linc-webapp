'use strict';

angular.module('lion.guardians.metadata.directive', [])

.directive('metadata', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template: function(element, attrs) {
      switch (attrs.type) { //view selection. Put type='edit' or type=''
        case 'add_image_set':
          return '<p><a class="btn btn-lg btn-default" ng-click="show()"><i class="icon icon-circle-with-plus"></i> ADD NEW IMAGE SET</a></p>';
        case 'add_lion':
          return '<p><a class="btn btn-lg btn-default" ng-click="show()"><i class="icon icon-circle-with-plus"></i> ADD NEW LION</a></p>';
        case 'side_lion':
          return '<a ng-click="show();">Add new Lion</a>';
        case 'side_image_set':
          return '<a ng-click="show();">Add new Image Set</a>';
        default:
          return '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-pencil"></i> EDIT METADATA</a></p>';
      }
    },
    scope: {
      //gotoImagesetAction: '&',
      cancelAction: '&',
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      optionsSet: '=',
      gotoImagesetAction:'&'
    },
    link: function(scope, element, attrs) {
      /*scope.dismiss = function() {
        console.log
      }*/
      scope.show = function(){
        var modalInstance = $uibModal.open({
          animation: true,
          backdrop: true,
          templateUrl: scope.useTemplateUrl,
          controller:  scope.useCtrl,
          size: scope.formSize,
          resolve: {
            optionsSet: function () {
              return scope.optionsSet;
            },
            organizations: function(LincServices) {
              return LincServices.Organizations();
            }
          }
        });
        modalInstance.result.then(function (result) {
          scope.gotoImagesetAction({Id: result.id});
          console.log('Modal ok' + result);
        }, function () {
          scope.cancelAction();
          console.log('Modal dismissed at: ' + new Date());
        });
      }
    }
  };
});
