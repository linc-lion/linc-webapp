
'use strict';

angular.module('lion.guardians.home.controller', [])
// Home
.controller('HomeCtrl', ['$scope', '$state', function ($scope, $state) {

  $scope.is_modal_open = false;
  $scope.options = {
    "imageset": {
        "type": "imageset", "edit": "new", "uploading_user_id": 6,
        "owner_organization_id": 2, "uploading_organization_id": 2
    },
    "lions": {
        "type": "lion", "edit": "new", "uploading_user_id": 6,
        "owner_organization_id": 2, "uploading_organization_id": 2
    }
  };

  $scope.goto_imageset = function (Id) {
    $state.go("imageset", { id: Id });
  }
  $scope.goto_lion = function (Id) {
    $state.go("lion", { id: Id });
  }

}]);
