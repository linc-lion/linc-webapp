'use strict';

angular.module('lion.guardians.metadata.controller', ['lion.guardians.metadata.directive'])

.controller('MetadataCtrl', ['$scope', '$window', function ($scope, $window) {
   // MetaData
    $scope.title = 'Metadata';
    $scope.content = 'Form';

    $scope.Cancel = function ($hide) {
        $hide();
    };
    $scope.Save = function ($hide) {
        $hide();
    };
}]);

