'use strict';

angular.module('lion.guardians.cvresults.directive', [])

.directive('cvresultsSearch', function($modal) {
    return {
        transclude: true,
        restrict: 'EA',
        scope : true ,
        template:  '<button class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i>CV Results</button>',
        scope: {
           // 'hideModal': '&hideModal'
        },
        link: function(scope, element, attrs) {
            scope.show = function(){
                 var myModal = $modal(
                        {
                            controller: 'CVResultsCtrl',
                            templateUrl: 'cvresults',
                            show: true
                        }
                    );
            };
        }
    };
})

.directive('cvresultsNew', function($modal) {
    return {
        transclude: true,
        restrict: 'EA',
        scope : true ,
        template: '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i> VIEW CV RESULTS</a></p>',

        scope: {
           // 'hideModal': '&hideModal'
        },
        link: function(scope, element, attrs) {
            scope.show = function(){
                 var myModal = $modal(
                        {
                            controller: 'CVResultsCtrl',
                            templateUrl: 'cvresults',
                            show: true
                        }
                    );
            };
        }
    };
})



