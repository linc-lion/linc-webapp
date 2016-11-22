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
angular.module('linc.data.factory', [])

.factory('LincDataFactory', [ 'LincServices', '$q', function(LincServices, $q) {
  var initialized = false;
  var lions_filters = {
      'LionAge': {},
      'name_or_id': '', 'tag_features': '', 'location': {'latitude':'','longitude': '', 'radius': ''}, 'reverse': false, 'predicate': 'id',
      'PerPage': 0, 'currentPage': 0, 'isAgeCollapsed': true,
      'isOrgCollapsed': true, 'isNameIdCollapsed': false, 'isGenderCollapsed' : true,
      'isFeaturesCollapsed' : true, 'isLocationCollapsed': true, 'organizations': [], 'genders': []
  };
  var imagesets_filters = {
      'LionAge': {},
      'name_or_id': '', 'tag_features': '', 'location': {'latitude':'','longitude': '', 'radius': ''}, 'reverse': false, 'predicate': 'id',
      'PerPage': 0, 'currentPage': 0, 'isAgeCollapsed': true,
      'isOrgCollapsed': true, 'isNameIdCollapsed': false, 'isGenderCollapsed' : true,
      'isFeaturesCollapsed' : true, 'isLocationCollapsed': true, 'organizations': [], 'genders': []
  };
  var lions_cvreq_filters = {
      'LionAge': {},
      'name_or_id': '', 'tag_features': '', 'location': {'latitude':'','longitude': '', 'radius': ''}, 'reverse': false, 'predicate': 'id',
      'PerPage': 0, 'currentPage': 0, 'isAgeCollapsed': true,
      'isOrgCollapsed': true, 'isNameIdCollapsed': false, 'isGenderCollapsed' : true,
      'isFeaturesCollapsed' : true, 'isLocationCollapsed': true, 'organizations': [], 'genders': []
  };
  var default_organizations = [];
  var default_genders = [];
  var default_age = {};

  var init_organizations = function(type){
    var deferred = $q.defer();
     LincServices.Organizations().then(function (organizations){
      default_organizations =  _.map(organizations, function(element) {
        return _.extend({}, element, {checked: true});
      });
      lions_filters.organizations = angular.copy(default_organizations);
      imagesets_filters.organizations = angular.copy(default_organizations);
      lions_cvreq_filters.organizations = angular.copy(default_organizations);
      if(type=='lion')
        deferred.resolve(lions_filters);
      else if(type=='imageset')
        deferred.resolve(imagesets_filters);
      else if(type=='cvrequest')
        deferred.resolve(lions_cvreq_filters);
      else{
        deferred.resolve({"organizations": default_organizations, "genders": default_genders, "LionAge": default_age, 
                 "name_or_id": '', "tag_features" : '', "location": {}, "isAgeCollapsed": true,
                 "isOrgCollapsed": true, "isNameIdCollapsed": false, "isGenderCollapsed": true,
                 "isFeaturesCollapsed" : true, "isLocationCollapsed": true});
      }
    },function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  default_genders = [{'name': 'male', 'label': 'Male', 'checked': true},{'name': 'female', 'label': 'Female', 'checked': true}, {'name': 'unknown', 'label': 'Unknown', 'checked': true}];
  lions_filters.genders = angular.copy(default_genders);
  imagesets_filters.genders = angular.copy(default_genders);
  lions_cvreq_filters.genders = angular.copy(default_genders);
  default_age = { 'min': 0, 'max': 30, 'options': {'ceil': 32, 'floor': 0 }};
  lions_filters.LionAge = angular.copy(default_age);
  imagesets_filters.LionAge = angular.copy(default_age);
  lions_cvreq_filters.LionAge = angular.copy(default_age);

  if(default_organizations.length)
    init_organizations();
  
  return {
    get_defaults (){
      if(!default_organizations.length)
        return init_organizations();
      else
        return ({"organizations": default_organizations, "genders": default_genders, "LionAge": default_age, 
                 "name_or_id": '', "tag_features" : '', "location": {}, "isAgeCollapsed": true,
                 "isOrgCollapsed": true, "isNameIdCollapsed": false, "isGenderCollapsed": true,
                 "isFeaturesCollapsed" : true, "isLocationCollapsed": true});
    },
    get_lions_filters: function () {
      if(!default_organizations.length)
        return init_organizations('lion');
      else
        return (lions_filters);
    },
    set_lions_filters: function (filter) {
      lions_filters = filter;
    },
    get_imagesets_filters: function () {
      if(!default_organizations.length)
        return init_organizations('imageset');
      else
        return (imagesets_filters);
    },
    set_imagesets_filters: function (filter) {
      imagesets_filters = filter;
    },
    get_lions_cvreq_filters: function () {
      if(!default_organizations.length)
        return init_organizations('cvrequest');
      else
        return (lions_cvreq_filters);
    },
    set_lions_cvreq_filters: function (filter) {
      lions_cvreq_filters = filter;
    }
  };
}])

.factory('LincApiDataFactory', [ 'LincApiServices', '$localStorage', function(LincApiServices, $localStorage) {
  var initialized = false;
  var storage = {'settings': $localStorage.settings};
  var settings = {
      'Selected_tab': 'users',
      'users': {
        'reverse': false,
        'predicative': 'id',
        'Selecteds': [],
        'Mode': ''
      },
      'organizations': {
        'reverse': false,
        'predicative': 'id',
        'Selecteds': [],
        'Mode': ''
      },
      'lions': {
        'reverse': false,
        'predicative': 'id',
        'Selecteds': [],
        'Mode': ''
      },
      'imagesets': {
        'reverse': false,
        'predicative': 'id',
        'Selecteds': [],
        'Mode': ''
      },
      'images': {
        'reverse': false,
        'predicative': 'id',
        'Selecteds': [],
        'Mode': '',
        'currentPage': 0
      },
      'cvrequests': {
        'reverse': false,
        'predicative': 'id',
        'Selecteds': [],
        'Mode': ''
      },
      'cvresults': {
        'reverse': false,
        'predicative': 'id',
        'Selecteds': [],
        'Mode': ''
      }
  }

  if(storage.settings)
    settings = storage.settings;
  return {
    get_settings: function () {
      return (settings);
    },
    set_settings: function (source) {
      settings = source;
      $localStorage.settings = settings;
    }
  };
}])

.factory('toClipboard', ['$compile','$rootScope','$document', function($compile,$rootScope,$document) {
  return {
    copy: function(element){
      var copyElement = angular.element('<span id="ngClipboardCopyId">'+element+'</span>');
      var body = $document.find('body').eq(0);
      body.append($compile(copyElement)($rootScope));

      var ngClipboardElement = angular.element(document.getElementById('ngClipboardCopyId'));
      var range = document.createRange();

      range.selectNode(ngClipboardElement[0]);

      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);

      var successful = document.execCommand('copy');

      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      window.getSelection().removeAllRanges();

      copyElement.remove();
    }
  }
}]);
