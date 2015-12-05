//angular.module('lion-guardians', [])  ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
var app = angular.module('lion.guardians', ['ngStorage', 'ngAnimate', 'ui.bootstrap', 'ngSanitize', 'rzModule', 'ui.router', 'ngMap', 'mgcrea.ngStrap', 'angularFileUpload', 'cgNotify', 'ngCookies', 'angular-loading-bar', 'ngInputModified', 'lion.guardians.controllers', 'lion.guardians.interceptor.factory', 'lion.guardians.services']);

'use strict';

app.run(['$rootScope', '$state', '$stateParams', '$localStorage', function ($rootScope, $state, $stateParams, $localStorage) {

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

    var history = [];
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        history.push({name: toState.name, param: toParams});
    });

    $rootScope.go_back = function() {
      var prevUrl = history.length > 1 ? history.splice(-2)[0] : {'name': 'home', 'param': {}};
      $state.go(prevUrl.name, prevUrl.param);
    };
    $rootScope.remove_history = function(name, id) {
      var find = _.findWhere(history, {'name': name, 'param' : {'id': id}});
      var result = _.without(history,find);
      if(result[result.length-1].name == ('search' + name))
       result.pop();
      history = result;
    }
}]);

app.config(['$urlMatcherFactoryProvider', function($urlMatcherFactory) {
  $urlMatcherFactory.type("ObjParam", {
    decode: function(val) { return typeof(val) === "string" ? JSON.parse(val) : val; },
    encode: function(val) { return JSON.stringify(val); },
    equals: function(a, b) { return this.is(a) && this.is(b)},
    is: function(val) { return angular.isObject(val) }
  });
}]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
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
          templateUrl: 'login.html'
        })
        // Search Lion
        .state("admin", {
          url: "/admin",
          controller: 'AdminCtrl',
          templateUrl: 'admin.html',
          data: {
            bodyClasses: 'admin'
          },
          resolve: {
            organizations: ['LincApiServices', function(LincApiServices) {
              return LincApiServices.Organizations({'method': 'get'});
            }],
            users: ['LincApiServices', 'organizations', function(LincApiServices, organizations) {
              return LincApiServices.Users({'method': 'get', 'organizations': organizations});
            }],
            lions: ['LincApiServices', 'organizations', function(LincApiServices, organizations) {
              return LincApiServices.Lions({'method': 'get', 'organizations': organizations});
            }],
            images: ['LincApiServices', function(LincApiServices) {
              return LincApiServices.Images({'method': 'get'});
            }],
            imagesets: ['LincApiServices', 'organizations', 'users', 'lions', 'images', function(LincApiServices, organizations, users, lions, images) {
              return LincApiServices.ImageSets({'method': 'get', 'organizations': organizations, 'users': users, 'lions': lions, 'images': images});
            }],
            cvrequests: ['LincApiServices', 'organizations', function(LincApiServices, organizations) {
              return LincApiServices.CVRequests({'method': 'get', 'organizations': organizations});
            }],
            cvresults: ['LincApiServices', function(LincApiServices) {
              return LincApiServices.CVResults({'method': 'get'});
            }]
          }
        })
        .state('admin.users', {
          url: '/users',
          templateUrl: 'admin.users.tpl.html'
        })
        .state('admin.organizations', {
          url: '/organizations',
          templateUrl: 'admin.organizations.tpl.html'
        })
        .state('admin.lions', {
          url: '/lions',
          templateUrl: 'admin.lions.tpl.html'
        })
        .state('admin.imagesets', {
          url: '/imagesets',
          templateUrl: 'admin.imagesets.tpl.html'
        })
        .state('admin.images', {
          url: '/images',
          templateUrl: 'admin.images.tpl.html'
        })
        .state('admin.cvrequests', {
          url: '/cvrequests',
          templateUrl: 'admin.cvrequests.tpl.html'
        })
        .state('admin.cvresults', {
          url: '/cvresults',
          templateUrl: 'admin.cvresults.tpl.html'
        })

        // Home Menu
        .state("home", {
          url: "/home",
          controller: 'HomeCtrl',
          templateUrl: 'home.html'
        })
        .state("lion", {
          url: "/lion/{id:int}",
          controller: 'LionCtrl',
          templateUrl: 'lion.html',
          data: {
            bodyClasses: 'lion'
          },
          resolve: {
            organizations: ['LincServices', function(LincServices) {
              return LincServices.Organizations();
            }],
            lion: ['$stateParams', 'LincServices', function($stateParams, LincServices) {
              return LincServices.Lion($stateParams.id);
            }]
          }
        })
        // New Image Set
        .state("imageset", {
          url: "/imageset/{id:int}",
          controller: 'ImageSetCtrl',
          templateUrl: 'imageset.html',
          data: {
            bodyClasses: 'imageset'
          },
          resolve: {
            organizations: ['LincServices', function(LincServices) {
              return LincServices.Organizations();
            }],
            imageset: ['$stateParams', 'LincServices', function($stateParams, LincServices) {
              return LincServices.ImageSet($stateParams.id);
            }]
          }
        })
        // Search Lion
        .state("searchlion", {
          url: "/searchlion",
          controller: 'SearchLionCtrl',
          templateUrl: 'searchlion.html',
          data: {
            bodyClasses: 'searchlion'
          },
          resolve: {
            lions: ['LincServices', function(LincServices) {
              return LincServices.Lions();
            }],
            lion_filters: ['LincDataFactory', function(LincDataFactory) {
              return LincDataFactory.get_lions_filters();
            }]
          }
        })
        // Search Image Set
        .state("searchimageset", {
          url: '/searchimageset?{filter:ObjParam}',
          controller: 'SearchImageSetCtrl',
          templateUrl: 'searchimageset.html',
          data: {
            bodyClasses: 'searchimageset'
          },
          resolve: {
            imagesets: ['LincServices', function(LincServices) {
              return LincServices.ImageSets();
            }],
            imagesets_filters: ['LincDataFactory', function(LincDataFactory) {
              return LincDataFactory.get_imagesets_filters();
            }]
          }
        })
        // Conservationists
        .state("conservationists", {
          url: "/conservationists",
          controller: 'ConservationistsCtrl',
          templateUrl: 'conservationists.html',
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
      //$locationProvider.html5Mode(true);
}]);

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 500;
}]);
