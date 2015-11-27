
'use strict';

angular.module('lion.guardians.admin.cvrequests.controller', [])

.controller('AdminCVRequestsCtrl', ['$scope', function ($scope) {
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.CVRequest_Change = {'mode': '', 'label': 'Submit'};

  $scope.check_all = function (val){
    _.forEach($scope.cvrequests, function(cvrequest) {
      cvrequest.selected = val;
      if(cvrequest.selected){
        if(!_.some($scope.Selecteds, cvrequest))
          $scope.Selecteds.push(cvrequest);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, cvrequest);
      }
    });
  }
  $scope.Select_CVRequest1 = function (cvrequest){
    if(mode!='') return;
    cvrequest.selected = !cvrequest.selected;
    $scope.Select_CVRequest(cvrequest);
  }
  $scope.Select_CVRequest = function (cvrequest){
    //cvrequest.selected = !cvrequest.selected;
    if(cvrequest.selected){
      if(!_.some($scope.Selecteds, cvrequest))
        $scope.Selecteds.push(cvrequest);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, cvrequest);
    }
    if($scope.Selecteds.length != $scope.cvrequests.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }
  $scope.Add_CVRequest = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.cvrequests.unshift({ 'id': '', 'image_set_id': '', 'requesting_organization_id': -1,
    'status': '', 'request_body': '', 'trashed': false, 'selected': true, 'change_mode': true });
    $scope.btn_submit = 'Add New';
    $scope.CVRequest_Change = {'mode': mode, 'label': 'Submit'};
  };

  $scope.Edit_CVRequest = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.CVRequest_Change = {'mode': mode, 'label': 'Submit'};
    }
  }
  $scope.Cancel_Edit_CVRequest = function(){
    if(mode == 'add'){
      _.remove($scope.cvrequests, function(cvrequest) {
        return cvrequest == $scope.cvrequests[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.CVRequest_Change.mode = '';
  }

  $scope.Delete_CVRequest = function() {

    $scope.Delete('CV Request')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (cvrequest){
        return {'id': cvrequest.id};
      }), 'id');

      $scope.LincApiServices.CVRequests({'method': 'delete', 'cvrequests_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'CV Requests successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.cvrequests, function(cvrequest) {
            return cvrequest.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }

  $scope.Submit_CVRequest = function(){
    if(mode == 'edit'){
      var cvrequest = $scope.Selecteds[0];
      var data = {'image_set_id': cvrequest.image_set_id, 'requesting_organization_id': cvrequest.requesting_organization_id, 'status': cvrequest.status, 'request_body': cvrequest.request_body};

      $scope.LincApiServices.CVRequests({'method': 'put', 'cvrequest_id' : cvrequest.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'CV Request Info', message: 'CV Request data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(cvresult, cvresult, response.data);
        cvresult.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change CV Request data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var cvrequest = $scope.Selecteds[0];
      var data = { 'image_set_id': cvrequest.image_set_id, 'requesting_organization_id': cvrequest.requesting_organization_id, 'status': cvrequest.status, 'request_body': cvrequest.request_body};

      $scope.LincApiServices.CVRequests({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'CV Request Info', message: 'New CV Request successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(cvrequest, cvrequest, response.data);
        cvrequest.change_mode = false;
        cvrequest.selected = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new CV Request ',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }
}])

;
