'use strict';

angular.module('lion.guardians.login.controller', [])
// Login
.controller('LoginCtrl', ['$scope', '$state', '$timeout', 'AuthService', 'NotificationFactory', function ($scope, $state, $timeout, AuthService, NotificationFactory) {

  $scope.loginData = { username : '' , password : '', _xsrf: ''};
  $scope.dataLoading = false;
  $scope.remember = true;

  var user = AuthService.user;
  $scope.checkLogged = function(){
    if (user && user.logged){
      $scope.dataLoading = true;
      $timeout(function() {
        $scope.dataLoading = false;
        $state.go("home");
      }, 1000);
    }
  }

  $scope.login = function() {
    if (!user || !user.logged){
      if (!$scope.loginData.username || !$scope.loginData.password){
        alert('Please fill the email address and password to login.');
      }else{
        $scope.dataLoading = true;
        AuthService.setUser(null);
        // Authentication Service
        AuthService.Login($scope.loginData, function(logged){
          $scope.dataLoading = false;
          if (!logged){
            NotificationFactory.error({
              title: 'Login', message: 'Login error.',
              position: 'left', // right, left, center
              duration: 10000   // milisecond
            });
          }
          else{
            $state.go("home");
          }
        }, function (error){
          $scope.dataLoading = false;
          NotificationFactory.error({
            title: "Error", message: 'Login failed',
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
          console.log(error);
        });
      }
    }
  };

  $scope.checkLogged();

}])
