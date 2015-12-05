'use strict';

angular.module('lion.guardians.interceptor.factory', [])

.factory('httpInterceptor', ['$q', '$injector', '$localStorage', '$cookies', function($q, $injector, $localStorage, $cookies){
  return {
      'response': function (response) {
          if (response.status === 401) {
              console.log("Response 401");
          }
          return response || $q.when(response);
      },
      'responseError': function (rejection) {
          if (rejection.status === 401) {
            $localStorage.$reset();
            $cookies.remove("userlogin");
            $injector.get('$state').transitionTo('login');
            console.log("Response Error 401");
          }
          if (rejection.status === 403) {
            NotificationFactory.info({
              title: 'Forbidden', message: 'Not authorized to access',
              position: 'left',  // right, left, center
              duration: 5000     // milisecond
            });
          }
          return $q.reject(rejection);
      }
  };
}])

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
});
