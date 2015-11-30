
'use strict';

angular.module('lion.guardians.admin.cvresults.controller', [])

.controller('AdminCVResultsCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

  $scope.Selecteds = $scope.CleanBracket.cvresults;
  $scope.select_all = $scope.ItemsSelecteds.cvresults;
  $scope.CVResult_Mode = $scope.EmptyString.cvresults;

  $scope.check_all = function (val){
    _.forEach($scope.cvresults, function(cvresult) {
      cvresult.selected = val;
      if(cvresult.selected){
        if(!_.some($scope.Selecteds, cvresult))
          $scope.Selecteds.push(cvresult);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, cvresult);
      }
    });
  }
  $scope.Select_CVresult1 = function (cvresult){
    if($scope.CVResult_Mode != '') return;
    cvresult.selected = !cvresult.selected;
    $scope.Select_CVresult(cvresult);
  }
  $scope.Select_CVresult = function (cvresult){
    if(cvresult.selected){
      if(!_.some($scope.Selecteds, cvresult))
        $scope.Selecteds.push(cvresult);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, cvresult);
    }
    if($scope.Selecteds.length != $scope.cvresults.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }

  var modal = null;
  $scope.Add_CVResult = function () {
    $scope.modalTitle = 'Add CV Result';
    $scope.showValidationMessages = false;
    $scope.cvresult = {
      'cvrequest_id': -1, 'match_probability': '',
      'trashed': false, 'selected': true
    }
    modal = $uibModal.open({
        templateUrl: 'Edit_CVResult.tmpl.html',
        scope:$scope
    });
    modal.result.then(function (result) {
      console.log("Add");
    }, function (){
      $scope.CVResult_Mode = '';
      console.log("add dismiss");
    });

    $scope.check_all(false);
    $scope.CVResult_Mode = 'add';
  };

  $scope.Edit_CVResult = function() {
    $scope.modalTitle = 'Edit CV Result';
    $scope.showValidationMessages = false;

    if($scope.Selecteds.length == 1){
      $scope.CVResult_Mode = 'edit';
      $scope.cvresult = angular.copy($scope.Selecteds[0]);
      modal = $uibModal.open({
          templateUrl: 'Edit_CVResult.tmpl.html',
          scope:$scope
      });
      modal.result.then(function (result) {
        console.log("Edited");
      }, function (){
        $scope.CVResult_Mode = '';
        console.log("edit dismiss");
      });
    }
  }

  $scope.Cancel_Edit_CVResult = function(){
    modal.dismiss();
    $scope.CVResult_Mode = '';
  }

  $scope.Submit = function (valid){
    if(valid){
      modal.close();
      Submit_CVresult();
    }
    else {$scope.showValidationMessages = true;}
  }

  $scope.Delete_CVResult = function() {
    $scope.Delete('CV Results')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (cvresult){
        return {'id': cvresult.id};
      }), 'id');

      $scope.LincApiServices.CVResults({'method': 'delete', 'cvresults_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'CV Results successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.cvresults, function(cvresult) {
            return cvresult.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }

  var Submit_CVresult = function(){
    if($scope.CVResult_Mode == 'edit'){
      var data = {
        'cvrequest_id': $scope.cvresult.cvrequest_id, 'match_probability': $scope.cvresult.match_probability,
        'trashed': $scope.cvresult.trashed
      };
      $scope.LincApiServices.CVResults({'method': 'put', 'cvresult_id' : $scope.cvresult.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'CV Result Info', message: 'CV Result data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        var cvresult = $scope.Selecteds[0];
        _.merge(cvresult, cvresult, response.data);
        cvresult.created_at = (cvrequest.created_at || "").substring(0,19);
        cvresult.updated_at = (cvrequest.updated_at || "").substring(0,19);
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change CV Result data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if($scope.CVResult_Mode == 'add'){
      var data = {
        'cvrequest_id': $scope.cvresult.cvrequest_id, 'match_probability': $scope.cvresult.match_probability,
        'trashed': $scope.cvresult.trashed
      };
      $scope.LincApiServices.CVResults({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'CV Result Info', message: 'New CV Result successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        var cvresult = response.data;
        cvresult.created_at = (cvrequest.created_at || "").substring(0,19);
        cvresult.updated_at = (cvrequest.updated_at || "").substring(0,19);
        cvresult.selected = true;
        $scope.cvresults.push(cvresult);
        $scope.Selecteds.push(cvresult);
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new CV Result ',
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
