'use strict';

angular.module('lion.guardians.map.controllers', [])

.controller('MapCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {
  //$scope.modal = {title: 'Location History', content: 'Map'};
  function MyController($scope) {
    $scope.title = 'Location History';
    $scope.content = 'Map';
  }
  MyController.$inject = ['$scope'];
  var myModal = $modal({controller: MyController, templateUrl: 'map', show: false});

  $scope.showModal = function () {
    myModal.$promise.then(myModal.show);
  };

  $scope.hideModal = function ($hide) {
    myModal.$promise.then($hide);
    $window.history.back();
  };
/*
  $scope.zoom = "14";
  $scope.center = "-22.891054,-47.094948";
  $scope.mapTypeId = google.maps.MapTypeId.SATELLITE;
  $scope.map = { center: $scope.center, zoom: $scope.zoom, options: { mapTypeId: $scope.mapTypeId } };

  var marker, map;
  $scope.$on('mapInitialized', function(evt, evtMap) {
    map = evtMap;
    marker = map.markers[0];
  });
  $scope.centerChanged = function(event) {
    $timeout(function() {
      map.panTo(marker.getPosition());
    }, 3000);
  }
  $scope.click = function(event) {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  }*/

/*
  $scope.center = {-22.891054,-47.094948};
  $scope.zoom = 14;
  $scope.mapTypeId = google.maps.MapTypeId.SATELLITE;
  // Map
  $scope.map = { center: $scope.center, zoom: $scope.zoom, options: { mapTypeId: $scope.mapTypeId } };
  $scope.icon = new google.maps.MarkerImage("/static/icons/lion_icon-98x72.png", null, null, null, new google.maps.Size(32,24));
  $scope.marker = {
    id: 0,
      coords: $scope.center,
      options: { draggable: true, icon: $scope.icon},
      events: {
        click: function(marker, eventName, model, args){
          console.log('marker click');
        },
        dragstart: function (marker, eventName, model, args) {
          console.log('marker drag start');
        },
        drag: function (marker, eventName, model, args) {
          console.log('marker dragend');
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          console.log(lat);
          console.log(lon);

          $scope.marker.options = {
            draggable: true,
            icon: $scope.icon,
            labelContent: "[" + $scope.marker.coords.latitude.toFixed(4)  + '; ' +  $scope.marker.coords.longitude.toFixed(4) + "]",
            labelAnchor: "100 0",
            labelClass: "marker-labels"
          };
        },
        dragsend: function (marker, eventName, model, args) {
          console.log('marker drag end');
          $scope.marker.options = {
            draggable: true,
            icon: $scope.icon
          };
        },
      }
    };*/

}])
