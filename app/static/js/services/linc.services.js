angular.module('lion.guardians.services', [])

.factory('LincServices', ['$http', '$cacheFactory', '$q', '$cookies', 'NotificationFactory', function($http, $cacheFactory, $q, $cookies, NotificationFactory) {
  // cache
  var $httpcache = $cacheFactory.get('$http');
  // default get
  var HTTPGet = function (url, label){
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
        if(label){
          NotificationFactory.error({
            title: "Error", message: 'Unable to load ' + label + ' data',
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        }
        deferred.reject(error);
      });
    }
    return deferred.promise;
  };

  var databases = {};
      databases['lions'] =         {label: 'Lions', url: '/lions'};
      databases['organizations'] = {label: 'Organizations',  url: '/organizations'};
      databases['imagesets'] =     {label: 'Imagesets', url: '/imagesets'};
      databases['images'] =        {label: 'Images', url: '/images'};

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
    function (error) {
      console.log(error);
    });
  };
  /*// Get All Lists
  var Get_All_Lists = function (fn) {
    var names = Object.keys(databases);
    return (GetLists(names,fn));
  };*/

  var GetImageSet= function (id,  fn) {
    var url = databases['imagesets'].url + '/' + id;
    var label = databases['imagesets'].label;
    HTTPGet(url, label).then(function (results) {
      fn(results);
    },
    function (error) {
      console.log(error);
    });
  };
  // Get Lion by Id
  var GetLion = function (id,  fn) {
    var url = databases['lions'].url + '/' + id;
    var label = databases['lions'].label;
    HTTPGet(url, label).then(function (results) {
      fn(results);
    },
    function (error) {
      console.log(error);
    });
  };
  var GetOrg = function (id,  fn) {
    var url = databases['organizations'].url + '/' + id;
    var label = databases['organizations'].label;
    HTTPGet(url, label).then(function (results) {
      fn(results.data);
    },
    function (error) {
      console.log(error);
    });
  };

  // POSTS AND PUTS

  var HTTPPutPost = function (url, metod, data) {
    var deferred = $q.defer();
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    $http({
      method: metod,
      headers: { 'Content-Type': 'application/json'},
      url: url,
      data: data
    })
    .then(function(result){
      deferred.resolve(result);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };
  var Post_RequestCV = function (request, fn) {
    var url = '/imagesets/' + request.imageset_id + '/cvrequest';
    var metod = 'POST';
    var data = {"lions": request.lions_id};

    HTTPPutPost(url, metod, data).then(function (results) {
      NotificationFactory.success({
        title: "Success", message:'CV Request created with success',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
      fn(results);
    },
    function (error) {
      if(error.status == 500){
        NotificationFactory.error({
          title: "Error", message: 'Request failed',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      console.log(error);
    });
  };
  var Post_CVResults = function (cvrequest_id, fn) {
    var url = '/cvresults/';
    var metod = 'POST';
    var data = {"cvrequest_id":cvrequest_id};

    HTTPPutPost(url, metod, data, fn).then(function (results) {
      NotificationFactory.success({
        title: "Success", message:'CV Request created with success',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
      fn(results);
    },
    function (error) {
      if(error.status == 500){
        NotificationFactory.error({
          title: "Error", message: 'Request failed',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      console.log(error);
    });
  };

  var Get_CVResults = function (cvresults_id, fn) {
    var url = '/cvresults/' + cvresults_id + '/list';
    var label = 'CV Results'
    HTTPGet(url).then(function (results) {
      fn(results.data);
    },
    function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Unable to load CV Results List',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      console.log(error);
    });
  };

  var dataFactory = {};
  dataFactory.getLion = GetLion;
  dataFactory.getOrganization = GetOrg;
  dataFactory.GetImageSet = GetImageSet;
  dataFactory.getlists = GetLists;

  dataFactory.requestCV = Post_RequestCV;
  dataFactory.requestCVResults = Post_CVResults;
  dataFactory.getListCVResults = Get_CVResults

  return dataFactory;
}])


.factory('SelectedLion', function() {
  var _lion = {};
  return {
    Selectedlion: _lion
  };
})

;
