'use strict';

angular.module('lion.guardians.cvrefine.directive', [])

.directive('cvrefine', function($modal) {
    return {
        transclude: true,
        restrict: 'EA',
        scope : true ,
        template:  '<button class="btn btn-default" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i>Request CV</button>',
        scope: {
           // 'hideModal': '&hideModal'
        },
        link: function(scope, element, attrs) {
            scope.show = function(){
                 var myModal = $modal(
                        {
                            controller: 'CVRefineCtrl',
                            templateUrl: 'cvrefine',
                            show: true
                        }
                    );
            };
        }
    };
})




