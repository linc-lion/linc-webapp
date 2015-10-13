//angular.module('lion-guardians', [])  ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
var app = angular.module('lion.guardians', ['ngAnimate', 'ngSanitize', 'rzModule', 'ui.router', 'mgcrea.ngStrap', 'lion.controllers']);

'use strict';

app.run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
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

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,   $urlRouterProvider) {
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

        // Home
        .state("home", {
          // Use a url of "/" to set a states as the "index".
          url: "/",
          controller: 'MainCtrl',
          templateUrl: 'templates/main.html'
        })

        .state("sidemenu", {
          // Use a url of "/" to set a states as the "index".
          url: "/sidemenu",
          controller: 'AsideCtrl',
          templateUrl: 'templates/side_menu.html'
        })
        .state("newlion", {
          // Use a url of "/" to set a states as the "index".
          url: "/newlion",
          controller: 'NewLionCtrl',
          templateUrl: 'templates/new_lion.html'
        })
        // About //
        .state('about', {
          url: '/about',
          // Showing off how you could return a promise from templateProvider
          templateProvider: ['$timeout', function ($timeout) {
              return $timeout(function () {
                return '<p class="lead">UI-Router Resources</p><ul>' +
                         '<li><a href="https://github.com/angular-ui/ui-router/tree/master/sample">Source for this Sample</a></li>' +
                         '<li><a href="https://github.com/angular-ui/ui-router">Github Main Page</a></li>' +
                         '<li><a href="https://github.com/angular-ui/ui-router#quick-start">Quick Start</a></li>' +
                         '<li><a href="https://github.com/angular-ui/ui-router/wiki">In-Depth Guide</a></li>' +
                         '<li><a href="https://github.com/angular-ui/ui-router/wiki/Quick-Reference">API Reference</a></li>' +
                       '</ul>';
              }, 100);
          }]
      })
}]);
