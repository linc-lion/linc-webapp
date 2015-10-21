'use strict';

angular.module('lion.guardians.side.menu.controller', ['lion.guardians.side.menu.directive'])

.controller('SideMenuCtrl', ['$scope', '$state', '$window', '$localStorage', function ($scope, $state, $window, $localStorage) {
    $scope.title = 'Menu';
    $scope.content = 'Menu';

    $scope.$storage = $localStorage;

    var user = { email: 'justin@lg.org', org: 'Lion Guardians' }
    $scope.login = { logged: $scope.$storage.logged,
                            msg: $scope.$storage.logged ? 'Logged in as <b>' +
                            user.email + '</b> of <b>' + user.org + '</b>' : 'Not Logged In'};

    /*$scope.hideModal = function ($hide) {
        SideModal.$promise.then($hide);
        $window.history.back();
    };*/
    $scope.logout = function($hide){
        $hide();
        $scope.$storage.logged = false;
        $state.go("login");
    }
}]);
