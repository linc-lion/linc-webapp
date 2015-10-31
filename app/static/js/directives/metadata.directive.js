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
        default:
          return '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-pencil"></i> EDIT METADATA</a></p>';
      }
    },
    scope: {
      gotoImagesetAction: '&',
      //'hideModal': '&hideModal',
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      showBtnSave: '=',
      showBtnUpdate: '=',
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
            ShowBtnSave: function () {
              return scope.showBtnSave;
            },
            ShowBtnUpdate: function () {
              return scope.showBtnUpdate;
            }
          }
        });
        modalInstance.result.then(function (result) {
          scope.gotoImagesetAction();
          console.log('Modal ok' + result);
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      }
    }
  };
});
