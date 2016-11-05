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

angular.module('linc.login.controller', [])
// Login
.controller('LoginCtrl', ['$scope', '$state', '$timeout', '$uibModal', 'AuthService', 'NotificationFactory', 
  function ($scope, $state, $timeout, $uibModal, AuthService, NotificationFactory) {

    $scope.loginData = { username : '' , password : '', _xsrf: ''};
    $scope.dataLoading = false;
    $scope.remember = true;

    var user = AuthService.user;
    $scope.checkLogged = function(){
      AuthService.login_chech_auth().then(function(resp){
        $state.go("home");
      });
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
    $scope.forgotPwd = function(){
      var modalScope = $scope.$new();
      modalScope.dataSending = false;
      modalScope.modalTitle = 'Reset your password?';
      modalScope.showValidationMessages = false;
      modalScope.forgot = {username: ''};

      var modalInstance = $uibModal.open({
        templateUrl: 'ForgetPwd.tmpl.html',
        scope: modalScope
      });
      modalInstance.result.then(function (result) {
        var data = {'username': result.username};
        modalScope.dataSending = false;
        ShowInfo(data);
      });
      modalScope.resetPassword = function (valid){
        if(valid){
          modalScope.dataSending = true;
          $timeout(function() {
            modalInstance.close(modalScope.forgot);
          }, 2000);
          // $scope.LincApiServices.Users({'method': 'put', 'user_id' : $scope.sel_user.id, 'data': data}).then(function(response){
          //   $scope.Notification.success({
          //     title: 'Change Password', message: 'Password of '+ $scope.sel_user.email +' successfully updated',
          //     position: "right", // right, left, center
          //     duration: 2000     // milisecond
          //   });
          // },
          // function(error){
          //   $scope.Notification.error({
          //     title: "Fail", message: 'Fail to change User Password',
          //     position: 'right', // right, left, center
          //     duration: 5000   // milisecond
          //   });
          // });
        }
        else {
          modalScope.showValidationMessages = true;
        }
      }
      modalScope.cancel = function(){
        modalInstance.dismiss();
      }
    }
    var ShowInfo = function (data){
      var modalScope = $scope.$new();
      modalScope.modalTitle = 'Verification email';
      modalScope.modalMessage = "An email with password reset instructions has been sent to "+ 
                            data.username + ", if it exists on our system.";
      var modalInstance = $uibModal.open({
          templateUrl: 'ForgetSended.tmpl.html',
          scope: modalScope,
          size: '350px'
      });
      modalScope.close = function (){
        modalInstance.close();
      }
    }
    $scope.checkLogged();

  }
])
