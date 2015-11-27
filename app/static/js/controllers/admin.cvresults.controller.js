
'use strict';

angular.module('lion.guardians.admin.cvresults.controller', [])

.controller('AdminCVResultsCtrl', ['$scope', function ($scope) {
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.CVResult_Change = {'mode': '', 'label': 'Submit'};

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
    if(mode!='') return;
    cvresult.selected = !cvresult.selected;
    $scope.Select_CVresult(cvresult);
  }
  $scope.Select_CVresult = function (cvresult){
    //cvresult.selected = !cvresult.selected;
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
  $scope.Add_CVResult = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.cvresults.unshift({ 'id': '', 'match_probability': '', 'cvrequest_iid': -1,
                      'trashed': false, 'selected': true, 'change_mode': true });

    $scope.btn_submit = 'Add New';
    $scope.CVResult_Change = {'mode': mode, 'label': 'Submit'};
  };

  $scope.Edit_CVResult = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.CVResult_Change = {'mode': mode, 'label': 'Submit'};
    }
  }
  $scope.Cancel_Edit_CVResult = function(){
    if(mode == 'add'){
      _.remove($scope.cvresults, function(cvresult) {
        return cvresult == $scope.cvresults[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.CVResult_Change.mode = '';
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

  $scope.Submit_CVresult = function(){
    if(mode == 'edit'){
      var cvresult = $scope.Selecteds[0];
      var data = {'match_probability': cvresult.match_probability,
        'cvrequest_iid': cvresult.cvrequest_iid };

      $scope.LincApiServices.CVResults({'method': 'put', 'cvresult_id' : cvresult.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'CV Result Info', message: 'CV Result data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(cvresult, cvresult, response.data);
        cvresult.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change CV Result data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var cvresult = $scope.Selecteds[0];
      var data = {'match_probability': cvresult.match_probability,
        'cvrequest_iid': cvresult.cvrequest_iid };

      $scope.LincApiServices.CVResults({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'CV Result Info', message: 'New CV Result successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(cvresult, cvresult, response.data);
        cvresult.change_mode = false;
        cvresult.selected = false;
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

}])

;
