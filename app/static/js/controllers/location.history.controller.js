'use strict';

angular.module('lion.guardians.location.history.controller', ['lion.guardians.location.history.directive'])

.controller('LocationHistoryCtrl', ['$scope', '$uibModal', '$q', '$timeout', '$uibModalInstance', 'locationSets', 'LincServices', function ($scope, $uibModal, $q, $timeout, $uibModalInstance, locationSets, LincServices) {
  $scope.title = 'Location History';
  $scope.content = 'Map';

  $scope.locationSets = locationSets;
  $scope.isLion = (locationSets.type == 'lion');

  var add_circle = function (center, radius){
    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2,
      fillColor: '#FF0000', fillOpacity: 0.1, map: $scope.map,
      center: center, radius: radius
    });
  }
  // Close
  $scope.Cancel = function () {
   $uibModalInstance.dismiss();
  };
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
      promises.push(promise);
      i++;
    });
    $q.all(promises).then(function (results) {
      fn();
    });
  }
  // If is Lion, load from  url. If Imageset get by params
  var load_imagesets = function (fn){
    if($scope.locationSets.type == "imageset"){
      $scope.GoBackMessage = "Go Back to Image Set";
      $scope.locations = locationSets.locations
      $scope.count = 1;
      fn();
    }
    else{
      $scope.GoBackMessage = "Go to Image Set";
      LincServices.LocationHistory(locationSets.id,function(data){
        $scope.locations = data.locations;
        $scope.count = data.count;
        fn();
      });
    }
  }
  // Initialize map
  $scope.$on('mapInitialized', function(evt, evtMap) {
    load_imagesets (function (){
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
    });
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
  // Animate marker when I click label
  $scope.animate = function(id){
    if(typeof($scope.anime) != 'undefined'){
      clearTimeout($scope.anime);
      $scope.animated_marker.setAnimation(null);
    }
    $scope.animated_marker =  _.result(_.find($scope.markers, {id: id}), 'marker');
    $scope.animated_marker.setAnimation(google.maps.Animation.BOUNCE);
    $scope.anime = setTimeout(function() {$scope.animated_marker.setAnimation(null);}, 3000);
  }
  // Modal Functions
  $scope.close=function(){
    $scope.modalInstance.dismiss();
  };
  $scope.goto=function(){
    $scope.modalInstance.close();
  }
}]);
