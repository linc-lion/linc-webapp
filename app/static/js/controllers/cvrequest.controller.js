'use strict';

angular.module('lion.guardians.cvrequest.controller', ['lion.guardians.cvrequest.directive'])

.controller('CVRequesCtrl', ['$scope', '$window', '$uibModalInstance', 'LincServices', 'imagesetId', 'lions', function ($scope, $window, $uibModalInstance, LincServices, imagesetId, lions) {

  $scope.title = 'Lion Search';
  $scope.content = 'Search';

  $scope.lions = lions;

  $scope.Close = function () {
    $uibModalInstance.dismiss("close");
  };
  $scope.requestCV = function () {
    var lions_id = _.pluck(_.filter($scope.lions, 'selected', true), 'id');
    var data = {"lions": lions_id};
    LincServices.requestCV(imagesetId, data, function(result){
      var requestObj = result.data.data;
      $uibModalInstance.close(requestObj);
      NotificationFactory.success({
        title: "Success", message:'CV Request created with success',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
    });
  };
  $scope.checkAll = function (check) {
    $scope.lions.forEach(function(lion){
      lion.selected = check;
    });
  };
  $scope.checked_count = 0;
  $scope.count = function(check){
    if(check)
      $scope.checked_count++;
    else $scope.checked_count--;
    console.log("checked" + $scope.checked_count);
  }

  // Order by
  $scope.reverse = true;
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };
}]);
