'use strict';

angular.module('lion.guardians.side.menu.controller', ['lion.guardians.side.menu.directive'])

.controller('SideMenuCtrl', ['$scope', '$state', '$window', '$localStorage', 'notificationFactory', function ($scope, $state, $window, $localStorage, notificationFactory) {
    $scope.title = 'Menu';
    $scope.content = 'Menu';

    $scope.$storage = $localStorage;

    var user = { email: 'justin@lg.org', org: 'Lion Guardians' }
    $scope.login = { logged: $scope.$storage.logged,
                            msg: $scope.$storage.logged ? 'Logged in as <b>' +
                            user.email + '</b> of <b>' + user.org + '</b>' : 'Not Logged In'};

    $scope.options = {imageset: { btn: {save:true, update:true}, title: 'Image Set Metadata'},
                         lions: { btn: {save:true, update:true}, title:'Lion Metadata'}};

    $scope.goto_imageset = function ($hide) { $hide(); $state.go("imageset"); }
    $scope.goto_lion = function ($hide) { $hide(); $state.go("lion"); }

    $scope.logout = function($hide){
        $hide();
        $scope.$storage.logged = false;

        notificationFactory.success({
          title: "Logout", message:'Good bye.',
          position: "right", // right, left, center
          duration: 300000     // milisecond
        });
        $state.go("login");
    }
}]);
