'use strict';

angular.module('lion.guardians.location.history.controller', ['lion.guardians.location.history.directive'])

.controller('LocationHistoryCtrl', ['$scope', '$uibModal', '$q', '$timeout', '$uibModalInstance', 'locationSets', function ($scope, $uibModal, $q, $timeout, $uibModalInstance, locationSets) {
    $scope.title = 'Location History';
    $scope.content = 'Map';
    // Close
    $scope.Close = function () {
     $uibModalInstance.close('close');
    };

    $scope.imagesets  = [
      { id: 1,
        date: (new Date('2008-04-06')).toLocaleDateString(),
        geopos: [-2.728214, 37.020190],
        thumbnail: "/static/images/square-small/lion1.jpg"},
      { id: 2, date: new Date('2008-09-26').toLocaleDateString(),
        geopos: [-2.811887, 36.869128],
        thumbnail: "/static/images/square-small/lion2.jpeg"},
      { id: 3, date: new Date('2009-04-16').toLocaleDateString(),
        geopos: [-2.704894, 36.836169],
        thumbnail: "/static/images/square-small/lion3.jpeg"},
      { id: 4,date: new Date('2010-11-21').toLocaleDateString(),
        geopos: [-2.543016, 37.080614],
        thumbnail: "/static/images/square-small/lion4.jpg"},
      { id: 5, date: new Date('2011-08-12').toLocaleDateString(),
        geopos: [-2.647856, 37.191164],
        thumbnail: "/static/images/square-small/lion5.jpg"},
      { id: 6, date: new Date('2012-04-02').toLocaleDateString(),
        geopos: [-3.293193, 37.526870],
        thumbnail: "/static/images/square-small/lion6.jpeg"},
      { id: 7,date: new Date('2013-08-11').toLocaleDateString(),
        geopos: [-2.014719, 36.141606],
        thumbnail: "/static/images/square-small/lion7.jpeg"},
      { id: 8, date: new Date('2014-05-20').toLocaleDateString(),
        geopos: [-2.706266, 35.921880],
        thumbnail: "/static/images/square-small/lion8.jpeg"},
      { id: 9, date: new Date('2014-12-16').toLocaleDateString(),
        geopos: [-3.598955, 37.185796],
        thumbnail: "/static/images/square-small/lion9.jpg"},
      { id: 10, date: new Date('2015-08-02').toLocaleDateString(),
        geopos: [0.974389, 34.654247],
        thumbnail: "/static/images/square-small/lion10.jpeg"}];
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
    function get_bounds (){
      var bounds = new google.maps.LatLngBounds();
      $scope.imagesets.forEach(function(imageset){
        var position = new google.maps.LatLng(imageset.geopos[0], imageset.geopos[1])
        bounds.extend(position);
      });
      return (bounds);
    }
    function Calc_distancia(p1, p2){
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

    function Calc_Radius (center){
      var dist = 0;
      $scope.imagesets.forEach(function(imageset){
        var position = new google.maps.LatLng(imageset.geopos[0], imageset.geopos[1]);
        dist = Math.max(dist, Calc_distancia(center,position));
      });
      return (dist);
    }
    function add_lions (){
        var i=0;
        var lion_url = "/static/icons/lion-icon.ico";
        $scope.markers = [];
        $scope.imagesets.forEach(function(imageset){
            $timeout(function() {
                var icon = new google.maps.MarkerImage(lion_url, null, null, null, new google.maps.Size(24, 24));
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(imageset.geopos[0], imageset.geopos[1]),
                    map: $scope.map,
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    icon: icon
                });
                $scope.markers.push({'id': imageset.id, 'marker': marker});
                var handler = google.maps.event.addListener(marker, 'click', function(event) {
                  $scope.click(imageset.id, event);
                });
            }, i * 200);
            i++;
        });
    }
    var map;
    $scope.$on('mapInitialized', function(evt, evtMap) {
        map = evtMap;
        //marker = map.markers[0];
        add_lions();
        var bounds = get_bounds();
        var center = bounds.getCenter();
        map.fitBounds(bounds);
        var radius = Calc_Radius(center);
        add_circle(center, radius*1.1);
    });
    $scope.click = function (id, event){
      var index = _.indexOf($scope.imagesets, _.find($scope.imagesets, {id: id}));
      $scope.infomsg = 'Imageset ' + id+ ' : date: ' + $scope.imagesets[index].date;
      $scope.thumbnail = $scope.imagesets[index].thumbnail;
      $scope.modalInstance = $uibModal.open({
          templateUrl: 'InfoWindow.tmpl.html',
          scope:$scope
      });
      //alert('Imageset :' + id+ ' - date: ' + $scope.imagesets[id].date);
    }
    $scope.animate = function(id){
      if(typeof($scope.anime) != 'undefined'){
        clearTimeout($scope.anime);
        $scope.animated_marker.setAnimation(null);
      }
      $scope.animated_marker =  _.result(_.find($scope.markers, {id: id}), 'marker');
      $scope.animated_marker.setAnimation(google.maps.Animation.BOUNCE);
      $scope.anime = setTimeout(function() {$scope.animated_marker.setAnimation(null);}, 3000);
    }
    $scope.close=function(){
      $scope.modalInstance.dismiss();//$scope.modalInstance.close() also works I think
    };
    $scope.doSomething=function(){
      //any actions to take place
      console.log("Do Something");
    }
}]);
