'use strict';

angular.module('lion.guardians.upload.images.directive', [])

.directive('uploadImages', function($modal) {
    return {
        transclude: true,
        restrict: 'EA',
        template: '<a class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-camera"></i> ADD NEW IMAGE SET</a>',
        scope: {
           // 'hideModal': '&hideModal'
        },
        link: function(scope, element, attrs) {
            scope.show = function(){
                 var myModal = $modal(
                        {
                            controller: 'UploadImagesCtrl',
                            templateUrl: 'uploadimages',
                            show: true
                        }
                    );

            };
        }
    };
});
