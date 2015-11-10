'use strict';

angular.module('lion.guardians.cvresults.controller', ['lion.guardians.cvresults.directive'])

.controller('CVResultsCtrl', ['$scope', '$window', '$uibModalInstance', 'LincServices', 'imagesetId', 'cvresultsId', function ($scope, $window, $uibModalInstance, LincServices, imagesetId, cvresultsId) {

  $scope.title = 'CV Results';
  $scope.content = 'Form';

  $scope.Close = function () {
    $uibModalInstance.dismiss("close");
  };
  $scope.ClearResults= function () {
  //  var lions_id = _.pluck(_.filter($scope.lions, 'selected', true), 'id');
//    var data = {imageset_id: imagesetId, lions_id: lions_id};

  //  LincServices.xxx(data, function(result){
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
      //lion.selected = false;
      lion.associated = false;
    });
    var index = _.indexOf($scope.lions, _.find($scope.lions, {id: id}));
    //$scope.lions[index].selected = true;
    $scope.lions[index].associated = true;
  };
  $scope.Dissociate = function (id){
    var index = _.indexOf($scope.lions, _.find($scope.lions, {id: id}));
    $scope.lions[index].associated = false;
  };
  LincServices.getListCVResults(cvresultsId, function(result){
    var data = result.data.table;
    var associated_id = result.data.associated.id;

    $scope.lions = _.map(data, function(element, index) {
      var elem = {};
      if(associated_id == element.id) elem["associated"] = true;
      else elem["associated"] = false;
      return _.extend({}, element, elem);
    });
  });
}]);
