'use strict';

angular.module('lion.guardians.location.history.controller', ['lion.guardians.location.history.directive'])

.controller('LocationHistoryCtrl', ['$scope', '$window', '$timeout', '$uibModalInstance', function ($scope, $window, $timeout, $uibModalInstance) {
    $scope.title = 'Location History';
    $scope.content = 'Map';
    // Close
    $scope.Close = function () {
     $uibModalInstance.close('close');
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
                strokeOpacity: 0.5,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.1,
                map: $scope.map,
                center: center,
                radius: radius
        });
    }

    function add_lions (){
        var i=0;
        var lion_url = "/static/icons/lion-icon.ico";
        $scope.lions.forEach(function(lion){
            $timeout(function() {
                var icon = new google.maps.MarkerImage(lion_url, null, null, null, new google.maps.Size(24, 24));
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
}]);
