
'use strict';

angular.module('lion.guardians.admin.imagesets.controller', [])

.controller('AdminImageSetsCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.ImageSet_Change = {'mode': '', 'label': 'Submit'};

  $scope.genders = [{'type': 'male', 'name' :'Male'},
                    {'type': 'female', 'name': 'Female'}];
  /*$scope.tags = [
    //{'value':'EYE_DAMAGE_BOTH', 'label': 'Eye Damage Both'},
    {'value':'EYE_DAMAGE_LEFT', 'label': 'Eye Damage Left'},
    {'value':'EYE_DAMAGE_RIGHT', 'label': 'Eye Damage Right'},
    {'value':'TEETH_BROKEN_CANINE_LEFT', 'label': 'Broken Teeth Canine Left'},
    {'value':'TEETH_BROKEN_CANINE_RIGHT', 'label': 'Broken Teeth Canine Right'},
    {'value':'TEETH_BROKEN_INCISOR_LEFT', 'label': 'Broken Teeth Incisor Left'},
    {'value':'TEETH_BROKEN_INCISOR_RIGHT', 'label': 'Broken Teeth Incisor Right'},
    //{'value':'EAR_MARKING_BOTH', 'label': 'Ear Marking Both'},
    {'value':'EAR_MARKING_LEFT', 'label': 'Ear Marking Left'},
    {'value':'EAR_MARKING_RIGHT', 'label': 'Ear Marking Right'},
    {'value':'MOUTH_MARKING_BACK', 'label': 'Mounth Marking Back'},
    {'value':'MOUTH_MARKING_FRONT', 'label': 'Mounth Marking Front'},
    {'value':'MOUTH_MARKING_LEFT', 'label': 'Mounth Marking Left'},
    {'value':'MOUTH_MARKING_RIGHT', 'label': 'Mounth Marking Right'},
    {'value':'TAIL_MARKING_MISSING_TUFT', 'label': 'Tail Marking Missing Tuft'},
    {'value':'NOSE_COLOUR_BLACK', 'label': 'Nose Color Black'},
    {'value':'NOSE_COLOUR_PATCHY', 'label': 'Nose Color Patchy'},
    {'value':'NOSE_COLOUR_PINK', 'label': 'Nose Color Pink'},
    {'value':'NOSE_COLOUR_SPOTTED', 'label': 'Nose Color Spotted'},
    {'value':'SCARS_BODY_LEFT', 'label': 'Scars Body Left'},
    {'value':'SCARS_BODY_RIGHT', 'label': 'Scars Body Right'},
    {'value':'SCARS_FACE', 'label': 'Scars Face'},
    {'value':'SCARS_TAIL', 'label': 'Scars Tail'}
  ];*/
  $scope.tags = { 'ear_markings': [
                      {'value': 'EAR_MARKING_LEFT',  'label': 'Left'},
                      {'value': 'EAR_MARKING_RIGHT', 'label': 'Right'}
                    ],
                  'mount_markings': [
                      {'value': 'MOUTH_MARKING_BACK',  'label': 'Back'},
                      {'value': 'MOUTH_MARKING_FRONT', 'label': 'Front'},
                      {'value': 'MOUTH_MARKING_LEFT',  'label': 'Left'},
                      {'value': 'MOUTH_MARKING_RIGHT', 'label': 'Right'}
                    ],
                  'tail_markings': [
                      {'value': 'TAIL_MARKING_MISSING_TUFT', 'label': 'Missing Tuft'}
                    ],
                  'eye_damages': [ //{value: 'EYE_DAMAGE_BOTH',  label: 'Both'}
                      {'value': 'EYE_DAMAGE_LEFT',  'label': 'Left'},
                      {'value': 'EYE_DAMAGE_RIGHT', 'label': 'Right'}
                    ],
                  'nose_color': [
                      {'value': undefined, 'label': 'None'},
                      {'value': 'NOSE_COLOUR_BLACK', 'label': 'Black'},
                      {'value': 'NOSE_COLOUR_PATCHY', 'label': 'Patchy'},
                      {'value': 'NOSE_COLOUR_PINK', 'label': 'Pink'},
                      {'value': 'NOSE_COLOUR_SPOTTED', 'label': 'Spotted'}
                    ],
                  'broken_teeth': [
                      {'value': 'TEETH_BROKEN_CANINE_LEFT', 'label': 'Canine Left'},
                      {'value': 'TEETH_BROKEN_CANINE_RIGHT', 'label': 'Canine Right'},
                      {'value': 'TEETH_BROKEN_INCISOR_LEFT', 'label': 'Incisor Left'},
                      {'value': 'TEETH_BROKEN_INCISOR_RIGHT', 'label': 'Incisor Right'}
                    ],
                  'scars': [
                      {'value': 'SCARS_BODY_LEFT', 'label': 'Body Left'},
                      {'value': 'SCARS_BODY_RIGHT', 'label': 'Body Right'},
                      {'value': 'SCARS_FACE', 'label': 'Face'},
                      {'value': 'SCARS_TAIL', 'label': 'Tail'}
                    ]
  };

  $scope.check_all = function (val){
    _.forEach($scope.imagesets, function(imageset) {
      imageset.selected = val;
      if(imageset.selected){
        if(!_.some($scope.Selecteds, imageset))
          $scope.Selecteds.push(imageset);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, imageset);
      }
    });
  }
  $scope.Select_Imageset1 = function (imageset){
    if(mode!='') return;
    imageset.selected = !imageset.selected;
    $scope.Select_Imageset(imageset);
  }
  $scope.Select_Imageset = function (imageset){
    if(imageset.selected){
      if(!_.some($scope.Selecteds, imageset))
        $scope.Selecteds.push(imageset);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, imageset);
    }
    if($scope.Selecteds.length != $scope.imagesets.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }
  $scope.Add_ImageSet = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.modalTitle = 'Add ImageSet';
    $scope.showValidationMessages = false;
    $scope.imageset = {
      'id': '',
      'lion_id': -1,
      'main_image_id': -1,
      'owner_organization_id': -1,
      'uploading_organization_id':-1,
      'uploading_user_id': -1,
      'latitude' : '',
      'longitude' : '',
      'date_stamp': new Date().toJSON().slice(0,10),
      'date_of_birth': new Date().toJSON().slice(0,10),
      'gender': '',
      'tags': [],
      'notes': '',
      'is_verified': false,
      'trashed': false,
      'selected': true,
      'change_mode': true
    };
    $scope.imageset.image_url = '';
    $scope.modal = $uibModal.open({
        templateUrl: 'Edit_ImageSet.tmpl.html',
        scope:$scope
    });
    $scope.modal.result.then(function (result) {
      alert("Updated");
    }, function (){
      alert("update dismiss");
    });

    $scope.btn_submit = 'Add New';
    $scope.ImageSet_Change = {'mode': mode, label: 'Submit'};
  };

  $scope.change_url = function(){
    $scope.imageset.image_url = '';
    if($scope.imageset.main_image_id)
      $scope.imageset.image_url = _.find($scope.images, {'id': $scope.imageset.main_image_id}).url;
  };

  $scope.submit_modal = function (valid){
    if(valid)
      $scope.modalInstance.close();
    else {
      $scope.showValidationMessages = true;
    }
  }
  $scope.cancel_modal = function(){
    $scope.modalInstance.dismiss();
    mode = '';
    $scope.ImageSet_Change.mode = '';
  }

  $scope.Edit_ImageSet = function(){
    $scope.modalTitle = 'Edit ImageSet';
    $scope.showValidationMessages = false;
    if($scope.Selecteds.length == 1){
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.ImageSet_Change = {'mode': mode, 'label': 'Submit'};

      $scope.imageset = angular.copy($scope.Selecteds[0]);
      $scope.imageset.image_url = '';
      if($scope.imageset.main_image_id)
        $scope.imageset.image_url = _.find($scope.images, {'id': $scope.imageset.main_image_id}).url;

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

/*      var marks = _.intersection(TAGS,['EYE_DAMAGE_LEFT','EYE_DAMAGE_RIGHT','TEETH_BROKEN_CANINE_LEFT',
       'TEETH_BROKEN_CANINE_RIGHT', 'TEETH_BROKEN_INCISOR_LEFT', 'TEETH_BROKEN_INCISOR_RIGHT',
       'EAR_MARKING_LEFT', 'EAR_MARKING_RIGHT','MOUTH_MARKING_BACK', 'MOUTH_MARKING_FRONT',
       'MOUTH_MARKING_LEFT', 'MOUTH_MARKING_RIGHT', 'TAIL_MARKING_MISSING_TUFT', 'NOSE_COLOUR_BLACK',
        'NOSE_COLOUR_PATCHY','NOSE_COLOUR_PINK', 'NOSE_COLOUR_SPOTTED', 'SCARS_BODY_LEFT', 'SCARS_BODY_RIGHT','SCARS_FACE','SCARS_TAIL'])
      var concat = _([]).concat(eyes_dams);
          concat = _(concat).concat(ear_marks);
          concat = _(concat).concat(marks);
      $scope.imageset.tags = concat.value();*/
      $scope.modalInstance = $uibModal.open({
          templateUrl: 'Edit_ImageSet.tmpl.html',
          scope:$scope
      });
      $scope.modalInstance.result.then(function (result) {
        alert("Edited");
      }, function (){

      });
    };
  }

  $scope.Delete_ImageSet = function() {

    $scope.Delete('Image Sets')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (imageset){
        return {'id': imageset.id};
      }), 'id');

      $scope.LincApiServices.ImageSets({'method': 'delete', 'imageset_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'ImageSets successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.imagesets, function(imageset) {
            return imageset.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }


  $scope.Submit_Imageset = function(){
    if(mode == 'edit'){
      var imageset = $scope.Selecteds[0];
      var data = {'email': imageset.email,
        'organization_id': imageset.organization_id,
                  'admin': imageset.admin,
                'trashed': imageset.trashed };
/*
                "tags": "[\"NOSE_COLOUR_PINK\"]",
    "updated_at": "2015-08-12 08:34:53.886000",
    "lion_id": 15,
    "id": 21,
    "main_image_id": 229,
    "uploading_user_id": 9,
    "gender": "male",
    "notes": null,
    "obj_id": "5633a5570640fd58c1e6667d",
    "owner_organization_id": 3,
    "longitude": 35.19293,
    "date_stamp": null,
    "date_of_birth": "2014-02-11 15:29:50.032000",
    "uploading_organization_id": 3,
    "is_primary": false,
    "latitude": -1.33436,
    "is_verified": true,
    "created_at": "2015-08-11 14:29:02.435000",
    "trashed": false

    */
      $scope.LincApiServices.ImageSets({'method': 'put', 'imageset_id' : imageset.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Image Set Info', message: 'Image Set data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(imageset, imageset, response.data);
        imageset.organization = _.find($scope.organizations, {'id': imageset.organization_id}).name;
        imageset.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Image Set data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var imageset = $scope.Selecteds[0];
      var data = {'email': imageset.email,
          'organization_id': imageset.organization_id,
                    'admin': imageset.admin,
                  'trashed': imageset.trashed };
      $scope.LincApiServices.ImageSets({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Image Set Info', message: 'New Image Set successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(imageset, imageset, response.data);
        imageset.organization = _.find($scope.organizations, {'id': imageset.organization_id}).name;
        imageset.change_mode = false;
        imageset.selected = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new Image Set',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }

}])

;
