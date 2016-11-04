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

angular.module('linc.controllers', ['linc.admin.controller',
                                    'linc.home.controller',
                                    'linc.login.controller',
                                    'linc.side.menu.controller',
                                    'linc.lions.controllers',
                                    'linc.image.set.controllers',
                                    'linc.conservationists.controller',
                                    'linc.image.gallery.controller',
                                    'linc.metadata.controller',
                                    'linc.location.history.controller',
                                    'linc.cvresults.controller',
                                    'linc.cvrequest.controller',
                                    'linc.upload.images.controller',
                                    'linc.notification.factory',
                                    'linc.data.factory' ])

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
        if(piece.length==1 && piece[0]==="*"){
          contain = true;
          return;
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

.filter('LatLngFilter', function(){
  var check_dist = function (lat1, lon1, lat2, lon2, radius){
    var R = 6371; // m (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // km
    //var dist = Math.round(d*1000*100)/100;
    return (d <= radius);
  };

  return function(input, location) {

    if(location.latitude == undefined || location.longitude == undefined || location.radius == undefined)
      return input;
    if(!location.latitude.length || !location.longitude.length || !location.radius.length)
      return input;
    var lat = Number(location.latitude);
    //if(isNaN(lat)) return input;
    var lng = Number(location.longitude);
    //if(isNaN(lng)) return input;
    var radius = Number(location.radius);
    //if(isNaN(radius)) return input;

    var filtered = _.filter(input, function(value){
      if(!value.latitude) return false;
      if(!value.longitude) return false;
      return check_dist(lat, lng, value.latitude, value.longitude, radius);
    });
    return filtered;
  };

})

.directive('limlatlng', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ctrl) {
      var el = elem;
      var limit = parseInt(attr.limlatlng,10);

      var toModel = function (val) {
        return val.replace(/,/g, '.') ;
      };
      ctrl.$parsers.unshift(toModel);

      ctrl.$validators.limlatlng = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) return true;

        if(typeof modelValue === 'number' || modelValue instanceof Number)  return true;

        var val = modelValue.replace(/,/g, '.') ;
        var num = parseFloat(val);
        if(isNaN(num) || (num && (num.toString() != val)))
          return true;
        else if(Math.abs(num) > limit)
          return false;
        else
          return true;
      };
    }
  };
})
;
