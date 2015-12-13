angular.module('lion.guardians.auth.services', [])

.factory('AuthService', ['$http', '$localStorage', '$cookies', function ($http, $localStorage, $cookies) {
  var authService = {'user': $localStorage.user};

  authService.Login = function (data, success, error){
    var req = { method: 'POST',
                url: '/login',
                data: data,
                headers: { 'Content-Type': 'application/json', 'X-XSRFToken' : data['_xsrf']},
                config: {}};
    $http(req).then(function(response){
      var data = response.data.data;
      var auth_user = {
        'name': data['username'],
        'id': data['id'],
        'organization': data['orgname'],
        'organization_id': data['organization_id'],
        'admin': data['admin'],
        'logged': true,
        'token': data['token']
      }
      $localStorage.user = auth_user;
      authService.user = auth_user;
      success(auth_user.logged);
    }, error);
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
      authService.user = null;
      success();
    }, function(response){
      $cookies.remove('userlogin');
      $localStorage.$reset();
      authService.user = null;
      error(response);
    });
  };

  authService.isAuthenticated = function(){
    var user = authService.user;
    if(user==undefined || !user.logged)
      return false;
    else
      return true;
  };
  authService.isAuthorized = function (authorized) {
    var user = authService.user;
    if(user==undefined) return false;
    if(!user.logged) return false;
    if(user.admin) return true;
    if(authorized=='admin') return false;
    return true;
  };
  authService.setUser = function (val) {
    authService.user = val;
    $localStorage.user = val;
  };
  return authService;
}]);
