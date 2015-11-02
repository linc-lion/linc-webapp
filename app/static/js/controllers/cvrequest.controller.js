'use strict';

angular.module('lion.guardians.cvrequest.controller', [])

.controller('CVRequesCtrl', ['$scope', '$window', '$uibModalInstance', 'LincServices', 'imagesetId', function ($scope, $window, $uibModalInstance, LincServices, imagesetId) {

    $scope.title = 'Lion Search';
    $scope.content = 'Search';
    //ng-init="lions=[{hasResults:true},{pending:true},{ verified:true}]">
    /*$scope.lions_filter = function() {
      var filter = {hasResults: true, pending: true, verified: true}
      return (filter);
    };*/

    $scope.Close = function () {
      $uibModalInstance.dismiss("ok");
    };
    $scope.requestCV = function () {
      var lions_id = _.pluck(_.filter($scope.lions, 'selected', true), 'id');
      console.log('image set: ' + imagesetId + ' lions: ' + lions_id)
      var data = {imageset_id: imagesetId, lions_id: lions_id};
      LincServices.requestCV(data, function(result){
        $uibModalInstance.close(result);
      });
    };
    $scope.Cancel = function () {
      $uibModalInstance.dismiss('cancel');
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

    LincServices.getlists(['lions'],function(data){
      $scope.lions = data['lions'];
    });
}]);
