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

angular.module('lion.guardians.cvresults.directive', [])

.directive('cvresults', ['$uibModal', '$interval', function($uibModal, $interval) {
  return {
    transclude: true,
    restrict: 'EA',
    template: function(element, attrs) {
      switch (attrs.type) { //view selection. Put type='new' or type='search'
        case 'search':
          return '<button class="btn btn-primary" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i>CV Results</button>';
        default:
          return '<p><a class="btn btn-lg btn-default btn-block" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i> VIEW CV RESULTS</a></p>';
      }
    },
    scope: {
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      imagesetId: '=',
      cvresultsId: '=',
      cvrequestId: '=',
      cvResultErased: '&',
      debug: '=',
      modalIsOpen: '='
    },
    link: function(scope, element, attrs) {
      scope.show = function(){
        if(scope.modalIsOpen) return;
        scope.modalIsOpen = true;
        var modalScope = scope.$new();
        modalScope.debug = scope.debug;
        var modalInstance = $uibModal.open({
          animation: true,
          backdrop: true,
          templateUrl: scope.useTemplateUrl,
          controller:  scope.useCtrl,
          size: scope.formSize,
          scope: modalScope,
          resolve: {
            imagesetId: function () {
              return scope.imagesetId;
            },
            cvrequestId: function () {
              return scope.cvrequestId;
            },
            cvresultsId: function () {
              return scope.cvresultsId;
            },
            data_cvresults: ['LincServices', function(LincServices) {
              return LincServices.getCVResults(scope.cvresultsId);
            }]
          }
        });
        var poller_promisse = undefined;
        modalScope.get_poller_promisse = function(){
          return poller_promisse;
        };
        modalScope.set_poller_promisse = function(val){
          poller_promisse = val;
        };
        modalScope.cancel_Poller = function () {
          if(poller_promisse){
            $interval.cancel(poller_promisse);
            poller_promisse = undefined;
            console.log("CV Results Poller canceled");
          }
        };
        modalInstance.result.then(function (result) {
          modalScope.cancel_Poller();
          scope.modalIsOpen = false;
          scope.cvResultErased({change: result, imagesetId: scope.imagesetId});
          console.log('Modal ok' + result);
        }, function () {
          modalScope.cancel_Poller();
          scope.modalIsOpen = false;
          console.log('Modal dismissed at: ' + new Date());
        });
      };
    }
  };
}]);
