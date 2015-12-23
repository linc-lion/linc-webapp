'use strict';

angular.module('lion.guardians.controllers', ['lion.guardians.admin.controller',
                                              'lion.guardians.home.controller',
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
                                              'lion.guardians.linc.data.factory' ])

.controller('BodyCtrl', ['$scope', '$state', '$interval', 'AuthService', function ($scope, $state, $interval, AuthService){

  $scope.bodyClasses = 'default';
  $scope.debug = false;
  // this'll be called on every state change in the app
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    $scope.cancel_Poller();
    if (toState.data != undefined && angular.isDefined(toState.data.bodyClasses)) {
      $scope.bodyClasses = toState.data.bodyClasses;
      $scope.debug = $state.current.data.debug;
      return;
    }
    $scope.bodyClasses = 'default';
  });
  $scope.Auth = AuthService;
  $scope.poller_promisse = undefined;
  $scope.cancel_Poller = function(){
    if($scope.poller_promisse){
      $interval.cancel($scope.poller_promisse);
      $scope.poller_promisse = undefined;
      console.log("Results CV Request Poller canceled");
    }
  }

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
        if(isNaN(value.age)) return true;
        return value.age >= age.min && value.age <= age.max;
    });
    return filtered;
  };
})
// Name or Id Filter
.filter('nameid_filter', function(){
  return function(input, name_str, special_str) {
    if(name_str == undefined || !name_str.length)
      return input;

    var name = name_str.toLowerCase();
  /*  var special = '';
    if(special_str.length){
      var idx = name.indexOf('!');
      if(idx != -1){
        special = name.substring(idx+1, name.length-1);
        name = name.substring(0,idx-1);
      }
    }*/

    // split by space
    var name_pieces = name.match(/\S+/g);
    //var id = parseInt(name, 10);

    var filtered = _.filter(input, function(value){
      var val = value.name.toLowerCase();
      var contain = false;
      name_pieces.forEach(function (piece, i){
        var idx = piece.indexOf('!');
        if(special_str.length && idx!=-1)
        {
          var special = piece.substring(idx+1, piece.length);
          if(_.has(value, special_str) && value[special_str] == special)
          {
            contain = true;
            return;
          }
        }else{
          if(val.indexOf(piece) != -1){
            contain = true;
            return;
          }
          if(parseInt(piece, 10) == value.id){
            contain = true;
            return;
          }
        }
      });
      return contain; //(contain || (value.id === id));
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
      var val = value.tag_features.toLowerCase();
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

// Filter by Organization
.filter('gender_filter', function(){
  return function(input, genders) {
    var filtered = _.filter(input, function(value){
        if(!value.gender)
          return value;
        return (_.result(_.find(genders, {'name': value.gender}), 'checked'));
    });
    return filtered;
  };
})

.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}])

.filter('PrivateFilter', function(){
  return function(input, show_private) {
    if (show_private)
      return input;
    else{
      var filtered = _.filter(input, function(value){
        return value.is_public;
      });
      return filtered;
    }
  };
})
;
