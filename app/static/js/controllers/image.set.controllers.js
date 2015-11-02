'use strict';

angular.module('lion.guardians.image.set.controllers', [])

.controller('ImageSetCtrl', ['$scope', '$uibModal', '$window', 'notificationFactory', function ($scope, $mouibModaldal, $window, notificationFactory) {

$scope.modalOptions = { btn: {save:true, update:false}, title:'Image Set Metadata'};

}])

.controller('SearchImageSetCtrl', ['$scope', '$uibModal', '$window', 'LincServices', function ($scope, $uibModal, $window, LincServices) {
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
      //if(index == 52 || index == 55 || index == 59) element["cvresults"] = true;
      //if(index == 53 || index == 54 || index == 58) element.cvrequest = "request";
      if(element.cvresults) elem["action"] = 'cvresults';
      else if(element.cvrequest) elem["action"] = 'cvpending';
      else  elem["action"] = 'cvrequest';
      return _.extend({}, element, elem);
    });
  });

  $scope.showCVRequest = function(imageset_id){
    var opts = { animation: true, backdrop: true,
      templateUrl: 'cvrequest', controller: 'CVRequesCtrl', size: "lg",
      resolve: {
        imagesetId: function () {
          return imageset_id;
        }
      }
    }
    $uibModal.open(opts).result.then(function (cvrequest) {
      var index = _.indexOf($scope.imagesets, _.find($scope.imagesets, {id: imageset_id}));
      $scope.imagesets[index].action = 'cvpending';
      $scope.imagesets[index].cvrequest = cvrequest.obj_id;
        console.log('Modal ok ' + cvrequest.obj_id);
    }, function () {
        console.log('Modal dismissed at: ' + new Date());
    });
  };
}]);
