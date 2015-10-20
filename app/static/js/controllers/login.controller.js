'use strict';

angular.module('lion.guardians.login.controller', [])
// Login
.controller('LoginCtrl', ['$scope', '$state', '$timeout', '$localStorage', function ($scope, $state, $timeout, $localStorage) {

  $scope.loginData = { email : 'teste@venidera.com' , password : '123123'};
  $scope.dataLoading = false;
  $scope.remember = true;

  $scope.$storage = $localStorage;

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
      if (!$scope.loginData.email || !$scope.loginData.password){
        alert('Please fill the email address and password to login.');
      }else{
        $scope.dataLoading = true;
        // Authentication Service
        //$scope.loginData.email; $scope.loginData.password
        //var shaObj = new jsSHA($scope.loginData.email + $scope.loginData.password + $rootScope.secret, "TEXT");
        //var encrypted_pass = shaObj.getHash("SHA-512", "HEX");
        //$localStorage.logged = (result.data.data[0].password == encrypted_pass)
        var result = {email: "teste@venidera.com", password: '123123'}
        var encrypted_pass = result.password;
        $timeout(function () {
          //$scope.$storage.logged = ("123123" == "123123");
          $scope.$storage.logged = (result.password == encrypted_pass)
          $scope.$storage.email = result.email;

          $scope.dataLoading = false;

          if (!$scope.$storage.logged){
            alert("Incorrect password!");
            console.log(error);
          }
          else{
            $state.go("home");
          }
        }, 1000);
      }
    }
  };

  $scope.checkLogged();

}])
