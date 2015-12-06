'use strict';

angular.module('lion.guardians.metadata.directive', [])

.directive('metadata', ['$uibModal', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template: function(element, attrs) {
      switch (attrs.type) { //view selection. Put type='edit' or type=''
        case 'add_image_set':
          return '<p><a class="btn btn-lg btn-default" ng-click="showNew()"><i class="icon icon-circle-with-plus"></i> ADD NEW IMAGE SET</a></p>';
        case 'add_lion':
          return '<p><a class="btn btn-lg btn-default" ng-click="showNew()"><i class="icon icon-circle-with-plus"></i> ADD NEW LION</a></p>';
        case 'side_lion':
          return '<a ng-click="showNew();">Add new Lion</a>';
        case 'side_image_set':
          return '<a ng-click="showNew();">Add new Image Set</a>';
        default:
          return '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="showEdit()"><i class="icon icon-pencil"></i> EDIT METADATA</a></p>';
      }
    },
    scope: {
      //gotoImagesetAction: '&',
      cancelAction: '&',
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      optionsSet: '=',
      gotoImagesetAction:'&',
      updateAction: '&',
      debug: '=',
      modalIsOpen: '='
    },
    link: function(scope, element, attrs) {
      scope.showNew = function(){
        if(scope.modalIsOpen) return;
        scope.modalIsOpen = true;
        var modalScope = scope.$new();
        modalScope.created = false;
        modalScope.id = 0;
        modalScope.debug = scope.debug;
        var modalInstance = $uibModal.open({
          animation: true,
          backdrop: true,
          templateUrl: scope.useTemplateUrl,
          controller:  scope.useCtrl,
          size: scope.formSize,
          scope: modalScope,
          resolve: {
            optionsSet: function () {
              return scope.optionsSet;
            },
            organizations: function(LincServices) {
              return LincServices.Organizations();
            }
          }
        });
        modalScope.Object_Created = function (obj) {
          modalScope.created = true;
          modalScope.id = obj.id;
        };
        modalInstance.result.then(function (result) {
          scope.modalIsOpen = false;
          scope.gotoImagesetAction({Id: result.id});
          console.log('Modal ok' + result);
        }, function () {
          scope.modalIsOpen = false;
          if(modalScope.created)
            scope.gotoImagesetAction({'Id': modalScope.id});
          else {
            scope.cancelAction();
          }
          console.log('Modal dismissed at: ' + new Date());
        });
      },
      scope.showEdit = function(){
        if(scope.modalIsOpen) return;
        scope.modalIsOpen = true;
        var modalScope = scope.$new();
        modalScope.debug = scope.debug;
        var modalInstance = $uibModal.open({
          animation: true,
          backdrop: true,
          templateUrl: scope.useTemplateUrl,
          controller:  scope.useCtrl,
          size: scope.formSize,
          scope: modalScope,
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
          scope.modalIsOpen = false;
          scope.updateAction({data: result.data});
          console.log('Modal ok' + result);
        }, function () {
          scope.modalIsOpen = false;
          scope.cancelAction();
          console.log('Modal dismissed at: ' + new Date());
        });
      }
    }
  };
}]);
