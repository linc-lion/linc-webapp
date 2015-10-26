'use strict';

angular.module('lion.guardians.image.set.directives', [])

.directive('newImagesetMetadata', function($modal) {
    return {
        transclude: true,
        restrict: 'EA',
        template: '<p><a class="btn btn-lg btn-default" ng-click="show()"><i class="icon icon-circle-with-plus"></i> ADD NEW IMAGE SET</a></p>',
        scope: {
           // 'hideModal': '&hideModal'
        },
        link: function(scope, element, attrs) {
            scope.show = function(){
                 var myModal = $modal(
                        {
                            controller: 'NewImageSetMetadataCtrl',
                            templateUrl: 'metadata',
                            show: true
                        }
                    );
            };
        }
    };
});
