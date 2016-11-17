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

angular.module('linc.cvrequest.controller', ['linc.cvrequest.directive'])

.controller('CVRequesCtrl', ['$scope', '$window', '$timeout', '$uibModalInstance', 'LincServices', 'NotificationFactory', 
  'imageset', 'lions', 'lion_filters', 'AuthService', 'TAG_LABELS', 'TOOL_TITLE', function ($scope, $window, $timeout, 
  $uibModalInstance, LincServices, NotificationFactory, imageset, lions, lion_filters, AuthService, TAG_LABELS, TOOL_TITLE) {

  $scope.title = 'CV Search';
  $scope.content = 'Search';
  $scope.imageset = imageset;

  $scope.title_tooltip = {'title': 'tips: ' + TOOL_TITLE, 'checked': true};

  var GET_FEATURES = function (lbls, TAGS){
    var label = "";
    TAGS.forEach(function (elem, i){
      label += lbls[elem];
      if(i<TAGS.length-1) label += ', ';
    });
    return label;
  }

  $scope.show_photo = function(object){
    if(angular.isObject(object)){
      var url = $state.href("viewimages", {'images':{'imageset': imageset, 'lion': object}},  {absolute: true});
      window.open(url,"_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=100, left=100, width=1200");
    }
    else if (angular.isString(object)){
      var win = window.open(object, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=100, left=100, width=600, height=600");
      win.focus();    
    }
  }

  $scope.user = AuthService.user;

  var get_permissions = function (user,lion){
    var permissions = {};
    var lion_ismine  = user.organization_id == lion.organization_id;
    permissions['canLocate'] = (!lion.geopos_private || user.admin || lion_ismine);
    return permissions;
  }
  $scope.lions = _.map(lions, function(element, index) {

    element['permissions'] = get_permissions($scope.user, element);

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

    return _.extend({}, element, elem);
  });

  $scope.organizations = lion_filters.organizations;
  $scope.genders = lion_filters.genders;
  //$scope.isCollapsed = true;
  $scope.isCVAgeCollapsed = lion_filters.isAgeCollapsed;
  $scope.isCVOrgCollapsed = lion_filters.isOrgCollapsed;
  $scope.isCVNameIdCollapsed = lion_filters.isNameIdCollapsed;
  $scope.isCVFeaturesCollapsed = lion_filters.isFeaturesCollapsed;
  $scope.isCVGenderCollapsed = lion_filters.isGenderCollapsed;
  $scope.isCVLocationCollapsed = lion_filters.isLocationCollapsed;
  // Filters  scopes
  $scope.LionAge = lion_filters.LionAge;

  $scope.refreshSlider = function () {
    $timeout(function () {
        $scope.$broadcast('rzSliderForceRender');
    });
  };
  $scope.refreshSlider();
  //$scope.name_or_id ='';
  $scope.name_or_id = lion_filters.name_or_id;
  // tags
  $scope.tag_features = lion_filters.tag_features;
  // Location {Lat Lang Radius}
  $scope.cv_location = lion_filters.location;
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
  // Change Name_or_Id input
  $scope.change_cv_name_or_id = function(){
    lion_filters.name_or_id = $scope.name_or_id;
  }
  $scope.change_cv_organizations = function(){
  }
  $scope.change_cv_features = function(){
  }
  $scope.change_cv_gender = function(){
  }
  $scope.change_cv_age = function(){
  }
  $scope.change_cv_location = function(){
  }
  // Click Collapse
  $scope.collapse_cv_age = function(){
    $scope.isCVAgeCollapsed = !$scope.isCVAgeCollapsed
    lion_filters.isAgeCollapsed = $scope.isCVAgeCollapsed;
  }
  $scope.collapse_cv_organizations = function(){
    $scope.isCVOrgCollapsed = !$scope.isCVOrgCollapsed
    lion_filters.isOrgCollapsed = $scope.isCVOrgCollapsed;
  }
  $scope.collapse_cv_name_id = function(){
    $scope.isCVNameIdCollapsed = !$scope.isCVNameIdCollapsed
    lion_filters.isNameIdCollapsed = $scope.isCVNameIdCollapsed;
  }
  $scope.collapse_cv_features = function(){
    $scope.isCVFeaturesCollapsed = !$scope.isCVFeaturesCollapsed
    lion_filters.isFeaturesCollapsed = $scope.isCVFeaturesCollapsed;
  }
  $scope.collapse_cv_gender = function(){
    $scope.isCVGenderCollapsed = !$scope.isCVGenderCollapsed
    lion_filters.isGenderCollapsed = $scope.isCVGenderCollapsed;
  }
  $scope.collapse_cv_location = function(){
    $scope.isCVLocationCollapsed = !$scope.isCVLocationCollapsed;
    lion_filters.isLocationCollapsed = $scope.isCVLocationCollapsed;
  }
  $scope.viewer_label = function(){
    var label = "0 lions found";
    if($scope.filtered_lions != undefined && $scope.filtered_lions.length){
      label = ($scope.filtered_lions.length).toString() + " lions found";
    }
    return label;
  }

  $scope.Close = function () {
    $uibModalInstance.dismiss("close");
  };
  $scope.requestCV = function () {
    var lions_id = _.pluck($scope.filtered_lions, 'id');
    var data = {"lions": lions_id};
    LincServices.requestCV(imageset.id, data, function(result){
      var requestObj = result.data.data;
      $uibModalInstance.close(requestObj);
      NotificationFactory.success({
        title: "Success", message:'CV Request created with success',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
    });
  };
  /*$scope.checkAll = function (check) {
    $scope.lions.forEach(function(lion){
      lion.selected = check;
    });
  };
  $scope.checked_count = 0;
  $scope.count = function(check){
    if(check)
      $scope.checked_count++;
    else $scope.checked_count--;
    console.log("checked" + $scope.checked_count);
  }*/
/*
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };*/
}]);
