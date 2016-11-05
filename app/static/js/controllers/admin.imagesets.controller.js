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

angular.module('linc.admin.imagesets.controller', [])

.controller('AdminImageSetsCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

  $scope.ImageSet_Mode  =  $scope.settings.imagesets.Mode;

  $scope.genders = [{value: 'male', label: 'Male'}, {value: 'female',label: 'Female'}, {value: null,label: 'Unknown'}];

  $scope.tags = { 'ear_markings': [{'value': 'EAR_MARKING_LEFT',  'label': 'Left'},{'value': 'EAR_MARKING_RIGHT', 'label': 'Right'}],
                  'mouth_markings': [{'value': 'MOUTH_MARKING_BACK',  'label': 'Back'},{'value': 'MOUTH_MARKING_FRONT', 'label': 'Front'},{'value': 'MOUTH_MARKING_LEFT',  'label': 'Left'},{'value': 'MOUTH_MARKING_RIGHT', 'label': 'Right'}],
                  'tail_markings': [{'value': 'TAIL_MARKING_MISSING_TUFT', 'label': 'Missing Tuft'}],
                  'eye_damages': [{'value': 'EYE_DAMAGE_LEFT',  'label': 'Left'},{'value': 'EYE_DAMAGE_RIGHT', 'label': 'Right'}],
                  'nose_color': [{'value': undefined, 'label': 'None'},{'value': 'NOSE_COLOUR_BLACK', 'label': 'Black'},{'value': 'NOSE_COLOUR_PATCHY', 'label': 'Patchy'},{'value': 'NOSE_COLOUR_PINK', 'label': 'Pink'},{'value': 'NOSE_COLOUR_SPOTTED', 'label': 'Spotted'}],
                  'broken_teeth': [{'value': 'TEETH_BROKEN_CANINE_LEFT', 'label': 'Canine Left'},{'value': 'TEETH_BROKEN_CANINE_RIGHT', 'label': 'Canine Right'},{'value': 'TEETH_BROKEN_INCISOR_LEFT', 'label': 'Incisor Left'},{'value': 'TEETH_BROKEN_INCISOR_RIGHT', 'label': 'Incisor Right'}],
                  'scars': [{'value': 'SCARS_BODY_LEFT', 'label': 'Body Left'},{'value': 'SCARS_BODY_RIGHT', 'label': 'Body Right'},{'value': 'SCARS_FACE', 'label': 'Face'},{'value': 'SCARS_TAIL', 'label': 'Tail'}]
  };

  $scope.check_all = function (val){
    _.forEach($scope.$parent.imagesets, function(imageset) {
      imageset.selected = val;
      if(imageset.selected){
        if(!_.some($scope.Selecteds, imageset))
          $scope.Selecteds.push(imageset);
      }
    });
    if(!val){
      $scope.Selecteds = [];
      $scope.settings.imagesets.Selecteds = $scope.Selecteds;
    }
    check_selects();
  }

  var lastSelId = -1;
  $scope.Select_Imageset = function ($event, imageset, type){
    if(type == 'line-click'){
      imageset.selected = !imageset.selected;
    }
    var shiftKey = $event.shiftKey;
    if(shiftKey && lastSelId>=0){
      var index0 = _.findIndex($scope.ordered_imagesets, {'id': lastSelId});
      var index1 = _.findIndex($scope.ordered_imagesets, {'id': imageset.id});
      var first = Math.min(index0, index1);
      var second = Math.max(index0, index1);
      for(var i = first; i < second; i++){
        var imgset = $scope.ordered_imagesets[i];
        imgset.selected = imageset.selected;
        if(imageset.selected){
          if(!_.some($scope.Selecteds, imgset))
            $scope.Selecteds.push(imgset);
        }
        else {
          $scope.Selecteds = _.without($scope.Selecteds, imgset);
          $scope.settings.imagesets.Selecteds = $scope.Selecteds;
        }
      }
    }
    else{
      lastSelId = imageset.id;
      if(imageset.selected){
        if(!_.some($scope.Selecteds, imageset))
          $scope.Selecteds.push(imageset);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, imageset);
        $scope.settings.imagesets.Selecteds = $scope.Selecteds;
      }
    }
    check_selects();
  }

  $scope.Add_ImageSet = function () {
    $scope.ImageSet_Mode = 'add';
    $scope.check_all(false);

    var modalScope = $scope.$new();
    modalScope.modalTitle = 'Add ImageSet';

    modalScope.dataSending = false;
    modalScope.showValidationMessages = false;

    modalScope.organizations = angular.copy($scope.$parent.organizations);
    modalScope.lions = angular.copy($scope.$parent.lions);
    modalScope.images = angular.copy($scope.$parent.images);

    modalScope.imageset = { 
      'lion_id': undefined, 
      'main_image_id': undefined, 
      'owner_organization_id': undefined,
      'uploading_organization_id': undefined, 
      'uploading_user_id': undefined, 
      'latitude' : '', 'longitude' : '',
      'date_stamp': new Date().toJSON().slice(0,10), 
      'date_of_birth': new Date().toJSON().slice(0,10),
      'gender': '', 
      'tags': [], 
      'notes': '', 
      'is_verified': false, 
      'selected': true
    };
    modalScope.imageset.main_image = '';
    modalScope.imageset.lion_id = undefined;

    var modalInstance = $uibModal.open({
        templateUrl: 'Edit_ImageSet.tmpl.html',
        scope: modalScope,
        size: 'lg'
    });

    modalInstance.result.then(function (result) {
      $scope.ImageSet_Mode = '';
      modalScope.dataSending = false;
    }, function (){
      $scope.ImageSet_Mode = '';
      modalScope.dataSending = false;
    });

    modalScope.onSelected = function (item, model){
      modalScope.imageset.main_image = (item && item.url) ? item.url : '';
      modalScope.imageset.main_image_id = ((item && item.id) ? item.id : undefined);
      console.log('main_image_id: ' + modalScope.imageset.main_image_id);
    };

    modalScope.submit = function (valid){
      if(valid){
        var eyes_dams = _.includes(modalScope.imageset.eye_damages, "EYE_DAMAGE_LEFT", "EYE_DAMAGE_RIGHT") ? ["EYE_DAMAGE_BOTH"] : modalScope.imageset.eye_damages;
        var ear_marks = _.includes(modalScope.imageset.ear_markings, "EAR_MARKING_LEFT", "EAR_MARKING_RIGHT") ? ["EAR_MARKING_BOTH"] : modalScope.imageset.ear_markings;

        var concat = _([]).concat(eyes_dams);
        concat = _(concat).concat(ear_marks);
        concat = _(concat).concat(modalScope.imageset.mouth_markings);
        concat = _(concat).concat(modalScope.imageset.tail_markings);
        concat = _(concat).concat(modalScope.imageset.broken_teeth);
        if(modalScope.imageset.nose_color != undefined)
          concat = _(concat).concat([modalScope.imageset.nose_color]);
        concat = _(concat).concat(modalScope.imageset.scars);
        var TAGS = JSON.stringify(concat.value());
        if(!concat.value().length) TAGS = "null";

        var latitude = isNaN(parseFloat(modalScope.imageset.latitude)) ? null : parseFloat(modalScope.imageset.latitude);
        var longitude = isNaN(parseFloat(modalScope.imageset.longitude)) ? null : parseFloat(modalScope.imageset.longitude);

        var data = {
          'lion_id': modalScope.imageset.lion_id,
          'main_image_id': modalScope.imageset.main_image_id,
          'gender': modalScope.imageset.gender,
          'notes': modalScope.imageset.notes,
          'owner_organization_id': modalScope.imageset.owner_organization_id,
          'uploading_user_id': modalScope.imageset.uploading_user_id,
          'latitude': latitude,
          'longitude': longitude,
          'date_stamp': modalScope.imageset.date_stamp,
          'date_of_birth': modalScope.imageset.date_of_birth,
          'tags': TAGS,
          'is_verified': modalScope.imageset.is_verified
        };
        modalScope.dataSending = true;
        $scope.LincApiServices.ImageSets({'method': 'post', 'data': data}).then(function(response){
          $scope.Notification.success({
            title: 'Image Set Info', 
            message: 'New Image Set successfully created',
            position: "right",
            duration: 2000
          });
          var imageset = response.data;
          imageset.created_at = (imageset.created_at || "").substring(0,19);
          imageset.updated_at = (imageset.updated_at || "").substring(0,19);

          if(imageset.date_of_birth)
            imageset.date_of_birth = (imageset.date_of_birth || "").substring(0,10);
          var id = imageset.lion_id;
          var lion = _.find($scope.$parent.lions, {'id': id});
          imageset.lion_name = (lion == undefined)? '-' : lion.name;
          id = imageset.owner_organization_id;
          var owner_organization = _.find($scope.$parent.organizations, {'id': id});
          imageset.owner_organization = (owner_organization == undefined)? '-' : owner_organization.name;
          id = imageset.uploading_organization_id;
          var uploading_organization = _.find($scope.$parent.organizations, {'id': id});
          imageset.uploading_organization = (uploading_organization == undefined)? '-' : uploading_organization.name;
          id = imageset.uploading_user_id;
          var uploading_user = _.find($scope.$parent.users, {'id': id});
          imageset.uploading_user = (uploading_user == undefined)? '-' : uploading_user.email;
          id = imageset.main_image_id;
          var main_image = _.find($scope.$parent.images, {'id': id});
          imageset.main_image = (main_image == undefined)? '' : main_image.url;
          imageset.selected = true;

          $scope.$parent.imageset.push(imageset);
          $scope.Selecteds.push(imageset);
          modalInstance.close();
        },
        function(error){
          $scope.Notification.error({
            title: "Fail", 
            message: 'Fail to create new Image Set',
            position: 'right', 
            duration: 5000
          });
          modalInstance.dismiss();
        });
      }
      else {
        modalScope.showValidationMessages = true;
      }
    };
    modalScope.cancel = function(){
      modalInstance.dismiss();
    };
  };

  $scope.Edit_ImageSet = function(){
    if($scope.Selecteds.length == 1){
      $scope.ImageSet_Mode = 'edit';
      
      var modalScope = $scope.$new();
      modalScope.modalTitle = 'Edit ImageSet';

      modalScope.dataSending = false;
      modalScope.showValidationMessages = false;

      modalScope.organizations = angular.copy($scope.$parent.organizations);
      modalScope.lions = angular.copy($scope.$parent.lions);
      modalScope.images = angular.copy($scope.$parent.images);

      modalScope.imageset = angular.copy($scope.Selecteds[0]);
      modalScope.imageset.main_image = '';

      if(modalScope.imageset.main_image_id){
        var main_image = _.find(modalScope.images, {'id': modalScope.imageset.main_image_id});
        modalScope.imageset.main_image = (main_image == undefined)? '' : main_image.url;
        modalScope.imageset.image = main_image;
      }
      var TAGS = [];
      try{
        TAGS = JSON.parse(modalScope.imageset.tags);
      }catch(e){
        TAGS = modalScope.imageset.tags.split(",");
      }

      modalScope.imageset.eyes_damages = _.includes(TAGS,'EYE_DAMAGE_BOTH')? ['EYE_DAMAGE_LEFT', 'EYE_DAMAGE_RIGHT'] :  _.intersection(TAGS,['EYE_DAMAGE_LEFT', 'EYE_DAMAGE_RIGHT']);
      modalScope.imageset.ear_markings = _.includes(TAGS,'EAR_MARKING_BOTH')? ['EAR_MARKING_LEFT', 'EAR_MARKING_RIGHT'] :  _.intersection(TAGS,['EAR_MARKING_LEFT', 'EAR_MARKING_RIGHT']);
      modalScope.imageset.mouth_markings = _.intersection(TAGS, ['MOUTH_MARKING_BACK', 'MOUTH_MARKING_FRONT','MOUTH_MARKING_LEFT', 'MOUTH_MARKING_RIGHT']);
      modalScope.imageset.tail_markings = _.intersection(TAGS,['TAIL_MARKING_MISSING_TUFT']);
      modalScope.imageset.broken_teeth = _.intersection(TAGS,['TEETH_BROKEN_CANINE_LEFT', 'TEETH_BROKEN_CANINE_RIGHT','TEETH_BROKEN_INCISOR_LEFT', 'TEETH_BROKEN_INCISOR_RIGHT']);
      modalScope.imageset.nose_color = (_.intersection(TAGS, ['NOSE_COLOUR_BLACK', 'NOSE_COLOUR_PATCHY', 'NOSE_COLOUR_PINK', 'NOSE_COLOUR_SPOTTED']))[0];
      modalScope.imageset.scars = _.intersection(TAGS, ['SCARS_BODY_LEFT', 'SCARS_BODY_RIGHT', 'SCARS_FACE', 'SCARS_TAIL']);

      var modalInstance = $uibModal.open({
          templateUrl: 'Edit_ImageSet.tmpl.html',
          scope: modalScope,
          size: 'lg'
      });

      modalInstance.result.then(function (result) {
        $scope.ImageSet_Mode = '';
        modalScope.dataSending = false;
      }, function (){
        $scope.ImageSet_Mode = '';
        modalScope.dataSending = false;
      });

      modalScope.onSelected = function (item, model){
        modalScope.imageset.main_image = (item && item.url) ? item.url : '';
        modalScope.imageset.main_image_id = ((item && item.id) ? item.id : null);
        console.log('main_image_id: ' + modalScope.imageset.main_image_id);
      };
      
      modalScope.submit = function(valid){
        if(valid){
          var eyes_dams = _.includes(modalScope.imageset.eye_damages, "EYE_DAMAGE_LEFT", "EYE_DAMAGE_RIGHT") ? ["EYE_DAMAGE_BOTH"] : modalScope.imageset.eye_damages;
          var ear_marks = _.includes(modalScope.imageset.ear_markings, "EAR_MARKING_LEFT", "EAR_MARKING_RIGHT") ? ["EAR_MARKING_BOTH"] : modalScope.imageset.ear_markings;

          var concat = _([]).concat(eyes_dams);
          concat = _(concat).concat(ear_marks);
          concat = _(concat).concat(modalScope.imageset.mouth_markings);
          concat = _(concat).concat(modalScope.imageset.tail_markings);
          concat = _(concat).concat(modalScope.imageset.broken_teeth);
          if(modalScope.imageset.nose_color != undefined)
            concat = _(concat).concat([modalScope.imageset.nose_color]);
          concat = _(concat).concat(modalScope.imageset.scars);
          var TAGS = JSON.stringify(concat.value());
          if(!concat.value().length) TAGS = "null";

          var latitude = isNaN(parseFloat(modalScope.imageset.latitude)) ? null : parseFloat(modalScope.imageset.latitude);
          var longitude = isNaN(parseFloat(modalScope.imageset.longitude)) ? null : parseFloat(modalScope.imageset.longitude);

          var data = {
            'lion_id': modalScope.imageset.lion_id,
            'main_image_id': modalScope.imageset.main_image_id,
            'gender': modalScope.imageset.gender,
            'notes': modalScope.imageset.notes,
            'owner_organization_id': modalScope.imageset.owner_organization_id,
            'uploading_user_id': modalScope.imageset.uploading_user_id,
            'latitude': latitude,
            'longitude': longitude,
            'date_stamp': modalScope.imageset.date_stamp,
            'date_of_birth': modalScope.imageset.date_of_birth,
            'tags': TAGS,
            'is_verified': modalScope.imageset.is_verified
          };
          modalScope.dataSending = true;
          $scope.LincApiServices.ImageSets({'method': 'put', 'imageset_id' : modalScope.imageset.id, 'data': data}).then(function(response){
            $scope.Notification.success({
              title: 'Image Set Info', 
              message: 'Image Set data successfully updated',
              position: "right",
              duration: 2000 
            });

            var imageset = $scope.Selecteds[0];
            _.merge(imageset, imageset, response.data);
            imageset.created_at = (imageset.created_at || "").substring(0,19);
            imageset.updated_at = (imageset.updated_at || "").substring(0,19);

            if(imageset.date_of_birth)
              imageset.date_of_birth = (imageset.date_of_birth || "").substring(0,10);
            var id = imageset.lion_id;
            var lion = _.find($scope.$parent.lions, {'id': id});
            imageset.lion_name = (lion == undefined)? '-' : lion.name;
            id = imageset.owner_organization_id;
            var owner_organization = _.find($scope.$parent.organizations, {'id': id});
            imageset.owner_organization = (owner_organization == undefined)? '-' : owner_organization.name;
            id = imageset.uploading_organization_id;
            var uploading_organization = _.find($scope.$parent.organizations, {'id': id});
            imageset.uploading_organization = (uploading_organization == undefined)? '-' : uploading_organization.name;
            id = imageset.uploading_user_id;
            var uploading_user = _.find($scope.$parent.users, {'id': id});
            imageset.uploading_user = (uploading_user == undefined)? '-' : uploading_user.email;
            id = imageset.main_image_id;
            var main_image = _.find($scope.$parent.images, {'id': id});
            imageset.main_image = (main_image == undefined)? '' : main_image.url;
            $scope.$parent.ImageSetsUpdated();
            modalInstance.close();
          },
          function(error){
            $scope.Notification.error({
              title: "Fail", 
              message: 'Fail to change Image Set data',
              position: 'right', 
              duration: 5000 
            });
            modalInstance.dismiss();
          });
        }
        else {
          modalScope.showValidationMessages = true;
        }
      }
      modalScope.cancel = function(){
        modalInstance.dismiss();
      };
    }
  }

  $scope.Delete_ImageSet = function() {
    $scope.DialogDelete('Image Sets')
    .then(function (result) {
      var imagesets_id = _.pluck(_.map($scope.Selecteds, function (imageset){
        return {'id': imageset.id};
      }), 'id');

      $scope.LincApiServices.ImageSets({'method': 'delete', 'imagesets_id': imagesets_id}).then(function(response){
        if(response.error.length>0){
          var data = _.pluck(_.map(response.error, function (imageset){
            return {'id': imageset.id};
          }), 'id');
          var msg = (data.length>1) ? 'Unable to delete imagesets ' + data : 'Unable to delete imageset ' + data;
          $scope.Notification.error({
            title: "Delete", 
            message: msg,
            position: "right", 
            duration: 2000 
          });
        }
        else if(response.success.length>0){
          var msg = (response.success.length>1) ? 'Imagesets successfully deleted' : 'Imageset successfully deleted';
          $scope.Notification.success({
            title: "Delete", 
            message: msg,
            position: "right",
            duration: 2000 
          });
        }
        _.forEach(response.success, function(item, i){
          var remove = _.remove($scope.$parent.imagesets, function(imageset) {
            return imageset.id == item.id;
          });
        });
        $scope.Selecteds = [];
        $scope.settings.imagesets.Selecteds = $scope.Selecteds;
        $scope.$parent.ImageSetsUpdated();
      });
    }, function () {
      $scope.Notification.info({
        title: "Cancel", 
        message: 'Delete canceled',
        position: 'right', 
        duration: 2000 
      });
    });
  }

  var check_selects = function (){
    var count = 0;
    $scope.all_selected = false;
    $scope.all_unselected = true;
    if($scope.ordered_imagesets) count = $scope.ordered_imagesets.length;
    if(count>0){
      if($scope.Selecteds.length == count)
        $scope.all_selected = true;
      if($scope.Selecteds.length)
        $scope.all_unselected = false;
    }
  }

  // Order by
  $scope.reverse = $scope.settings.imagesets.reverse;
  $scope.predicate = $scope.settings.imagesets.predicate;
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
    $scope.settings.imagesets.predicate = $scope.predicate;
    $scope.settings.imagesets.reverse = $scope.reverse;
  };

  $scope.Selecteds = [];
  _.forEach($scope.settings.imagesets.Selecteds, function(selected) {
    if(selected != undefined){
      var sel_imageset = _.find($scope.$parent.imagesets, function(imageset) {
        return imageset.id == selected.id;
      });
      if(sel_imageset){
        sel_imageset.selected = true;
        $scope.Selecteds.push(sel_imageset);
      }
    }
  });
  $scope.settings.imagesets.Selecteds = $scope.Selecteds;

  check_selects();


  var items = [];
  for (var i = 0; i < 10000; i++) {
    var person = {
      name: 'Adam' + i,
      email: 'adam' + i + '@email.com',
      age: 12,
      country: 'United States'
    };
    items.push(person);
  }
  $scope.all = {items: items};

  $scope.multipleDemo = {};
  $scope.multipleDemo.singleSelectedPerson = $scope.all.items[500];


}])

;
