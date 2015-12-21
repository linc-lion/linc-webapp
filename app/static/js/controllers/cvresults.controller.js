'use strict';

angular.module('lion.guardians.cvresults.controller', ['lion.guardians.cvresults.directive'])

.controller('CVResultsCtrl', ['$scope', '$state', '$timeout', '$interval', '$uibModalInstance', 'LincServices', 'NotificationFactory', 'imagesetId', 'cvrequestId', 'cvresultsId', 'data_cvresults', function ($scope, $state, $timeout, $interval, $uibModalInstance, LincServices, NotificationFactory, imagesetId, cvrequestId, cvresultsId, data_cvresults) {

  $scope.title = 'CV Results (CV Request Id: '+ data_cvresults.req_id + ' - Status: ' + data_cvresults.status + ')';
  $scope.content = 'Form';

  $scope.cvresults = data_cvresults.cvresults;

  var count = 0;
  var Poller = function () {
    LincServices.getCVResults(cvresultsId).then(function(response){
      $scope.cvresults = response.cvresults;
      if(response.status == 'finished' || response.status == 'error'){
        console.log('Res Canceled - Status: ' + response.status);
        $scope.title = 'CV Results (CV Request Id: '+ data_cvresults.req_id + ' - Status: ' + response.status + ')';
        $scope.cancel_Poller();
        //$scope.$parent.cancel_Poller();
      }
      count++;
      console.log('Res Count: ' + count);
    }, function(error){
      if(error.status != 403)
        $scope.cancel_Poller();
    });
  };

  var start_Poller = function (){
    if($scope.get_poller_promisse())
      $scope.cancel_Poller();
    Poller();
    var repeat_timer = 20000;
    $timeout(function() {
      count = 0;
      $scope.$apply(function () {
        $scope.set_poller_promisse($interval(Poller, repeat_timer));
        console.log("Result CV Req Poller started");
      });
    }, 0);
  }

  if(data_cvresults.status != 'finished' && data_cvresults.status != 'error'){
    start_Poller();
  }

  $scope.Close = function () {
    $uibModalInstance.dismiss("close");
  };
  $scope.ClearResults= function () {
    LincServices.deleteCVRequest(cvrequestId, function(){
      console.log("Results cleared");
      $uibModalInstance.close(true);
    });
  };
  $scope.Associate = function (id){
    _.forEach($scope.cvresults, function(lion) {
      lion.associated = false;
    });
    var index = _.indexOf($scope.cvresults, _.find($scope.cvresults, {id: id}));
    var data = {'lion_id': id};
    LincServices.Associate(imagesetId, data, function(){
      $scope.cvresults[index].associated = true;
      LincServices.ClearAllCaches();
      NotificationFactory.success({
        title: "Associate", message:'Lion (id: ' + id + ') was associated',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
    },
    function(error){
      if($scope.debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Associate the Lion (id: ' + id + ') ',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      console.log(error);
    });
  };

  $scope.Dissociate = function (id){
    var index = _.indexOf($scope.cvresults, _.find($scope.cvresults, {id: id}));
    var data = {'lion_id': null};
    LincServices.Associate(imagesetId, data, function(){
      $scope.cvresults[index].associated = false;
      LincServices.ClearAllImagesetsCaches();
      LincServices.ClearImagesetProfileCache(imagesetId);
      NotificationFactory.success({
        title: "Dissociate", message:'Lion (id: ' + id + ') was dissociated',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
    },
    function(error){
      if($scope.debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Dissociate the Lion (id: ' + id + ')',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      console.log(error);
    });
  };
}]);
