
'use strict';

angular.module('lion.guardians.admin.controller', [ 'lion.guardians.admin.users.controller',
                                                    'lion.guardians.admin.organiaztions.controller',
                                                    'lion.guardians.admin.lions.controller',
                                                    'lion.guardians.admin.imagesets.controller',
                                                    'lion.guardians.admin.images.controller',
                                                    'lion.guardians.admin.cvrequests.controller',
                                                    'lion.guardians.admin.cvresults.controller'])

.controller('AdminCtrl', ['$scope', '$q', '$uibModal', 'LincApiServices', 'NotificationFactory', 'organizations', 'users', 'lions', 'imagesets', 'images', 'cvrequests', 'cvresults', function ($scope, $q, $uibModal, LincApiServices, NotificationFactory, organizations, users, lions, imagesets, images, cvrequests, cvresults) {
  $scope.LincApiServices = LincApiServices;
  $scope.Notification = NotificationFactory;
  $scope.organizations = organizations;
  $scope.users = users;
  $scope.lions = lions;
  $scope.imagesets = imagesets;
  $scope.images = images;
  $scope.cvrequests = cvrequests;
  $scope.cvresults = cvresults;

  $scope.EmptyString = {'users': '', 'organizations': '', 'lions': '', 'imagesets': '', 'images': '', 'cvrequests': '', 'cvresults': ''}
  $scope.CleanBracket = {'users': [], 'organizations': [], 'lions': [], 'imagesets': [], 'images': [], 'cvrequests': [], 'cvresults': []};
  $scope.ItemsSelecteds = {'users': false, 'organizations': false, 'lions': false, 'imagesets': false, 'images': false, 'cvrequests': false, 'cvresults': false};


  $scope.tabs = [
    { title:'Organizations', disabled: false, sref: 'admin.organizations'},
    { title:'Lions', disabled: false, sref: 'admin.lions'},
    { title:'Imagesets', disabled: false, sref: 'admin.imagesets'},
    { title:'Images', disabled: false, sref: 'admin.images'},
    { title:'CV Requests', disabled: false, sref: 'admin.cvrequests'},
    { title:'CV Results', disabled: false, sref: 'admin.cvresults'}
  ];

  $scope.Delete = function (title){
    var deferred = $q.defer();
    $scope.modalTitle = 'Delete ' + title;
    $scope.modalMessage = 'Are you sure you want to delete the ' + title + ' ?';
    $scope.modalContent = 'Form';
    $scope.modalInstance = $uibModal.open({
        templateUrl: 'Delete.tmpl.html',
        scope:$scope
    });
    $scope.ok = function (){
      $scope.modalInstance.close();
      deferred.resolve();
    }
    $scope.cancel = function(){
      $scope.modalInstance.dismiss();
      deferred.reject();
    }
    return deferred.promise;
  };
}])

.directive('nxEqualEx', function() {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, model) {
      if (!attrs.nxEqualEx) {
        console.error('nxEqualEx expects a model as an argument!');
        return;
      }
      scope.$watch(attrs.nxEqualEx, function (value) {
        // Only compare values if the second ctrl has a value.
        if (model.$viewValue !== undefined && model.$viewValue !== '') {
          model.$setValidity('nxEqualEx', value === model.$viewValue);
        }
      });
      model.$parsers.push(function (value) {
        // Mute the nxEqual error if the second ctrl is empty.
        if (value === undefined || value === '') {
          model.$setValidity('nxEqualEx', true);
          return value;
        }
        var isValid = value === scope.$eval(attrs.nxEqualEx);
        model.$setValidity('nxEqualEx', isValid);
        return isValid ? value : undefined;
      });
    }
  };
})

/*.directive('watchScope', [function () {
  return {
    scope: {
      item: '=watchScope'
    },
    link: function (scope, element, attrs) {
      console.log('element ' + scope.item.name + ' created');
    }
  };
}])*/

.directive('repeatDone', function() {
  return function(scope, element, attrs) {
    if (scope.$last) { // all are rendered
      scope.$eval(attrs.repeatDone);
    }
  }
})

/*.directive('uiSrefActiveIf', ['$state', function($state) {
  return {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
      var state = $attrs.uiSrefActiveIf;
      function update() {
        if ( $state.includes(state) || $state.is(state) ) {
          $element.addClass("active");
        } else {
          $element.removeClass("active");
        }
      }
      $scope.$on('$stateChangeSuccess', update);
      update();
    }]
  };
}])*/
;
