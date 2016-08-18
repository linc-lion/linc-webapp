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

angular.module('lion.guardians.lions.controllers', [])

.controller('LionCtrl', ['$scope', '$rootScope', '$state', '$uibModal', '$bsTooltip', 'NotificationFactory', 'LincServices', 'AuthService', 'organizations', 'lion', function ($scope, $rootScope, $state, $uibModal, $bsTooltip, NotificationFactory, LincServices, AuthService, organizations, lion) {

  $scope.is_modal_open = false;
  $scope.lion = lion;
  $scope.user = AuthService.user;
  var labels = function (damages, labels){
    var label = "";
    labels.forEach(function (elem, i){
      label += damages[elem];
      if(i<labels.length-1) label += ', ';
    });
    return label;
  }
  $scope.tooltip_need_verifiy = {'title': 'There are Image sets pending of verification', 'checked': true};

  var eye_damages    = {'EYE_DAMAGE_BOTH': 'Both', 'EYE_DAMAGE_LEFT': 'Left', 'EYE_DAMAGE_RIGHT': 'Right'};
  var broken_teeths  = {'TEETH_BROKEN_CANINE_LEFT': 'Canine Left', 'TEETH_BROKEN_CANINE_RIGHT': 'Canine Right', 'TEETH_BROKEN_INCISOR_LEFT': 'Incisor Left', 'TEETH_BROKEN_INCISOR_RIGHT': 'Incisor Right'};
  var ear_markings   = {'EAR_MARKING_BOTH': 'Both', 'EAR_MARKING_LEFT': 'Left', 'EAR_MARKING_RIGHT': 'Right'};
  var mount_markings = {'MOUTH_MARKING_BACK': 'Back', 'MOUTH_MARKING_FRONT': 'Front', 'MOUTH_MARKING_LEFT': 'Left', 'MOUTH_MARKING_RIGHT': 'Right'};
  var tail_markings  = {'TAIL_MARKING_MISSING_TUFT': 'Missing Tuft'};
  var nose_color     = {'NOSE_COLOUR_BLACK': 'Black', 'NOSE_COLOUR_PATCHY': 'Patchy', 'NOSE_COLOUR_PINK': 'Pynk', 'NOSE_COLOUR_SPOTTED': 'Spotted'};
  var scars          = {'SCARS_BODY_LEFT': 'Body Left', 'SCARS_BODY_RIGHT': 'Body Right', 'SCARS_FACE': 'Face', 'SCARS_TAIL': 'Tail'};

  var Set_Tags = function(){
    $scope.canShow = ($scope.user.admin || $scope.user.organization_id == $scope.lion.organization_id);

    //$scope.ShowIsVerified =
    //(($scope.lion.organization_id === $scope.user.organization_id) || $scope.user.admin) ? $scope.lion.is_verified : true;

    var TAGS = [];
    try{
      TAGS = JSON.parse($scope.lion.tags);
    }catch(e){
      TAGS = $scope.lion.tags.split(",");
    }
    $scope.lion.eye_damage = labels(eye_damages,_.intersection(TAGS, ['EYE_DAMAGE_BOTH', 'EYE_DAMAGE_LEFT', 'EYE_DAMAGE_RIGHT']));
    $scope.lion.broken_teet = labels(broken_teeths,_.intersection(TAGS, ['TEETH_BROKEN_CANINE_LEFT', 'TEETH_BROKEN_CANINE_RIGHT', 'TEETH_BROKEN_INCISOR_LEFT', 'TEETH_BROKEN_INCISOR_RIGHT']));
    $scope.lion.ear_markings = labels(ear_markings,_.intersection(TAGS, ['EAR_MARKING_BOTH', 'EAR_MARKING_LEFT', 'EAR_MARKING_RIGHT']));
    $scope.lion.mount_markings =labels(mount_markings, _.intersection(TAGS, ['MOUTH_MARKING_BACK', 'MOUTH_MARKING_FRONT', 'MOUTH_MARKING_LEFT', 'MOUTH_MARKING_RIGHT']));
    $scope.lion.tail_markings = labels(tail_markings,_.intersection(TAGS, ['TAIL_MARKING_MISSING_TUFT']));
    $scope.lion.nose_color = labels(nose_color,_.intersection(TAGS, ['NOSE_COLOUR_BLACK', 'NOSE_COLOUR_PATCHY', 'NOSE_COLOUR_PINK', 'NOSE_COLOUR_SPOTTED']));
    $scope.lion.scars = labels(scars,_.intersection(TAGS, ['SCARS_BODY_LEFT', 'SCARS_BODY_RIGHT', 'SCARS_FACE', 'SCARS_TAIL']));
  };
  Set_Tags();
  // Metadata Options
  $scope.metadata_options = { type: 'lion', edit: 'edit', data: $scope.lion};
  // Updated in Metadata
  $scope.update_lion = function (data){
    _.merge($scope.lion, $scope.lion, data);
    $scope.lion.organization =  _.find(organizations, {id: $scope.lion.organization_id}).name;
    Set_Tags();
  }
  // Image Gallery
  $scope.gallery_options = { type: 'lion', edit: 'edit', id: $scope.lion.primary_image_set_id};
  // Location History
  $scope.location_options = { type: 'lion', lion_id: $scope.lion.id};

  $scope.location_goto = function (imageset_id){
    $state.go("imageset", {id: imageset_id});
  }
  $scope.goto_search_imageset = function (){
    $state.go("searchimageset", {filter: {name_or_id: '!'+lion.id}});
  }

  $scope.Delete = function (){
    $scope.modalTitle = 'Delete Lion';
    $scope.modalMessage = 'Are you sure you want to delete the lion?';
    $scope.SucessMessage = 'Lions was successfully deleted.';
    $scope.ErrorMessage = 'Unable to delete this Lion.';
    $scope.modalContent = 'Form';
    $scope.modalInstance = $uibModal.open({
        templateUrl: 'Delete.tmpl.html',
        scope:$scope
    });
    $scope.modalInstance.result.then(function (result) {
      LincServices.DeleteLion($scope.lion.id, function(results){
        NotificationFactory.success({
          title: $scope.modalTitle, message: $scope.SucessMessage,
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $rootScope.remove_history('lion', $scope.lion.id);
        $state.go("searchlion");
      },
      function(error){
        if($scope.debug || (error.status != 401 && error.status != 403)){
          NotificationFactory.error({
            title: "Fail: "+$scope.modalTitle, message: $scope.ErrorMessage,
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        }
      });
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
    $scope.ok = function (){
      $scope.modalInstance.close();
    }
    $scope.cancel = function(){
      $scope.modalInstance.dismiss();
    }
  };
  $scope.Disassociate = function (id){
    var data = {'lion_id': null};
    LincServices.Associate(id, data, function(){
      $scope.lion.primary_image_set_id = null;
      NotificationFactory.success({
        title: "Disassociate", message:'Lion was disassociated',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
    },
    function(error){
      if($scope.debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Disassociate the Lion',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      console.log(error);
    });
  };
  $scope.Reload_Page = function () {
    $state.go($state.current, {'id': lion.id}, {reload: true});
  };
  var date_format = function(data){
    if(data == null || data =="" || data =="-"){
      return "-";
    }
    if(data.length>10){
      return data.substring(0, 10);
    }
    else {
      return data;
    }
  }
  $scope.lion.date_of_birth = date_format($scope.lion.date_of_birth);
}])

.controller('SearchLionCtrl', ['$scope', '$timeout', '$stateParams', '$bsTooltip', 'AuthService', 'lions', 'lion_filters', 'default_filters', function ($scope, $timeout, $stateParams, $bsTooltip, AuthService, lions, lion_filters, default_filters) {

  $scope.user = AuthService.user;
  var tag_labels    = {'EYE_DAMAGE_BOTH': 'Eye Damage Both', 'EYE_DAMAGE_LEFT': 'Eye Damage Left', 'EYE_DAMAGE_RIGHT': 'Eye Damage Right', 'TEETH_BROKEN_CANINE_LEFT': 'Broken Teeth Canine Left', 'TEETH_BROKEN_CANINE_RIGHT': 'Broken Teeth Canine Right', 'TEETH_BROKEN_INCISOR_LEFT': 'Broken Teeth Incisor Left', 'TEETH_BROKEN_INCISOR_RIGHT': 'Broken Teeth Incisor Right',
  'EAR_MARKING_BOTH': 'Ear Marking Both', 'EAR_MARKING_LEFT': 'Ear Marking Left', 'EAR_MARKING_RIGHT': 'Ear Marking Right',
  'MOUTH_MARKING_BACK': 'Mounth Marking Back', 'MOUTH_MARKING_FRONT': 'Mounth Marking Front', 'MOUTH_MARKING_LEFT': 'Mounth Marking Left', 'MOUTH_MARKING_RIGHT': 'Mounth Marking Right', 'TAIL_MARKING_MISSING_TUFT': 'Tail Marking Missing Tuft', 'NOSE_COLOUR_BLACK': 'Nose Color Black', 'NOSE_COLOUR_PATCHY': 'Nose Color Patchy', 'NOSE_COLOUR_PINK': 'Nose Color Pink',
  'NOSE_COLOUR_SPOTTED': 'Nose Color Spotted', 'SCARS_BODY_LEFT': 'Scars Body Left', 'SCARS_BODY_RIGHT': 'Scars Body Right', 'SCARS_FACE': 'Scars Face', 'SCARS_TAIL': 'Scars Tail'};

  var tool_title =  "Eye Damage: Left, Right or Both; Broken Teeth: Canine Left/Right and Incisor Left/Right; \n"; +
    "Ear Marking: Left, Right, or Both; Mounth Marking: Back, Front, Left and Right; \n" +
    "Tail Marking: Missing Tuft; Nose Color: Black, Patchy, Pink, or Spotted; Scars: Body Left/Right, Face and Tail";

  $scope.title_tooltip = {'title': 'tips: ' + tool_title, 'checked': true};

  var get_features = function (tag_labels, TAGS){
    var label = "";
    TAGS.forEach(function (elem, i){
      label += tag_labels[elem];
      if(i<TAGS.length-1) label += ', ';
    });
    return label;
  }

  $scope.lions = _.map(lions, function(element, index) {

    element.canShow = ($scope.user.admin || $scope.user.organization_id == element.organization_id);

    var elem = {};
    var TAGS = [];
    if(!element.gender) element.gender = 'unknown';
    if(element['tags']==undefined)element['tags']="[]";
    try{ TAGS = JSON.parse(element['tags']);
    }catch(e){ TAGS = element['tags'].split(","); }
    if(TAGS==null) TAGS = [];

    var tag_features = get_features(tag_labels, TAGS);
    elem['features_tooltip'] = {'title': tag_features, 'checked': true};
    elem['features'] = (tag_features.length > 0) ? true : false;
    elem['tag_features'] = tag_features;
    elem['need_verifiy_tooltip'] = {'title': 'There are Image sets pending of verification', 'checked': true};
    return _.extend({}, element, elem);
  });

  console.log(lions.length);

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
  $scope.collapse_organization = function(){
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
    $scope.organizations = $scope.filters.hasOwnProperty('organizations') ? $scope.filters.name_or_id : default_filters.organizations;
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
