angular.module('lion.guardians.services', [])

.factory('LincServices', ['$http', '$cacheFactory', '$q', '$cookies', 'NotificationFactory', function($http, $cacheFactory, $q, $cookies, NotificationFactory) {
  // cache
  var $httpcache = $cacheFactory.get('$http');
  // default get
  var HTTPCachedGet = function (url, config){
    var cache = $httpcache.get(url);
    var deferred = $q.defer();
    if(cache && cache.length>1){
      var responde = JSON.parse(cache[1]);
      deferred.resolve(responde);
    }
    else{
      angular.merge(config, {cache: true});
      $http.get(url, config)
      .success(function (response) {deferred.resolve(response);})
      .error(function (error) {deferred.reject(error);});
    }
    return deferred.promise;
  };

  var databases = {};
      databases['lions'] =         {label: 'Lions', url: '/lions'};
      databases['organizations'] = {label: 'Organizations',  url: '/organizations'};
      databases['imagesets'] =     {label: 'Imagesets', url: '/imagesets'};
      databases['images'] =        {label: 'Images', url: '/images'};
  // Get All Imagesets List
  var GetAllImageSets = function () {
    var deferred = $q.defer();
    var url = databases['imagesets'].url + '/list';
    HTTPCachedGet(url, {}).then(function (results) {
      deferred.resolve(results.data);
    },
    function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Unable to load Imagesets data',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      deferred.reject(error);
    });
    return deferred.promise;
  };
  // Get All Lions List
  var GetAllLions = function () {
    var deferred = $q.defer();
    var url = databases['lions'].url + '/list';
    HTTPCachedGet(url, {}).then(function (results) {
      deferred.resolve(results.data);
    },
    function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Unable to load Lions datas',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      deferred.reject(error);
    });
    return deferred.promise;
  };
  // Get All Organizations List
  var GetAllOrganizations = function () {
    var deferred = $q.defer();
    var url = databases['organizations'].url + '/list';
    HTTPCachedGet(url, {}).then(function (results) {
      deferred.resolve(results.data);
    },
    function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Unable to load Lions data',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      deferred.reject(error);
    });
    return deferred.promise;
  };
  // Get Imageset by Id
  var GetImageSet= function (id) {
    var deferred = $q.defer();
    var url = databases['imagesets'].url + '/' + id + '/profile';
    HTTPCachedGet(url, {}).then(function (results) {
      deferred.resolve(results.data);
    },
    function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Unable to load Imageset data',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      deferred.reject(error);
    });
    return deferred.promise;
  };
  // Get Images Gallery
  var GetImageGallery = function (id) {
    var deferred = $q.defer();
    var url = databases['imagesets'].url + '/' + id + '/gallery';
    HTTPCachedGet(url,{ignoreLoadingBar: true}).then(function (results) {
        deferred.resolve(results.data);
    },
    function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Unable to load Image Gallery',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      deferred.reject(error);
    });
    return deferred.promise;
  };
  // Get Lion by Id
  var GetLion = function (id) {
    var deferred = $q.defer();
    var url = databases['lions'].url + '/' + id + '/profile';
    HTTPCachedGet(url, {}).then(function (results) {
       deferred.resolve(results.data);
    },
    function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Unable to load Lion data',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      deferred.reject(error);
    });
    return deferred.promise;
  };
  // Get Lion History Locations
  var GetLocations = function (id) {
    var deferred = $q.defer();
    var url = databases['lions'].url + '/' + id + '/locations';
    HTTPCachedGet(url,{ignoreLoadingBar: true}).then(function (results) {
        deferred.resolve(results.data);
    },
    function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Unable to load History Locations data',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      deferred.reject(error);
    });
    return deferred.promise;
  };

  // Clean Caches
  var ClearAllCaches = function (fn) { $httpDefaultCache.removeAll(); };
  var ClearAllImagesetsCaches = function () { $httpcache.remove('/imagesets/list'); };
  var ClearImageGalleryCache = function (id) { $httpcache.remove('/imagesets/' + id + '/gallery'); };
  var ClearImagesetProfileCache = function (id) { $httpcache.remove('/imagesets/' + id); };
  // Http without cache
  var HTTP = function (metod, url, data, config, success, error) {
    if(metod == 'GET'){ $http.get(url, config).then(success, error); }
    else{ var req = { method: metod, url: url, data: data, headers: { 'Content-Type': 'application/json'}, config: config}; $http(req).then(success, error); }
  }
  // Post Imageset (CV Request)
  var RequestCV = function (imageset_id, data, success) {
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('POST', '/imagesets/' + imageset_id + '/cvrequest', data, {}, success,
    function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Request failed',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      console.log(error);
    });
  };
  // Associate  (Update Imageset)
  var Associate = function (imageset_id, data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('PUT', '/imagesets/' + imageset_id, data, {}, success, error);
  }
  // Put ImageSet (Update Imageset)
  var PutImageSet = function (imageset_id, data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('PUT', '/imagesets/' + imageset_id, data, {}, success, error);
  }
  // Post ImageSet - New Imageset
  var PostImageset = function (data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('POST', '/imagesets', data, {}, success, error);
  };
  // Put Lion (Update Lion)
  var PutLion = function (lion_id, data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('PUT', '/lions/' + lion_id, data, {}, success, error);
  }
  // Post Lion - New Lion
  var PostLion = function (data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('POST', '/lion', data, {}, success, error);
  };
  // Put Lion (Update Lion)
  var PutImage = function (image_id, data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('PUT', '/images/' + image_id, data, {}, success, error);
  }

  var PutImages = function (items, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    var promises = items.map(function(item) {
      var deferred = $q.defer();
      var data = item.data;
      angular.merge(data, cookies);
      var req = { method: 'PUT',
                  url: '/images/' + item.image_id,
                  data: item.data,
                  headers: { 'Content-Type': 'application/json'},
                  config: {ignoreLoadingBar: true}};
      return $http(req);
    });
    $q.all(promises).then(function (results) {
      var dados = {};
      results.forEach( function (result, index) {
        var key = names[index];
        dados[key] = result.data;
      })
      success(dados);
    },
    function (reason) {
      error(reason);
    });
  }
  // Delete CVRequest / CVResults
  var DeleteImage = function (image_id, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    return HTTP('DELETE', '/images/' + image_id, cookies, {}, success, error);
  };

  var DeleteImages = function (items, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    var promises = items.map(function(item) {
      var deferred = $q.defer();
      //var data = item.data;
      //angular.merge(data, cookies);
      var req = { method: 'DELETE',
                  url: '/images/' + item.id,
                  data: cookies,
                  headers: { 'Content-Type': 'application/json'},
                  config: {ignoreLoadingBar: true}};
      return $http(req);
    });
    $q.all(promises).then(function (results) {
      var result = {'message': 'success'};
      success(result);
    },
    function (reason) {
      error(reason);
    });
  };
  /*
  var GetLists = function(names, fn){
    var requests = [];
    var promises = names.map(function(name) {
      var url = databases[name].url;
      var label = databases[name].label;
      return Get(url, label);
    });
    $q.all(promises).then(function (results) {
      var dados = {};
      results.forEach( function (result, index) {
        var key = names[index];
        dados[key] = result.data;
      })
      notificationFactory.success({
        title: "Database", message:'Database Successfully Loaded',
        position: "right", // right, left, center
        duration: 2000     // milisecond
      });
      fn(dados);
    },
    function (reason) {
      console.log(reason);
    });
  };
  */
  // Get CV Results
  var GetCVResults = function (cvresults_id) {
    var deferred = $q.defer();
    var url = '/cvresults/' + cvresults_id + '/list';
    HTTP('GET', url, null, {ignoreLoadingBar: true},
    function (results){
      var data = results.data.data.table;
      var associated_id = results.data.data.associated.id;
      var cvresults = _.map(data, function(element, index) {
        var elem = {};
        if(associated_id == element.id) elem["associated"] = true;
        else elem["associated"] = false;
        return _.extend({}, element, elem);
      });
      deferred.resolve(cvresults);
    }, function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to load CV Results List',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      deferred.reject(error);
    });
    return deferred.promise;
  };
  // Post CVResults - Request CV Results
  var PostCVResults = function (cvrequest_id, success){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    var data = {"cvrequest_id":cvrequest_id};
    angular.merge(data, cookies);
    return HTTP('POST', '/cvresults', data, {}, success,
    function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to Post CV Results',
        position: 'right', // right, left, center
        duration: 180000   // milisecond
      });
      console.log(error);
    });
  };
  // Put CVResults - Update Request CV Results
  var PutCVResults = function (cvrequest_id, success){
    var data = {'_xsrf': $cookies.get('_xsrf')};
    //var data = {"cvrequest_id":cvrequest_id};
    //angular.merge(data, cookies);
    return HTTP('PUT', '/cvresults/' + cvrequest_id, data, {}, success,
    function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to Post CV Results',
        position: 'right', // right, left, center
        duration: 180000   // milisecond
      });
      console.log(error);
    });
  };
  // Delete CVRequest / CVResults
  var DeleteCVRequest = function (cvrequest_id, success){
    var data = {'_xsrf': $cookies.get('_xsrf')};
    //var data = {"cvrequest_id":cvrequest_id};
    //angular.merge(data, cookies);
    return HTTP('DELETE', '/cvrequest/' + cvrequest_id, data, {}, success,
    function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to Delete CV Results/CVRequest',
        position: 'right', // right, left, center
        duration: 180000   // milisecond
      });
      console.log(error);
    });
  };

  var Login = function (data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    //var data = {"input_data": input_data};
    angular.merge(data, cookies);
    return HTTP('POST', '/login', data, {}, success, error);
  };

  var dataFactory = {};
  // List of ImageSets , Lions and Organizations
  dataFactory.Organizations = GetAllOrganizations;
  dataFactory.ImageSets = GetAllImageSets;
  dataFactory.Lions = GetAllLions;
  // ImageSet to ImageSet Profile
  dataFactory.ImageSet = GetImageSet;
  // Lion to lion Profile
  dataFactory.Lion = GetLion;
  // Location History
  dataFactory.LocationHistory = GetLocations;
  // Clean Caches
  dataFactory.ClearAllCaches = ClearAllCaches;
  dataFactory.ClearAllImagesetsCaches = ClearAllImagesetsCaches;
  dataFactory.ClearImagesetProfileCache = ClearImagesetProfileCache;
  dataFactory.ClearImageGalleryCache = ClearImageGalleryCache
  // CV Request (Post Imageset w/ /request)
  dataFactory.requestCV = RequestCV;
  // Update Imageset
  dataFactory.Associate = Associate;
  dataFactory.SaveImageset = PutImageSet;
  dataFactory.CreateImageset = PostImageset;

  // Images
  dataFactory.UpdateImages = PutImages;
  dataFactory.UpdateImage = PutImage;
  dataFactory.DeleteImage = DeleteImage;
  dataFactory.DeleteImages = DeleteImages;
  // Update Lion
  dataFactory.SaveLion = PutLion;
  dataFactory.CreateLion = PostLion;

  // Get List of CV Results
  dataFactory.getCVResults = GetCVResults;
  // Post CV Results - Request Results
  dataFactory.postCVResults = PostCVResults;
  // Update Request CV Results
  dataFactory.putCVResults = PutCVResults;
  // Delete CV Results and CV Request
  dataFactory.deleteCVRequest = DeleteCVRequest;

  dataFactory.getImageGallery = GetImageGallery;

  dataFactory.Login = Login;
  return dataFactory;
}])

;
