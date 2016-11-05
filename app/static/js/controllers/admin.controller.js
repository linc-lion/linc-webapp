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
'use strict';

angular.module('linc.admin.controller', [ 'linc.admin.users.controller',
                                          'linc.admin.organizations.controller',
                                          'linc.admin.lions.controller',
                                          'linc.admin.imagesets.controller',
                                          'linc.admin.images.controller',
                                          'linc.admin.cvrequests.controller',
                                          'linc.admin.cvresults.controller'])

.controller('AdminCtrl', ['$scope', '$state', '$q', '$uibModal', 'LincApiServices', 'NotificationFactory', 'toClipboard',
  'organizations', 'users', 'lions', 'imagesets', 'images', 'cvrequests', 'cvresults', 'settings', 
  function ($scope, $state, $q, $uibModal, LincApiServices, NotificationFactory, toClipboard,
    organizations, users, lions, imagesets, images, cvrequests, cvresults, settings) {

  //$scope.debug = $state.current.data.debug;
  $scope.LincApiServices = LincApiServices;
  $scope.Notification = NotificationFactory;
  $scope.organizations = organizations;
  $scope.users = users;
  $scope.lions = lions;
  $scope.imagesets = imagesets;
  $scope.images = images;
  $scope.cvrequests = cvrequests;
  $scope.cvresults = cvresults;

  $scope.tabs = [
    { 'name': 'users', title:'Users', disabled: false, sref: 'admin.users'},
    { 'name': 'organizations',title:'Organizations', disabled: false, sref: 'admin.organizations'},
    { 'name': 'lions',title:'Lions', disabled: false, sref: 'admin.lions'},
    { 'name': 'imagesets',title:'Imagesets', disabled: false, sref: 'admin.imagesets'},
    { 'name': 'images',title:'Images', disabled: false, sref: 'admin.images'},
    { 'name': 'cvrequests',title:'CV Requests', disabled: false, sref: 'admin.cvrequests'},
    { 'name': 'cvresults',title:'CV Results', disabled: false, sref: 'admin.cvresults'}
  ];

  $scope.settings = settings;
  $state.go("admin." + settings.Selected_tab, {});

  $scope.onTabClick = function (tab){
    settings.Selected_tab = tab.name;
  }

  $scope.DialogDelete = function (title){
    var deferred = $q.defer();
    $scope.modalTitle = 'Delete ' + title;
    $scope.modalMessage = 'Are you sure you want to delete the ' + title + ' ?';
    $scope.modalContent = 'Form';
    $scope.modalInstance = $uibModal.open({
        templateUrl: 'Dialog.Delete.tmpl.html',
        scope:$scope
    });
    $scope.ok = function (){
      $scope.modalInstance.close();
      deferred.resolve();
    }
    $scope.cancel = function(){
      $scope.modalInstance.dismiss();
      deferred.reject();
    }
    return deferred.promise;
  };

  $scope.ImagesDeleted = function(){
    var deferred = $q.defer();
    LincApiServices.ImageSets({'method': 'get', 'organizations': $scope.organizations, 'users': $scope.users, 'lions': $scope.lions, 'images': $scope.images}).then( function(response){
      $scope.imagesets = response;
      deferred.resolve(response);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  $scope.CVRequestsDeleted = function(){
    var deferred = $q.defer();
    LincApiServices.CVResults({'method': 'get'}).then( function(response){
      $scope.cvresults = response;
      deferred.resolve(response);
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  $scope.OrganizationsUpdated = function(){
    var deferred = $q.defer();
    LincApiServices.Users({'method': 'get', 'organizations': $scope.organizations}).then(function(users){
      $scope.users = users;
      LincApiServices.Lions({'method': 'get', 'organizations': $scope.organizations}).then(function(lions){
        $scope.lions = lions;
        LincApiServices.ImageSets({'method': 'get', 'organizations': $scope.organizations, 'users': $scope.users, 'lions': $scope.lions, 'images': $scope.images}).then(function(imagesets){
          $scope.imagesets = imagesets;
          LincApiServices.CVRequests({'method': 'get', 'organizations': $scope.organizations}).then(function(cvrequests){
            $scope.cvrequests = cvrequests;
            deferred.resolve(cvrequests);
          },function(cvrequests_error){
            deferred.reject(cvrequests_error);
          });
        },function(imagesets_error){
          deferred.reject(imagesets_error);
        });
      },function(lions_error){
        deferred.reject(lions_error);
      });
    },function(users_error){
      deferred.reject(users_error);
    });
    return deferred.promise;
  };

  $scope.LionsUpdated = function(){
    var deferred = $q.defer();
    LincApiServices.ImageSets({'method': 'get', 'organizations': $scope.organizations, 'users': $scope.users, 'lions': $scope.lions, 'images': $scope.images}).then(function(response){
      $scope.imagesets = response;
      deferred.resolve(response);
    },function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  $scope.ImageSetsUpdated = function(){
    var deferred = $q.defer();
    LincApiServices.Lions({'method': 'get', 'organizations': $scope.organizations}).then(function(lions){
      $scope.lions = lions;
      LincApiServices.Images({'method': 'get'}).then(function(images){
        $scope.images = images;
        LincApiServices.CVRequests({'method': 'get', 'organizations': $scope.organizations}).then(function(cvrequests){
          $scope.cvrequests = cvrequests;
          deferred.resolve(cvrequests);
        },function(cvrequests_error){
          deferred.reject(cvrequests_error);
        });
      },function(images_error){
        deferred.reject(images_error);
      });
    },function(lions_error){
      deferred.reject(lions_error);
    });
    return deferred.promise;
  };

  $scope.CopyTextToClipBoard = function(text,value){
    var val = angular.copy(text);
    toClipboard.copy(val);
    alert('The '+value+' has been copied to the clipboard');
  }
  $scope.onCopySuccess = function(val){
    alert('The '+val+' has been copied to the clipboard');
  }
  $scope.onCopyError = function(){
    alert('Unable to copy');
  }

  $scope.CopyToClipBoard = function(items){
    var datas = angular.copy(items);
    toClipboard.copy(JSON.stringify(datas));
    console.log(datas);
    var count=datas.length;
    if(count==1)
      alert('One item has been copied to the clipboard');
    else
      alert(count.toString() + ' items have been copied to the clipboard');
  }
  
}])

;
