angular.module('lion.guardians.linc.data.factory', [])

.factory('LincDataFactory', [ 'LincServices',function(LincServices) {
  var initialized = false;
  var lions_filters = {
      'LionAge': {},
      'name_or_id': '', 'features': '', 'reverse': false, 'predicate': 'id',
      'PerPage': 0, 'currentPage': 0, 'isAgeCollapsed': true,
      'isOrgCollapsed': true, 'isNameIdCollapsed': false, 'isGenderCollapsed' : true,
      'isFeaturesCollapsed' : true, 'organization': [], 'genders': []
  };
  var imagesets_filters = {
      'LionAge': {},
      'name_or_id': '', 'features': '', 'reverse': false, 'predicate': 'id',
      'PerPage': 0, 'currentPage': 0, 'isAgeCollapsed': true,
      'isOrgCollapsed': true, 'isNameIdCollapsed': false, 'isGenderCollapsed' : true,
      'isFeaturesCollapsed' : true, 'organization': [], 'genders': []
  };
  var lions_cvreq_filters = {
      'LionAge': {},
      'name_or_id': '', 'features': '', 'reverse': false, 'predicate': 'id',
      'PerPage': 0, 'currentPage': 0, 'isAgeCollapsed': true,
      'isOrgCollapsed': true, 'isNameIdCollapsed': false, 'isGenderCollapsed' : true,
      'isFeaturesCollapsed' : true, 'organization': [], 'genders': []
  };
  if(!initialized){
    LincServices.Organizations().then(function (organizations){
      lions_filters.organizations =  _.map(organizations, function(element) {
        return _.extend({}, element, {checked: true});
      });
      imagesets_filters.organizations = angular.copy(lions_filters.organizations);
      lions_cvreq_filters.organizations = angular.copy(lions_filters.organizations);
    });
    lions_filters.genders = [{'name': 'male', 'label': 'Male', 'checked': true},{'name': 'female', 'label': 'Female', 'checked': true}, {'name': 'unknown', 'label': 'Unknown', 'checked': true}];
    imagesets_filters.genders = [{'name': 'male', 'label': 'Male', 'checked': true},{'name': 'female', 'label': 'Female', 'checked': true}, {'name': 'unknown', 'label': 'Unknown', 'checked': true}];
    lions_cvreq_filters.genders = [{'name': 'male', 'label': 'Male', 'checked': true},{'name': 'female', 'label': 'Female', 'checked': true}, {'name': 'unknown', 'label': 'Unknown', 'checked': true}];
    lions_filters.LionAge = { 'min': 0, 'max': 30, 'options': {'ceil': 32, 'floor': 0 }};
    imagesets_filters.LionAge = { 'min': 0, 'max': 30, 'options': {'ceil': 32, 'floor': 0 }};
    lions_cvreq_filters.LionAge = { 'min': 0, 'max': 30,  'options': {'ceil': 32, 'floor': 0 }};
  };
  return {
    get_lions_filters: function () {
      return (lions_filters);
    },
    set_lions_filters: function (filter) {
      lions_filters = filter;
    },
    get_imagesets_filters: function () {
      return (imagesets_filters);
    },
    set_imagesets_filters: function (filter) {
      imagesets_filters = filter;
    },
    get_lions_cvreq_filters: function () {
      return (lions_cvreq_filters);
    },
    set_lions_cvreq_filters: function (filter) {
      lions_cvreq_filters = filter;
    }
  };
}]);
