'use strict';

angular.module('lion.guardians.side.menu.directive', [])

.directive('sidemenu', ['$aside', function($aside) {
  return {
    transclude: true,
    restrict: 'EA',
    template: '<li><a ng-click="show()" data-placement="right"><i class="icon icon-menu"></i></a></li>',
    scope: {
     debug: '='
    },
    link: function(scope, element, attrs) {
      scope.show = function(){
        var modalScope = scope.$new();
        modalScope.debug = scope.debug;
        var myModal = $aside({
                    scope: modalScope,
               controller: 'SideMenuCtrl',
              templateUrl: 'sidemenu.html',
                     show: true
        });
      };
    }
  };
}]);
