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

angular.module('lion.guardians.cvrequest.directive', [])

.directive('cvrequest', ['$uibModal', function($uibModal){
  return {
    transclude: true,
    restrict: 'EA',
    template: function(element, attrs) {
      switch (attrs.type) { //view selection. Put type='new' or type='search'
        case 'search':
          return '<button class="btn btn-default btn-sm" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i>Request CV</button>';
          default:
            return '<p><a class="btn btn-lg btn-default btn-block btn-minwidth-180" data-animation="am-fade-and-slide-top" ng-click="show()"><i class="icon icon-flash"></i> Request CV</a></p>';
      }
    },
    scope: {
      useTemplateUrl: '@',
      useCtrl: '@',
      formSize: '@',
      imagesetId: '=',
      cvRequestSuccess:'&',
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
          backdrop  : 'static',
          templateUrl: scope.useTemplateUrl,
          controller:  scope.useCtrl,
          size: scope.formSize,
          scope: modalScope,
          windowClass: 'large-Modal',
          resolve: {
            imagesetId: function () {
              return scope.imagesetId;
            },
            lions: ['LincServices', function(LincServices) {
              return LincServices.Lions();
            }],
            lion_filters: ['LincDataFactory', function(LincDataFactory) {
              return LincDataFactory.get_lions_cvreq_filters();
            }]
          }
        });
        modalInstance.result.then(function (cvrequest) {
          scope.modalIsOpen = false;
          scope.cvRequestSuccess({imageset_Id: scope.imagesetId, request_Obj: cvrequest});
          console.log('Modal ok ' + cvrequest);
        }, function () {
          scope.modalIsOpen = false;
          console.log('Modal dismissed at: ' + new Date());
        });
      };
    }
  };
}]);
