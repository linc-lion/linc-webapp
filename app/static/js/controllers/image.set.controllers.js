'use strict';

angular.module('lion.guardians.image.set.controllers', [])

.controller('ImageSetCtrl', ['$scope', '$stateParams', '$timeout', '$interval', 'NotificationFactory', 'LincServices', function ($scope, $stateParams, $timeout, $interval, NotificationFactory, LincServices) {

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

  LincServices.getlists(['imagesets'],function(data){

    $scope.imageset = _.find(data['imagesets'], {id: $scope.id});
    if($scope.imageset.cvresults) $scope.imageset["action"] = 'cvresults';
    else if($scope.imageset.cvrequest) $scope.imageset["action"] = 'cvpending';
    else $scope.imageset["action"] = 'cvrequest';

    var TAGS = ['EYE_DAMAGE_BOTH','TEETH_BROKEN_CANINE_LEFT','TEETH_BROKEN_INCISOR_LEFT',
                'EAR_MARKING_RIGHT', 'MOUTH_MARKING_BACK', 'MOUTH_MARKING_FRONT',
                'NOSE_COLOUR_BLACK', 'SCARS_FACE'];

    $scope.imageset.eye_damage = labels(eye_damages,_.intersection(TAGS,
      ['EYE_DAMAGE_BOTH', 'EYE_DAMAGE_LEFT', 'EYE_DAMAGE_RIGHT']));
    $scope.imageset.broken_teet = labels(broken_teeths,_.intersection(TAGS,
      ['TEETH_BROKEN_CANINE_LEFT', 'TEETH_BROKEN_CANINE_RIGHT',
       'TEETH_BROKEN_INCISOR_LEFT', 'TEETH_BROKEN_INCISOR_RIGHT']));
    $scope.imageset.ear_markings = labels(ear_markings,_.intersection(TAGS,
      ['EAR_MARKING_BOTH', 'EAR_MARKING_LEFT', 'EAR_MARKING_RIGHT']));
    $scope.imageset.mount_markings =labels(mount_markings, _.intersection(TAGS,
      ['MOUTH_MARKING_BACK', 'MOUTH_MARKING_FRONT',
       'MOUTH_MARKING_LEFT', 'MOUTH_MARKING_RIGHT']));
    $scope.imageset.tail_markings = labels(tail_markings,_.intersection(TAGS,
      ['TAIL_MARKING_MISSING_TUFT']));
    $scope.imageset.nose_color = labels(nose_color,_.intersection(TAGS,
      ['NOSE_COLOUR_BLACK', 'NOSE_COLOUR_PATCHY',
       'NOSE_COLOUR_PINK', 'NOSE_COLOUR_SPOTTED']));
    $scope.imageset.scars = labels(scars,_.intersection(TAGS,
      ['SCARS_BODY_LEFT', 'SCARS_BODY_RIGHT', 'SCARS_FACE']));

    // Metadata Options
    $scope.options = { type: 'imagesets', edit: 'edit', data: $scope.imageset};
    // Location History
    $scope.locationHistory = {};
  });



  var requestCVResults = function (ReqObjid){
    NotificationFactory.info({
      title: "Notify", message:'Trying to get CV Results',
      position: "right", // right, left, center
      duration: 2000     // milisecond
    });
    LincServices.putCVResults(ReqObjid, function(result){
      var cvresult = result.data.data;
      if(cvresult.status == "queued"){
        $scope.imageset.action = 'cvresults';
        $scope.imageset.cvresults = cvresult.obj_id;
        cancel_intervals();
      }
      else if (cvresult.status == "error"){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Get CV Results',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
    }, function(error){
      cancel_intervals();
    });
  }
  $scope.CVReqSuccess = function (imageset_Id, requestObj) {
    $scope.imageset.action = 'cvpending';
    $scope.imageset.cvrequest = requestObj.obj_id;
    console.log('Success CV Request');
    $timeout(function() {
      LincServices.postCVResults(requestObj.id, function(result){
        var cvresult = result.data.data;
        if(cvresult.status == "finished"){
          $scope.imageset.action = 'cvresults';
          $scope.imageset.cvresults = cvresult.obj_id;
          console.log('Success Results CV');
        }
        else if (cvresult.status == "queued"){
          $scope.requesCVpromise = $interval(
            requestCVResults('PUT', requestObj.id), 60000);
        }
        else{
          NotificationFactory.error({
            title: "Error", message: 'Unable to Get CV Results',
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        }
      });
    }, 180000);
  };
}])

.controller('SearchImageSetCtrl', ['$scope', '$timeout', '$interval', 'NotificationFactory','LincServices', function ($scope, $timeout, $interval, NotificationFactory, LincServices) {
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
  $scope.itemsPerPage = 10; $scope.currentPage = 0;
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
    return Math.ceil($scope.filtered_image_sets.length/$scope.itemsPerPage);
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
    var label = "0 image sets found";
    if($scope.filtered_image_sets){
      label = ($scope.filtered_image_sets.length).toString() + " image sets found - " +
              ($scope.currentPage*$scope.itemsPerPage+1).toString() + " to " +
              (Math.min((($scope.currentPage+1)*$scope.itemsPerPage),$scope.filtered_image_sets.length)).toString();
    }
    return label;
  }

  LincServices.getlists(['imagesets','organizations'],function(data){
    $scope.organizations = _.map(data['organizations'], function(element) {
      return _.extend({}, element, {checked: true});
    });
    $scope.imagesets = _.map(data['imagesets'], function(element, index) {
      var elem = {};
      if(element.cvresults) elem["action"] = 'cvresults';
      else if(element.cvrequest) elem["action"] = 'cvpending';
      else  elem["action"] = 'cvrequest';
      return _.extend({}, element, elem);
    });
  });

  var cancel_intervals = function (){
    if($scope.requesCVpromise != null){
      $interval.cancel($scope.requesCVpromise);
      $scope.requesCVpromise = undefined;
      console.log('Interval cancel');
    }
  }

  var requestCVResults = function (index, ReqObjid){
    NotificationFactory.info({
      title: "Notify", message:'Trying to get CV Results',
      position: "right", // right, left, center
      duration: 2000     // milisecond
    });
    LincServices.putCVResults(ReqObjid, function(result){
      var cvresult = result.data.data;
      if(cvresult.status == "queued"){
        $scope.imagesets[index].action = 'cvresults';
        $scope.imagesets[index].cvresults = cvresult.obj_id;
        cancel_intervals();
      }
      else if (cvresult.status == "error"){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Get CV Results',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
    }, function(error){
      cancel_intervals();
    });
  }
  $scope.CVReqSuccess = function (imageset_Id, requestObj) {
    var index = _.indexOf($scope.imagesets, _.find($scope.imagesets, {id: imageset_Id}));
    $scope.imagesets[index].action = 'cvpending';
    $scope.imagesets[index].cvrequest = requestObj.obj_id;
    console.log('Success CV Request');
    $timeout(function() {
      LincServices.postCVResults(requestObj.id, function(result){
        var cvresult = result.data.data;
        if(cvresult.status == "finished"){
          $scope.imagesets[index].action = 'cvresults';
          $scope.imagesets[index].cvresults = cvresult.obj_id;
          console.log('Success Results CV');
        }
        else if (cvresult.status == "queued"){
          $scope.requesCVpromise = $interval(
            requestCVResults('PUT', index, requestObj.id), 60000);
        }
        else{
          NotificationFactory.error({
            title: "Error", message: 'Unable to Get CV Results',
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        }
      });
    }, 180000);
  };
}]);
