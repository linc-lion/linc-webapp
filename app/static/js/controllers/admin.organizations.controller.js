
'use strict';

angular.module('lion.guardians.admin.organiaztions.controller', [])

.controller('AdminOrganizationsCtrl', ['$scope', function ($scope) {

  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.Org_Change = {'mode': '', 'label': 'Submit'};

  $scope.check_all = function (val){
    _.forEach($scope.organizations, function(organization) {
      organization.selected = val;
      if(organization.selected){
        if(!_.some($scope.Selecteds, organization))
          $scope.Selecteds.push(organization);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, organization);
      }
    });
  }
  $scope.Select_Org1 = function (organization){
    if(mode!='') return;
    organization.selected = !organization.selected;
    $scope.Select_Org(organization);
  }
  $scope.Select_Org = function (organization){
    if(organization.selected){
      if(!_.some($scope.Selecteds, organization))
        $scope.Selecteds.push(organization);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, organization);
    }
    if($scope.Selecteds.length != $scope.organizations.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }

  $scope.Add_Organization = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.organizations.unshift({ 'id': '', 'trashed': false, 'selected': true, 'change_mode': true });
    $scope.btn_submit = 'Add New';
    $scope.Org_Change = {'mode': mode, 'label': 'Submit'};
  };

  $scope.Edit_Organization = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.Org_Change = {'mode': mode, 'label': 'Submit'};
    }
  }

  $scope.Cancel_Edit_Org = function(){
    if(mode == 'add'){
      _.remove($scope.organizations, function(organization) {
        return organization == $scope.organizations[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.Org_Change.mode = '';
  }

  $scope.Delete_Organization = function() {
    $scope.Delete('Organizations')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (organization){
        return {'id': organization.id};
      }), 'id');

      $scope.LincApiServices.Organizations({'method': 'delete', 'organizations_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'Organizations successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.organizations, function(organization) {
            return organization.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }

  $scope.Submit_Organization = function(){
    if(mode == 'edit'){
      var organization = $scope.Selecteds[0];
      var data = {'name': organization.name,
                'trashed': organization.trashed };
      $scope.LincApiServices.Organizations({'method': 'put', 'organization_id' : organization.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Organization Info', message: 'Organization data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(organization, organization, response.data);
        organization.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Organization data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var organization = $scope.Selecteds[0];
      var data = {'name': organization.name,
                'trashed': organization.trashed };
      $scope.LincApiServices.Organizations({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Organization Info', message: 'New Organization successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(organization, organization, response.data);
        organization.change_mode = false;
        organization.selected = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new Organization',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }

}])
;
