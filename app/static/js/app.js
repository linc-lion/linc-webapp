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
var app = angular.module('linc', ['ngStorage', 'ngAnimate', 'ui.bootstrap', 'ngSanitize', 'rzModule', 'ui.router', 
  'ngMap', 'mgcrea.ngStrap', 'angularFileUpload', 'cgNotify', 'ngCookies', 'angular-loading-bar', 'ngInputModified', 
  'ngMessages', 'ui.select', 'panzoom', 'panzoomwidget', 'linc.controllers', 'linc.directive', 'linc.services', 
  'linc.interceptor.factory', 'linc.auth.services']);

'use strict';

app.constant('TAG_LABELS', {
    EYE_DAMAGE_LEFT: 'Eye Damage Left', 
    EYE_DAMAGE_RIGHT: 'Eye Damage Right',
    EYE_DAMAGE_BOTH: 'Eye Damage Both',
    //EYE_DAMAGE_NONE: 'No Eye Damage',
    TEETH_BROKEN_CANINE_LEFT: 'Broken Teeth Canine Left', 
    TEETH_BROKEN_CANINE_RIGHT: 'Broken Teeth Canine Right', 
    TEETH_BROKEN_INCISOR_LEFT: 'Broken Teeth Incisor Left', 
    TEETH_BROKEN_INCISOR_RIGHT: 'Broken Teeth Incisor Right',
//     TEETH_BROKEN_NONE: 'No Broken Teeth',
    EAR_MARKING_LEFT: 'Ear Marking Left', 
    EAR_MARKING_RIGHT: 'Ear Marking Right',
    EAR_MARKING_BOTH: 'Ear Marking Both',
//     EAR_MARKING_NONE:  'No Ear Marking',
    MOUTH_MARKING_BACK: 'Mouth Marking Back', 
    MOUTH_MARKING_FRONT: 'Mouth Marking Front', 
    MOUTH_MARKING_LEFT: 'Mouth Marking Left', 
    MOUTH_MARKING_RIGHT: 'Mouth Marking Right', 
//     MOUTH_MARKING_NONE: 'No Mouth Marking',
    TAIL_MARKING_MISSING_TUFT: 'Tail Marking Missing Tuft', 
//     TAIL_MARKING_MISSING_TUFT_YES: 'Tail Marking Missing Tuft', 
//     TAIL_MARKING_MISSING_TUFT_NONE: 'NO Missing Tuft',
    NOSE_COLOUR_BLACK: 'Nose Color Black', 
    NOSE_COLOUR_PATCHY: 'Nose Color Patchy', 
    NOSE_COLOUR_PINK: 'Nose Color Pink',
    NOSE_COLOUR_SPOTTED: 'Nose Color Spotted', 
//     NOSE_COLOUR_NONE: 'No Nose Colour',
    SCARS_BODY_LEFT: 'Scars Body Left', 
    SCARS_BODY_RIGHT: 'Scars Body Right', 
    SCARS_FACE: 'Scars Face', 
    SCARS_TAIL: 'Scars Tail'
//     SCARS_NONE: 'No Scars'
})
.constant('TAGS_CONST', {
  EYE_DAMAGE: [
    'EYE_DAMAGE_LEFT',
    'EYE_DAMAGE_RIGHT',
    'EYE_DAMAGE_BOTH'
    //'EYE_DAMAGE_NONE'
  ],
  TEETH_BROKEN: [
    'TEETH_BROKEN_CANINE_LEFT',
    'TEETH_BROKEN_CANINE_RIGHT',
    'TEETH_BROKEN_INCISOR_LEFT',
    'TEETH_BROKEN_INCISOR_RIGHT'
    //'TEETH_BROKEN_NONE'
  ],
  EAR_MARKINGS: [
    'EAR_MARKING_LEFT',
    'EAR_MARKING_RIGHT',
    'EAR_MARKING_BOTH'
    //'EAR_MARKING_NONE'
  ],
  MOUTH_MARKING: [
    'MOUTH_MARKING_BACK',
    'MOUTH_MARKING_FRONT',
    'MOUTH_MARKING_LEFT',
    'MOUTH_MARKING_RIGHT'
    //'MOUTH_MARKING_NONE'
  ],
  TAIL_MARKING_MISSING_TUFT:[
    'TAIL_MARKING_MISSING_TUFT'
    //'TAIL_MARKING_MISSING_TUFT_YES',
    //'TAIL_MARKING_MISSING_TUFT_NONE'
  ],
  NOSE_COLOUR:[
    'NOSE_COLOUR_BLACK',
    'NOSE_COLOUR_PATCHY',
    'NOSE_COLOUR_PINK',
    'NOSE_COLOUR_SPOTTED'
    //'NOSE_COLOUR_NONE'
  ],
  SCARS:[
    'SCARS_BODY_LEFT',
    'SCARS_BODY_RIGHT',
    'SCARS_FACE',
    'SCARS_TAIL'
    //'SCARS_NONE'
  ]
})
.constant('TOOL_TITLE',"Eye Damage: Left, Right or Both; Broken Teeth: Canine Left/Right and Incisor Left/Right; \n Ear Marking: Left, Right, or Both; Mouth Marking: Back, Front, Left and Right; \n Tail Marking: Missing Tuft; Nose Color: Black, Patchy, Pink, or Spotted; Scars: Body Left/Right, Face and Tail")
.constant('TAGS_BY_TYPE', {
  EYE_DAMAGE: {
    EYE_DAMAGE_LEFT: 'Left', 
    EYE_DAMAGE_RIGHT: 'Right', 
    EYE_DAMAGE_BOTH: 'Both'
    //EYE_DAMAGE_NONE: 'None'
  },
  TEETH_BROKEN: {
    TEETH_BROKEN_CANINE_LEFT: 'Canine Left', 
    TEETH_BROKEN_CANINE_RIGHT: 'Canine Right', 
    TEETH_BROKEN_INCISOR_LEFT: 'Incisor Left', 
    TEETH_BROKEN_INCISOR_RIGHT: 'Incisor Right'
    //TEETH_BROKEN_NONE: 'None'
  },
  EAR_MARKINGS: {
    EAR_MARKING_LEFT: 'Left', 
    EAR_MARKING_RIGHT: 'Right',
    EAR_MARKING_BOTH: 'Both'
    //EAR_MARKING_NONE:  'Nonen'
  },
  MOUTH_MARKING: {
    MOUTH_MARKING_BACK: 'Back', 
    MOUTH_MARKING_FRONT: 'Front', 
    MOUTH_MARKING_LEFT: 'Left', 
    MOUTH_MARKING_RIGHT: 'Right'
    //MOUTH_MARKING_NONE: 'No Mouth Marking'
  },
  TAIL_MARKING_MISSING_TUFT:{
    TAIL_MARKING_MISSING_TUFT: 'Missing Tuft'
    //TAIL_MARKING_MISSING_TUFT_YES: 'Tail Marking Missing Tuft'
    //TAIL_MARKING_MISSING_TUFT_NONE: 'NO Missing Tuft'
  },
  NOSE_COLOUR:{
    NOSE_COLOUR_BLACK: 'Black', 
    NOSE_COLOUR_PATCHY: 'Patchy', 
    NOSE_COLOUR_PINK: 'Pink',
    NOSE_COLOUR_SPOTTED: 'Spotted'
    //NOSE_COLOUR_NONE: 'None'
  },
  SCARS:{
    SCARS_BODY_LEFT: 'Body Left', 
    SCARS_BODY_RIGHT: 'Body Right', 
    SCARS_FACE: 'Face', 
    SCARS_TAIL: 'Tail'
    //SCARS_NONE: 'No Scars'
  }
})

.constant('CONST_LIST', {
  GENDERS: [
    {value: 'male',  label: 'Male'}, 
    {value: 'female',label: 'Female'}, 
    {value:  null,   label: 'Unknown'}
  ],
  EAR_MARKING: [
    {value: 'EAR_MARKING_LEFT',  label: 'Left'},
    {value: 'EAR_MARKING_RIGHT', label: 'Right'}
    //{value: 'EAR_MARKING_NONE', label: 'None'}
  ],
  MOUTH_MARKING: [ 
      {value: 'MOUTH_MARKING_BACK',  label: 'Back'},
      {value: 'MOUTH_MARKING_FRONT', label: 'Front'},
      {value: 'MOUTH_MARKING_LEFT',  label: 'Left'},
      {value: 'MOUTH_MARKING_RIGHT', label: 'Right'}
      //{value: 'MOUTH_MARKING_NONE', label: 'None'}
  ],
  TAIL_MARKING: [
    {value: 'TAIL_MARKING_MISSING_TUFT', label: 'Missing Tuft'}
    //{value: 'TAIL_MARKING_MISSING_TUFT_YES', label: 'Missing Tuft'}
    //{value: 'TAIL_MARKING_MISSING_TUFT_NONE', label: 'NO Missing Tuft'}
  ],
  EYE_DAMAGE: [
    {value: 'EYE_DAMAGE_LEFT',  label: 'Left'}, 
    {value: 'EYE_DAMAGE_RIGHT', label: 'Right'}
  ],
  NOSE_COLOUR: [
    {value: undefined, label: 'NONE'}, 
    {value: 'NOSE_COLOUR_BLACK', label: 'Black'},
    {value: 'NOSE_COLOUR_PATCHY',  label: 'Patchy'}, 
    {value: 'NOSE_COLOUR_PINK', label: 'Pink'},
    {value: 'NOSE_COLOUR_SPOTTED', label: 'Spotted'}
  ],
  TEETH_BROKEN: [
    {value: 'TEETH_BROKEN_CANINE_LEFT', label: 'Canine Left'},
    {value: 'TEETH_BROKEN_CANINE_RIGHT', label: 'Canine Right'}, 
    {value: 'TEETH_BROKEN_INCISOR_LEFT', label: 'Incisor Left'}, 
    {value: 'TEETH_BROKEN_INCISOR_RIGHT', label: 'Incisor Right'}
  ],
  SCARS: [
    {value: 'SCARS_BODY_LEFT', label: 'Body Left'}, 
    {value: 'SCARS_BODY_RIGHT', label: 'Body Right'}, 
    {value: 'SCARS_FACE', label: 'Face'}, 
    {value: 'SCARS_TAIL', label: 'Tail'}
  ]
})

app.run(['$rootScope', '$state', '$stateParams', 'AuthService', function ($rootScope, $state, $stateParams, AuthService) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      var authorized = toState.data.authorized;
      if (toState.name != "login"){
        if (!AuthService.isAuthenticated()){
          event.preventDefault();
          $state.go("login");
        }
        else if (!AuthService.isAuthorized(authorized)) {
          event.preventDefault();
        }
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
      //if(result[result.length-1].name == ('search' + name))
      // result.pop();
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
  var debug = false;
  // State Configurations //
  // Use $stateProvider to configure your states.
  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      controllerAs: 'vm',
      templateUrl: 'login.html',
      data:{
        authorized: '*',
      }
    })
    // Search Lion
    .state("admin", {
      url: "/admin",
      controller: 'AdminCtrl',
      templateUrl: 'admin.html',
      data: {
        bodyClasses: 'admin',
        authorized: 'admin',
        debug: debug
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
        }],
        settings: ['LincApiDataFactory', function(LincApiDataFactory) {
          return LincApiDataFactory.get_settings();
        }]
      }
    })
    .state('admin.users', {
      url: '/users',
      templateUrl: 'admin.users.tpl.html',
      data:{
        authorized: 'admin'
      }
    })
    .state('admin.organizations', {
      url: '/organizations',
      templateUrl: 'admin.organizations.tpl.html',
      data:{
        authorized: 'admin'
      }
    })
    .state('admin.lions', {
      url: '/lions',
      templateUrl: 'admin.lions.tpl.html',
      data:{
        authorized: 'admin'
      }
    })
    .state('admin.imagesets', {
      url: '/imagesets',
      templateUrl: 'admin.imagesets.tpl.html',
      data:{
        authorized: 'admin'
      }
    })
    .state('admin.images', {
      url: '/images',
      templateUrl: 'admin.images.tpl.html',
      data:{
        authorized: 'admin'
      }
    })
    .state('admin.cvrequests', {
      url: '/cvrequests',
      templateUrl: 'admin.cvrequests.tpl.html',
      data:{
        authorized: 'admin'
      }
    })
    .state('admin.cvresults', {
      url: '/cvresults',
      templateUrl: 'admin.cvresults.tpl.html',
      data:{
        authorized: 'admin'
      }
    })
    // Home Menu
    .state("home", {
      url: "/home",
      controller: 'HomeCtrl',
      templateUrl: 'home.html',
      data: {
        debug: debug,
        authorized: 'logged'
      }
    })
    .state("lion", {
      url: "/lion/{id:int}",
      controller: 'LionCtrl',
      templateUrl: 'lion.html',
      data: {
        bodyClasses: 'lion',
        authorized: 'logged',
        debug: debug
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
        bodyClasses: 'imageset',
        authorized: 'logged',
        debug: debug
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
        bodyClasses: 'searchlion',
        authorized: 'logged',
        debug: debug
      },
      resolve: {
        lions: ['LincServices', function(LincServices) {
          return LincServices.Lions();
        }],
        lion_filters: ['LincDataFactory', function(LincDataFactory) {
          return LincDataFactory.get_lions_filters();
        }],
        default_filters: ['LincDataFactory', function(LincDataFactory) {
          return LincDataFactory.get_defaults();
        }]
      }
    })
    // Search Image Set
    .state("searchimageset", {
      url: '/searchimageset?{filter:ObjParam}',
      controller: 'SearchImageSetCtrl',
      templateUrl: 'searchimageset.html',
      data: {
        bodyClasses: 'searchimageset',
        authorized: 'logged',
        debug: debug
      },
      resolve: {
        imagesets: ['LincServices', function(LincServices) {
          return LincServices.ImageSets();
        }],
        imagesets_filters: ['LincDataFactory', function(LincDataFactory) {
          return LincDataFactory.get_imagesets_filters();
        }],
        default_filters: ['LincDataFactory', function(LincDataFactory) {
          return LincDataFactory.get_defaults();
        }]
      }
    })
    // Conservationists
    .state("conservationists", {
      url: "/conservationists",
      controller: 'ConservationistsCtrl',
      templateUrl: 'conservationists.html',
      data: {
        bodyClasses: 'conservationists',
        authorized: 'logged',
        debug: debug
      },
      resolve: {
        conservationists: ['LincServices', function(LincServices) {
          return LincServices.Conservationists();
        }]
      }
    })
    .state("viewimages", {
      url: "/viewimages?{images:ObjParam}",
      controller: 'ViewImagesCtrl',
      templateUrl: 'view.images.html',
      data: {
        bodyClasses: 'viewimages',
        authorized: 'logged',
        debug: debug
      },
      resolve: {
        conservationists: ['LincServices', function(LincServices) {
          return LincServices.Conservationists();
        }]
      }
    })
    // About
    .state('about', {
      url: '/about',
      // Showing off how you could return a promise from templateProvider
      templateProvider: ['$timeout', function ($timeout) {
          return $timeout(function () {
            return '<p class="lead">Linc-Lions</p><ul>' +
                     '<li><a href="https://github.com/linc-lion/linc-webapp">Linc Lions</a></li>' +
                     '</ul>';
          }, 100);
      }]
    });

  $urlRouterProvider.otherwise('home');
  //$locationProvider.html5Mode(true);
}]);

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 500;
}])

app.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}])

app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.useApplyAsync(true);
}])

app.config(['$provide', function($provide) {

  $provide.decorator('$uibModal', [ '$delegate', function($delegate) {
    var open = $delegate.open;

    // decorate newly created modalInstance with some custom methods
    $delegate.open = function() {
      var modalInstance = open.apply(this, arguments);

      modalInstance.freeze = function(freeze) {
        modalInstance._freezed = freeze;
      };

      // return true when the modal instance is freezed and
      // dismiss reason is 'backdrop click' or 'escape key press'
      modalInstance.freezed = function(reason) {
        if (!modalInstance._freezed) { return false; }
        return _.contains(['backdrop click', 'escape key press'], reason);
      };

      return modalInstance;
    };

    return $delegate;
  }]);

  $provide.decorator('$uibModalStack', [ '$delegate', function($delegate) {
    var dismiss = $delegate.dismiss;

    // do nothing when the modal is freezed
    // otherwise fallback to the old behaviour
    $delegate.dismiss = function(modalInstance, reason) {
      if (modalInstance.freezed(reason)) { return; }
      dismiss.apply(this, arguments);
    };

    return $delegate;
  }]);

}])
;
