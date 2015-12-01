
'use strict';

angular.module('lion.guardians.admin.cvrequests.controller', [])

.controller('AdminCVRequestsCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

  $scope.CVReq_Status = [{'type': 'submitted', 'label': 'Submitted'},
                         {'type': 'created', 'label': 'Created'}];

  $scope.Selecteds = $scope.CleanBracket.cvrequests;
  $scope.select_all = $scope.ItemsSelecteds.cvrequests;
  $scope.CVRequest_Mode = $scope.EmptyString.cvrequests;

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
    if($scope.CVRequest_Mode != '') return;
    cvrequest.selected = !cvrequest.selected;
    $scope.Select_CVRequest(cvrequest);
  }
  $scope.Select_CVRequest = function (cvrequest){
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

  var modal = null;
  $scope.Add_CVRequest = function () {
    $scope.modalTitle = 'Add CV Request';
    $scope.showValidationMessages = false;
    $scope.cvrequest = {
      'requesting_organization_id': -1, 'image_set_id': -1, 'status': '', 'request_body': '',
      'trashed': false, 'selected': true
    }
    modal = $uibModal.open({
        templateUrl: 'Edit_CVRequest.tmpl.html',
        scope:$scope
    });
    modal.result.then(function (result) {
      console.log("Add");
    }, function (){
      $scope.CVRequest_Mode = '';
      console.log("add dismiss");
    });

    $scope.check_all(false);
    $scope.CVRequest_Mode = 'add';
  };

  $scope.Edit_CVRequest = function() {
    $scope.modalTitle = 'Edit CV Request';
    $scope.showValidationMessages = false;

    if($scope.Selecteds.length == 1){
      $scope.CVRequest_Mode = 'edit';
      $scope.cvrequest = angular.copy($scope.Selecteds[0]);
      modal = $uibModal.open({
          templateUrl: 'Edit_CVRequest.tmpl.html',
          scope:$scope
      });
      modal.result.then(function (result) {
        console.log("Edited");
      }, function (){
        $scope.CVRequest_Mode = '';
        console.log("edit dismiss");
      });
    }
  }
  $scope.Cancel_Edit_CVRequest = function(){
    modal.dismiss();
    $scope.CVRequest_Mode = '';
  }

  $scope.Submit = function (valid){
    if(valid){
      modal.close();
      Submit_CVRequest();
    }
    else {$scope.showValidationMessages = true;}
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

  var Submit_CVRequest = function(){
    if($scope.CVRequest_Mode == 'edit'){
      var data = {
          'requesting_organization_id': $scope.cvrequest.requesting_organization_id,
          'image_set_id': $scope.cvrequest.image_set_id, 'status': $scope.cvrequest.status,
          'request_body': $scope.cvrequest.request_body, 'trashed': $scope.cvrequest.trashed
      };
      $scope.LincApiServices.CVRequests({'method': 'put', 'cvrequest_id' : $scope.cvrequest.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'CV Request Info', message: 'CV Request data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });

        var cvrequest = $scope.Selecteds[0];
        _.merge(cvrequest, cvrequest, response.data);
        cvrequest.created_at = (cvrequest.created_at || "").substring(0,19);
        cvrequest.updated_at = (cvrequest.updated_at || "").substring(0,19);
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change CV Request data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if($scope.CVRequest_Mode == 'add'){
      var data = {
          'requesting_organization_id': $scope.cvrequest.requesting_organization_id,
          'image_set_id': $scope.cvrequest.image_set_id, 'status': $scope.cvrequest.status,
          'request_body': $scope.cvrequest.request_body, 'trashed': $scope.cvrequest.trashed
      };
      $scope.LincApiServices.CVRequests({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'CV Request Info', message: 'New CV Request successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        var cvrequest = response.data;
        cvrequest.created_at = (cvrequest.created_at || "").substring(0,19);
        cvrequest.updated_at = (cvrequest.updated_at || "").substring(0,19);
        cvrequest.selected = true;
        $scope.cvrequests.push(cvrequest);
        $scope.Selecteds.push(cvrequest);
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

  // Order by
  $scope.reverse = false;
  $scope.predicate = 'id';
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };
}])

;
