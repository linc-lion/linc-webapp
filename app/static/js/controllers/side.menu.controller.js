'use strict';

angular.module('lion.guardians.side.menu.controller', ['lion.guardians.side.menu.directive'])

.controller('SideMenuCtrl', ['$scope', '$state', '$window', '$localStorage', '$http', '$cookies', 'NotificationFactory', function ($scope, $state, $window, $localStorage, $http, $cookies, NotificationFactory) {

  $scope.is_modal_open = false;
  $scope.title = 'Menu';
  $scope.content = 'Menu';

  $scope.user = $localStorage.user;

  $scope.options = {
    "imageset": {"type": "imageset", "edit": "new"},
    "lions": {"type": "lion", "edit": "new"}
  };

  $scope.goto_imageset = function (Id) {
    $state.go("imageset", { id: Id });
  }
  $scope.goto_lion = function (Id) {
    $state.go("lion", { id: Id });
  }

  $scope.logout = function($hide){
    $hide();
    var xsrfcookie = $cookies.get('_xsrf');
    var req = { method: 'POST',
                   url: '/logout',
                  data: {},
               headers: { 'Content-Type': 'application/json', 'X-XSRFToken' : xsrfcookie},
                config: {}};
    $http(req).then(function(){
      console.log('Logout ok!');
      // Cleanning storage
      $localStorage.$reset();
      $cookies.remove('userlogin');
      $state.go("login");
      NotificationFactory.success({
        title: "Logout", message:'Good bye.',
        position: "right", // right, left, center
        duration: 3000     // milisecond
      });
    }, function(){
      console.log('Logout ok but the token is already invalid');
      // Cleanning storage
      $localStorage.$reset();
      $cookies.remove('userlogin');
      $state.go("login");
    });
  }
}]);
