
'use strict';

angular.module('lion.guardians.admin.users.controller', [])

.controller('AdminUsersCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.User_Change = {'mode': '', 'label': 'Submit'};
  $scope.isCollapsed = true;

  $scope.check_all = function (val){
    _.forEach($scope.users, function(user) {
      user.selected = val;
      if(user.selected){
        if(!_.some($scope.Selecteds, user))
          $scope.Selecteds.push(user);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, user);
      }
    });
  }
  $scope.Select_User1 = function (user){
    if(mode!='') return;
    user.selected = !user.selected;
    $scope.Select_User(user);
  }
  $scope.Select_User = function (user){
    if(user.selected){
      if(!_.some($scope.Selecteds, user))
        $scope.Selecteds.push(user);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, user);
    }
    if($scope.Selecteds.length != $scope.users.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }

  $scope.Add_User = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.users.unshift({ 'id': '', 'email': '', 'organization_id': -1, 'admin': false,
                      'trashed': false, 'selected': true, 'change_mode': true });
    $scope.btn_submit = 'Add New';
    $scope.User_Change = {'mode': mode, 'label': 'Submit'};
  };

  $scope.Edit_User = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.User_Change = {'mode': mode, 'label': 'Submit'};
    }
  }

  $scope.Cancel_Edit_User = function(){
    if(mode == 'add'){
      _.remove($scope.users, function(user) {
        return user == $scope.users[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.User_Change.mode = '';
  }

  $scope.Delete_User = function() {

    $scope.Delete('Users')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (user){
        return {'id': user.id};
      }), 'id');

      $scope.LincApiServices.Users({'method': 'delete', 'users_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'Users successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.users, function(user) {
            return user.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }

  $scope.Submit_User = function(){
    if(mode == 'edit'){
      var user = $scope.Selecteds[0];
      var data = {'email': user.email,
        'organization_id': user.organization_id,
                  'admin': user.admin,
                'trashed': user.trashed };
      $scope.LincApiServices.Users({'method': 'put', 'user_id' : user.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'User Info', message: 'User data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(user, user, response.data);
        user.organization = _.find($scope.organizations, {'id': user.organization_id}).name;
        user.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change User data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var user = $scope.Selecteds[0];
      var data = {'email': user.email,
          'organization_id': user.organization_id,
                    'admin': user.admin,
                  'trashed': user.trashed };
      $scope.LincApiServices.Users({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'User Info', message: 'New User successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(user, user, response.data);
        user.organization = _.find($scope.organizations, {'id': user.organization_id}).name;
        user.change_mode = false;
        user.selected = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new User',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }

  $scope.ChangePassword = function(){
    $scope.modalTitle = 'Change Password';
    $scope.showValidationMessages = false;
    if($scope.Selecteds.length == 1){
      $scope.sel_user = { 'email': $scope.Selecteds[0].email, 'password': "", 'confirmPassword': "" };
      $scope.modalInstance = $uibModal.open({
          templateUrl: 'Password.tmpl.html',
          scope:$scope
      });
      $scope.modalInstance.result.then(function (result) {
        alert("Update Password");
      });
      $scope.submit_password = function (valid){
        if(valid)
          $scope.modalInstance.close();
        else {
          $scope.showValidationMessages = true;
        }
      }
      $scope.cancel_password = function(){
        $scope.modalInstance.dismiss();
      }
    };
  }
}])
;
