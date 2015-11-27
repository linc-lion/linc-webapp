
'use strict';

angular.module('lion.guardians.admin.lions.controller', [])

.controller('AdminLionsCtrl', ['$scope', function ($scope) {
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.Lion_Change = {'mode': '', 'label': 'Submit'};

  $scope.check_all = function (val){
    _.forEach($scope.lions, function(lion) {
      lion.selected = val;
      if(lion.selected){
        if(!_.some($scope.Selecteds, lion))
          $scope.Selecteds.push(lion);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, lion);
      }
    });
  }
  $scope.Select_Lion1 = function (lion){
    if(mode!='') return;
    lion.selected = !lion.selected;
    $scope.Select_Lion(lion);
  }
  $scope.Select_Lion = function (lion){
    if(lion.selected){
      if(!_.some($scope.Selecteds, lion))
        $scope.Selecteds.push(lion);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, lion);
    }
    if($scope.Selecteds.length != $scope.lions.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }
  $scope.Add_Lion = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.lions.unshift({ 'id': '', 'name': '', 'organization_id': -1, 'primary_image_set_id': '',
                      'trashed': false, 'selected': true, 'change_mode': true });
    $scope.btn_submit = 'Add New';
    $scope.Lion_Change = {'mode': mode, label: 'Submit'};
  };
  $scope.Edit_Lion = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.Lion_Change = {'mode': mode, 'label': 'Submit'};
    }
  }
  $scope.Cancel_Edit_Lion = function(){
    if(mode == 'add'){
      _.remove($scope.lions, function(lion) {
        return lion == $scope.lions[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.Lion_Change.mode = '';
  }

  $scope.Delete_Lion = function() {
    $scope.Delete('Lions')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (lion){
        return {'id': lion.id};
      }), 'id');

      $scope.LincApiServices.Lions({'method': 'delete', 'lions_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'Lions successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.lions, function(lion) {
            return lion.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }

  $scope.Submit_Lion = function(){
    if(mode == 'edit'){
      var lion = $scope.Selecteds[0];
      var data = {'name': lion.name,
       'organization_id': lion.organization_id,
  'primary_image_set_id': lion.primary_image_set_id,
                'trashed': lion.trashed };
      $scope.LincApiServices.Lions({'method': 'put', 'lion_id' : lion.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Lion Info', message: 'Lion data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(lion, lion, response.data);
        lion.organization = _.find($scope.organizations, {id: lion.organization_id}).name;
        lion.change_mode = false;
        lion.selected = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Lion data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var lion = $scope.Selecteds[0];
      var data = {'name': lion.name,
       'organization_id': lion.organization_id,
  'primary_image_set_id': lion.primary_image_set_id,
                'trashed': lion.trashed };
      $scope.LincApiServices.Lions({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Lion Info', message: 'New Lion successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(lion, lion, response.data);
        lion.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new Lion',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }

}])
;
