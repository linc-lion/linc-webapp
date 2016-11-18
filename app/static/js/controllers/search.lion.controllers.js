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

angular.module('search.linc.lions.controllers', [])

.controller('SearchLionCtrl', ['$scope', '$timeout', '$stateParams', '$bsTooltip', 'AuthService', 'lions', 'lion_filters', 
  'default_filters', 'TAG_LABELS', 'TOOL_TITLE', function ($scope, $timeout, $stateParams, $bsTooltip, AuthService, 
  lions, lion_filters, default_filters, TAG_LABELS, TOOL_TITLE) {

  $scope.user = AuthService.user;

  $scope.title_tooltip = {'title': 'tips: ' + TOOL_TITLE, 'checked': true};

  var GET_FEATURES = function (lbs, TAGS){
    var label = "";
    TAGS.forEach(function (elem, i){
      label += lbs[elem];
      if(i<TAGS.length-1) label += ', ';
    });
    return label;
  }

  var get_permissions = function (user,lion){
    var permissions = {};
    var lion_ismine  = user.organization_id == lion.organization_id;

    permissions['canLocate'] = (!lion.geopos_private || user.admin || lion_ismine);
  
    return permissions;
  }
  $scope.lions = _.map(lions, function(element, index) {

    element['permissions'] = get_permissions($scope.user, element);
    element['age'] = isNaN(parseInt(element['age'])) ? null : element['age'];
    
    var elem = {};
    var TAGS = [];
    if(!element.gender) element.gender = 'unknown';
    if(element['tags']==undefined)element['tags']="[]";
    try{ TAGS = JSON.parse(element['tags']);
    }catch(e){ TAGS = element['tags'].split(","); }
    if(TAGS==null) TAGS = [];

    var tag_features = GET_FEATURES(TAG_LABELS, TAGS);
    elem['features_tooltip'] = {'title': tag_features, 'checked': true};
    elem['features'] = (tag_features.length > 0) ? true : false;
    elem['tag_features'] = tag_features;
    elem['need_verifiy_tooltip'] = {'title': 'There are Image sets pending of verification', 'checked': true};
    return _.extend({}, element, elem);
  });

  $scope.organizations = lion_filters.organizations;
  $scope.genders = lion_filters.genders;
  //$scope.isCollapsed = true;
  $scope.isAgeCollapsed = lion_filters.isAgeCollapsed;
  $scope.isOrgCollapsed = lion_filters.isOrgCollapsed;
  $scope.isNameIdCollapsed = lion_filters.isNameIdCollapsed;
  $scope.isFeaturesCollapsed = lion_filters.isFeaturesCollapsed;
  $scope.isGenderCollapsed = lion_filters.isGenderCollapsed;
  $scope.isLocationCollapsed = lion_filters.isLocationCollapsed;
  // Filters  scopes
  $scope.LionAge = lion_filters.LionAge;

  $scope.refreshSlider = function () {
    $timeout(function () {
        $scope.$broadcast('rzSliderForceRender');
    });
  };
  // Click in Photo - Show Big Image
  $scope.show_photo = function(url){
    var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=100, left=100, width=600, height=600");
    win.focus();
  }
  $scope.refreshSlider();
  //$scope.name_or_id ='';
  $scope.name_or_id = lion_filters.name_or_id;
  // tags
  $scope.tag_features = lion_filters.tag_features;
  // Location {Lat Lang Radius}
  $scope.location = lion_filters.location;
  // Order by
  //$scope.reverse = false;
  $scope.reverse = lion_filters.reverse;
  //$scope.predicate = 'id';
  $scope.predicate = lion_filters.predicate;

  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
    lion_filters.predicate = $scope.predicate;
    lion_filters.reverse = $scope.reverse;
  };

  $scope.PerPages = [
      {'index': 0, 'label' : '10 Lions', 'value': 10, 'disabled': false},
      {'index': 1, 'label' : '20 Lions', 'value': 20, 'disabled': lions.length < 10 ?  true : false},
      {'index': 2, 'label' : '30 Lions', 'value': 30, 'disabled': lions.length < 20 ?  true : false},
      {'index': 3, 'label' : '60 Lions', 'value': 60, 'disabled': lions.length < 30 ?  true : false},
      {'index': 4, 'label' : '100 Lions', 'value' : 100, 'disabled': lions.length < 60 ?  true : false}
    ];

  $scope.PerPage = lion_filters.PerPage;
  $scope.changeItensPerPage = function(){
    $scope.setPage(0);
    var min_val = ($scope.filtered_lions==undefined) ? $scope.lions.length : $scope.filtered_lions.length;
    switch ($scope.PerPage){
      case 0:
        $scope.itemsPerPage = Math.min(10, min_val);
        lion_filters.PerPage = $scope.PerPages[0].index;
      break;
      case 1:
        $scope.itemsPerPage = Math.min(20, min_val);
        lion_filters.PerPage = $scope.PerPages[1].index;
      break;
      case 2:
        $scope.itemsPerPage = Math.min(30, min_val);
        lion_filters.PerPage = $scope.PerPages[2].index;
      break;
      case 3:
        $scope.itemsPerPage = Math.min(60, min_val);
        lion_filters.PerPage = $scope.PerPages[3].index;
      break;
      default:
        $scope.itemsPerPage = Math.min(100, min_val);
        lion_filters.PerPage = $scope.PerPages[4].index;
    }
  }
  // Change Name_or_Id input
  $scope.change_name_or_id = function(){
    lion_filters.name_or_id = $scope.name_or_id;
    $scope.setPage(0);
  }
  $scope.change_organizations = function(){
    $scope.setPage(0);
  }
  $scope.change_features = function(){
    $scope.setPage(0);
  }
  $scope.change_gender = function(){
    $scope.setPage(0);
  }
  $scope.change_age = function(){
    $scope.setPage(0);
  }
  $scope.change_location = function(){
    //lion_filters.latlngradius = $scope.latlngradius;
    $scope.setPage(0);
  }
  // Click collapse
  $scope.collapse_age = function(){
    $scope.isAgeCollapsed = !$scope.isAgeCollapsed;
    lion_filters.isAgeCollapsed = $scope.isAgeCollapsed;
  }
  $scope.collapse_organizations = function(){
    $scope.isOrgCollapsed = !$scope.isOrgCollapsed;
    lion_filters.isOrgCollapsed = $scope.isOrgCollapsed;
  }
  $scope.collapse_name_id = function(){
    $scope.isNameIdCollapsed = !$scope.isNameIdCollapsed;
    lion_filters.isNameIdCollapsed = $scope.isNameIdCollapsed;
  }
  $scope.collapse_features = function(){
    $scope.isFeaturesCollapsed = !$scope.isFeaturesCollapsed;
    lion_filters.isFeaturesCollapsed = $scope.isFeaturesCollapsed;
  }
  $scope.collapse_gender = function(){
    $scope.isGenderCollapsed = !$scope.isGenderCollapsed;
    lion_filters.isGenderCollapsed = $scope.isGenderCollapsed;
  }
  $scope.collapse_location = function(){
    $scope.isLocationCollapsed = !$scope.isLocationCollapsed;
    lion_filters.isLocationCollapsed = $scope.isLocationCollapsed;
  }

  $scope.setPage = function(n) {
    $scope.currentPage = n;
    lion_filters.currentPage = $scope.currentPage;
  };
  $scope.prevPage = function() {
    if ($scope.currentPage > 0)
      $scope.setPage($scope.currentPage - 1);
  };
  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()-1)
      $scope.setPage($scope.currentPage + 1);
  };
  $scope.firstPage = function() {
    $scope.setPage(0)
  };
  $scope.lastPage = function() {
    if ($scope.currentPage < $scope.pageCount()-1)
      $scope.setPage($scope.pageCount()-1);
  };
  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };
  $scope.nextPageDisabled = function() {
    return ($scope.currentPage === $scope.pageCount()-1 || !$scope.pageCount())? "disabled" : "";
  };
  $scope.pageCount = function() {
    return Math.ceil($scope.filtered_lions.length/$scope.itemsPerPage);
  };
  $scope.range = function() {
    var rangeSize = Math.min(5, $scope.pageCount());
    var ret = [];
    var start = $scope.currentPage -3;
    if ( start < 0 ) start = 0;
    if ( start > $scope.pageCount()-(rangeSize-3) ) {
      start = $scope.pageCount()-rangeSize+1;
    }
    var max = Math.min(start+rangeSize,$scope.pageCount());
    for (var i=start; i<max; i++) {
      ret.push(i);
    }
    return ret;
  };
  $scope.viewer_label = function(){
    var label = "0 lions found";
    if($scope.filtered_lions != undefined && $scope.filtered_lions.length){
      label = ($scope.filtered_lions.length).toString() + " lions found - " +
              ($scope.currentPage*$scope.itemsPerPage+1).toString() + " to " +
              (Math.min((($scope.currentPage+1)*$scope.itemsPerPage),$scope.filtered_lions.length)).toString();
    }
    return label;
  }

  $scope.filters = $stateParams.filter ? $stateParams.filter : {};

  if(Object.keys($scope.filters).length){
    console.log('Search lions - has filter params');
    $scope.name_or_id = $scope.filters.hasOwnProperty('name_or_id') ? $scope.filters.name_or_id : default_filters.name_or_id;
    $scope.tag_features = $scope.filters.hasOwnProperty('tag_features') ? $scope.filters.tag_features : default_filters.tag_features;
    $scope.organizations = $scope.filters.hasOwnProperty('organizations') ? $scope.filters.organizations : default_filters.organizations;
    $scope.genders = $scope.filters.hasOwnProperty('genders') ? $scope.filters.genders : default_filters.genders;
    $scope.LionAge = $scope.filters.hasOwnProperty('LionAge') ? $scope.filters.LionAge : default_filters.LionAge;
    $scope.isNameIdCollapsed = $scope.filters.hasOwnProperty('isNameIdCollapsed') ? $scope.filters.isNameIdCollapsed : default_filters.isNameIdCollapsed;
    $scope.isFeaturesCollapsed = $scope.filters.hasOwnProperty('isFeaturesCollapsed') ? $scope.filters.isFeaturesCollapsed : default_filters.isFeaturesCollapsed;
    $scope.isGenderCollapsed = $scope.filters.hasOwnProperty('isGenderCollapsed') ? $scope.filters.isGenderCollapsed : default_filters.isGenderCollapsed;
  }
  else{
    var cur_per_page = lion_filters.currentPage;
    $scope.changeItensPerPage();
    $scope.currentPage = cur_per_page;
  }

}]);
