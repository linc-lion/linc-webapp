angular.module('lion.guardians.api.services', [])

.factory('LincApiServices', ['$http', '$q', '$cookies', 'NotificationFactory', function($http, $q, $cookies, NotificationFactory) {

  var HTTP = function (metod, url, data, config, success, error) {
    if(metod == 'GET'){ $http.get(url, config).then(success, error); }
    else{
      var xsrfcookie = $cookies.get('_xsrf');
      var req = { method: metod, url: url, data: data,
        headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie}, config: config};
      $http(req).then(success, error); }
  }

  var Organizations = function (data_in) {
    var deferred = $q.defer();
    if(data_in.method=='get'){
      var url = '/organizations/';
      HTTP('GET', url, null, {},
      function (results){
        var data = results.data.data;
        var organizations = _.map(data, function(org) {
          org.created_at = org.created_at.substring(0,19);
          org.updated_at = org.updated_at.substring(0,19);
          return _.extend({}, org, {'selected': false, 'change_mode': false});
        });
        deferred.resolve(organizations);
      }, function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to load Organizations',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
    }
    if(data_in.method=='delete'){
      var organizations_id = data_in.organizations_id;
      var xsrfcookie = $cookies.get('_xsrf');
      var promises = organizations_id.map(function(id) {
        var req = { method: 'DELETE',
                    url: '/organizations/' + id,
                    data: {'_xsrf': xsrfcookie},
                    headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie},
                    config: {ignoreLoadingBar: true}};
        return $http(req);
      });
      $q.all(promises).then(function (results) {
        var result = {'message': 'success'};
        deferred.resolve(result);
      },
      function (reason) {
        deferred.reject(reason);
      });
    }
    if(data_in.method=='put'){
      var organizations_id = data_in.organizations_id;
      var data = data_in.data;
      var cookies = {'_xsrf': $cookies.get('_xsrf')};
      angular.merge(data, cookies);
      HTTP('PUT', '/organizations/' + organizations_id, data, {},
      function (response) {
        deferred.resolve(response.data);
      },
      function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Save Organizations data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
    }
    if(data_in.method=='post'){
      var data = data_in.data;
      var cookies = {'_xsrf': $cookies.get('_xsrf')};
      angular.merge(data, cookies);
      HTTP('POST', '/organizations/', data, {},
      function (response) {
        deferred.resolve(response.data);
      },
      function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Create New Organization',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
    }
    return deferred.promise;
  };

  var Users = function (data_in) {
    var deferred = $q.defer();
    if(data_in.method=='get'){
      var url = '/users';
      HTTP('GET', url, null, {},
      function (results){
        var data = results.data.data;
        var organizations = data_in.organizations;
        var users =  _.map(data, function(user) {

          user.created_at = user.created_at.substring(0,19);
          user.updated_at = user.updated_at.substring(0,19);

          user.current_sign_in_at = user.current_sign_in_at.substring(0,19);
          user.last_sign_in_at = user.last_sign_in_at.substring(0,19);

          var text =
          'Current Sign In At: ' + user.current_sign_in_at + ';<br>' +
          'Current Sign In Ip: ' + user.current_sign_in_ip + ';<br>' +
          'Last Sign In At: ' + user.last_sign_in_at + ';<br>' +
          'Last Sign In Ip: ' + user.last_sign_in_ip + ';<br>' +
          'Sign In Count: ' + user.sign_in_count;
          var tooltip = {'title': text, 'checked': true};

          var id = user.organization_id;
          var organization = _.find(organizations, {'id': id});
          if(organization != undefined){
            return _.extend({}, user, {'organization': organization['name'], 'tooltip': tooltip, 'selected': false, 'change_mode': false});
          }
          else {
            return _.extend({}, user, {'organization': '-', 'selected': false, 'change_mode': false});
          }
        });
        deferred.resolve(users);
      }, function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Get Users data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
    }
    if(data_in.method=='delete'){
      var users_id = data_in.users_id;
      var xsrfcookie = $cookies.get('_xsrf');
      var promises = users_id.map(function(id) {
        var req = { method: 'DELETE',
                    url: '/users/' + id,
                    data: {'_xsrf':xsrfcookie},
                    headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie},
                    config: {ignoreLoadingBar: true}};
        return $http(req);
      });
      $q.all(promises).then(function (results) {
        var result = {'message': 'success'};
        deferred.resolve(result);
      },
      function (reason) {
        deferred.reject(reason);
      });
    }
    if(data_in.method=='put'){
      var users_id = data_in.user_id;
      var data = data_in.data;
      var cookies = {'_xsrf': $cookies.get('_xsrf')};
      angular.merge(data, cookies);
      HTTP('PUT', '/users/' + users_id, data, {},
      function (response) {
        deferred.resolve(response.data);
      },
      function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Save User data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
    }
    if(data_in.method=='post'){
      var data = data_in.data;
      var cookies = {'_xsrf': $cookies.get('_xsrf')};
      angular.merge(data, cookies);
      HTTP('POST', '/users/', data, {},
      function (response) {
        deferred.resolve(response.data);
      },
      function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Create New User',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
    }
    return deferred.promise;
  };

  var Lions = function (data_in) {
    if(data_in.method=='get'){
      var deferred = $q.defer();
      var url = '/lions?api=true';
      HTTP('GET', url, null, {},
      function (results){
        var data = results.data.data;
        var organizations = data_in.organizations;

        var lions = _.map(data, function(lion) {
          lion.created_at = lion.created_at.substring(0,19);
          lion.updated_at = lion.updated_at.substring(0,19);
          var id = lion.organization_id;
          var organization = _.find(organizations, {'id': id});
          if(organization != undefined){
            return _.extend({}, lion, {'organization': organization['name'], 'selected': false, 'change_mode': false});
          }
          else{
            return _.extend({}, lion, {'organization': '-', 'selected': false, 'change_mode': false});
          }
        });
        deferred.resolve(lions);
      }, function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to get Lions datas',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };

  var ImageSets = function (data_in) {
    if(data_in.method=='get'){
      var deferred = $q.defer();
      var url = '/imagesets';
      HTTP('GET', url, null, {},
      function (results){
        var data = results.data.data;
        var organizations = data_in.organizations;
        var lions = data_in.lions;
        var users = data_in.users;
        var images = data_in.images;
        var imagesets = _.map(data, function(imageset) {
          imageset.created_at = imageset.created_at.substring(0,19);
          imageset.updated_at = imageset.updated_at.substring(0,19);
          if(imageset.date_of_birth)
            imageset.date_of_birth = imageset.date_of_birth.substring(0,10);
          var id = imageset.lion_id;
          var lion = _.find(lions, {'id': id});
          if(lion == undefined) lion = {'name': '-'};
          id = imageset.owner_organization_id;
          var owner_organization = _.find(organizations, {'id': id});
          if(owner_organization == undefined) owner_organization = {'name': '-'};
          id = imageset.uploading_organization_id;
          var uploading_organization = _.find(organizations, {'id': id});
          if(uploading_organization == undefined) uploading_organization = {'name': '-'};
          id = imageset.uploading_user_id;
          var uploading_user = _.find(users, {'id': id});
          if(uploading_user == undefined) uploading_user = {'email': '-'};
          id = imageset.main_image_id;
          //var main_image = _.find(images, {'id': id});
          //if(main_image == undefined) main_image = {'url': ''};

          return _.extend({}, imageset, {'lion_name': lion['name'], 'owner_organization': owner_organization['name'], 'uploading_organization': uploading_organization['name'], 'uploading_user': uploading_user['email'], /*'main_image': main_image['url'],*/ 'selected': false, 'change_mode': false});
        });
        deferred.resolve(imagesets);
      }, function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to get Image Sets datas',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };

  var Images = function (data_in) {
    if(data_in.method=='get'){
      var deferred = $q.defer();
      var url = '/images';
      HTTP('GET', url, null, {},
      function (results){
        var data = results.data.data;

        deferred.resolve(data);
      }, function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to get Images datas',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };

  var CVRequests = function (data_in) {
    if(data_in.method=='get'){
      var deferred = $q.defer();
      var url = '/cvrequests';
      HTTP('GET', url, null, {},
      function (results){
        var data = results.data.data;

        deferred.resolve(data);
      }, function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to get CV Requests datas',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };

  var CVResults = function (data_in) {
    if(data_in.method=='get'){
      var deferred = $q.defer();
      var url = '/cvresults';
      HTTP('GET', url, null, {},
      function (results){
        var data = results.data.data;

        deferred.resolve(data);
      }, function(error){
        NotificationFactory.error({
          title: "Error", message: 'Unable to get CV Results datas',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };
/*

    var UpdateUser = function (users_id, data, success, error){
      var cookies = {'_xsrf': $cookies.get('_xsrf')};
      angular.merge(data, cookies);
      return HTTP('PUT', '/users/' + users_id, data, {},
      function (result) {
        ClearAllCaches();
        success(result.data.data);
      }, error);
    }
*/
  //  dataFactory.UpdateUser = UpdateUser;*/
  var dataFactory = {};

  dataFactory.Organizations = Organizations;
  dataFactory.Users = Users;
  dataFactory.Lions = Lions;
  dataFactory.ImageSets = ImageSets;
  dataFactory.Images = Images;
  dataFactory.CVResults = CVResults
  dataFactory.CVRequests = CVRequests

  return dataFactory;
}])

;
