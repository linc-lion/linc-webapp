'use strict';

angular.module('lion.guardians.image.set.controllers', [])

.controller('ImageSetCtrl', ['$scope', '$timeout', '$interval', 'NotificationFactory', 'LincServices', 'organizations', 'imageset', function ($scope, $timeout, $interval, NotificationFactory, LincServices, organizations, imageset) {

  $scope.imageset = imageset;

  var labels = function (damages, labels){
    var label = "";
    labels.forEach(function (elem, i){
      label += damages[elem];
      if(i<labels.length-1) label += ', ';
    });
    return label;
  }

  var eye_damages    = {'EYE_DAMAGE_BOTH': 'Both', 'EYE_DAMAGE_LEFT': 'Left', 'EYE_DAMAGE_RIGHT': 'Right'};
  var broken_teeths  = {'TEETH_BROKEN_CANINE_LEFT': 'Canine Left', 'TEETH_BROKEN_CANINE_RIGHT': 'Canine Right', 'TEETH_BROKEN_INCISOR_LEFT': 'Incisor Left', 'TEETH_BROKEN_INCISOR_RIGHT': 'Incisor Right'};
  var ear_markings   = {'EAR_MARKING_BOTH': 'Both', 'EAR_MARKING_LEFT': 'Left', 'EAR_MARKING_RIGHT': 'Right'};
  var mount_markings = {'MOUTH_MARKING_BACK': 'Back', 'MOUTH_MARKING_FRONT': 'Front', 'MOUTH_MARKING_LEFT': 'Left', 'MOUTH_MARKING_RIGHT': 'Right'};
  var tail_markings  = {'TAIL_MARKING_MISSING_TUFT': 'Missing Tuft'};
  var nose_color     = {'NOSE_COLOUR_BLACK': 'Black', 'NOSE_COLOUR_PATCHY': 'Patchy', 'NOSE_COLOUR_PINK': 'Pynk', 'NOSE_COLOUR_SPOTTED': 'Spotted'};
  var scars          = {'SCARS_BODY_LEFT': 'Body Left', 'SCARS_BODY_RIGHT': 'Body Right', 'SCARS_FACE': 'Face', 'SCARS_TAIL': 'Tail'};

  var Set_Tags = function(){
    if($scope.imageset.cvresults) $scope.imageset["action"] = 'cvresults';
    else if($scope.imageset.cvrequest) $scope.imageset["action"] = 'cvpending';
    else $scope.imageset["action"] = 'cvrequest';

    var TAGS = [];
    try{
      TAGS = JSON.parse($scope.imageset.tags);
    }catch(e){
      TAGS = $scope.imageset.tags.split(",");
    }
    $scope.imageset.eye_damage = labels(eye_damages,_.intersection(TAGS, ['EYE_DAMAGE_BOTH', 'EYE_DAMAGE_LEFT', 'EYE_DAMAGE_RIGHT']));
    $scope.imageset.broken_teet = labels(broken_teeths,_.intersection(TAGS, ['TEETH_BROKEN_CANINE_LEFT', 'TEETH_BROKEN_CANINE_RIGHT', 'TEETH_BROKEN_INCISOR_LEFT', 'TEETH_BROKEN_INCISOR_RIGHT']));
    $scope.imageset.ear_markings = labels(ear_markings,_.intersection(TAGS, ['EAR_MARKING_BOTH', 'EAR_MARKING_LEFT', 'EAR_MARKING_RIGHT']));
    $scope.imageset.mount_markings =labels(mount_markings, _.intersection(TAGS, ['MOUTH_MARKING_BACK', 'MOUTH_MARKING_FRONT', 'MOUTH_MARKING_LEFT', 'MOUTH_MARKING_RIGHT']));
    $scope.imageset.tail_markings = labels(tail_markings,_.intersection(TAGS, ['TAIL_MARKING_MISSING_TUFT']));
    $scope.imageset.nose_color = labels(nose_color,_.intersection(TAGS, ['NOSE_COLOUR_BLACK', 'NOSE_COLOUR_PATCHY', 'NOSE_COLOUR_PINK', 'NOSE_COLOUR_SPOTTED']));
    $scope.imageset.scars = labels(scars,_.intersection(TAGS, ['SCARS_BODY_LEFT', 'SCARS_BODY_RIGHT', 'SCARS_FACE']));
  };
  Set_Tags();
  // Metadata Options
  $scope.metadata_options = { type: 'imageset', edit: 'edit', data: $scope.imageset};
  // Updated in Metadata
  $scope.update_imageset = function (data){
    _.merge($scope.imageset, $scope.imageset, data);
    $scope.imageset.organization = _.find(organizations, {'id': $scope.imageset.owner_organization_id}).name;
    Set_Tags();
  }
  // Image Gallery
  $scope.gallery_options = { type: 'imageset', edit: 'edit', id: $scope.imageset.id};
  // Location History
  var label = 'Image Set ' + $scope.imageset.id;
  var date = (new Date($scope.imageset.updated_at)).toLocaleDateString();
  $scope.location_options = { type: 'imageset', history: { count: 1,
                 locations: [{'id': $scope.imageset.id, 'label': label, 'updated_at': date, 'longitude': $scope.imageset.longitude, 'latitude': $scope.imageset.latitude }]}
  };

  $scope.location_goto = function (imageset_id){
    //
  }
  $scope.Delete = function (){

  }
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

  $scope.Change_results = function (change, ImagesetId) {
    $scope.imageset["action"] = 'cvrequest';
    LincServices.ClearAllImagesetsCaches();
    LincServices.ClearImagesetProfileCache(ImagesetId);
  }
}])

.controller('SearchImageSetCtrl', ['$scope', '$timeout', '$interval', 'NotificationFactory','LincServices', 'organizations', 'imagesets', function ($scope, $timeout, $interval, NotificationFactory, LincServices, organizations, imagesets) {

  $scope.organizations =  _.map(organizations, function(element) {
    return _.extend({}, element, {checked: true});
  });
  $scope.imagesets = _.map(imagesets, function(element, index) {
    var elem = {};
    if(element.cvresults) elem["action"] = 'cvresults';
    else if(element.cvrequest) elem["action"] = 'cvpending';
    else  elem["action"] = 'cvrequest';
    return _.extend({}, element, elem);
  });


  // Hide Filters
  $scope.isCollapsed = true;
  // Filters  scopes
  $scope.LionAge = { min: 0, max: 30, ceil: 30, floor: 0 };
  $scope.name_or_id ='';
  // Order by
  $scope.reverse = false;
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
  $scope.Change_results = function (change, ImagesetId) {
    var index = _.indexOf($scope.imagesets, _.find($scope.imagesets, {id: ImagesetId}));
    $scope.imagesets[index]["action"] = 'cvrequest';
    LincServices.ClearAllImagesetsCaches();
    LincServices.ClearImagesetProfileCache(ImagesetId);
  }
}]);
