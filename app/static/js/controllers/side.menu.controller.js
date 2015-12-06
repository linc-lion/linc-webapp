'use strict';

angular.module('lion.guardians.side.menu.controller', ['lion.guardians.side.menu.directive'])

.controller('SideMenuCtrl', ['$scope', '$state', '$window', '$localStorage', '$http', '$cookies', 'NotificationFactory', function ($scope, $state, $window, $localStorage, $http, $cookies, NotificationFactory) {

  $scope.title = 'Menu';
  $scope.content = 'Menu';

  $scope.$storage = $localStorage;

  $scope.login = { 'logged': $scope.$storage.logged,
                   'username': $scope.$storage.username,
                   'orgname': $scope.$storage.orgname,
                   'admin': $scope.$storage.admin };

  $scope.options = {
    "imageset": {
      "type": "imageset", "edit": "new", "uploading_user_id": 1,
      "owner_organization_id": 2, "uploading_organization_id": 2
    },
    "lions": {
      "type": "lion", "edit": "new", "uploading_user_id": 1,
      "owner_organization_id": 2, "uploading_organization_id": 2
    }
  };

  $scope.goto_imageset = function (Id) {
    $state.go("imageset", { id: Id });
  }
  $scope.goto_lion = function (Id) {
    $state.go("lion", { id: Id });
  }

  $scope.logout = function($hide){
    $hide();
    // Clear storage info
    var xsrfcookie = $cookies.get('_xsrf');
    var req = { method: 'POST',
                   url: '/logout',
                  data: {},
               headers: { 'Content-Type': 'application/json', 'X-XSRFToken' : xsrfcookie},
                config: {}};
    $http(req).then(function(){
      // Cleanning storage
      $scope.$storage.$reset();

      NotificationFactory.success({
        title: "Logout", message:'Good bye.',
        position: "right", // right, left, center
        duration: 3000     // milisecond
      });
      $state.go("login");
    }, function(){
      NotificationFactory.error({
        title: "Logout", message:'Logout failed.',
        position: "right", // right, left, center
        duration: 5000     // milisecond
      });
    });
  }
}]);
