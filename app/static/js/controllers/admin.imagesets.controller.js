
'use strict';

angular.module('lion.guardians.admin.imagesets.controller', [])

.controller('AdminImageSetsCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

  $scope.ImageSet_Mode  =  $scope.settings.imagesets.Mode;

  $scope.genders = [{value: 'male', label: 'Male'}, {value: 'female',label: 'Female'}, {value: null,label: 'Unknown'}];

  $scope.tags = { 'ear_markings': [{'value': 'EAR_MARKING_LEFT',  'label': 'Left'},{'value': 'EAR_MARKING_RIGHT', 'label': 'Right'}],
                  'mount_markings': [{'value': 'MOUTH_MARKING_BACK',  'label': 'Back'},{'value': 'MOUTH_MARKING_FRONT', 'label': 'Front'},{'value': 'MOUTH_MARKING_LEFT',  'label': 'Left'},{'value': 'MOUTH_MARKING_RIGHT', 'label': 'Right'}],
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

  $scope.Select_Imageset1 = function ($event, imageset){
    if($scope.ImageSet_Mode != '') return;
    imageset.selected = !imageset.selected;
    $scope.Select_Imageset($event, imageset);
  }

  var lastSelId = -1;
  $scope.Select_Imageset = function ($event, imageset){
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

  var modal = null;
  $scope.Add_ImageSet = function () {
    $scope.modalTitle = 'Add ImageSet';
    $scope.showValidationMessages = false;

    $scope.organizations = angular.copy($scope.$parent.organizations);
    $scope.lions = angular.copy($scope.$parent.lions);
    $scope.images = angular.copy($scope.$parent.images);

    $scope.imageset = { 'lion_id': -1, 'main_image_id': -1, 'owner_organization_id': -1,
      'uploading_organization_id':-1, 'uploading_user_id': -1, 'latitude' : '', 'longitude' : '',
      'date_stamp': new Date().toJSON().slice(0,10), 'date_of_birth': new Date().toJSON().slice(0,10),
      'gender': '', 'tags': [], 'notes': '', 'is_verified': false, /*'trashed': false,*/ 'selected': true
    };
    $scope.imageset.main_image = '';
    modal = $uibModal.open({
        templateUrl: 'Edit_ImageSet.tmpl.html',
        scope:$scope
    });
    modal.result.then(function (result) {
      console.log("Add");
    }, function (){
      $scope.ImageSet_Mode = '';
      console.log("add dismiss");
    });

    $scope.check_all(false);
    $scope.ImageSet_Mode = 'add';
  };

  $scope.change_url = function(){
    $scope.imageset.main_image = '';

    if($scope.imageset.main_image_id){
      var main_image = _.find($scope.images, {'id': $scope.imageset.main_image_id});
      $scope.imageset.main_image = (main_image == undefined)? '' : main_image.url;
    }
  };
  $scope.Edit_ImageSet = function(){
    $scope.modalTitle = 'Edit ImageSet';
    $scope.showValidationMessages = false;

    $scope.organizations = angular.copy($scope.$parent.organizations);
    $scope.lions = angular.copy($scope.$parent.lions);
    $scope.images = angular.copy($scope.$parent.images);

    if($scope.Selecteds.length == 1){
      $scope.ImageSet_Mode = 'edit';
      $scope.imageset = angular.copy($scope.Selecteds[0]);
      $scope.imageset.main_image = '';
      if($scope.imageset.main_image_id){
        var main_image = _.find($scope.images, {'id': $scope.imageset.main_image_id});
        $scope.imageset.main_image = (main_image == undefined)? '' : main_image.url;
      }
      var TAGS = [];
      try{
        TAGS = JSON.parse($scope.imageset.tags);
      }catch(e){
        TAGS = $scope.imageset.tags.split(",");
      }

      $scope.imageset.eyes_damages = _.includes(TAGS,'EYE_DAMAGE_BOTH')? ['EYE_DAMAGE_LEFT', 'EYE_DAMAGE_RIGHT'] :  _.intersection(TAGS,['EYE_DAMAGE_LEFT', 'EYE_DAMAGE_RIGHT']);
      $scope.imageset.ear_markings = _.includes(TAGS,'EAR_MARKING_BOTH')? ['EAR_MARKING_LEFT', 'EAR_MARKING_RIGHT'] :  _.intersection(TAGS,['EAR_MARKING_LEFT', 'EAR_MARKING_RIGHT']);
      $scope.imageset.mount_markings = _.intersection(TAGS, ['MOUTH_MARKING_BACK', 'MOUTH_MARKING_FRONT','MOUTH_MARKING_LEFT', 'MOUTH_MARKING_RIGHT']);
      $scope.imageset.tail_markings = _.intersection(TAGS,['TAIL_MARKING_MISSING_TUFT']);
      $scope.imageset.broken_teeth = _.intersection(TAGS,['TEETH_BROKEN_CANINE_LEFT', 'TEETH_BROKEN_CANINE_RIGHT','TEETH_BROKEN_INCISOR_LEFT', 'TEETH_BROKEN_INCISOR_RIGHT']);
      $scope.imageset.nose_color = (_.intersection(TAGS, ['NOSE_COLOUR_BLACK', 'NOSE_COLOUR_PATCHY', 'NOSE_COLOUR_PINK', 'NOSE_COLOUR_SPOTTED']))[0];
      $scope.imageset.scars = _.intersection(TAGS, ['SCARS_BODY_LEFT', 'SCARS_BODY_RIGHT', 'SCARS_FACE', 'SCARS_TAIL']);
      modal = $uibModal.open({
          templateUrl: 'Edit_ImageSet.tmpl.html',
          scope:$scope
      });
      modal.result.then(function (result) {
        modal
      }, function (){
        $scope.ImageSet_Mode = '';
        console.log("edit dismiss");
      });
    };
  }

  $scope.Cancel_Edit_ImageSet = function(){
    modal.dismiss();
    $scope.ImageSet_Mode = '';
  }

  $scope.Submit = function (valid){
    if(valid){
      modal.close();
      Submit_Imageset();
    }
    else {$scope.showValidationMessages = true;}
  }

  $scope.Delete_ImageSet = function() {
    $scope.Delete('Image Sets')
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
            title: "Delete", message: msg,
            position: "right", // right, left, center
            duration: 2000     // milisecond
          });
        }
        else if(response.success.length>0){
          var msg = (response.success.length>1) ? 'Imagesets successfully deleted' : 'Imageset successfully deleted';
          $scope.Notification.success({
            title: "Delete", message: msg,
            position: "right", // right, left, center
            duration: 2000     // milisecond
          });
        }
        /*_.forEach(response.success, function(imageset, i){
          var index = _.indexOf($scope.Selecteds, _.find($scope.Selecteds, {'id': imageset.id}));
          if(index>-1){
            $scope.Selecteds[index].trashed = true;
          }
        });*/
        _.forEach(response.success, function(item, i){
          var remove = _.remove($scope.$parent.imagesets, function(imageset) {
            return imageset.id == item.id;
          });
        });
        $scope.Selecteds = [];
        $scope.settings.imagesets.Selecteds = $scope.Selecteds;
        $scope.$parent.ImageSetsDeleted();
      });
    }, function () {
      $scope.Notification.info({
        title: "Cancel", message: 'Delete canceled',
        position: 'right', // right, left, center
        duration: 2000   // milisecond
      });
    });
  }

  /*$scope.Undo_Trash = function() {
    var imagesets_id = _.pluck(_.map($scope.Selecteds, function (imageset){
      return {'id': imageset.id};
    }), 'id');

    $scope.LincApiServices.ImageSets({'method': 'undo_trash', 'imagesets_id': imagesets_id}).then(function(response){
      if(response.error.length>0){
        var data = _.pluck(_.map(response.error, function (imageset){
          return {'id': imageset.id};
        }), 'id');
        var msg = (data.length>1) ? 'Unable to restore imagesets ' + data : 'Unable to restore imageset ' + data;
        $scope.Notification.error({
          title: "Restore", message: msg,
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
      }
      else if(response.success.length>0){
        var msg = (response.success.length>1) ? 'Imagesets successfully restored' : 'Imageset successfully restored';
        $scope.Notification.success({
          title: "Restore", message: msg,
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
      }
      _.forEach(response.success, function(imageset, i){
        var index = _.indexOf($scope.Selecteds, _.find($scope.Selecteds, {'id': imageset.id}));
        if(index>-1){
          $scope.Selecteds[index].trashed = false;
        }
      });
    },
    function(error){
      $scope.Notification.error({
        title: "Fail", message: 'Fail to restore from Trash',
        position: 'right', // right, left, center
        duration: 5000   // milisecond
      });
    });
  }*/

  var Submit_Imageset = function(){
    if($scope.ImageSet_Mode == 'edit'){
      var imageset = $scope.Selecteds[0];

      var eyes_dams = _.includes($scope.imageset.eye_damages, "EYE_DAMAGE_LEFT", "EYE_DAMAGE_RIGHT") ? ["EYE_DAMAGE_BOTH"] : $scope.imageset.eye_damages;
      var ear_marks = _.includes($scope.imageset.ear_markings, "EAR_MARKING_LEFT", "EAR_MARKING_RIGHT") ? ["EAR_MARKING_BOTH"] : $scope.imageset.ear_markings;

      var concat = _([]).concat(eyes_dams);
      concat = _(concat).concat(ear_marks);
      concat = _(concat).concat($scope.imageset.mount_markings);
      concat = _(concat).concat($scope.imageset.tail_markings);
      concat = _(concat).concat($scope.imageset.broken_teeth);
      if($scope.imageset.nose_color != undefined)
        concat = _(concat).concat([$scope.imageset.nose_color]);
      concat = _(concat).concat($scope.imageset.scars);
      var TAGS = JSON.stringify(concat.value());
      if(!concat.value().length) TAGS = "null";

      var latitude = isNaN(parseFloat($scope.imageset.latitude)) ? null : parseFloat($scope.imageset.latitude);
      var longitude = isNaN(parseFloat($scope.imageset.longitude)) ? null : parseFloat($scope.imageset.longitude);

      var data = {'lion_id': $scope.imageset.lion_id,
            'main_image_id': $scope.imageset.main_image_id,
                   'gender': $scope.imageset.gender,
                    'notes': $scope.imageset.notes,
    'owner_organization_id': $scope.imageset.owner_organization_id,
        'uploading_user_id': $scope.imageset.uploading_user_id,
                 'latitude': latitude,
                'longitude': longitude,
               'date_stamp': $scope.imageset.date_stamp,
            'date_of_birth': $scope.imageset.date_of_birth,
                      'tags': TAGS,
              'is_verified': $scope.imageset.is_verified/*,
                  'trashed': $scope.imageset.trashed,*/
      };

      $scope.LincApiServices.ImageSets({'method': 'put', 'imageset_id' : $scope.imageset.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Image Set Info', message: 'Image Set data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
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
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Image Set data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if($scope.ImageSet_Mode == 'add'){
      var eyes_dams = _.includes($scope.imageset.eye_damages, "EYE_DAMAGE_LEFT", "EYE_DAMAGE_RIGHT") ? ["EYE_DAMAGE_BOTH"] : $scope.imageset.eye_damages;
      var ear_marks = _.includes($scope.imageset.ear_markings, "EAR_MARKING_LEFT", "EAR_MARKING_RIGHT") ? ["EAR_MARKING_BOTH"] : $scope.imageset.ear_markings;

      var concat = _([]).concat(eyes_dams);
      concat = _(concat).concat(ear_marks);
      concat = _(concat).concat($scope.imageset.mount_markings);
      concat = _(concat).concat($scope.imageset.tail_markings);
      concat = _(concat).concat($scope.imageset.broken_teeth);
      if($scope.imageset.nose_color != undefined)
        concat = _(concat).concat([$scope.imageset.nose_color]);
      concat = _(concat).concat($scope.imageset.scars);
      var TAGS = JSON.stringify(concat.value());
      if(!concat.value().length) TAGS = "null";

      var latitude = isNaN(parseFloat($scope.imageset.latitude)) ? null : parseFloat($scope.imageset.latitude);
      var longitude = isNaN(parseFloat($scope.imageset.longitude)) ? null : parseFloat($scope.imageset.longitude);

      var data = {'lion_id': $scope.imageset.lion_id,
            'main_image_id': $scope.imageset.main_image_id,
                   'gender': $scope.imageset.gender,
                    'notes': $scope.imageset.notes,
    'owner_organization_id': $scope.imageset.owner_organization_id,
        'uploading_user_id': $scope.imageset.uploading_user_id,
                 'latitude': latitude,
                'longitude': longitude,
               'date_stamp': $scope.imageset.date_stamp,
            'date_of_birth': $scope.imageset.date_of_birth,
                      'tags': TAGS,
              'is_verified': $scope.imageset.is_verified/*,
                  'trashed': $scope.imageset.trashed,*/
      };
      $scope.LincApiServices.ImageSets({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Image Set Info', message: 'New Image Set successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
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
        $scope.imageset.push(imageset);
        $scope.Selecteds.push(imageset);
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new Image Set',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    $scope.ImageSet_Mode = '';
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

}])

;
