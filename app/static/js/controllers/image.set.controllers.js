'use strict';

angular.module('lion.guardians.image.set.controllers', [])

.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return _.slice(input, start);
  };
})

.controller('NewImageSetCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {

}])

.controller('SearchImageSetCtrl', ['$scope', '$modal', '$window', 'LincServices', function ($scope, $modal, $window, LincServices) {
    // Hide Filters
    $scope.isCollapsed = true;
    // Filters  scopes
    $scope.LionAge = { min: 1, max: 25, ceil: 30, floor: 0 };
    $scope.name_or_id ='';
    // Order by
    $scope.sorting = "name";
    $scope.sortReverse = false;
    // Age Filter
    $scope.byAgeFilter = function(val) {
        var filter = (val.age >= $scope.LionAge.min && val.age <= $scope.LionAge.max);
        return (filter);
    };
    // Filter by Name OR Id
    $scope.byName_or_Id = function(val) {
        if(!$scope.name_or_id.length)
            return true;
        var filter = (val.name.indexOf($scope.name_or_id) !== -1) || (val.id.toString().indexOf($scope.name_or_id) !== -1);
        return (filter);
    };

    LincServices.getOrganizationsList()
    .success(function (list) {
      $scope.organizations = list.data;
      $scope.organizations.forEach(function (element, index, array) {
        element["checked"] = true;
      });
      // Filter by Organization
      $scope.byOrganization = function(val) {
        var filter = _.result(_.find($scope.organizations, {'name': val.organization}), 'checked');
        return filter;
      };
    })
    .error(function (error) {
      $scope.status = 'Unable to load organizations data: ' + error.message;
    });

    // Pagination scopes
    $scope.itemsPerPage = 10;
    $scope.currentPage = 0;

    LincServices.getImageSetList()
    .success(function (list) {
      $scope.imagesets = list.data;
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


    })
    .error(function (error) {
        $scope.status = 'Unable to load image set data: ' + error.message;
    });

}]);

/*
$scope.organizations = [{ 'name': 'Lion Guardians', 'checked': true},
                            {'name': 'Mara Lion Project', 'checked': true},
                            {'name': 'Lion Guardians 1', 'checked': true}
                          ];
//ng-init="lions=[{hasResults:true},{pending:true},{primary:true, verified:true}]"
$scope.imagesets = [{ id: 0, name: 'leão 1', age: 13, url_small: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2014-04-01T23:28:56.782Z"},
                    { id: 1, name: 'leão 2', age: 14, url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: false, selected: false, created: "2014-01-01T23:28:56.782Z"},
                   { id: 2, name: 'leão 3', age: 15, url_small: "/static/images/square-small/lion3.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: false, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2014-12-01T23:28:56.782Z"},
                   { id: 3, name: 'leão 4', age: 8, url_small: "/static/images/square-small/lion4.jpg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2014-03-01T23:28:56.782Z" },
                   { id: 4, name: 'leão 5', age: 8, url_small: "/static/images/square-small/lion5.jpg", gender: 'male', organization: 'Mara Lion Project', cvresults: true, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2015-01-01T23:28:56.782Z" },
                   { id: 5, name: 'leão 6', age: 9, url_small: "/static/images/square-small/lion6.jpeg", gender: 'male', organization: 'Mara Lion Project', cvresults: false, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2014-11-11T23:28:56.782Z" },
                   { id: 6, name: 'leão 7', age: 6, url_small: "/static/images/square-small/lion7.jpeg", gender: 'male', organization: 'Lion Guardians 1', cvresults: false, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2014-04-04T23:28:56.782Z" },
                   { id: 7, name: 'leão 8', age: 2, url_small: "/static/images/square-small/lion8.jpeg", gender: 'female', organization: 'Lion Guardians 1', cvresults: true, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2013-01-01T23:28:56.782Z" },
                  { id: 8, name: 'leão 9', age: 7, url_small: "/static/images/square-small/lion9.jpg", gender: 'female', organization: 'Mara Lion Project', cvresults: false, cvrequest: false, is_primary: false, is_verified: true, selected: false, created: "2013-11-01T23:28:56.782Z" },
                 { id: 9, name: 'leão 10', age: 10, url_small: "/static/images/square-small/lion10.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2014-06-01T23:28:56.782Z" },
                 { id: 10, name: 'leão 2', age: 14, url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: false, selected: false, created: "2014-02-01T23:28:56.782Z"},
                 { id: 11, name: 'leão 2', age: 14, url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: false, selected: false, created: "2014-02-01T23:28:56.782Z"},
                 { id: 12, name: 'leão 3', age: 15, url_small: "/static/images/square-small/lion3.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: false, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2014-10-01T23:28:56.782Z"},
                 { id: 13, name: 'leão 4', age: 8, url_small: "/static/images/square-small/lion4.jpg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2014-05-01T23:28:56.782Z" },
                 { id: 14, name: 'leão 5', age: 8, url_small: "/static/images/square-small/lion5.jpg", gender: 'male', organization: 'Mara Lion Project', cvresults: true, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2014-06-01T23:28:56.782Z" },
                 { id: 15, name: 'leão 6', age: 9, url_small: "/static/images/square-small/lion6.jpeg", gender: 'male', organization: 'Mara Lion Project', cvresults: false, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2014-11-21T23:28:56.782Z" },
                 { id: 16, name: 'leão 7', age: 6, url_small: "/static/images/square-small/lion7.jpeg", gender: 'male', organization: 'Lion Guardians 1', cvresults: false, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2014-01-14T23:28:56.782Z" },
                 { id: 17, name: 'leão 8', age: 2, url_small: "/static/images/square-small/lion8.jpeg", gender: 'female', organization: 'Lion Guardians 1', cvresults: true, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2013-02-05T23:28:56.782Z" },
                 { id: 18, name: 'leão 9', age: 7, url_small: "/static/images/square-small/lion9.jpg", gender: 'female', organization: 'Mara Lion Project', cvresults: false, cvrequest: false, is_primary: false, is_verified: true, selected: false, created: "2013-11-04T23:28:56.782Z" },
                 { id: 19, name: 'leão 10', age: 10, url_small: "/static/images/square-small/lion10.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2014-08-11T23:28:56.782Z" },
                 { id: 20, name: 'leão 2', age: 14, url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: false, selected: false, created: "2011-02-01T23:28:56.782Z"},
                 { id: 21, name: 'leão 2', age: 14, url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: false, selected: false, created: "2011-02-01T23:28:56.782Z"},
                 { id: 22, name: 'leão 3', age: 15, url_small: "/static/images/square-small/lion3.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: false, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2012-10-01T23:28:56.782Z"},
                 { id: 23, name: 'leão 4', age: 8, url_small: "/static/images/square-small/lion4.jpg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2012-05-01T23:28:56.782Z" },
                 { id: 24, name: 'leão 5', age: 8, url_small: "/static/images/square-small/lion5.jpg", gender: 'male', organization: 'Mara Lion Project', cvresults: true, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2011-06-01T23:28:56.782Z" },
                 { id: 25, name: 'leão 6', age: 9, url_small: "/static/images/square-small/lion6.jpeg", gender: 'male', organization: 'Mara Lion Project', cvresults: false, cvrequest: false, is_primary: true, is_verified: true, selected: false, created: "2011-11-21T23:28:56.782Z" },
                 { id: 26, name: 'leão 7', age: 6, url_small: "/static/images/square-small/lion7.jpeg", gender: 'male', organization: 'Lion Guardians 1', cvresults: false, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2011-01-14T23:28:56.782Z" },
                 { id: 27, name: 'leão 8', age: 2, url_small: "/static/images/square-small/lion8.jpeg", gender: 'female', organization: 'Lion Guardians 1', cvresults: true, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2010-02-05T23:28:56.782Z" },
                 { id: 28, name: 'leão 9', age: 7, url_small: "/static/images/square-small/lion9.jpg", gender: 'female', organization: 'Mara Lion Project', cvresults: false, cvrequest: false, is_primary: false, is_verified: true, selected: false, created: "2010-11-04T23:28:56.782Z" },
                 { id: 29, name: 'leão 10', age: 10, url_small: "/static/images/square-small/lion10.jpeg", gender: 'male', organization: 'Lion Guardians', cvresults: true, cvrequest: true, is_primary: true, is_verified: true, selected: false, created: "2011-08-11T23:28:56.782Z" }];
*/
