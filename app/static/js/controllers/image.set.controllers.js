'use strict';

angular.module('lion.guardians.image.set.controllers', [])

.controller('ImageSetCtrl', ['$scope', '$window', '$stateParams', 'NotificationFactory', function ($scope, $window, $stateParams, NotificationFactory) {

  $scope.id = $stateParams.id;
  /*LincServices.GetImageSet($scope.id,function(data){
    $scope.imageset = data;
    $scope.options = { type: 'imagesets'}, edit: 'edit', data: $scope.data};
  });*/

  $scope.imageset = { id: 1, name: 'leão 1', age: 13, thumbnail: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false};
  $scope.options = { type: 'imagesets', edit: 'edit', data: $scope.data};

}])

.controller('SearchImageSetCtrl', ['$scope', '$window', '$timeout', '$interval', 'LincServices', function ($scope, $window, $timeout, $interval, LincServices) {
  // Hide Filters
  $scope.isCollapsed = true;
  // Filters  scopes
  $scope.LionAge = { min: 0, max: 30, ceil: 30, floor: 0 };
  $scope.name_or_id ='';
  // Order by
  $scope.reverse = true;
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

  var requestCVResults = function (index, ReqObjid){
    LincServices.requestCVResults(ReqObjid, function(result){
      var cvresult = result.data.data;
      // created_at: "2015...."; cvrequest_id: 90; id: 29; match_probability []; obj_id: num; update_at
      $scope.imagesets[index].action = 'cvresults';
      $scope.imagesets[index].cvresults = cvresult.obj_id;
      console.log('Success Results CV');
      $interval.cancel($scope.requesCVpromise);
        $scope.requesCVpromise = undefined;
    });
  }
  $scope.CVReqSuccess = function (imageset_Id, requestObj) {
      var index = _.indexOf($scope.imagesets, _.find($scope.imagesets, {id: imageset_Id}));
      $scope.imagesets[index].action = 'cvpending';
      $scope.imagesets[index].cvrequest = requestObj.obj_id;
      console.log('Success CV Request');
      $timeout(function() {
        $scope.requesCVpromise = $interval(requestCVResults(index, requestObj.id), 5000);
      }, 10000);
  };
}]);
