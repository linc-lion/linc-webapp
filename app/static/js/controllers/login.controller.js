// LINC is an open source shared database and facial recognition
// system that allows for collaboration in wildlife monitoring.
// Copyright (C) 2016  Wildlifeguardians
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For more information or to contact visit linclion.org or email tech@linclion.org
'use strict';

angular.module('lion.guardians.login.controller', [])
// Login
.controller('LoginCtrl', ['$scope', '$state', '$timeout', 'AuthService', 'NotificationFactory', function ($scope, $state, $timeout, AuthService, NotificationFactory) {

  $scope.loginData = { username : '' , password : '', _xsrf: ''};
  $scope.dataLoading = false;
  $scope.remember = true;

  var user = AuthService.user;
  $scope.checkLogged = function(){
    if(AuthService.chech_auth().then( function(resp){
    //if (user && user.logged){
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
