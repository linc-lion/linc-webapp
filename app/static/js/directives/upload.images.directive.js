'use strict';

angular.module('lion.guardians.upload.images.directive', [])

.directive('uploadImages', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template: function(element, attrs) {
      switch (attrs.type) {
        case 'new':
          return '<button type="submit" class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="!disabledBtn && showNew()"><i class="icon icon-camera"></i>Create & Add Images</button>';
        default:
          return '<button class="btn btn-primary btn-block" ng-click="ShowOpen()" ng-disabled="disabledBtn">Upload images</button>';
      }
    },
    scope: {
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      imagesetId: '=',
      saveMetadataAction:'&',
      closeAction:'&',
      disabledBtn: '=',
      imageUpdated:'&'
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
                return ({'isNew': attrs.type == 'new', 'data': result.data,'imagesetId': result.data.id});
              },
              disabledBtn: function (){
                return scope.disabledBtn;
              }
            }
          });
          modalInstance.result.then(function (result) {
             scope.closeAction();
            console.log(result);
          }, function (result) {
            scope.closeAction();
          });
        });
      },
      scope.ShowOpen = function(){
        var modalScope = scope.$new();
        modalScope.imagesChanged = false;
        var modalInstance = $uibModal.open({
          animation: true,
          backdrop: true,
          templateUrl: scope.useTemplateUrl,
          controller:  scope.useCtrl,
          controllerAs: 'scope',
          bindToController: true,
          size: scope.formSize,
          scope: modalScope,
          resolve: {
            options: function () {
              return ({'isnew': attrs.type == 'new', 'imagesetId': scope.imagesetId});
            }
          }
        });
        modalScope.Update = function () {
          modalScope.imagesChanged = true;
        };
        modalInstance.result.then(function (result) {
          if(modalScope.imagesChanged)
            scope.imageUpdated();
          console.log(result);
        }, function (result) {
          if(modalScope.imagesChanged)
            scope.imageUpdated();
          console.log('Modal dismissed at:');
        });
      }
    }
  };
});
