'use strict';

angular.module('lion.guardians.lions.controllers', [])

.controller('NewLionCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {
    // Image Gallery
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
    var MapCtrl = function ($scope, $timeout) {
        $scope.title = 'Location History';
        $scope.content = 'Map';
        $scope.hideModal = function ($hide) {
            MapModal.$promise.then($hide);
            $window.history.back();
        };
        $scope.lions = [{ id: 1, name: 'leão 1', age: 13, geopos: [-2.728214, 37.020190], url_small: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false},
                           { id: 2, name: 'leão 2', age: 14, geopos: [-2.811887, 36.869128], url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: false, selected: false},
                           { id: 3, name: 'leão 3', age: 15, geopos: [-2.704894, 36.836169], url_small: "/static/images/square-small/lion3.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false},
                           { id: 4, name: 'leão 4', age: 8, geopos: [-2.543016, 37.080614], url_small: "/static/images/square-small/lion4.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 5, name: 'leão 5', age: 8, geopos: [-2.647856, 37.191164], url_small: "/static/images/square-small/lion5.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false },
                           { id: 6, name: 'leão 6', age: 9, geopos: [-3.293193, 37.526870], url_small: "/static/images/square-small/lion6.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false },
                           { id: 7, name: 'leão 7', age: 6, geopos: [-2.014719, 36.141606], url_small: "/static/images/square-small/lion7.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: true, primary: true, verified: true, selected: false },
                           { id: 8, name: 'leão 8', age: 2, geopos: [-2.706266, 35.921880], url_small: "/static/images/square-small/lion8.jpeg", gender: 'female', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 9, name: 'leão 9', age: 7, geopos: [-3.598955, 37.185796], url_small: "/static/images/square-small/lion9.jpg", gender: 'female', organization: 'Lion Guardians', hasResults: false, pending: false, primary: false, verified: true, selected: false },
                           { id: 10, name: 'leão 10', age: 10, geopos: [0.974389, 34.654247], url_small: "/static/images/square-small/lion10.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false }];

        $scope.mapa = {
            center: [-2.704894, 36.836169],
            zoom: 8,
            mapTypeId  : google.maps.MapTypeId.HYBRID
        };

        function add_circle(center, radius){
            var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: $scope.map,
                center: center,
                radius: radius
            });
        }

        function add_lions (){
            var i=0;
            $scope.lions.forEach(function(lion){
                $timeout(function() {
                    var icon = new google.maps.MarkerImage(lion.url_small, null, null, null, new google.maps.Size(24, 24));

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lion.geopos[0], lion.geopos[1]),
                        map: $scope.map,
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                         icon: icon
                    });
                    var handler = google.maps.event.addListener(marker, 'click', function(event) {
                        alert('Lion name is :' + lion.name);
                    });
                }, i * 200);
                i++;
            });
        }
        var map;
        $scope.$on('mapInitialized', function(evt, evtMap) {
            map = evtMap;
            //marker = map.markers[0];
            add_lions ();
            $scope.center_gep = new google.maps.LatLng($scope.mapa.center[0], $scope.mapa.center[1]);
            add_circle($scope.center_gep, 150000);
        });
    };
    MapCtrl.$inject = ['$scope', '$timeout'];
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
}])

.controller('SearchLionCtrl', ['$scope', function ($scope) {

    $scope.lionRange = {
        min: 1,
        max: 10,
        ceil: 20,
        floor: 0
    };

    $scope.isCollapsed = true;

    //ng-init="lions=[{hasResults:true},{pending:true},{primary:true, verified:true}]"
    $scope.lions = [{ id: 1, name: 'leão 1', age: 13, geopos: [-2.728214, 37.020190], url_small: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false},
                           { id: 2, name: 'leão 2', age: 14, geopos: [-2.811887, 36.869128], url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: false, selected: false},
                           { id: 3, name: 'leão 3', age: 15, geopos: [-2.704894, 36.836169], url_small: "/static/images/square-small/lion3.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false},
                           { id: 4, name: 'leão 4', age: 8, geopos: [-2.543016, 37.080614], url_small: "/static/images/square-small/lion4.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 5, name: 'leão 5', age: 8, geopos: [-2.667856, 37.191164], url_small: "/static/images/square-small/lion5.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false },
                           { id: 6, name: 'leão 6', age: 9, geopos: [-2.763193, 37.226870], url_small: "/static/images/square-small/lion6.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false },
                           { id: 7, name: 'leão 7', age: 6, geopos: [-2.014719, 36.141606], url_small: "/static/images/square-small/lion7.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: true, primary: true, verified: true, selected: false },
                           { id: 8, name: 'leão 8', age: 2, geopos: [-2.706266, 35.921880], url_small: "/static/images/square-small/lion8.jpeg", gender: 'female', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 9, name: 'leão 9', age: 7, geopos: [-2.398955, 35.185796], url_small: "/static/images/square-small/lion9.jpg", gender: 'female', organization: 'Lion Guardians', hasResults: false, pending: false, primary: false, verified: true, selected: false },
                           { id: 10, name: 'leão 10', age: 10, geopos: [0.974389, 34.654247], url_small: "/static/images/square-small/lion10.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false }];

}]);
