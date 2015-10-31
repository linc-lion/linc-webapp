'use strict';

angular.module('lion.guardians.image.gallery.directive', [])

.directive('imageGallery', function($uibModal) {
    return {
        transclude: true,
        restrict: 'EA',
        template: '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-camera"></i> IMAGE GALLERY</a></p>',
        scope: {
           // 'hideModal': '&hideModal'
        },
        link: function(scope, element, attrs) {
          scope.show = function(){
            var modalInstance = $uibModal.open({
              animation: true,
              backdrop: true,
              templateUrl: 'imagegallery',
              controller: 'ImageGalleryCtrl',
              size: 'lg',
              resolve: {
              }
            });
            modalInstance.result.then(function (result) {
              console.log('Modal close : ' + result);
            }, function (result) {
              console.log('Modal dismissed : ' + result);
            });
          }
        }
    };
});
