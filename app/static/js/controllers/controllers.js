'use strict';

angular.module('lion.guardians.controllers', ['lion.guardians.login.controllers',
                                                               'lion.guardians.lions.controllers',
                                                               'lion.guardians.image.set.controllers',
                                                               'lion.guardians.conservationists.controllers'])

// Home
.controller('HomeCtrl', ['$scope', function ($scope) {

}])

.controller('BodyCtrl', ['$scope', function ($scope){
  $scope.bodyClasses = 'default';

  // this'll be called on every state change in the app
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (toState.data != undefined && angular.isDefined(toState.data.bodyClasses)) {
        $scope.bodyClasses = toState.data.bodyClasses;
        return;
    }
    $scope.bodyClasses = 'default';
  });
}])

// Side Menu Controller Base.html
.controller('SideMenuCtrl', ['$scope', '$aside', '$state', '$localStorage', function ($scope, $aside, $state, $localStorage) {

  $scope.$storage = $localStorage;

    //$scope.aside = {title: 'Menu', content: 'Menu'};
  function MyController($scope) {
    $scope.title = 'Menu';
    $scope.content = 'Menu';
  }
  MyController.$inject = ['$scope'];
  //var myModal = $modal({controller: MyController, templateUrl: 'sidemenu', show: false});
  var myASide = $aside({controller: MyController,   templateUrl: 'sidemenu', show: false});

  $scope.showModal = function () {
    myASide.$promise.then(myASide.show);
  };

  $scope.hideModal = function ($hide) {
    myASide.$promise.then($hide);
    //$window.history.back();
  };

    $scope.logout = function($hide){
      myASide.$promise.then($hide);
      $scope.$storage.logged = false;
      $state.go("login");
  }
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
