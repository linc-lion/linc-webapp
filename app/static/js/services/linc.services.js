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

  var GetDownload = function (data) {
    var deferred = $q.defer();
    var getFileNameFromHeader = function(header) {
      if (!header) return null;
      var result = header.split(";")[1].trim().split("=")[1];
      return result.replace(/"/g, '');
    };
    var req = {
      method: 'GET',
      url: databases['images'].url + data,
      headers: { accept: 'application/zip' },
      responseType: 'arraybuffer',
      cache: false,
      transformResponse: function(data, headers) {
        var zip = null;
        if (data) {
           zip = new Blob([data], { type: 'application/zip' });
        }
        var fileName = getFileNameFromHeader(headers('Content-Disposition'));
        var result = { blob: zip, fileName: fileName };
        return result;
      }
    };
    $http(req)
    .success(function (data, status, headers, response, statusText) {
      deferred.resolve(data);
    })
    .error(function (error) {
      NotificationFactory.error({
        title: "Error", message: 'Unable to Download Images',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      deferred.reject(error);
    });
    //deferred.resolve({'filename': 'http://www.colorado.edu/conflict/peace/download/peace_essay.ZIP'});
    return deferred.promise;
  };
  // Clean Caches
  var ClearAllCaches = function (fn) { $httpcache.removeAll(); };
  var ClearAllImagesetsCaches = function () { $httpcache.remove('/imagesets/list'); };
  var ClearImageGalleryCache = function (id) { $httpcache.remove('/imagesets/' + id + '/gallery'); };
  var ClearImagesetProfileCache = function (id) { $httpcache.remove('/imagesets/' + id + 'profile'); };
  var ClearLionProfileCache = function (id) { $httpcache.remove('/lions/' + id + 'profile'); };

  // Http without cache
  var HTTP = function (method, url, data, config, success, error) {
    if(method == 'GET'){ $http.get(url, config).then(success, error); }
    else{ var req = { method: method, url: url, data: data, headers: { 'Content-Type': 'application/json'}, config: config}; $http(req).then(success, error); }
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
  /*var Associate = function (imageset_id, data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('PUT', '/imagesets/' + imageset_id, data, {}, success, error);
  }*/
  // Put ImageSet (Update Imageset)
  var PutImageSet = function (imageset_id, data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    ClearAllCaches();
    return HTTP('PUT', '/imagesets/' + imageset_id, data, {}, success, error);
  }
  // Post ImageSet - New Imageset
  var PostImageset = function (data, success, error){
    ClearAllCaches
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('POST', '/imagesets', data, {}, success, error);
  };
  // Put Lion (Update Lion)
  var PutLionImageset = function (lion_id, data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    ClearAllCaches();
    var promises = [];
    // Imageset
    if(Object.keys(data.imageset).length){
      var data_imageset = data.imageset;
      angular.merge(data_imageset, cookies);
      var req = { method: 'PUT', url: '/imagesets/' + data.imagesetId, data: data_imageset,
                headers: { 'Content-Type': 'application/json'}, config: {ignoreLoadingBar: true}};
      promises.push($http(req));
    }
    // Lion
    if(Object.keys(data.lion).length){
      var data_lion = data.lion;
      angular.merge(data_lion, cookies);
      req = { method: 'PUT', url: '/lions/' + lion_id, data: data_lion,
              headers: { 'Content-Type': 'application/json'}, config: {ignoreLoadingBar: true}};
      promises.push($http(req));
    }
    $q.all(promises).then(function (results) {
      var dados = [];
      results.forEach( function (result, index) {
        dados.push(result.data.data);
      });
      success(dados);
    },
    function (reason) {
      error(reason);
    });
  }
  // Post Lion - New Lion
  var PostLionImageset = function (data, success, error){
    ClearAllCaches
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    var result_data;
    // Imageset
    var data_imageset = data.imageset;
    angular.merge(data_imageset, cookies);
    var req = { method: 'POST', url: '/imagesets/', data: data_imageset,
                headers: { 'Content-Type': 'application/json'}, config: {ignoreLoadingBar: true}};
    $http(req).then(function(response) {
      // Lion
      var data_lion = data.lion;
      result_data = response;
      data_lion.primary_image_set_id = response.data.data.id;
      angular.merge(data_lion, cookies);
      req = { method: 'POST', url: '/lions/', data: data_lion,
              headers: { 'Content-Type': 'application/json'}, config: {ignoreLoadingBar: true}};
      $http(req).then(function(response) {
        var results = _.merge({}, result_data, response);
        success(results);
      }, error);
    }, error);
  };
  // Put Lion (Update Lion)
  var PutImage = function (image_id, data, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    angular.merge(data, cookies);
    return HTTP('PUT', '/images/' + image_id, data, {},
    function (result) {
      ClearAllCaches();
      success(result.data.data);
    }, error);
  }

  var PutImages = function (items, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    var promises = items.map(function(item) {
      //var deferred = $q.defer();
      //var data = item.data;
      //angular.merge(data, cookies);
      var req = { method: 'PUT',
                  url: '/images/' + item.image_id,
                  data: item.data,
                  headers: { 'Content-Type': 'application/json'},
                  config: {ignoreLoadingBar: true}};
      return $http(req);
    });
    $q.all(promises).then(function (results) {
      var dados = [];
      results.forEach( function (result, index) {
        dados.push(result.data.data);
      })
      ClearAllCaches();
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
      //var deferred = $q.defer();
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

  // Delete ImageSet
  var DeleteImageSet = function (imageset_id, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    return HTTP('DELETE', '/imagesets/' + imageset_id, cookies, {}, success, error);
  };
  // Delete Lion
  var DeleteLion = function (lion_id, success, error){
    var cookies = {'_xsrf': $cookies.get('_xsrf')};
    return HTTP('DELETE', '/lions/' + lion_id, cookies, {}, success, error);
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
        duration: 5000   // milisecond
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
        duration: 5000   // milisecond
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
        duration: 5000   // milisecond
      });
      console.log(error);
    });
  };

  var Login = function (data, success, error){
    var req = { method: 'POST',
                url: '/login',
                data: data,
                headers: { 'Content-Type': 'application/json', 'X-XSRFToken' : data['_xsrf']},
                config: {}};
    $http(req).then(success, error);
  };

  // Administration
  var Get_Users = function () {
    var deferred = $q.defer();
    var url = '/users';
    var promise = $http.get(url, {ignoreLoadingBar: true}).then(function(response){
      return response.data;
    }, function(error){
      NotificationFactory.error({
        title: "Error", message: 'Unable to Get Users data',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
      console.log(error);
    });
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
  dataFactory.Associate = PutImageSet;
  dataFactory.SaveImageset = PutImageSet;
  dataFactory.CreateImageset = PostImageset;
  dataFactory.SetMaiImagenId = PutImageSet;
  // Images
  dataFactory.UpdateImages = PutImages;
  dataFactory.UpdateImage = PutImage;

  dataFactory.DeleteLion = DeleteLion;
  dataFactory.DeleteImageSet = DeleteImageSet;
  dataFactory.DeleteImage = DeleteImage;
  dataFactory.DeleteImages = DeleteImages;
  // Update Lion
  dataFactory.SaveLion = PutLionImageset;
  dataFactory.CreateLion = PostLionImageset;

  // Get List of CV Results
  dataFactory.getCVResults = GetCVResults;
  // Post CV Results - Request Results
  dataFactory.postCVResults = PostCVResults;
  // Update Request CV Results
  dataFactory.putCVResults = PutCVResults;
  // Delete CV Results and CV Request
  dataFactory.deleteCVRequest = DeleteCVRequest;

  dataFactory.getImageGallery = GetImageGallery;

  dataFactory.Download = GetDownload;
  dataFactory.Login = Login;
  return dataFactory;
}])

;
