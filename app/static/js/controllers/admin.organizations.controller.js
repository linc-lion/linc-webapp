
'use strict';

angular.module('lion.guardians.admin.organiaztions.controller', [])

.controller('AdminOrganizationsCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

  $scope.Selecteds = $scope.CleanBracket.organizations;
  $scope.select_all = $scope.ItemsSelecteds.organizations;
  $scope.Org_Mode  =  $scope.EmptyString.organizations;

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
    if($scope.Org_Mode !='') return;
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

  var modal = null;
  $scope.Add_Organization = function () {
    $scope.modalTitle = 'Add Organization';
    $scope.showValidationMessages = false;
    $scope.organization = { 'name' : '', 'trashed': false, 'selected': true};
    modal = $uibModal.open({
        templateUrl: 'Edit_Organization.tmpl.html',
        scope:$scope
    });
    modal.result.then(function (result) {
      console.log("Add");
    }, function (){
      $scope.Org_Mode = '';
      console.log("add dismiss");
    });
    $scope.Org_Mode = 'add';
    $scope.check_all(false);
  };

  $scope.Edit_Organization = function() {
    $scope.modalTitle = 'Edit Organization';
    $scope.showValidationMessages = false;

    if($scope.Selecteds.length == 1){
      $scope.Org_Mode = 'edit';
      $scope.organization = angular.copy($scope.Selecteds[0]);
      modal = $uibModal.open({
          templateUrl: 'Edit_Organization.tmpl.html',
          scope:$scope
      });
      modal.result.then(function (result) {
        console.log("Edited");
      }, function (){
        $scope.Org_Mode = '';
        console.log("edit dismiss");
      });
    }
  }

  $scope.Cancel_Edit_Org = function(){
    modal.dismiss();
    $scope.Org_Mode = '';
  }

  $scope.Submit = function (valid){
    if(valid){
      modal.close();
      Submit_Organization();
    }
    else {$scope.showValidationMessages = true;}
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

  var Submit_Organization = function(){
    if($scope.Org_Mode == 'edit'){
      var data = {'name': $scope.organization.name,
                'trashed': $scope.organization.trashed
      };
      $scope.LincApiServices.Organizations({'method': 'put', 'organization_id' : $scope.organization.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Organization Info', message: 'Organization data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        var organization = $scope.Selecteds[0];
        _.merge(organization, organization, response.data);
        organization.created_at = (organization.created_at || "").substring(0,19);
        organization.updated_at = (organization.updated_at || "").substring(0,19);
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Organization data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if($scope.Org_Mode == 'add'){
      var data = {'name': $scope.organization.name,
                'trashed': $scope.organization.trashed
      };
      $scope.LincApiServices.Organizations({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Organization Info', message: 'New Organization successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        var organization = response.data;
        organization.created_at = (organization.created_at || "").substring(0,19);
        organization.updated_at = (organization.updated_at || "").substring(0,19);
        organization.selected = true;
        $scope.organizations.push(organization);
        $scope.Selecteds.push(organization);
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new Organization',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    $scope.Org_Mode = '';
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
