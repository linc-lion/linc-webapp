// LINC is an open source shared database and facial recognition
// system that allows for collaboration in wildlife monitoring.
// Copyright (C) 2016  Wildlifeguardians
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// For more information or to contact visit linclion.org or email tech@linclion.org
angular.module('linc.services', ['linc.api.services'])

.factory('LincServices', ['$http', '$state', '$q', '$cookies', 'AuthService', 'NotificationFactory', function($http, $state, $q, $cookies, AuthService, NotificationFactory) {

  var debug = ($state.current.data == undefined) ? false : ($state.current.data.debug || false);
  var HTTPGet = function (url, config){
    var deferred = $q.defer();
    AuthService.chech_auth().then( function(resp){
      $http.get(url, config).then( function(response){
        deferred.resolve(response.data);
      }, function(response){
        deferred.reject(response);
      });
    },function(err){
      deferred.reject(err);
    });
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
    HTTPGet(url, {}).then(function (results) {
      deferred.resolve(results.data);
    },
    function (error) {
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to load Imagesets data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      if(error.status == 401 || error.status == 403){
        console.log("imageset resolve error");
        deferred.resolve({});
      }
      else{
        console.log("imageset reject error");
        deferred.reject(error);
      }
    });
    return deferred.promise;
  };
  // Get All Lions List
  var GetAllLions = function (org) {
    var deferred = $q.defer();
    var url = databases['lions'].url + '/list';
    if(org !== undefined)
      url = url + '?org_id=' + org;

    HTTPGet(url, {}).then(function (results) {
      deferred.resolve(results.data);
    },
    function (error) {
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to load Lions datas',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      if(error.status == 401 || error.status == 403){
        console.log("lions resolve error");
        deferred.resolve({});
      }
      else{
        console.log("lions reject error");
        deferred.reject(error);
      }
    });
    return deferred.promise;
  };
  // Get All Organizations List
  var GetAllOrganizations = function () {
    var deferred = $q.defer();
    var url = databases['organizations'].url + '/list';
    HTTPGet(url, {}).then(function (results) {
      deferred.resolve(results.data);
    },
    function (error) {
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to load Lions data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      if(error.status == 401 || error.status == 403){
        console.log("organizations resolve error");
        deferred.resolve({});
      }
      else{
        console.log("organizations reject error");
        deferred.reject(error);
      }
    });
    return deferred.promise;
  };

  // Get Imageset by Id
  var GetImageSet= function (id) {
    var deferred = $q.defer();
    var url = databases['imagesets'].url + '/' + id + '/profile';
    HTTPGet(url, {}).then(function (results) {
      deferred.resolve(results.data);
    },
    function (error) {
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to load Imageset data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      if(error.status == 401 || error.status == 403){
        console.log("imageset resolve error");
        deferred.resolve({});
      }
      else{
        console.log("imageset reject error");
        deferred.reject(error);
      }
    });
    return deferred.promise;
  };
  // Get Images Gallery
  var GetImageGallery = function (id) {
    var deferred = $q.defer();
    var url = databases['imagesets'].url + '/' + id + '/gallery';
    HTTPGet(url,{ignoreLoadingBar: true}).then(function (results) {
        deferred.resolve(results.data);
    },
    function (error) {
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to load Image Gallery',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      if(error.status == 401 || error.status == 403){
        console.log("image gallery resolve error");
        deferred.resolve({});
      }
      else{
        console.log("image gallery reject error");
        deferred.reject(error);
      }
    });
    return deferred.promise;
  };
  // Get Lion by Id
  var GetLion = function (id) {
    var deferred = $q.defer();
    var url = databases['lions'].url + '/' + id + '/profile';
    HTTPGet(url, {}).then(function (results) {
       deferred.resolve(results.data);
    },
    function (error) {
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to load Lion data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      if(error.status == 401 || error.status == 403){
        console.log("lion resolve error");
        deferred.resolve({});
      }
      else{
        console.log("lion reject error");
        deferred.reject(error);
      }
    });
    return deferred.promise;
  };
  // Get Lion History Locations
  var GetLocations = function (id) {
    var deferred = $q.defer();
    var url = databases['lions'].url + '/' + id + '/locations';
    HTTPGet(url,{ignoreLoadingBar: true}).then(function (results) {
        deferred.resolve(results.data);
    },
    function (error) {
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to load History Locations data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      if(error.status == 401 || error.status == 403){
        console.log("locations resolve error");
        deferred.resolve({});
      }else{
        console.log("locations reject error");
        deferred.reject(error);
      }
    });
    return deferred.promise;
  };

  var Conservationists = function () {
    var deferred = $q.defer();
    var url = '/users/conservationists';
    HTTPGet(url, {}).then(function (results) {
       deferred.resolve(results.data);
    },
    function (error) {
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to load Conservationists data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
      if(error.status == 401 || error.status == 403){
        console.log("conservationists resolve error");
        deferred.resolve({});
      }else{
        console.log("conservationists reject error");
        deferred.reject(error);
      }
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

    AuthService.chech_auth().then( function(resp){
      $http(req, {ignoreLoadingBar: true}).then(function (response){
        deferred.resolve(response.data);
      },
      function (error) {
        if(debug || (error.status != 401 && error.status != 403)){
          NotificationFactory.error({
            title: "Error", message: 'Unable to Download Images',
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        }
        if(error.status == 401 || error.status == 403){
          console.log("downloads resolve error");
          deferred.resolve({});
        }else{
          console.log("downloads reject error");
          deferred.reject(error.data);
        }
      });

    },function(err){
      deferred.reject(err);
    });
    //deferred.resolve({'filename': 'http://www.colorado.edu/conflict/peace/download/peace_essay.ZIP'});
    return deferred.promise;
  };

  var HTTP = function (method, url, data, config, success, error) {
    AuthService.chech_auth().then( function(resp){
      if(method == 'GET'){
        $http.get(url, config).then(success, error);
      }
      else{
        var xsrfcookie = $cookies.get('_xsrf');
        var req = {
          method: method, url: url, data: data,
          headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie},
          config: config
        };
        $http(req).then(success, error);
      }

    },function(err){
      error(err);
    });
  }
  // Post Imageset (CV Request)
  var RequestCV = function (imageset_id, data, success) {
    return HTTP('POST', '/imagesets/' + imageset_id + '/cvrequest', data, {}, success,
    function (error) {
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Request failed',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
        console.log(error.status);
      }
    });
  };
  // Put ImageSet (Update Imageset)
  var PutImageSet = function (imageset_id, data, success, error){
    return HTTP('PUT', '/imagesets/' + imageset_id, data, {}, success, error);
  }
  // Post ImageSet - New Imageset
  var PostImageset = function (data, success, error){
    return HTTP('POST', '/imagesets', data, {}, success, error);
  };

  // Put Lion (Update Lion)
  var PutLionImageset = function (lion_id, data, success, error){
    AuthService.chech_auth().then( function(resp){
      var xsrfcookie = $cookies.get('_xsrf');
      var promises = [];
      // Imageset
      if(Object.keys(data.imageset).length){
        var data_imageset = data.imageset;
        //angular.merge(data_imageset, cookies);
        var req = { method: 'PUT', url: '/imagesets/' + data.imagesetId, data: data_imageset,
                  headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie}, config: {ignoreLoadingBar: true}};
        promises.push($http(req));
      }
      // Lion
      if(Object.keys(data.lion).length){
        var data_lion = data.lion;
        //angular.merge(data_lion, cookies);
        req = { method: 'PUT', url: '/lions/' + lion_id, data: data_lion,
                headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie}, config: {ignoreLoadingBar: true}};
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

    },function(err){
      error(err);
    });
  }
  // Put Lion (Set Primary)
  var PutLion = function (lion_id, data, success, error){
    return HTTP('PUT', '/lions/' + lion_id, data, {}, success, error);
  }
  // Post Lion - New Lion
  var PostLionImageset = function (data, success, error){
    AuthService.chech_auth().then( function(resp){
      var xsrfcookie = $cookies.get('_xsrf');
      var result_data;
      // Imageset
      var data_imageset = data.imageset;
      //angular.merge(data_imageset, cookies);
      var req = { method: 'POST', url: '/imagesets/', data: data_imageset,
                  headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie}, config: {ignoreLoadingBar: true}};
      $http(req).then(function(response) {
        // Lion
        var data_lion = data.lion;
        //result_data = response;
        data_lion.primary_image_set_id = response.data.data.id;
        //angular.merge(data_lion, cookies);
        req = { method: 'POST', url: '/lions/', data: data_lion,
                headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie}, config: {ignoreLoadingBar: true}};
        $http(req).then(function(response) {
          result_data = response;
          var lion = response.data.data;
          var data = {'lion_id': lion.id}
          PutImageSet(lion.primary_image_set_id, data, function(response){
            var results = _.merge({}, response, result_data);
            success(results);
          }, error);
        }, error);
      }, error);

    },function(err){
      error(err);
    });
  };
  // Put Lion (Update Lion)
  var PutImage = function (image_id, data, success){
    return HTTP('PUT', '/images/' + image_id, data, {},
      function (result) {
        success(result.data.data);
      },
      function(error){
        if(debug || (error.status != 401 && error.status != 403)){
          NotificationFactory.error({
            title: "Error", message: "Unable to Update Image data",
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        }
      }
    );
  }

  var PutImages = function (items, success){
    AuthService.chech_auth().then( function(resp){
      var xsrfcookie = $cookies.get('_xsrf');
      var promises = items.map(function(item) {
        var req = { method: 'PUT',
                    url: '/images/' + item.image_id,
                    data: item.data,
                    headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie},
                    config: {ignoreLoadingBar: true}};
        return $http(req);
      });
      $q.all(promises).then(
        function (results) {
          var dados = [];
          results.forEach( function (result, index) {
            dados.push(result.data.data);
          })
          success(dados);
        },
        function(error){
          if(debug || (error.status != 401 && error.status != 403)){
            NotificationFactory.error({
              title: "Error", message: "Unable to Update Images data",
              position: 'right', // right, left, center
              duration: 5000   // milisecond
            });
          }
        }
      );

    },function(err){
      if(debug || (err.status != 401 && err.status != 403)){
        NotificationFactory.error({
          title: "Error", message: "Unable to Update Images data",
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
    });
  }
  // Delete CVRequest / CVResults
  var DeleteImage = function (image_id, success, error){
    return HTTP('DELETE', '/images/' + image_id, {}, {}, success, error);
  };

  var DeleteImages = function (items, success, error){
    AuthService.chech_auth().then( function(resp){
      var xsrfcookie = $cookies.get('_xsrf');
      var promises = items.map(function(item) {
        //var deferred = $q.defer();
        //var data = item.data;
        //angular.merge(data, cookies);
        var req = { method: 'DELETE',
                    url: '/images/' + item.id,
                    data: {'_xsrf':xsrfcookie},
                    headers: { 'Content-Type': 'application/json','X-XSRFToken' : xsrfcookie},
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

    },function(err){
      error(err);
    });
  };

  // Delete ImageSet
  var DeleteImageSet = function (imageset_id, success, error){
    return HTTP('DELETE', '/imagesets/' + imageset_id, {}, {}, success, error);
  };
  // Delete Lion
  var DeleteLion = function (lion_id, success, error){
    return HTTP('DELETE', '/lions/' + lion_id, {}, {}, success, error);
  };
  // Get CV Results
  var GetCVResults = function (cvresults_id) {
    var deferred = $q.defer();
    var url = '/cvresults/' + cvresults_id + '/list';
    HTTP('GET', url, null, {ignoreLoadingBar: true},
      function (results){
        var data = results.data.data.table;
        var associated_id = results.data.data.associated.id;
        var status = results.data.data.status;
        var req_id = results.data.data.req_id;
        var cvresults = _.map(data, function(element, index) {
          var elem = {};
          if(associated_id == element.id) elem["associated"] = true;
          else elem["associated"] = false;
          return _.extend({}, element, elem);
        });
        deferred.resolve({'cvresults': cvresults, 'req_id': req_id, 'status': status});
      },
      function(error){
        if(debug || (error.status != 401 && error.status != 403)){
          NotificationFactory.error({
            title: "Error", message: 'Unable to load CV Results List',
            position: 'right', // right, left, center
            duration: 5000   // milisecond
          });
        }
        deferred.reject(error);
      }
    );
    return deferred.promise;
  };

  // Delete CVRequest / CVResults
  var DeleteCVRequest = function (cvrequest_id, success){
    return HTTP('DELETE', '/cvrequests/' + cvrequest_id, {}, {}, success,
    function(error){
      if(debug || (error.status != 401 && error.status != 403)){
        NotificationFactory.error({
          title: "Error", message: 'Unable to Delete CV Results/CVRequest',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      }
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
  // Conservationists
  dataFactory.Conservationists = Conservationists;
  // CV Request (Post Imageset w/ /request)
  dataFactory.requestCV = RequestCV;
  // Update Imageset
  dataFactory.Verify = PutImageSet;
  dataFactory.Associate = PutImageSet;
  dataFactory.SaveImageset = PutImageSet;
  dataFactory.CreateImageset = PostImageset;
  dataFactory.SetMainImagenId = PutImageSet;
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
  dataFactory.SetPrimary = PutLion;

  // Get List of CV Results
  dataFactory.getCVResults = GetCVResults;
  // Delete CV Results and CV Request
  dataFactory.deleteCVRequest = DeleteCVRequest;

  dataFactory.getImageGallery = GetImageGallery;

  dataFactory.Download = GetDownload;
  return dataFactory;
}])

.factory('PollerService', ['$q', '$http', 'AuthService', function($q, $http, AuthService){
  return {
    cvrequests_list : function(){
      var url = '/cvrequests/list';
      var deferred = $q.defer();
      AuthService.chech_auth().then( function(resp){
        $http.get(url).then(function (response) {
          deferred.resolve(response.data);
        }, function(error){
          deferred.reject(error);
        });
      },function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    }
  }
}])
;
