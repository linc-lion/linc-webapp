'use strict';

angular.module('lion.controllers', [])

.controller('MainCtrl', ['$scope', '$state', function ($scope, $state) {
    $state.go('menu');
}])
// Home Menu
.controller('MenuCtrl', ['$scope', function ($scope) {

}])
// ASide Controller Base.html
.controller('AsideCtrl', ['$scope', function ($scope) {
    $scope.aside = {title: 'Menu', content: 'Menu'};
}])

.controller('NewLionCtrl', ['$scope', function ($scope) {

}])

.controller('NewImageSetCtrl', ['$scope', function ($scope) {

}])

.controller('SearchLionCtrl', ['$scope', function ($scope) {

  $scope.lionRange = {
    min: 1,
    max: 10,
    ceil: 20,
    floor: 0
  };

  $scope.isCollapsed = true;

}])

.controller('SearchImageSetCtrl', ['$scope', function ($scope) {

  $scope.imageSetRange = {
    min: 1,
    max: 10,
    ceil: 20,
    floor: 0
  };

  $scope.isCollapsed = true;

}])

.controller('ConservationistsCtrl', ['$scope', function ($scope) {

}])

// Image Gallery Controller
.controller('ImageGalleryCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {
  //$scope.modal = {title: 'Image Gallery', content: 'Image Galleryl<br />Contents!'};
  function MyController($scope) {
    $scope.title = 'Image Gallery';
    $scope.content = 'Image Galleryl<br />Contents!';
  }
  MyController.$inject = ['$scope'];
  var myModal = $modal({controller: MyController, templateUrl: 'imagegallery', show: false});

  $scope.showModal = function () {
    myModal.$promise.then(myModal.show);
  };

  $scope.hideModal = function ($hide) {
    myModal.$promise.then($hide);
    $window.history.back();
  };

  $scope.photos = [
    {
      id: 1,
      name: 'leão 1',
      age: 14,
      url: "/static/images/medium/lion1.jpg"
    },
    {
      id: 2,
      name: 'leão 2',
      age: 14,
      url: "/static/images/medium/lion1.jpg"
    },
    {
      id: 3,
      name: 'leão 3',
      age: 14,
      url: "/static/images/medium/lion1.jpg"
    },
  ];

  /*$scope.photo_select = function($event, value){
    value=!value;
    $event.stopPropagation();
  }*/
  $scope.show_photo = function(url){
    var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
    win.focus();
  }
}])
.controller('LocationHistoryCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {
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

}])
.controller('EditMetadataCtrl', ['$scope', '$modal', '$window', function ($scope, $modal, $window) {
  //$scope.modal = {title: 'Metadata', content: 'Form'};
 function MyController($scope) {
    $scope.title = 'Metadata';
    $scope.content = 'Form';
  }
  MyController.$inject = ['$scope'];
  var myModal = $modal({controller: MyController, templateUrl: 'metadata', show: false});

  $scope.showModal = function () {
    myModal.$promise.then(myModal.show);
  };

  $scope.hideModal = function ($hide) {
    myModal.$promise.then($hide);
    $window.history.back();
  };

  $scope.Cancel = function ($hide) {
    myModal.$promise.then($hide);
    $window.history.back();
  };

  $scope.Save = function ($hide) {
    myModal.$promise.then($hide);
    $window.history.back();
  };

}])
.controller('CVResultsCtrl', ['$scope', '$modal', function ($scope, $modal) {
  $scope.modal = {title: 'CV Results', content: 'Form'};
  $scope.modal2 = {title: 'Lion Search', content: 'Search'};
}])


/*
// Modal Controller
.controller('ModalDemoCtrl', ['$scope', '$modal', function ($scope, $modal) {
  $scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};
  function MyModalController($scope) {
    $scope.title = 'Some Title';
    $scope.content = 'Hello Modal<br />This is a multiline message from a controller!';
  }
  MyModalController.$inject = ['$scope'];
  var myModal = $modal({controller: MyModalController, templateUrl: 'modal/docs/modal.demo.tpl.html', show: false});
  $scope.showModal = function () {
    myModal.$promise.then(myModal.show);
  };
  $scope.hideModal = function () {
    myModal.$promise.then(myModal.hide);
  };
}])
*/

/*
// Select Controller
.controller('SelectDemoCtrl',  ['$scope', '$http', function($scope, $http) {
  $scope.selectedIcon = '';
  $scope.selectedIcons = ['Globe', 'Heart'];
  $scope.icons = [
    {value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'},
    {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'},
    {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'},
    {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}
  ];
  $scope.selectedMonth = 0;
  $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}])

// Dropdown Controller
.controller('DropdownDemoCtrl',  ['$scope', '$alert', function($scope, $alert) {
  $scope.dropdown = [
    {text: '<i class="fa fa-download"></i>&nbsp;Another action', href: '#anotherAction'},
    {text: '<i class="fa fa-globe"></i>&nbsp;Display an alert', click: '$alert("Holy guacamole!")'},
    {text: '<i class="fa fa-external-link"></i>&nbsp;External link', href: '/auth/facebook', target: '_self'},
    {divider: true},
    {text: 'Separated link', href: '#separatedLink'}
  ];
  $scope.$alert = function(title) {
    $alert({title: title, content: 'Best check yo self, you\'re not looking too good.', placement: 'top', type: 'info', keyboard: true, show: true});
  };
}])

// Buttons Controller
.controller('ButtonDemoCtrl',  ['$scope', function($scope) {
  $scope.button = {
    toggle: false,
    checkbox: {left: false, middle: true, right: false},
    radio: 'left'
  };
}])


// Typeahead Controller
.controller('TypeaheadDemoCtrl', ['$scope', '$templateCache', '$http', function($scope, $templateCache, $http) {
  $scope.selectedState = '';
  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  $scope.selectedIcon = '';
  $scope.icons = [
    {value: 'Gear', label: '<i class="fa fa-gear"></i> Gear'},
    {value: 'Globe', label: '<i class="fa fa-globe"></i> Globe'},
    {value: 'Heart', label: '<i class="fa fa-heart"></i> Heart'},
    {value: 'Camera', label: '<i class="fa fa-camera"></i> Camera'}
  ];

  $scope.selectedAddress = '';
  $scope.getAddress = function(viewValue) {
    var params = {address: viewValue, sensor: false};
    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {params: params})
    .then(function(res) {
      return res.data.results;
    });
  };
}])*/


;
