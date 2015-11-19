angular.module('lion.guardians.linc.data.factory', [])

.factory('LincDataFactory', [ 'LincServices',function(LincServices) {
  var initialized = false;
  var lions_filters = {
      'LionAge': { 'min': 0, 'max': 30, 'ceil': 30, 'floor': 0 },
      'name_or_id': '', 'reverse': false, 'predicate': 'id',
      'PerPage': 0, 'currentPage': 0, 'isAgeCollapsed': true,
      'isOrgCollapsed': true, 'isNameIdCollapsed': false,
      'organization': []
  };
  var imagesets_filters = {
      'LionAge': { 'min': 0, 'max': 30, 'ceil': 30, 'floor': 0 },
      'name_or_id': '', 'reverse': false, 'predicate': 'id',
      'PerPage': 0, 'currentPage': 0, 'isAgeCollapsed': true,
      'isOrgCollapsed': true, 'isNameIdCollapsed': false,
      'organization': []
  };
  if(!initialized){
    LincServices.Organizations().then(function (organizations){
      lions_filters.organizations =  _.map(organizations, function(element) {
        return _.extend({}, element, {checked: true});
      });
      imagesets_filters.organizations = angular.copy(lions_filters.organizations);
    });
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
  };
}]);
