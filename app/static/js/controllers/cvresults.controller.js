'use strict';

angular.module('lion.guardians.cvresults.controller', ['lion.guardians.cvresults.directive'])

.controller('CVResultsCtrl', ['$scope', '$window', '$uibModalInstance', 'LincServices', 'imagesetId', 'cvresultsId', 'cvrequestId', function ($scope, $window, $uibModalInstance, LincServices, imagesetId, cvresultsId, cvrequestId) {

  $scope.title = 'CV Results';
  $scope.content = 'Form';

  $scope.Close = function () {
    $uibModalInstance.dismiss("close");
  };
  $scope.ClearResults= function () {
    LincServices.deleteCVRequest(cvrequestId, function(){
      console.log("Results cleared");
      $uibModalInstance.close(true);
    });
  };
  $scope.Cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.Associate = function (id){
    _.forEach($scope.lions, function(lion) {
      lion.associated = false;
    });
    var index = _.indexOf($scope.lions, _.find($scope.lions, {id: id}));
    var data = {'lion_id': id};
    LincServices.putImageSet(imagesetId, data, function(){
      $scope.lions[index].associated = true;
    });
  };
  $scope.Dissociate = function (id){
    var index = _.indexOf($scope.lions, _.find($scope.lions, {id: id}));
    var data = {'lion_id': null};
    LincServices.putImageSet(imagesetId, data, function(){
      $scope.lions[index].associated = false;
    });
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
