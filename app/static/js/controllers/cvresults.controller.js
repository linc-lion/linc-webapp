'use strict';

angular.module('lion.guardians.cvresults.controller', ['lion.guardians.cvresults.directive'])

.controller('CVResultsCtrl', ['$scope', '$window', '$uibModalInstance', 'LincServices', 'imagesetId', function ($scope, $window, $uibModalInstance, LincServices, imagesetId) {

  $scope.title = 'CV Results';
  $scope.content = 'Form';

  $scope.Close = function () {
    $uibModalInstance.dismiss("close");
  };
  $scope.ClearResults= function () {
  //  var lions_id = _.pluck(_.filter($scope.lions, 'selected', true), 'id');
//    var data = {imageset_id: imagesetId, lions_id: lions_id};

  //  LincServices.requestCV(data, function(result){
  //    $uibModalInstance.close(result);
  //  });
    console.log("Clear Results");
    //$uibModalInstance.close("clearesultados");
  };
  $scope.Cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.Associate = function (id){
    _.forEach($scope.lions, function(lion) {
      lion.selected = false;
    });
    var index = _.indexOf($scope.lions, _.find($scope.lions, {id: id}));
    $scope.lions[index].selected = true;
  };
  LincServices.getlists(['lions'],function(data){
    $scope.lions = _.map(data['lions'], function(element, index) {
      var elem = {};
      elem["selected"] = false;
      return _.extend({}, element, elem);
    });
  });
}]);
