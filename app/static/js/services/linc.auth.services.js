angular.module('lion.guardians.auth.services', [])

.factory('AuthService', ['$http', '$localStorage', '$cookies', function ($http, $localStorage, $cookies) {
  var authService = {};

  authService.Login = function (data, success, error){
    var req = { method: 'POST',
                url: '/login',
                data: data,
                headers: { 'Content-Type': 'application/json', 'X-XSRFToken' : data['_xsrf']},
                config: {}};
    $http(req).then(success, error);
  };

  authService.Logout = function (success, error){
    var xsrfcookie = $cookies.get('_xsrf');
    var req = { method: 'POST',
                   url: '/logout',
                  data: {},
               headers: { 'Content-Type': 'application/json', 'X-XSRFToken' : xsrfcookie},
                config: {}};
    $http(req).then(function(response){
      $cookies.remove('userlogin');
      $localStorage.$reset();
      success();
    }, function(error){
      $cookies.remove('userlogin');
      $localStorage.$reset();
      error();
    });
  };

  authService.isAuthenticated = function(){
    var user = $localStorage.user;
    if(user==undefined || !user.logged)
      return false;
    else
      return true;
  };
  authService.isAuthorized = function (authorized) {
    var user = $localStorage.user;
    if(user==undefined) return false;
    if(!user.logged) return false;
    if(user.admin) return true;
    if(authorized=='admin') return false;
    return true;
  };
  return authService;
}]);
