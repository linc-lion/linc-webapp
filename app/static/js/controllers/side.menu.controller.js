'use strict';

angular.module('lion.guardians.side.menu.controller', ['lion.guardians.side.menu.directive'])

.controller('SideMenuCtrl', ['$scope', '$state', '$localStorage', 'AuthService', 'NotificationFactory', function ($scope, $state, $localStorage, AuthService, NotificationFactory) {

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
    AuthService.Logout(function(result){
      $state.go("login");
      NotificationFactory.success({
        title: "Logout", message:'Good bye.',
        position: "right", // right, left, center
        duration: 3000     // milisecond
      });
    }, function(){
      $state.go("login");
    });
  }
}]);
