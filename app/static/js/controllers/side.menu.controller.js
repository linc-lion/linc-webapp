'use strict';

angular.module('lion.guardians.side.menu.controller', ['lion.guardians.side.menu.directive'])

.controller('SideMenuCtrl', ['$scope', '$state', '$window', '$localStorage', 'NotificationFactory', function ($scope, $state, $window, $localStorage, NotificationFactory) {
    $scope.title = 'Menu';
    $scope.content = 'Menu';

    $scope.$storage = $localStorage;

    var user = { email: 'justin@lg.org', org: 'Lion Guardians' }
    $scope.login = { logged: $scope.$storage.logged,
                            msg: $scope.$storage.logged ? 'Logged in as <b>' +
                            user.email + '</b> of <b>' + user.org + '</b>' : 'Not Logged In'};

    $scope.options = {imageset: { type: 'imagesets', edit: 'new' },
                         lions: { type: 'lions', edit: 'new'}};

    $scope.goto_imageset = function (Id) {
      $state.go("imageset", { id: Id });
    }
    $scope.goto_lion = function (Id) {
      $state.go("lion", { id: Id });
    }

    $scope.logout = function($hide){
        $hide();
        $scope.$storage.logged = false;

        NotificationFactory.success({
          title: "Logout", message:'Good bye.',
          position: "right", // right, left, center
          duration: 300000     // milisecond
        });
        $state.go("login");
    }
}]);
