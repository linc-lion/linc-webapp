
'use strict';

angular.module('lion.guardians.admin.users.controller', [])

.controller('AdminUsersCtrl', ['$scope', '$window', '$uibModal', function ($scope, $window, $uibModal) {

  $scope.Selecteds = $scope.CleanBracket.users;
  $scope.User_Mode  =  $scope.EmptyString.users;

  var check_selects = function (){
    var count = 0;
    $scope.all_selected = false;
    $scope.all_unselected = true;
    if($scope.ordered_users) count = $scope.ordered_users.length;
    if(count>0){
      if($scope.Selecteds.length == count)
        $scope.all_selected = true;
      if($scope.Selecteds.length)
        $scope.all_unselected = false;
    }
  }

  check_selects();

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
    check_selects();
  }

  $scope.Select_User1 = function (user){
    if($scope.User_Mode != '') return;
    user.selected = !user.selected;
    $scope.Select_User(user);
  }

  var lastSelId = -1;
  $scope.Select_User = function (user){
    var shiftKey = $window.event.shiftKey;
    if(shiftKey && lastSelId>=0){
      var index0 = _.findIndex($scope.ordered_users, {'id': lastSelId});
      var index1 = _.findIndex($scope.ordered_users, {'id': user.id});
      var first = Math.min(index1, index0);
      var second = Math.max(index1, index0);
      for(var i = first; i < second; i++){
        var person = $scope.ordered_users[i];
        person.selected = user.selected;
        if(user.selected){
          if(!_.some($scope.Selecteds, person))
            $scope.Selecteds.push(person);
        }
        else {
          $scope.Selecteds = _.without($scope.Selecteds, person);
        }
      }
    }
    else{
      lastSelId= user.id;
      if(user.selected){
        if(!_.some($scope.Selecteds, user))
          $scope.Selecteds.push(user);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, user);
      }
    }
    check_selects();
  }

  var modal = null;
  $scope.Add_User = function () {
    $scope.password_required = true;
    $scope.modalTitle = 'Add User';
    $scope.showValidationMessages = false;
    $scope.user = {
      'email': '', 'organization_id': -1, 'password': '', 'confirmPassword': '', 'admin': false, 'trashed': false, 'selected': true
    }
    modal = $uibModal.open({
        templateUrl: 'Edit_User.tmpl.html',
        scope:$scope
    });
    modal.result.then(function (result) {
      console.log("Add");
    }, function (){
      $scope.User_Mode = '';
      console.log("add dismiss");
    });
    $scope.check_all(false);
    $scope.User_Mode = 'add';
  };

  $scope.Edit_User = function() {
    $scope.password_required = false;
    $scope.modalTitle = 'Edit User';
    $scope.showValidationMessages = false;

    if($scope.Selecteds.length == 1){
      $scope.User_Mode = 'edit';
      $scope.user = angular.copy($scope.Selecteds[0]);
      modal = $uibModal.open({
          templateUrl: 'Edit_User.tmpl.html',
          scope:$scope
      });
      modal.result.then(function (result) {
        console.log("Edited");
      }, function (){
        $scope.User_Mode = '';
        console.log("edit dismiss");
      });
    }
  }

  $scope.Cancel_Edit_User = function(){
    modal.dismiss();
    $scope.User_Mode = '';
  }

  $scope.Submit = function (valid){
    if(valid){
      modal.close();
      Submit_User();
    }
    else {$scope.showValidationMessages = true;}
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

  var Submit_User = function(){
    if($scope.User_Mode == 'edit'){
      var data = {'email': $scope.user.email,
          'organization_id': $scope.user.organization_id,
                    'admin': $scope.user.admin,
                  'trashed': $scope.user.trashed
      };
      $scope.LincApiServices.Users({'method': 'put', 'user_id' : $scope.user.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'User Info', message: 'User data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });

        var user = $scope.Selecteds[0];
        _.merge(user, user, response.data);
        user.created_at = (user.created_at || "").substring(0,19);
        user.updated_at = (user.updated_at || "").substring(0,19);
        user.organization = _.find($scope.organizations, {'id': user.organization_id}).name;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change User data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if($scope.User_Mode == 'add'){
      var data = {'email': $scope.user.email,
          'organization_id': $scope.user.organization_id,
          'password': $scope.user.password,
                    'admin': $scope.user.admin,
                  'trashed': $scope.user.trashed
      };
      $scope.LincApiServices.Users({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'User Info', message: 'New User successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        var user = response.data;
        user.created_at = (user.created_at || "").substring(0,19);
        user.updated_at = (user.updated_at || "").substring(0,19);
        user.organization = _.find($scope.organizations, {'id': user.organization_id}).name;
        user.selected = true;
        $scope.users.push(user);
        $scope.Selecteds.push(user);
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new User',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    $scope.User_Mode = '';
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

  // Order by
  $scope.reverse = false;
  $scope.predicate = 'id';
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };
}])
;
