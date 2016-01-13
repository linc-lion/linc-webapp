// LINC is an open source shared database and facial recognition
// system that allows for collaboration in wildlife monitoring.
// Copyright (C) 2016  Wildlifeguardians
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For more information or to contact visit linclion.org or email tech@linclion.org
'use strict';

angular.module('lion.guardians.location.history.controller', ['lion.guardians.location.history.directive'])

.controller('LocationHistoryCtrl', ['$scope', '$state', '$timeout', '$uibModal', '$q', '$uibModalInstance', 'LincServices', 'options', 'history', function ($scope, $state, $timeout, $uibModal, $q, $uibModalInstance, LincServices, options, history) {
  $scope.title = 'Location History';
  $scope.content = 'Map';

  //$scope.locationSets = locationSets;
  $scope.isLion = (options.type == 'lion');
  $scope.GoBackMessage = $scope.isLion? "Go to Image Set" : "Go Back to Image Set";

  $scope.locations = history.locations;
  $scope.count = history.count;

  $scope.Cancel = function () {
   $uibModalInstance.dismiss();
  };

  var add_circle = function (center, radius){
    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2,
      fillColor: '#FF0000', fillOpacity: 0.1, map: $scope.map,
      center: center, radius: radius
    });
  }
  // Calc distance between 2 points
  var Calc_distancia = function (p1, p2){
    var lat1 = p1.lat();var lon1 = p1.lng()
    var lat2 = p2.lat();var lon2 = p2.lng()

    var R = 6371; // km (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return (Math.round(d*1000*100)/100);
  }
  var CircleToBounds = function (center, radius) {
    var Spherical = google.maps.geometry.spherical;
    var southwest = Spherical.computeOffset(center, radius * Math.sqrt(2.0), 225);
    var northeast = Spherical.computeOffset(center, radius * Math.sqrt(2.0), 45);
    return (new google.maps.LatLngBounds(southwest, northeast));
  }
  // Calc radius
  var Calc_Radius = function (center){
    var dist = 0;
    $scope.locations.forEach(function(location){
      var position = new google.maps.LatLng(location.latitude, location.longitude);
      dist = Math.max(dist, Calc_distancia(center,position));
    });
    return (dist);
  }
  // Add Lion
  var add_lion = function (location, i) {
    var deferred = $q.defer();
    var icon = new google.maps.MarkerImage("/static/icons/lion-icon.ico", null,
                null, null, new google.maps.Size(24, 24));
    $timeout(function() {
      var position = new google.maps.LatLng(location.latitude, location.longitude);
      $scope.bounds.extend(position);
      var marker = new google.maps.Marker({
        position: position, map: $scope.map, draggable: false,
        animation: google.maps.Animation.DROP, icon: icon
      });
      $scope.markers.push({'id': location.id, 'marker': marker});
      var handler_click = google.maps.event.addListener(marker, 'click', function(event) {
          $scope.click(location.id, event);
      });
      deferred.resolve(marker);
    }, i * 200);
    return deferred.promise;
  }
  // Add Lions
  var add_lions = function(fn){
    var i=0;
    $scope.markers = [];
    $scope.bounds = new google.maps.LatLngBounds();
    var promises = [];
    $scope.locations.forEach(function(location){
      var promise = add_lion(location, i);
      location.selected = true;
      promises.push(promise);
      i++;
    });
    $q.all(promises).then(function (results) {
      fn();
    });
  }
  // If is Lion, load from  url. If Imageset get by params
/*  var load_imagesets = function (fn){
    if($scope.locationSets.type == "imageset"){
      $scope.GoBackMessage = "Go Back to Image Set";
      $scope.locations = locationSets.locations
      $scope.count = 1;
      fn();
    }
    else{
      $scope.GoBackMessage = "Go to Image Set";
      LincServices.LocationHistory(locationSets.id).then()
        $scope.locations = data.locations;
        $scope.count = data.count;
        fn();
      });
    }
  }*/
  // Initialize map
  $scope.$on('mapInitialized', function(evt, evtMap) {
    //load_imagesets (function (){
      $scope.map = evtMap;
      $scope.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      $scope.map.setZoom(8);
      add_lions(function(){
        // One Lion
        if($scope.count == 1){
          var center = $scope.markers[0].marker.getPosition();
          var radius = 40000;
          add_circle(center, radius);
          $scope.bounds = CircleToBounds(center, radius);
          $scope.map.fitBounds($scope.bounds);
          $scope.map.setCenter(center);
        }
        else{
          if($scope.bounds.getNorthEast().equals($scope.bounds.getSouthWest())){
            var center = $scope.markers[0].marker.getPosition();
            var radius = 40000;
            add_circle(center, radius);
            $scope.bounds = CircleToBounds(center, radius);
            $scope.map.fitBounds($scope.bounds);
            $scope.map.setCenter(center);
          }
          else{
            var center = $scope.bounds.getCenter();
            var radius = Math.max(40000, Calc_Radius(center));
            add_circle(center, radius*1.1);
            $scope.bounds = CircleToBounds(center, radius);
            $scope.map.fitBounds($scope.bounds);
            $scope.map.setCenter(center);
          }
        }
      });
  //  });
  });
  // On Click Marker
  $scope.click = function (id, event){
    var index = _.indexOf($scope.locations, _.find($scope.locations, {id: id}));
    $scope.infomsg = $scope.locations[index].label;
    $scope.date = 'Updated Date: ' + $scope.locations[index].updated_at;
    $scope.imageset_id = id;
    $scope.modalInstance = $uibModal.open({
        templateUrl: 'InfoWindow.tmpl.html',
        scope:$scope
    });
    $scope.modalInstance.result.then(function (result) {
      $uibModalInstance.close($scope.imageset_id);
    });
  }
  var promise = null;
  // Animate marker when I click label
  $scope.animate = function(location){

    if(promise) return;
    promise = $timeout(function() {
      $timeout.cancel(promise);
      promise = null;
      location.selected = !location.selected;
      if(typeof($scope.anime) != 'undefined'){
       clearTimeout($scope.anime);
       $scope.animated_marker.setAnimation(null);
      }
      var id = location.id;
      $scope.animated_marker =  _.result(_.find($scope.markers, {id: id}), 'marker');
      if(location.selected){
       $scope.animated_marker.setMap($scope.map);
       $scope.animated_marker.setAnimation(google.maps.Animation.BOUNCE);
       $scope.anime = setTimeout(function() {$scope.animated_marker.setAnimation(null);}, 1000);
      }
      else{
       $scope.animated_marker.setMap(null);
      }
    }, 250);
  }
  $scope.open_imageset = function (id){
    $timeout.cancel(promise);
    promise = null;
    var url = $state.href("imageset", { 'id': id },  {absolute: true});
    window.open(url,'_blank');
  }


  // Modal Functions
  $scope.close=function(){
    $scope.modalInstance.dismiss();
  };
  $scope.goto=function(){
    $scope.modalInstance.close();
  }
}]);
