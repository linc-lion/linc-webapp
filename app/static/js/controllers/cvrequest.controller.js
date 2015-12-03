'use strict';

angular.module('lion.guardians.cvrequest.controller', ['lion.guardians.cvrequest.directive'])

.controller('CVRequesCtrl', ['$scope', '$window', '$timeout', '$uibModalInstance', 'LincServices', 'NotificationFactory', 'imagesetId', 'lions', 'lion_filters', function ($scope, $window, $timeout, $uibModalInstance, LincServices, NotificationFactory, imagesetId, lions, lion_filters) {

  $scope.title = 'CV Search';
  $scope.content = 'Search';

  var tag_labels    = {'EYE_DAMAGE_BOTH': 'Eye Damage Both', 'EYE_DAMAGE_LEFT': 'Eye Damage Left', 'EYE_DAMAGE_RIGHT': 'Eye Damage Right', 'TEETH_BROKEN_CANINE_LEFT': 'Broken Teeth Canine Left', 'TEETH_BROKEN_CANINE_RIGHT': 'Broken Teeth Canine Right', 'TEETH_BROKEN_INCISOR_LEFT': 'Broken Teeth Incisor Left', 'TEETH_BROKEN_INCISOR_RIGHT': 'Broken Teeth Incisor Right',
  'EAR_MARKING_BOTH': 'Ear Marking Both', 'EAR_MARKING_LEFT': 'Ear Marking Left', 'EAR_MARKING_RIGHT': 'Ear Marking Right',
  'MOUTH_MARKING_BACK': 'Mounth Marking Back', 'MOUTH_MARKING_FRONT': 'Mounth Marking Front', 'MOUTH_MARKING_LEFT': 'Mounth Marking Left', 'MOUTH_MARKING_RIGHT': 'Mounth Marking Right', 'TAIL_MARKING_MISSING_TUFT': 'Tail Marking Missing Tuft', 'NOSE_COLOUR_BLACK': 'Nose Color Black', 'NOSE_COLOUR_PATCHY': 'Nose Color Patchy', 'NOSE_COLOUR_PINK': 'Nose Color Pink',
  'NOSE_COLOUR_SPOTTED': 'Nose Color Spotted', 'SCARS_BODY_LEFT': 'Scars Body Left', 'SCARS_BODY_RIGHT': 'Scars Body Right', 'SCARS_FACE': 'Scars Face', 'SCARS_TAIL': 'Scars Tail'};

  var tool_title =  "Eye Damage: Left, Right or Both; Broken Teeth: Canine Left/Right and Incisor Left/Right; \n"; +
    "Ear Marking: Left, Right, or Both; Mounth Marking: Back, Front, Left and Right; \n" +
    "Tail Marking: Missing Tuft; Nose Color: Black, Patchy, Pink, or Spotted; Scars: Body Left/Right, Face and Tail";

  var get_features = function (tag_labels, TAGS){
    var label = "";
    TAGS.forEach(function (elem, i){
      label += tag_labels[elem];
      if(i<TAGS.length-1) label += ', ';
    });
    return label;
  }

  $scope.lions = _.map(lions, function(element, index) {
    var elem = {};
    var TAGS = [];
    if(!element.gender) element.gender = 'unknown';
    if(element['tags']==undefined)element['tags']="[]";
    try{ TAGS = JSON.parse(element['tags']);
    }catch(e){ TAGS = element['tags'].split(","); }
    if(TAGS==null) TAGS = [];
    elem['features'] = get_features(tag_labels, TAGS);
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
  $scope.tag_features = lion_filters.features;
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
  $scope.change_name_or_id = function(){
    lion_filters.name_or_id = $scope.name_or_id;
  }
  $scope.change_organizations = function(){
  }
  $scope.change_features = function(){
  }
  $scope.change_gender = function(){
  }
  $scope.change_age_colapsed = function(){
    $scope.isAgeCollapsed = !$scope.isAgeCollapsed
    lion_filters.isAgeCollapsed = $scope.isAgeCollapsed;
  }
  $scope.change_org_colapsed = function(){
    $scope.isOrgCollapsed = !$scope.isOrgCollapsed
    lion_filters.isOrgCollapsed = $scope.isOrgCollapsed;
  }
  $scope.change_name_id_colapsed = function(){
    $scope.isNameIdCollapsed = !$scope.isNameIdCollapsed
    lion_filters.isNameIdCollapsed = $scope.isNameIdCollapsed;
  }
  $scope.change_features_is_collapsed = function(){
    $scope.isFeaturesCollapsed = !$scope.isFeaturesCollapsed
    lion_filters.isFeaturesCollapsed = $scope.isFeaturesCollapsed;
  }
  $scope.change_gender_colapsed = function(){
    $scope.isGenderCollapsed = !$scope.isGenderCollapsed
    lion_filters.isGenderCollapsed = $scope.isGenderCollapsed;
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
    LincServices.requestCV(imagesetId, data, function(result){
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
