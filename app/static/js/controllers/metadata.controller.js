'use strict';

angular.module('lion.guardians.metadata.controller', ['lion.guardians.metadata.directive'])

.controller('MetadataCtrl', ['$scope', '$window', function ($scope, $window) {
   // MetaData
    $scope.title = 'Metadata';
    $scope.content = 'Form';
    $scope.show = {save: true, upload: false};
    $scope.upload = {btn_class: "btn btn-lg btn-default"};
    $scope.Cancel = function ($hide) {
        $hide();
    };
    $scope.Save = function ($hide) {
        $hide();
    };
}]);
