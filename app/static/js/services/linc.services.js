angular.module('lion.guardians.services', [])

.factory('LincServices', ['$http', '$cacheFactory', '$q', '$cookies', 'NotificationFactory', function($http, $cacheFactory, $q, $cookies, NotificationFactory) {
  // cache
  var $httpcache = $cacheFactory.get('$http');
  // default get
  var HTTPCachedGet = function (url, label){
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
    var promises = names.map(function(name) {
      var url = databases[name].url + '/list';
      var label = databases[name].label + ' List';
      return HTTPCachedGet(url, label);
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

  var GetImageSet= function (id,  fn) {
    var url = databases['imagesets'].url + '/' + id;
    var label = databases['imagesets'].label;
    HTTPCachedGet(url, label).then(function (results) {
      fn(results.data);
    },
    function (error) {
      console.log(error);
    });
  };
  // Get Lion by Id
  var GetLion = function (id,  fn) {
    var url = databases['lions'].url + '/' + id;
    var label = databases['lions'].label;
    HTTPCachedGet(url, label).then(function (results) {
      fn(results.data);
    },
    function (error) {
      console.log(error);
    });
  };
  // Get Locations
  var GetLocations = function (id,  fn) {
    var url = databases['lions'].url + '/' + id + '/locations';
    var label = databases['lions'].label;
    HTTPCachedGet(url, label).then(function (results) {
      fn(results.data);
    },
    function (error) {
      console.log(error);
    });
  };

  var GetOrg = function (id,  fn) {
    var url = databases['organizations'].url + '/' + id;
    var label = databases['organizations'].label;
    HTTPCachedGet(url, label).then(function (results) {
      fn(results.data);
    },
    function (error) {
      console.log(error);
    });
  };

  var ClecarAllCaches = function (fn) {
    $httpDefaultCache.removeAll();
  };

  var ClearAllImagesetsCaches = function () {
    $httpcache.remove('/imagesets/list');
  };

  var ClearImagesetProfileCache = function (id) {
    $httpcache.remove('/imagesets/' + id);
  };

  var HTTP = function (metod, url, data, success, error) {
    if(metod == 'GET'){
      $http.get(url).then(success, error);
    }
    /*else if(metod == 'DELETE'){
      $http.delete(url).then(success, error);
    }*/
    else{
      var req = { method: metod, url: url, data: data,
                  headers: { 'Content-Type': 'application/json'}};
      $http(req).then(success, error);
    }
  }

  var PostImageSets = function (metod, request, success, fail) {
    var url = '/imagesets/' + request.imageset_id + '/cvrequest';
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    var data = {"lions": request.lions_id};
    angular.merge(data, cookies);
    return HTTP('POST', url, data,
      function (results) {
        NotificationFactory.success({
          title: "Success", message:'CV Request created with success',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        success(results);
      },
      function (error) {
        if(error.status == 500){
          NotificationFactory.error({
            title: "Error", message: 'Request failed',
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        }
        fail(error);
        console.log(error);
      }
    );
  };

  var GetCVResults = function (cvresults_id, success) {
    return HTTP('GET', '/cvresults/' + cvresults_id + '/list', null,
    function (results){
      success(results.data);
    }, function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to load CV Results List',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      console.log(error);
    });
  };
  var PutImageSet = function (imageset_id, data, success){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    //var data = {"cvrequest_id":cvrequest_id};
    angular.merge(data, cookies);
    return HTTP('PUT', '/imagesets/' + imageset_id, data, success,
    function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to Put Datas in ImageSets',
        position: 'right', // right, left, center
        duration: 180000   // milisecond
      });
      console.log(error);
    });
  }
  var PostCVResults = function (cvrequest_id, success){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    var data = {"cvrequest_id":cvrequest_id};
    angular.merge(data, cookies);
    return HTTP('POST', '/cvresults', data, success,
    function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to Post CV Results',
        position: 'right', // right, left, center
        duration: 180000   // milisecond
      });
      console.log(error);
    });
  };
  var PutCVResults = function (cvrequest_id, success){
    var data = {'_xsrf': $cookies.get('_xsrf')};
    //var data = {"cvrequest_id":cvrequest_id};
    //angular.merge(data, cookies);
    return HTTP('PUT', '/cvresults/' + cvrequest_id, data, success,
    function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to Post CV Results',
        position: 'right', // right, left, center
        duration: 180000   // milisecond
      });
      console.log(error);
    });
  };
  var DeleteCVRequest = function (cvrequest_id, success){
    var data = {'_xsrf': $cookies.get('_xsrf')};
    //var data = {"cvrequest_id":cvrequest_id};
    //angular.merge(data, cookies);
    return HTTP('DELETE', '/cvrequest/' + cvrequest_id, data, success,
    function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to Delete CV Results/CVRequest',
        position: 'right', // right, left, center
        duration: 180000   // milisecond
      });
      console.log(error);
    });
  };
  var dataFactory = {};
  // List of ImageSets , Lions and Organizations
  dataFactory.getlists = GetLists;
  // Lion to lion Profile
  dataFactory.Lion = GetLion;
  // ImageSet to ImageSet Profile
  dataFactory.ImageSet = GetImageSet;
  // Location History
  dataFactory.LocationHistory = GetLocations;
  //dataFactory.getOrganization = GetOrg;
  dataFactory.requestCV = PostImageSets;
  dataFactory.postCVResults = PostCVResults;
  dataFactory.putCVResults = PutCVResults;
  dataFactory.getListCVResults = GetCVResults;

  dataFactory.Associate = PutImageSet;
  dataFactory.deleteCVRequest = DeleteCVRequest;

  dataFactory.ClearAllCaches = ClecarAllCaches;
  dataFactory.ClearAllImagesetsCaches = ClearAllImagesetsCaches;
  dataFactory.ClearImagesetProfileCache = ClearImagesetProfileCache;
  return dataFactory;
}])

;
