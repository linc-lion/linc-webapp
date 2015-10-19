'use strict';

angular.module('lion.guardians.image.set.controllers', [])

.controller('NewImageSetCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {
   // Image Gallery
    var $ParentScope = $scope;
    //ng-init="lions=[{hasResults:true},{pending:true},{primary:true, verified:true}]"
    $scope.lions = [{ id: 1, name: 'leão 1', age: 13, url_small: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false},
                           { id: 2, name: 'leão 2', age: 14, url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: false, selected: false},
                           { id: 3, name: 'leão 3', age: 15, url_small: "/static/images/square-small/lion3.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false},
                           { id: 4, name: 'leão 4', age: 8, url_small: "/static/images/square-small/lion4.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 5, name: 'leão 5', age: 8, url_small: "/static/images/square-small/lion5.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false },
                           { id: 6, name: 'leão 6', age: 9, url_small: "/static/images/square-small/lion6.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false },
                           { id: 7, name: 'leão 7', age: 6, url_small: "/static/images/square-small/lion7.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: true, primary: true, verified: true, selected: false },
                           { id: 8, name: 'leão 8', age: 2, url_small: "/static/images/square-small/lion8.jpeg", gender: 'female', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 9, name: 'leão 9', age: 7, url_small: "/static/images/square-small/lion9.jpg", gender: 'female', organization: 'Lion Guardians', hasResults: false, pending: false, primary: false, verified: true, selected: false },
                           { id: 10, name: 'leão 10', age: 10, url_small: "/static/images/square-small/lion10.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false }];

    var ImageGalleryCtrl = function ($scope) {
        $scope.title = 'Image Gallery';
        $scope.content = 'Image Galleryl<br />Contents!';
        $scope.hideModal = function ($hide) {
            ImageGalleryModal.$promise.then($hide);
            $window.history.back();
        };
        $scope.photos = [{ id: 1, name: 'leão 1', age: 13, url: "/static/images/medium/lion1.jpg" },
                                  { id: 2, name: 'leão 2', age: 12, url: "/static/images/medium/lion2.jpeg" },
                                  { id: 3, name: 'leão 3', age: 14, url: "/static/images/medium/lion3.jpeg" },
                                  { id: 4, name: 'leão 4', age: 15, url: "/static/images/medium/lion4.jpg" },
                                  { id: 5, name: 'leão 5', age: 8, url: "/static/images/medium/lion5.jpg" },
                                  { id: 6, name: 'leão 6', age: 9, url: "/static/images/medium/lion6.jpeg" },
                                  { id: 7, name: 'leão 7', age: 6, url: "/static/images/medium/lion7.jpeg" },
                                  { id: 8, name: 'leão 8', age: 2, url: "/static/images/medium/lion8.jpeg" },
                                  { id: 9, name: 'leão 9', age: 7, url: "/static/images/medium/lion9.jpg" },
                                  { id: 10, name: 'leão 10', age: 10, url: "/static/images/medium/lion10.jpeg" }];
        $scope.show_photo = function(url){
            var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
            win.focus();
        }
    }
    ImageGalleryCtrl.$inject = ['$scope'];
    var ImageGalleryModal = $modal({controller: ImageGalleryCtrl, templateUrl: 'imagegallery', show: false});

    $scope.showImageGallery = function () {
        ImageGalleryModal.$promise.then(ImageGalleryModal.show);
    };

    //Map
    var MapCtrl = function ($scope) {
        $scope.title = 'Location History';
        $scope.content = 'Map';
        $scope.hideModal = function ($hide) {
            MapModal.$promise.then($hide);
            $window.history.back();
        };
        // Set Map
        /*$scope.center = {-22.891054,-47.094948};
        $scope.zoom = 14;
        $scope.mapTypeId = google.maps.MapTypeId.SATELLITE;
        // Map
        $scope.map = { center: $scope.center, zoom: $scope.zoom, options: { mapTypeId: $scope.mapTypeId } };
        $scope.icon = new google.maps.MarkerImage("/static/icons/lion_icon-98x72.png", null, null, null, new google.maps.Size(32,24));
        */
    };
    MapCtrl.$inject = ['$scope'];
    var MapModal = $modal({controller: MapCtrl, templateUrl: 'map', show: false});

    $scope.showMap = function () {
        MapModal.$promise.then(MapModal.show);
    };

    // MetaData
    var MetadataCtrl = function ($scope) {
        $scope.title = 'Metadata';
        $scope.content = 'Form';
        $scope.hideModal = function ($hide) {
            MetadataModal.$promise.then($hide);
            $window.history.back();
        };
        $scope.Cancel = function ($hide) {
            MetadataModal.$promise.then($hide);
        $window.history.back();
        };
        $scope.Save = function ($hide) {
            MetadataModal.$promise.then($hide);
            $window.history.back();
        };
    };
    MetadataCtrl.$inject = ['$scope'];
    var MetadataModal = $modal({controller: MetadataCtrl, templateUrl: 'metadata', show: false});

    $scope.showMetadata = function (){
        MetadataModal.$promise.then(MetadataModal.show);
    };

     // CV Results
    var CVResultsCtrl = function ($scope) {
        $scope.lions = $ParentScope.lions;
        $scope.title = 'CV Results';
        $scope.content = 'Form';
        /*$scope.hideModal = function ($hide) {
            CVResultsModal.$promise.then($hide);
            //$window.history.back();
        };*/
        //ng-init="lions=[{hasResults:true},{pending:true},{ verified:true}]">
        $scope.lions_filter = function() {
            var filter = {hasResults: true, pending: true, verified: true}
            return (filter);
        };
    }
    CVResultsCtrl.$inject = ['$scope'];
    var CVResultsModal = $modal({controller: CVResultsCtrl, templateUrl: 'cvresults', show: false});

    $scope.showCVResults = function () {
        CVResultsModal.$promise.then(CVResultsModal.show);
    };

}])

.controller('SearchImageSetCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {

    $scope.imageSetRange = { min: 1, max: 10, ceil: 20, floor: 0 };
    $scope.isCollapsed = true;
    var $ParentScope = $scope;

    //ng-init="lions=[{hasResults:true},{pending:true},{primary:true, verified:true}]"
    $scope.lions = [{ id: 1, name: 'leão 1', age: 13, url_small: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false},
                           { id: 2, name: 'leão 2', age: 14, url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: false, selected: false},
                           { id: 3, name: 'leão 3', age: 15, url_small: "/static/images/square-small/lion3.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false},
                           { id: 4, name: 'leão 4', age: 8, url_small: "/static/images/square-small/lion4.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 5, name: 'leão 5', age: 8, url_small: "/static/images/square-small/lion5.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false },
                           { id: 6, name: 'leão 6', age: 9, url_small: "/static/images/square-small/lion6.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false },
                           { id: 7, name: 'leão 7', age: 6, url_small: "/static/images/square-small/lion7.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: true, primary: true, verified: true, selected: false },
                           { id: 8, name: 'leão 8', age: 2, url_small: "/static/images/square-small/lion8.jpeg", gender: 'female', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 9, name: 'leão 9', age: 7, url_small: "/static/images/square-small/lion9.jpg", gender: 'female', organization: 'Lion Guardians', hasResults: false, pending: false, primary: false, verified: true, selected: false },
                           { id: 10, name: 'leão 10', age: 10, url_small: "/static/images/square-small/lion10.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false }];
    // CV Results
    var CVResultsCtrl = function ($scope) {
        $scope.lions = $ParentScope.lions;
        $scope.title = 'CV Results';
        $scope.content = 'Form';
        /*$scope.hideModal = function ($hide) {
            CVResultsModal.$promise.then($hide);
            //$window.history.back();
        };*/
        //ng-init="lions=[{hasResults:true},{pending:true},{ verified:true}]">
        $scope.lions_filter = function() {
            var filter = {hasResults: true, pending: true, verified: true}
            return (filter);
        };
    }
    CVResultsCtrl.$inject = ['$scope'];
    var CVResultsModal = $modal({controller: CVResultsCtrl, templateUrl: 'cvresults', show: false});

    $scope.showCVResults = function () {
        CVResultsModal.$promise.then(CVResultsModal.show);
    };

    // CV Refine
    var CVRefineCtrl = function ($scope) {
        $scope.lions = $ParentScope.lions;
        $scope.title = 'Lion Search';
        $scope.content = 'Search';
        /*$scope.hideModal = function ($hide) {
            CVRefineModal.$promise.then($hide);
            $window.history.back();
        };*/
        //ng-init="lions=[{hasResults:true},{pending:true},{ verified:true}]">
         $scope.lions_filter = function() {
            var filter = {hasResults: true, pending: true, verified: true}
            return (filter);
        };
    }
    CVRefineCtrl.$inject = ['$scope'];
    var CVRefineModal = $modal({controller: CVRefineCtrl, templateUrl: 'cvrefine', show: false});

    $scope.showCVRefine = function () {
        CVRefineModal.$promise.then(CVRefineModal.show);
    };

}]);
