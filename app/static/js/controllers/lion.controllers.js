'use strict';

angular.module('lion.guardians.lions.controllers', [])

.controller('LionCtrl', ['$scope', '$stateParams', 'LincServices', function ($scope, $stateParams, LincServices) {

  $scope.id = $stateParams.id;

  var labels = function (damages, labels){
    var label = "";
    labels.forEach(function (elem, i){
      label += damages[elem];
      if(i<labels.length-1)
      label += ', ';
    });
    return label;
  }

  var eye_damages    = {'EYE_DAMAGE_BOTH': 'Both', 'EYE_DAMAGE_LEFT': 'Left',
                        'EYE_DAMAGE_RIGHT': 'Right'};
  var broken_teeths  = {'TEETH_BROKEN_CANINE_LEFT': 'Canine Left',
                        'TEETH_BROKEN_CANINE_RIGHT': 'Canine Right',
                        'TEETH_BROKEN_INCISOR_LEFT': 'Incisor Left',
                        'TEETH_BROKEN_INCISOR_RIGHT': 'Incisor Right'};
  var ear_markings   = {'EAR_MARKING_BOTH': 'Both',
                        'EAR_MARKING_LEFT': 'Left',
                        'EAR_MARKING_RIGHT': 'Right'};
  var mount_markings = {'MOUTH_MARKING_BACK': 'Back',
                        'MOUTH_MARKING_FRONT': 'Front',
                        'MOUTH_MARKING_LEFT': 'Left',
                        'MOUTH_MARKING_RIGHT': 'Right'};
  var tail_markings  = {'TAIL_MARKING_MISSING_TUFT': 'Missing Tuft'};
  var nose_color     = {'NOSE_COLOUR_BLACK': 'Black',
                        'NOSE_COLOUR_PATCHY': 'Patchy',
                        'NOSE_COLOUR_PINK': 'Pynk',
                        'NOSE_COLOUR_SPOTTED': 'Spotted'};
  var scars          = {'SCARS_BODY_LEFT': 'Body Left',
                        'SCARS_BODY_RIGHT': 'Body Right',
                        'SCARS_FACE': 'Face', 'SCARS_TAIL': 'Tail'};

  LincServices.Lion($scope.id,function(data){

    $scope.lion =  data;
    //_.find(data['lions'], {id: $scope.id});

    var TAGS = JSON.parse(data.tags);

    $scope.lion.eye_damage = labels(eye_damages,_.intersection(TAGS,
      ['EYE_DAMAGE_BOTH', 'EYE_DAMAGE_LEFT', 'EYE_DAMAGE_RIGHT']));
    $scope.lion.broken_teet = labels(broken_teeths,_.intersection(TAGS,
      ['TEETH_BROKEN_CANINE_LEFT', 'TEETH_BROKEN_CANINE_RIGHT',
       'TEETH_BROKEN_INCISOR_LEFT', 'TEETH_BROKEN_INCISOR_RIGHT']));
    $scope.lion.ear_markings = labels(ear_markings,_.intersection(TAGS,
      ['EAR_MARKING_BOTH', 'EAR_MARKING_LEFT', 'EAR_MARKING_RIGHT']));
    $scope.lion.mount_markings =labels(mount_markings, _.intersection(TAGS,
      ['MOUTH_MARKING_BACK', 'MOUTH_MARKING_FRONT',
       'MOUTH_MARKING_LEFT', 'MOUTH_MARKING_RIGHT']));
    $scope.lion.tail_markings = labels(tail_markings,_.intersection(TAGS,
      ['TAIL_MARKING_MISSING_TUFT']));
    $scope.lion.nose_color = labels(nose_color,_.intersection(TAGS,
      ['NOSE_COLOUR_BLACK', 'NOSE_COLOUR_PATCHY',
       'NOSE_COLOUR_PINK', 'NOSE_COLOUR_SPOTTED']));
    $scope.lion.scars = labels(scars,_.intersection(TAGS,
      ['SCARS_BODY_LEFT', 'SCARS_BODY_RIGHT', 'SCARS_FACE']));

    // Metadata Options
    $scope.metadata_options = { type: 'lion', edit: 'edit', data: $scope.lion};
    // Image Gallery
    $scope.gallery_options = { type: 'lion', edit: 'edit', id: $scope.lion.id};
    // Location History
    $scope.locationHistory = {};
  });
}])

.controller('SearchLionCtrl', ['$scope', 'LincServices', function ($scope, LincServices) {
  // Hide Filters
  $scope.isCollapsed = true;
  // Filters  scopes
  $scope.LionAge = { min: 0, max: 30, ceil: 30, floor: 0 };
  $scope.name_or_id ='';
  // Order by
  $scope.reverse = true;
  $scope.predicate = 'id';
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };
  // Pagination scopes
  $scope.itemsPerPage = 10;
  $scope.currentPage = 0;
  $scope.setPage = function(n) {
    $scope.currentPage = n;
  };
  $scope.prevPage = function() {
    if ($scope.currentPage > 0)
      $scope.currentPage--;
  };
  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()-1)
      $scope.currentPage++;
  };
  $scope.firstPage = function() {
    $scope.currentPage = 0;
  };
  $scope.lastPage = function() {
    if ($scope.currentPage < $scope.pageCount()-1)
      $scope.currentPage = $scope.pageCount()-1;
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
    if($scope.filtered_lions){
      label = ($scope.filtered_lions.length).toString() + " lions found - " +
              ($scope.currentPage*$scope.itemsPerPage+1).toString() + " to " +
              (Math.min((($scope.currentPage+1)*$scope.itemsPerPage),$scope.filtered_lions.length)).toString();
    }
    return label;
  }

  LincServices.getlists(['lions','organizations'],function(data){
    $scope.organizations = _.map(data['organizations'], function(element) {
      return _.extend({}, element, {checked: true});
    });
    $scope.lions = data['lions'];
  });

}]);
