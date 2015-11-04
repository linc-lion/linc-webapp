'use strict';

angular.module('lion.guardians.side.menu.directive', [])

.directive('sidemenu', function($aside) {
    return {
        transclude: true,
        restrict: 'EA',
        template: '<li><a ng-click="show()" data-placement="right"><i class="icon icon-menu"></i></a></li>',
        scope: {
           // 'hideModal': '&hideModal'
        },
        link: function(scope, element, attrs) {
            scope.show = function(){
                 var myModal = $aside(
                        {
                            controller: 'SideMenuCtrl',
                            templateUrl: 'sidemenu.html',
                            show: true
                        }
                    );
            };
        }
    };
});
