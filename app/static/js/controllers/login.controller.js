'use strict';

angular.module('lion.guardians.login.controller', [])
// Login
.controller('LoginCtrl', ['$scope', '$state', '$timeout', '$localStorage', 'LincServices', 'NotificationFactory', function ($scope, $state, $timeout, $localStorage, LincServices, NotificationFactory) {

  $scope.loginData = { username : '' , password : '', _xsrf: '', token : '' , admin : false};
  $scope.dataLoading = false;
  $scope.remember = true;

  $scope.$storage = $localStorage;

  $localStorage.$reset();

  $scope.checkLogged = function(){
    if ($scope.$storage.logged){
      $scope.dataLoading = true;

      $timeout(function() {
        $scope.dataLoading = false;
        $state.go("home");
      }, 1000);

    }
  }

  $scope.login = function() {
    if (!$scope.$storage.logged){
      if (!$scope.loginData.username || !$scope.loginData.password){
        alert('Please fill the email address and password to login.');
      }else{
        $scope.dataLoading = true;
        // Authentication Service
        LincServices.Login($scope.loginData, function(result){
          $scope.$storage.logged = true;
          var data = result.data.data;
          $scope.$storage.username = data['username'];
          $scope.$storage.orgname = data['orgname']
          $scope.$storage.admin = data['admin'];
          $scope.$storage.token = data['token'];
          $scope.dataLoading = false;
          if (!$scope.$storage.logged){
            NotificationFactory.error({
              title: 'Login', message: 'Login error.',
              position: 'left', // right, left, center
              duration: 10000   // milisecond
            });
          }
          else{
            /*
            NotificationFactory.success({
              title: "Login", message:'Successfully connected.',
              position: "right", // right, left, center
              duration: 3000     // milisecond
            });
            */
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
