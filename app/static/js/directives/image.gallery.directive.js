'use strict';

angular.module('lion.guardians.image.gallery.directive', [])

.directive('imageGallery', function($modal) {
    return {
        transclude: true,
        restrict: 'EA',
        template: '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-camera"></i> IMAGE GALLERY</a></p>',
        scope: {
           // 'hideModal': '&hideModal'
        },
        link: function(scope, element, attrs) {
            scope.show = function(){
                 var myModal = $modal(
                        {
                            controller: 'ImageGalleryCtrl',
                            templateUrl: 'imagegallery',
                            show: true
                        }
                    );

            };
        }
    };
});

