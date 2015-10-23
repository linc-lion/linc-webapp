'use strict';

angular.module('lion.guardians.controllers', ['lion.guardians.login.controller',
                                                               'lion.guardians.home.controller',
                                                               'lion.guardians.side.menu.controller',
                                                               'lion.guardians.lions.controllers',
                                                               'lion.guardians.image.set.controllers',
                                                               'lion.guardians.conservationists.controller',
                                                               'lion.guardians.image.gallery.controller',
                                                               'lion.guardians.metadata.controller',
                                                               'lion.guardians.location.history.controller',
                                                               'lion.guardians.cvresults.controller',
                                                               'lion.guardians.cvrefine.controller',
                                                               'lion.guardians.services' ])

.controller('BodyCtrl', ['$scope', '$state', '$localStorage', function ($scope, $state, $localStorage){
    $scope.bodyClasses = 'default';
    // this'll be called on every state change in the app
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if (toState.data != undefined && angular.isDefined(toState.data.bodyClasses)) {
            $scope.bodyClasses = toState.data.bodyClasses;
            return;
        }
        $scope.bodyClasses = 'default';
    });
    $scope.$storage = $localStorage;
}])
;
