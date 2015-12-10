'use strict';

angular.module('lion.guardians.login.controller', [])
// Login
.controller('LoginCtrl', ['$scope', '$state', '$timeout', '$localStorage', 'LincServices', 'NotificationFactory', function ($scope, $state, $timeout, $localStorage, LincServices, NotificationFactory) {

  $scope.loginData = { username : '' , password : '', _xsrf: ''};
  $scope.dataLoading = false;
  $scope.remember = true;

  //$scope.$storage = $localStorage;
  var user = $localStorage.user;
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
        $localStorage.$reset();
        // Authentication Service
        LincServices.Login($scope.loginData, function(result){
          var data = result.data.data;
          user = {
            'name': data['username'],
            'id': data['id'],
            'organization': data['orgname'],
            'organization_id': data['organization_id'],
            'admin': data['admin'],
            'logged': true,
            'token': data['token']
          }
          $localStorage.user = user;
          $scope.dataLoading = false;
          if (!user.logged){
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
