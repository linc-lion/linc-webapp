//angular.module('lion-guardians', [])  ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
var app = angular.module('lion.guardians', ['ngStorage', 'ngAnimate', 'ui.bootstrap', 'ngSanitize', 'rzModule', 'ui.router', 'ngMap', 'mgcrea.ngStrap', 'lion.guardians.controllers']);

'use strict';

app.run(['$rootScope', '$state', '$stateParams', '$localStorage', function ($rootScope,   $state,   $stateParams, $localStorage) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        //console.log(toState);
        if(!$localStorage.logged && toState.name != "login"){
          event.preventDefault();
          $state.go("login");
        }
    });
}]);

//app.config(['$modalProvider', function ($modalProvider) {
app.config(['$modalProvider', '$asideProvider', '$dropdownProvider', function ($modalProvider, $asideProvider, $dropdownProvider) {
  angular.extend($modalProvider.defaults, {
    html: true
  });
  angular.extend($asideProvider.defaults, {
    container: 'body',
    html: true
  });
  angular.extend($dropdownProvider.defaults, {
    html: true
  });
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,  $urlRouterProvider) {
  // Redirects and Otherwise //
  // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
  /*$urlRouterProvider
      // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
      // Here we are just setting up some convenience urls.
      .when('/c?id', '/contacts/:id')
      .when('/user/:id', '/contacts/:id')
      // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
      .otherwise('/');*/

      // State Configurations //
      // Use $stateProvider to configure your states.
      $stateProvider

        .state('login', {
          url: '/login',
          controller: 'LoginCtrl',
          controllerAs: 'vm',
          templateUrl: 'login'
        })
        // Home Menu
        .state("home", {
          url: "/home",
          controller: 'HomeCtrl',
          templateUrl: 'home'
        })
        // New Lion
        .state("newlion", {
          url: "/newlion",
          controller: 'NewLionCtrl',
          templateUrl: '/newlion',
          data: {
            bodyClasses: 'newlion'
          }
        })
        // New Image Set
        .state("newimageset", {
          url: "/newimageset",
          controller: 'NewImageSetCtrl',
          templateUrl: '/newimageset',
          data: {
            bodyClasses: 'newimageset'
          }
        })
        // Searcg Lion
        .state("searchlion", {
          url: "/searchlion",
          controller: 'SearchLionCtrl',
          templateUrl: '/searchlion',
          data: {
            bodyClasses: 'searchlion'
          }
        })
        // Search Image Set
        .state("searchimageset", {
          url: "/searchimageset",
          controller: 'SearchImageSetCtrl',
          templateUrl: '/searchimageset',
          data: {
            bodyClasses: 'searchimageset'
          }
        })
        // Conservationists
        .state("conservationists", {
          url: "/conservationists",
          controller: 'ConservationistsCtrl',
          templateUrl: '/conservationists',
          data: {
            bodyClasses: 'conservationists'
          }
        })
        // About //
        .state('about', {
          url: '/about',
          // Showing off how you could return a promise from templateProvider
          templateProvider: ['$timeout', function ($timeout) {
              return $timeout(function () {
                return '<p class="lead">Lin-Lions</p><ul>' +
                         '<li><a href="https://github.com/linc-lion/linc-webapp">Linc Lions</a></li>' +
                         '</ul>';
              }, 100);
          }]
        });
      $urlRouterProvider.otherwise('login');
}]);

/*app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})*/
