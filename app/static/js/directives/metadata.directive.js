'use strict';

angular.module('lion.guardians.metadata.directive', [])

.directive('metadata', function($modal) {
    return {
        transclude: true,
        restrict: 'EA',
        template: '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-pencil"></i> EDIT METADATA</a></p>',
        scope: {
           // 'hideModal': '&hideModal'
        },
        link: function(scope, element, attrs) {
            scope.show = function(){
                 var myModal = $modal(
                        {
                            controller: 'MetadataCtrl',
                            templateUrl: 'metadata',
                            show: true
                        }
                    );
            };
        }
    };
});

