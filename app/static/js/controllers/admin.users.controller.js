
'use strict';

angular.module('lion.guardians.admin.users.controller', [])

.controller('AdminUsersCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

  $scope.User_Mode = $scope.settings.users.Mode;

  $scope.check_all = function (val){
    _.forEach($scope.$parent.users, function(user) {
      user.selected = val;
      if(user.selected){
        if(!_.some($scope.Selecteds, user))
          $scope.Selecteds.push(user);
      }
    });
    if(!val){
      $scope.Selecteds = [];
      $scope.settings.users.Selecteds = $scope.Selecteds;
    }
    check_selects();
  }

  $scope.Select_User1 = function ($event, user){
    if($scope.User_Mode != '') return;
    user.selected = !user.selected;
    $scope.Select_User($event, user);
  }

  var lastSelId = -1;
  $scope.Select_User = function ($event, user){
    var shiftKey = $event.shiftKey;
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
          $scope.settings.users.Selecteds = $scope.Selecteds;
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
        $scope.settings.users.Selecteds = $scope.Selecteds;
      }
    }
    check_selects();
  }

  var modal = null;
  $scope.Add_User = function () {
    $scope.password_required = true;
    $scope.modalTitle = 'Add User';
    $scope.showValidationMessages = false;

    $scope.organizations = angular.copy($scope.$parent.organizations);

    $scope.user = {
      'email': '', 'organization_id': -1, 'password': '', 'confirmPassword': '', 'admin': false, 'selected': true
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

    $scope.organizations = angular.copy($scope.$parent.organizations);

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
      var users_id = _.pluck(_.map($scope.Selecteds, function (user){
        return {'id': user.id};
      }), 'id');

      $scope.LincApiServices.Users({'method': 'delete', 'users_id': users_id}).then(function(response){
        if(response.error.length>0){
          var data = _.pluck(_.map(response.error, function (user){
            return {'id': user.id};
          }), 'id');
          var msg = (data.length>1) ? 'Unable to delete users ' + data : 'Unable to delete user ' + data;
          $scope.Notification.error({
            title: "Delete", message: msg,
            position: "right", // right, left, center
            duration: 2000     // milisecond
          });
        }
        else if(response.success.length>0){
          var msg = (response.success.length>1) ? 'Users successfully deleted' : 'User successfully deleted';
          $scope.Notification.success({
            title: "Delete", message: msg,
            position: "right", // right, left, center
            duration: 2000     // milisecond
          });
        }
        _.forEach(response.success, function(item, i){
          var remove = _.remove($scope.$parent.users, function(user) {
            return user.id == item.id;
          });
        });
        $scope.Selecteds = [];
        $scope.settings.users.Selecteds = $scope.Selecteds;
      });
    }, function () {
      $scope.Notification.info({
        title: "Cancel", message: 'Delete canceled',
        position: 'right', // right, left, center
        duration: 2000   // milisecond
      });
    });
  }

  var Submit_User = function(){
    if($scope.User_Mode == 'edit'){
      var data = {'email': $scope.user.email,
          'organization_id': $scope.user.organization_id,
                    'admin': $scope.user.admin
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
        var org = _.find($scope.$parent.organizations, {'id': user.organization_id});
        user.organization =  (org == undefined)? '' : org.name;
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
                    'admin': $scope.user.admin
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
        var org = _.find($scope.$parent.organizations, {'id': user.organization_id});
        user.organization =  (org == undefined)? '' : org.name;
        user.selected = true;
        $scope.$parent.users.push(user);
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
      $scope.sel_user = { 'email': $scope.Selecteds[0].email,
                          'id': $scope.Selecteds[0].id,
                          'password': "", 'confirmPassword': "" };
      $scope.modalInstance = $uibModal.open({
          templateUrl: 'Password.tmpl.html',
          scope:$scope
      });
      $scope.modalInstance.result.then(function (result) {
        var data = {'password': $scope.sel_user.password};
        $scope.LincApiServices.Users({'method': 'put', 'user_id' : $scope.sel_user.id, 'data': data}).then(function(response){
          $scope.Notification.success({
            title: 'Change Password', message: 'Password of '+ $scope.sel_user.email +' successfully updated',
            position: "right", // right, left, center
            duration: 2000     // milisecond
          });
        },
        function(error){
          $scope.Notification.error({
            title: "Fail", message: 'Fail to change User Password',
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        });
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

  // Order by
  $scope.reverse = $scope.settings.users.reverse;
  $scope.predicate = $scope.settings.users.predicate;
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
    $scope.settings.users.predicate = $scope.predicate;
    $scope.settings.users.reverse = $scope.reverse;
  };

  $scope.Selecteds = [];
  _.forEach($scope.settings.users.Selecteds, function(selected) {
    if(selected != undefined){
      var sel_user = _.find($scope.$parent.users, function(user) {
        return user.id == selected.id;
      });
      if(sel_user){
        sel_user.selected = true;
        $scope.Selecteds.push(sel_user);
      }
    }
  });
  $scope.settings.users.Selecteds = $scope.Selecteds;

  check_selects();

}])
;
