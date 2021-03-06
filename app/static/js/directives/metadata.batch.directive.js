// LINC is an open source shared database and facial recognition
// system that allows for collaboration in wildlife monitoring.
// Copyright (C) 2016  Wildlifeguardians
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For more information or to contact visit linclion.org or email tech@linclion.org
'use strict';

angular.module('linc.metadata.batch.directive', [])

.directive('metadataBatch', ['$uibModal', function($uibModal) {
  return {
    transclude: true,
    replace: true,
    restrict: 'EA',
    template: '<button type="button" class="btn btn-primary btn-edit" ng-disabled="disableBtn" ng-click="show()">Edit'+
              '<span ng-if="dataloading" class="text-center"><img src="/static/images/loading.gif"/></span></button>',
    scope: {
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      debug: '=',
      disableBtn: '=',
      metaData: '=',
      modalStatus: '=',
      updateAction: '&'
    },
    link: function(scope, element, attrs) {
      scope.show = function(){
        if(scope.modalStatus.is_open) return;
        scope.modalStatus.is_open = true;
        var modalScope = scope.$new();
        modalScope.debug = scope.debug;
        scope.dataloading = true;
        var modalInstance = $uibModal.open({
          animation: true,
          backdrop  : 'static',
          templateUrl: scope.useTemplateUrl,
          controller:  scope.useCtrl,
          size: scope.formSize,
          scope: modalScope,
          resolve: {
            metadata: function () {
              return scope.metaData;
            },
            organizations: ['$q', 'LincServices', function($q, LincServices) {
              var deferred = $q.defer();
              LincServices.Organizations().then(function(response){
                if (response.length)
                  deferred.resolve(response);
                else
                  deferred.reject(response);
              });
              return deferred.promise;
            }]
          }
        });
        modalInstance.result.then(function (result) {
          scope.modalStatus.is_open = false;
          scope.dataloading = false;
          scope.updateAction({data: result.data});
          console.log('Modal ok');
        }, function () {
          scope.modalStatus.is_open = false;
          scope.dataloading = false;
          console.log('Modal dismissed at: ' + new Date());
        });
      }
    }
  };
}]);
