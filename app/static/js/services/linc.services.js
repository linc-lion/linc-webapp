angular.module('lion.guardians.services', [])

.factory('LincServices', ['$http', '$cacheFactory', '$q', '$cookies', 'notificationFactory', function($http, $cacheFactory, $q, $cookies, notificationFactory) {

  //var urlBase = 'http://localhost:5080';
  var $httpcache = $cacheFactory.get('$http');

  var databases = {};
    databases['lions'] =         {label: 'Lions', url: '/lions'};
    databases['organizations'] = {label: 'Organizations',  url: '/organizations'};
    databases['imagesets'] =     {label: 'Imagesets', url: '/imagesets'};
    databases['images'] =        {label: 'Images', url: '/images'};

  var HTTPGet = function (url, label){
    //var url = base + path;
    var cache = $httpcache.get(url);
    var deferred = $q.defer();
    if(cache && cache.length>1){
      var responde = JSON.parse(cache[1]);
      deferred.resolve(responde);
    }
    else{
      $http.get(url, {cache: true})
      .success(function (response) {
        deferred.resolve(response);
      })
      .error(function (error) {
        notificationFactory.error({
          title: "Error", message: 'Unable to load ' + label + ' data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        deferred.reject(error);
      });
    }
    return deferred.promise;
  };

  var GetImageSet= function (id,  fn) {
    var url = databases['imagesets'].url + '/' + id;
    var label = databases['imagesets'].label;
    HTTPGet(url, label).then(function (results) {
      fn(results);
    },
    function (reason) {
      console.log(reason);
    });
  };
  // Get Lion by Id
  var GetLion = function (id,  fn) {
    var url = databases['lions'].url + '/' + id;
    var label = databases['lions'].label;
    HTTPGet(url, label).then(function (results) {
      fn(results);
    },
    function (reason) {
      console.log(reason);
    });
  };
  var GetOrg = function (id,  fn) {
    var url = databases['organizations'].url + '/' + id;
    var label = databases['organizations'].label;
    HTTPGet(url, label).then(function (results) {
      fn(results.data);
    },
    function (reason) {
      console.log(reason);
    });
  };
  // Get Lions, Image Sets, Organizations, List
  var GetLists = function(names, fn){
    var requests = [];
    var promises = names.map(function(name) {
      var url = databases[name].url + '/list';
      var label = databases[name].label + ' List';
      return HTTPGet(url, label);
    });
    $q.all(promises).then(function (results) {
      var dados = {};
      results.forEach( function (result, index) {
        var key = names[index];
        dados[key] = result.data;
      })
      fn(dados);
    },
    function (reason) {
      console.log(reason);
    });
  };
  /*// Get All Lists
  var Get_All_Lists = function (fn) {
    var names = Object.keys(databases);
    return (GetLists(names,fn));
  };*/

  var RequestCV = function (request, fn) {
    var cookies = $cookies.get('_xsrf');
    var req = { method: 'POST', url: '/imagesets/' + request.imageset_id + '/cvrequest',
      headers: { 'Content-Type': 'application/json'},
      data: {"lions": request.lions_id, '_xsrf': cookies}
    }
    $http(req)
    .then(function(result){
      notificationFactory.success({
        title: "Success", message:'CV Request created with success',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
      fn(result.data.data);
    }, function(error){
      if(error.status == 500){
        notificationFactory.error({
          title: "Error", message: 'Request failed',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      console.log(error);
    });
  };
  // Get Datas
  var dataFactory = {};

  dataFactory.getLion = GetLion;
  dataFactory.getOrganization = GetOrg;
  dataFactory.GetImageSet = GetImageSet;
  dataFactory.getlists = GetLists;
  //dataFactory.getAlllists = Get_All_Lists;
  dataFactory.requestCV = RequestCV;

  return dataFactory;
}])


.factory('SelectedLion', function() {
  var _lion = {};
  return {
    Selectedlion: _lion
  };
})

;
