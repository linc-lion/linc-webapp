'use strict';

angular.module('lion.guardians.cvresults.controller', ['lion.guardians.cvresults.directive'])

.controller('CVResultsCtrl', ['$scope', '$uibModalInstance', 'LincServices', 'imagesetId', 'cvrequestId', 'cvresults', function ($scope, $uibModalInstance, LincServices, imagesetId, cvrequestId, cvresults) {

  $scope.title = 'CV Results';
  $scope.content = 'Form';

  $scope.cvresults = cvresults;

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
      LincServices.ClearAllImagesetsCaches();
      LincServices.ClearImagesetProfileCache(ImagesetId);
    });
  };
  $scope.Dissociate = function (id){
    var index = _.indexOf($scope.cvresults, _.find($scope.cvresults, {id: id}));
    var data = {'lion_id': null};
    LincServices.Associate(imagesetId, data, function(){
      $scope.cvresults[index].associated = false;
      LincServices.ClearAllImagesetsCaches();
      LincServices.ClearImagesetProfileCache(ImagesetId);
    });
  };
  /*LincServices.getListCVResults(cvresultsId, function(result){
    var data = result.data.table;
    var associated_id = result.data.associated.id;

    $scope.cvresults = _.map(data, function(element, index) {
      var elem = {};
      if(associated_id == element.id) elem["associated"] = true;
      else elem["associated"] = false;
      return _.extend({}, element, elem);
    });
  });*/
}]);
