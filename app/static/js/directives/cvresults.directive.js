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
