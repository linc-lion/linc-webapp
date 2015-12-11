
'use strict';

angular.module('lion.guardians.admin.lions.controller', [])

.controller('AdminLionsCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

  $scope.Lion_Mode = $scope.settings.lions.Mode;

  $scope.check_all = function (val){
    _.forEach($scope.$parent.lions, function(lion) {
      lion.selected = val;
      if(lion.selected){
        if(!_.some($scope.Selecteds, lion))
          $scope.Selecteds.push(lion);
      }
    });
    if(!val) {
      $scope.Selecteds = [];
      $scope.settings.lions.Selecteds = $scope.Selecteds;
    }
    check_selects();
  }
  $scope.Select_Lion1 = function ($event, lion){
    if($scope.Lion_Mode != '') return;
    lion.selected = !lion.selected;
    $scope.Select_Lion($event, lion);
  }

  var lastSelId = -1;
  $scope.Select_Lion = function ($event, lion){
    var shiftKey = $event.shiftKey;
    if(shiftKey && lastSelId>=0){
      var index0 = _.findIndex($scope.ordered_lions, {'id': lastSelId});
      var index1 = _.findIndex($scope.ordered_lions, {'id': lion.id});
      var first = Math.min(index0, index1);
      var second = Math.max(index0, index1);
      for(var i = first; i < second; i++){
        var animal = $scope.ordered_lions[i];
        animal.selected = lion.selected;
        if(lion.selected){
          if(!_.some($scope.Selecteds, animal))
            $scope.Selecteds.push(animal);
        }
        else {
          $scope.Selecteds = _.without($scope.Selecteds, animal);
          $scope.settings.lions.Selecteds = $scope.Selecteds;
        }
      }
    }
    else{
      lastSelId = lion.id;
      if(lion.selected){
        if(!_.some($scope.Selecteds, lion))
          $scope.Selecteds.push(lion);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, lion);
        $scope.settings.lions.Selecteds = $scope.Selecteds;
      }
    }
    check_selects();
  }

  var modal = null;
  $scope.Add_Lion = function () {
    $scope.modalTitle = 'Add Lion';
    $scope.showValidationMessages = false;

    $scope.organizations = angular.copy($scope.$parent.organizations);
    $scope.imagesets = angular.copy($scope.$parent.imagesets);

    $scope.lion = {
      'name': '', 'organization_id': -1, 'primary_image_set_id': '',
      'trashed': false, 'selected': true
    }
    modal = $uibModal.open({
        templateUrl: 'Edit_Lion.tmpl.html',
        scope:$scope
    });
    modal.result.then(function (result) {
      console.log("Add");
    }, function (){
      $scope.Lion_Mode = '';
      console.log("add dismiss");
    });

    $scope.check_all(false);
    $scope.Lion_Mode = 'add';
  };

  $scope.Edit_Lion = function() {
    $scope.modalTitle = 'Edit Lion';
    $scope.showValidationMessages = false;

    $scope.organizations = angular.copy($scope.$parent.organizations);
    $scope.imagesets = angular.copy($scope.$parent.imagesets);

    if($scope.Selecteds.length == 1){
      $scope.Lion_Mode = 'edit';
      $scope.lion = angular.copy($scope.Selecteds[0]);
      modal = $uibModal.open({
          templateUrl: 'Edit_Lion.tmpl.html',
          scope:$scope
      });
      modal.result.then(function (result) {
        console.log("Edited");
      }, function (){
        $scope.Lion_Mode = '';
        console.log("edit dismiss");
      });
    }
  }

  $scope.Cancel_Edit_Lion = function(){
    modal.dismiss();
    $scope.Lion_Mode = '';
  }

  $scope.Submit = function (valid){
    if(valid){
      modal.close();
      Submit_Lion();
    }
    else {$scope.showValidationMessages = true;}
  }

  $scope.Delete_Lion = function() {
    $scope.Delete('Lions')
    .then(function (result) {
      var lions_id = _.pluck(_.map($scope.Selecteds, function (lion){
        return {'id': lion.id};
      }), 'id');

      $scope.LincApiServices.Lions({'method': 'delete', 'lions_id': lions_id}).then(function(response){
        if(response.error.length>0){
          var data = _.pluck(_.map(response.error, function (lion){
            return {'id': lion.id};
          }), 'id');
          var msg = (data.length>1) ? 'Unable to delete lions ' + data : 'Unable to delete lion ' + data;
          $scope.Notification.error({
            title: "Delete", message: msg,
            position: "right", // right, left, center
            duration: 2000     // milisecond
          });
        }
        else if(response.success.length>0){
          var msg = (response.success.length>1) ? 'Lions successfully deleted' : 'Lion successfully deleted';
          $scope.Notification.success({
            title: "Delete", message: msg,
            position: "right", // right, left, center
            duration: 2000     // milisecond
          });
        }
        _.forEach(response.success, function(lion, i){
          var index = _.indexOf($scope.Selecteds, _.find($scope.Selecteds, {'id': lion.id}));
          if(index>-1){
            $scope.Selecteds[index].trashed = true;
          }
        });
      });
    }, function () {
      $scope.Notification.info({
        title: "Cancel", message: 'Delete canceled',
        position: 'right', // right, left, center
        duration: 2000   // milisecond
      });
    });
  }

  $scope.Undo_Trash = function() {
    var lions_id = _.pluck(_.map($scope.Selecteds, function (lion){
      return {'id': lion.id};
    }), 'id');

    $scope.LincApiServices.Lions({'method': 'undo_trash', 'lions_id': lions_id}).then(function(response){
      if(response.error.length>0){
        var data = _.pluck(_.map(response.error, function (lion){
          return {'id': lion.id};
        }), 'id');
        var msg = (data.length>1) ? 'Unable to restore lions ' + data : 'Unable to restore lion ' + data;
        $scope.Notification.error({
          title: "Restore", message: msg,
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
      }
      else if(response.success.length>0){
        var msg = (response.success.length>1) ? 'Lions successfully restored' : 'Lion successfully restored';
        $scope.Notification.success({
          title: "Restore", message: msg,
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
      }
      _.forEach(response.success, function(lion, i){
        var index = _.indexOf($scope.Selecteds, _.find($scope.Selecteds, {'id': lion.id}));
        if(index>-1){
          $scope.Selecteds[index].trashed = false;
        }
      });
    },
    function(error){
      $scope.Notification.error({
        title: "Fail", message: 'Fail to restore from Trash',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
    });
  }

  var Submit_Lion = function(){
    if($scope.Lion_Mode == 'edit'){
      var data = {'name': $scope.lion.name,
       'organization_id': $scope.lion.organization_id,
  'primary_image_set_id': $scope.lion.primary_image_set_id,
                'trashed': $scope.lion.trashed
      };
      $scope.LincApiServices.Lions({'method': 'put', 'lion_id' : $scope.lion.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Lion Info', message: 'Lion data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });

        var lion = $scope.Selecteds[0];
        _.merge(lion, lion, response.data);
        lion.created_at = (lion.created_at || "").substring(0,19);
        lion.updated_at = (lion.updated_at || "").substring(0,19);

        var org = _.find($scope.$parent.organizations, {'id': lion.organization_id});
        lion.organization = (org == undefined)? '' : org.name;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Lion data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if($scope.Lion_Mode  == 'add'){
      var data = {'name': $scope.lion.name,
       'organization_id': $scope.lion.organization_id,
  'primary_image_set_id': $scope.lion.primary_image_set_id,
                'trashed': $scope.lion.trashed
      };
      $scope.LincApiServices.Lions({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Lion Info', message: 'New Lion successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        var lion = response.data;
        lion.created_at = (lion.created_at || "").substring(0,19);
        lion.updated_at = (lion.updated_at || "").substring(0,19);
        var org = _.find($scope.$parent.organizations, {'id': lion.organization_id});
        lion.organization = (org == undefined)? '' : org.name;
        lion.selected = true;
        $scope.$parent.lions.push(lion);
        $scope.Selecteds.push(lion);
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new Lion',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    $scope.Lion_Mode = '';
  }

  var check_selects = function (){
    var count = 0;
    $scope.all_selected = false;
    $scope.all_unselected = true;
    if($scope.ordered_lions) count = $scope.ordered_lions.length;
    if(count>0){
      if($scope.Selecteds.length == count)
        $scope.all_selected = true;
      if($scope.Selecteds.length)
        $scope.all_unselected = false;
    }
  }

  // Order by
  $scope.reverse = $scope.settings.lions.reverse;
  $scope.predicate = $scope.settings.lions.predicate;

  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
    $scope.settings.lions.predicate = $scope.predicate;
    $scope.settings.lions.reverse = $scope.reverse;
  };

  $scope.Selecteds = [];
  _.forEach($scope.settings.lions.Selecteds, function(selected) {
    if(selected != undefined){
      var sel_lion = _.find($scope.$parent.lions, function(lion) {
        return lion.id == selected.id;
      });
      if(sel_lion){
        sel_lion.selected = true;
        $scope.Selecteds.push(sel_lion);
      }
    }
  });
  $scope.settings.lions.Selecteds = $scope.Selecteds;

  check_selects();

}])
;
