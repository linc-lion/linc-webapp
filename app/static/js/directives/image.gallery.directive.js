'use strict';

angular.module('lion.guardians.image.gallery.directive', [])

.directive('imageGallery', ['$uibModal', function($uibModal) {
  return {
    transclude: true,
    restrict: 'EA',
    template: '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-camera"></i> IMAGE GALLERY</a></p>',
    scope: {
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      optionsSet: '=',
      debug: '=',
      modalIsOpen: '='
    },
    link: function(scope, element, attrs) {
      scope.show = function(){
        console.log(scope.modalIsOpen);
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
            gallery: function(LincServices) {
              return LincServices.getImageGallery(scope.optionsSet.id);
            }
          }
        });
        modalInstance.result.then(function (result) {
          scope.modalIsOpen = false;
          console.log('Modal close : ' + result);
        }, function (result) {
          scope.modalIsOpen = false;
          console.log('Modal dismissed : ' + result);
        });
      }
    }
  };
}]);
