//angular.module('lion-guardians', [])  ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
var app = angular.module('lion.guardians', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap', 'lion.controllers']);

'use strict';

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

