'use strict';

angular.module('lion.guardians.controllers', ['lion.guardians.home.controller',
                                              'lion.guardians.login.controller',
                                              'lion.guardians.side.menu.controller',
                                              'lion.guardians.lions.controllers',
                                              'lion.guardians.image.set.controllers',
                                              'lion.guardians.conservationists.controller',
                                              'lion.guardians.image.gallery.controller',
                                              'lion.guardians.metadata.controller',
                                              'lion.guardians.location.history.controller',
                                              'lion.guardians.cvresults.controller',
                                              'lion.guardians.cvrequest.controller',
                                              'lion.guardians.upload.images.controller',
                                              'lion.guardians.notification.factory',
                                              'lion.guardians.services',
                                              'lion.guardians.linc.data.factory' ])

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

.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    var res = _.slice(input, start);
    return res
  };
})

// Age Filter
.filter('age_filter', function(){
  return function(input, age) {
    var filtered = _.filter(input, function(value){
        return value.age >= age.min && value.age <= age.max;
    });
    return filtered;
  };
})
// Name or Id Filter
.filter('nameid_filter', function(){
  return function(input, name_str, id_str) {
    if(!name_str.length)
      return input;

    var name = name_str.toLowerCase();
    var name_pieces = name.match(/\S+/g);
    var id = parseInt(id_str);

    var filtered = _.filter(input, function(value){
      var val = value.name.toLowerCase();
      var contain = true;
      name_pieces.forEach(function (piece, i){
        if(val.indexOf(piece) == -1){
          contain = false;
          return;
        }
      });
      return (contain || (value.id === id));
    });
    return filtered;
  };
})

// All Markings
.filter('features_filter', function(){
  return function(input, features_str) {
    if(!features_str.length)
      return input;

    var features = features_str.toLowerCase();
    var pieces = features.match(/\S+/g);

    var filtered = _.filter(input, function(value){
      var val = value.features.toLowerCase();
      // For each piece test contained in input
      var contain = true;
      pieces.forEach(function (piece, i){
        if(val.indexOf(piece) == -1){
          contain = false;
          return;
        }
      });
      return contain;
    });
    return filtered;
  };
})

// Filter by Organization
.filter('organization_filter', function(){
  return function(input, organizations) {
    var filtered = _.filter(input, function(value){
        return (_.result(_.find(organizations, {'name': value.organization}), 'checked'));
    });
    return filtered;
  };
})

.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}])
;
