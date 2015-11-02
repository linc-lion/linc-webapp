'use strict';

angular.module('lion.guardians.image.set.controllers', [])

.controller('ImageSetCtrl', ['$scope', '$window', 'notificationFactory', function ($scope, $window, notificationFactory) {

$scope.modalOptions = { btn: {save:true, update:false}, title:'Image Set Metadata'};

}])

.controller('SearchImageSetCtrl', ['$scope', '$window', 'LincServices', function ($scope, $window, LincServices) {
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

  $scope.CVReqSuccess = function (imageset_Id, requestObjId) {
      var index = _.indexOf($scope.imagesets, _.find($scope.imagesets, {id: imageset_Id}));
      $scope.imagesets[index].action = 'cvpending';
      $scope.imagesets[index].cvrequest = requestObjId;
  };
}]);
