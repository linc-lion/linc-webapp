angular.module('lion.guardians.services', [])

.factory('LincServices', ['$http', '$cacheFactory', '$q', '$cookies', 'notificationFactory', function($http, $cacheFactory, $q, $cookies, notificationFactory) {

  //var urlBase = 'http://localhost:5080';
  var $httpcache = $cacheFactory.get('$http');

  var databases = {};
    databases['lions'] =         {label: 'Lions List', url: '/lions/list'};
    databases['organizations'] = {label: 'Organizations List',  url: '/organizations/list'};
    databases['imagesets'] =     {label: 'Imagesets List', url: '/imagesets/list'};
    databases['images'] =        {label: 'Images List', url: '/images/list'};
    databases['lion'] =         {label: 'Lion', url: 'localhost:5000/lion'};

  var Get = function (url, label){
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

  // Get Lion by Id
  var GetLion = function (id,  fn) {
    var url = databases['lion'].url + '/' + id;
    var label = databases['lion'].label;
    Get(url, label).then(function (results) {
      var dados = {};
      dados['lion'] = result.data;
      fn(dados);
    },
    function (reason) {
      console.log(reason);
    });
  };
  // Get Lions, Image Sets, Organizations, List
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
      fn(dados);
    },
    function (reason) {
      console.log(reason);
    });
  };
  // Get All Lists
  var Get_All_Lists = function (fn) {
    var names = Object.keys(databases);
    return (GetLists(names,fn));
  };

  var RequestCV = function (request, fn) {
    var cookies = $cookies.get('_xsrf');

    /*var data = {"lions": request.lions_id,"_xsrf": cookies};
        $http.post('/imagesets/'+ request.imageset_id + '/cvrequest', data)
        .success(function(result, status) {
            fn(result);
        }).error(function(result, status, headers, config) {
			       alert( "failure message: " + JSON.stringify({data: result}));
		    });*/

    var req = { method: 'POST', url: '/imagesets/' + request.imageset_id + '/cvrequest',
      headers: { 'Content-Type': 'application/json'},
      data: {"lions": request.lions_id, '_xsrf': cookies}
    }
    $http(req)
    //$http.post(url,data)
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
  dataFactory.getlists = GetLists;
  dataFactory.getAlllists = Get_All_Lists;

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
