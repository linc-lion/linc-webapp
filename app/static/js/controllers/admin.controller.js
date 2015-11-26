
'use strict';

angular.module('lion.guardians.admin.controller', [])

.controller('AdminCtrl', ['$scope', '$q', '$uibModal', 'LincApiServices', 'NotificationFactory', 'organizations', 'users', 'lions'/*, 'imagesets', 'images', 'cvrequests', 'cvresults'*/, function ($scope, $q, $uibModal, LincApiServices, NotificationFactory, organizations, users, lions/*, imagesets, images, cvrequests, cvresults*/) {
  $scope.LincApiServices = LincApiServices;
  $scope.Notification = NotificationFactory;
  $scope.organizations = organizations;
  $scope.users = users;
  $scope.lions = lions;
  //$scope.imagesets = imagesets;
  //$scope.images = images;
  /*$scope.cvrequests = cvrequests;
  $scope.cvresults = cvresults;*/

  $scope.tabIndex = {'users': 0, 'organizations': 1, 'lions': 2, 'imagesets': 3,
                     'images': 4, 'cvrequests': 5, 'cvresults': 6  }
  $scope.tabs = [
    { index: 'users', title:'Users', disabled: false, template: 'admin.users.tpl.html'},
    { index: 'organizations', title:'Organizations', disabled: false, template: 'admin.organizations.tpl.html'},
    { index: 'lions', title:'Lions', disabled: false, template: 'admin.lions.tpl.html'},
    { index: 'imagesets', title:'Imagesets', disabled: false, template: 'admin.imagesets.tpl.html'},
    { index: 'images', title:'Images', disabled: false, template: 'admin.images.tpl.html'},
    { index: 'cvrequests', title:'CV Requests', disabled: false, template: 'admin.cvrequests.tpl.html'},
    { index: 'cvresults', title:'CV Results', disabled: false, template: 'admin.cvresults.tpl.html'}
  ];

  $scope.Delete = function (title){
    var deferred = $q.defer();
    $scope.modalTitle = 'Delete ' + title;
    $scope.modalMessage = 'Are you sure you want to delete the ' + title + ' ?';
    $scope.modalContent = 'Form';
    $scope.modalInstance = $uibModal.open({
        templateUrl: 'Delete.tmpl.html',
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
}])

.controller('AdminUsersCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.User_Change = {'mode': '', 'label': 'Submit'};
  $scope.isCollapsed = true;

  $scope.check_all = function (val){
    _.forEach($scope.users, function(user) {
      user.selected = val;
      if(user.selected){
        if(!_.some($scope.Selecteds, user))
          $scope.Selecteds.push(user);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, user);
      }
    });
  }

  $scope.Select_User = function (user){
    user.selected = !user.selected;
    if(user.selected){
      if(!_.some($scope.Selecteds, user))
        $scope.Selecteds.push(user);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, user);
    }
    if($scope.Selecteds.length != $scope.users.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }

  $scope.Add_User = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.users.unshift({ 'id': '', 'email': '', 'organization_id': -1, 'admin': false,
                      'trashed': false, 'selected': true, 'change_mode': true });
    $scope.btn_submit = 'Add New';
    $scope.User_Change = {'mode': mode, 'label': 'Submit'};
  };

  $scope.Edit_User = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.User_Change = {'mode': mode, 'label': 'Submit'};
    }
  }

  $scope.Cancel_Edit_User = function(){
    if(mode == 'add'){
      _.remove($scope.users, function(user) {
        return user == $scope.users[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.User_Change.mode = '';
  }

  $scope.Delete_User = function() {

    $scope.Delete('User')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (user){
        return {'id': user.id};
      }), 'id');

      $scope.LincApiServices.Users({'method': 'delete', 'users_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'Users successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.users, function(user) {
            return user.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }

  $scope.Submit_User = function(){
    if(mode == 'edit'){
      var user = $scope.Selecteds[0];
      var data = {'email': user.email,
        'organization_id': user.organization_id,
                  'admin': user.admin,
                'trashed': user.trashed };
      $scope.LincApiServices.Users({'method': 'put', 'user_id' : user.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'User Info', message: 'User data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(user, user, response.data);
        user.organization = _.find($scope.organizations, {'id': user.organization_id}).name;
        user.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change User data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var user = $scope.Selecteds[0];
      var data = {'email': user.email,
          'organization_id': user.organization_id,
                    'admin': user.admin,
                  'trashed': user.trashed };
      $scope.LincApiServices.Users({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'User Info', message: 'New User successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(user, user, response.data);
        user.organization = _.find($scope.organizations, {'id': user.organization_id}).name;
        user.change_mode = false;
        user.selected = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new User',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }

  $scope.ChangePassword = function(){
    $scope.modalTitle = 'Change Password';
    $scope.showValidationMessages = false;
    if($scope.Selecteds.length == 1){
      $scope.sel_user = { 'email': $scope.Selecteds[0].email, 'password': "", 'confirmPassword': "" };
      $scope.modalInstance = $uibModal.open({
          templateUrl: 'Password.tmpl.html',
          scope:$scope
      });
      $scope.modalInstance.result.then(function (result) {
        alert("Update Password");
      });
      $scope.submit_password = function (valid){
        if(valid)
          $scope.modalInstance.close();
        else {
          $scope.showValidationMessages = true;
        }
      }
      $scope.cancel_password = function(){
        $scope.modalInstance.dismiss();
      }
    };
  }
}])

.controller('AdminOrganizationsCtrl', ['$scope', function ($scope) {

  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.Org_Change = {'mode': '', 'label': 'Submit'};

  $scope.check_all = function (val){
    _.forEach($scope.organizations, function(organization) {
      organization.selected = val;
      if(organization.selected){
        if(!_.some($scope.Selecteds, organization))
          $scope.Selecteds.push(organization);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, organization);
      }
    });
  }

  $scope.Select_Org = function (organization){
    organization.selected = !organization.selected;
    if(organization.selected){
      if(!_.some($scope.Selecteds, organization))
        $scope.Selecteds.push(organization);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, organization);
    }
    if($scope.Selecteds.length != $scope.organizations.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }

  $scope.Add_Organization = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.organizations.unshift({ 'id': '', 'trashed': false, 'selected': true, 'change_mode': true });
    $scope.btn_submit = 'Add New';
    $scope.Org_Change = {'mode': mode, 'label': 'Submit'};
  };

  $scope.Edit_Organization = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.Org_Change = {'mode': mode, 'label': 'Submit'};
    }
  }

  $scope.Cancel_Edit_Org = function(){
    if(mode == 'add'){
      _.remove($scope.organizations, function(organization) {
        return organization == $scope.organizations[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.Org_Change.mode = '';
  }

  $scope.Delete_Organization = function() {
    $scope.Delete('Organization')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (organization){
        return {'id': organization.id};
      }), 'id');

      $scope.LincApiServices.Organizations({'method': 'delete', 'organizations_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'Organizations successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.organizations, function(organization) {
            return organization.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }

  $scope.Submit_Organization = function(){
    if(mode == 'edit'){
      var organization = $scope.Selecteds[0];
      var data = {'name': organization.name,
                'trashed': organization.trashed };
      $scope.LincApiServices.Organizations({'method': 'put', 'organization_id' : organization.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Organization Info', message: 'Organization data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(organization, organization, response.data);
        organization.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Organization data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var organization = $scope.Selecteds[0];
      var data = {'name': organization.name,
                'trashed': organization.trashed };
      $scope.LincApiServices.Organizations({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Organization Info', message: 'New Organization successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(organization, organization, response.data);
        organization.change_mode = false;
        organization.selected = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new Organization',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }

}])

.controller('AdminLionsCtrl', ['$scope', function ($scope) {
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.Lion_Change = {'mode': '', 'label': 'Submit'};

  $scope.check_all = function (val){
    _.forEach($scope.lions, function(lion) {
      lion.selected = val;
      if(lion.selected){
        if(!_.some($scope.Selecteds, lion))
          $scope.Selecteds.push(lion);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, lion);
      }
    });
  }
  $scope.Select_Lion = function (lion){
    lion.selected = !lion.selected;
    if(lion.selected){
      if(!_.some($scope.Selecteds, lion))
        $scope.Selecteds.push(lion);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, lion);
    }
    if($scope.Selecteds.length != $scope.lions.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }
  $scope.Add_Lion = function () {
    mode = 'add';
    $scope.check_all(false);
    $scope.lions.unshift({ 'id': '', 'name': '', 'organization_id': -1, 'primary_image_set_id': '',
                      'trashed': false, 'selected': true, 'change_mode': true });
    $scope.btn_submit = 'Add New';
    $scope.Lion_Change = {'mode': mode, label: 'Submit'};
  };
  $scope.Edit_Lion = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.Lion_Change = {'mode': mode, 'label': 'Submit'};
    }
  }
  $scope.Cancel_Edit_Lion = function(){
    if(mode == 'add'){
      _.remove($scope.lions, function(lion) {
        return lion == $scope.lions[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.Lion_Change.mode = '';
  }

  $scope.Delete_Lion = function() {
    $scope.Delete('Lion')
    .then(function (result) {
      var data = _.pluck(_.map($scope.Selecteds, function (lion){
        return {'id': lion.id};
      }), 'id');

      $scope.LincApiServices.Lions({'method': 'delete', 'lions_id': data}).then(function(){
        $scope.Notification.success({
          title: "Delete", message: 'Lions successfully deleted.',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.Selecteds.forEach(function(item, i){
          var remove = _.remove($scope.lions, function(lion) {
            return lion.id == item.id;
          });
        });
        $scope.Selecteds = [];
      });
    }, function () {

    });
  }

  $scope.Submit_Lion = function(){
    if(mode == 'edit'){
      var lion = $scope.Selecteds[0];
      var data = {'name': lion.name,
       'organization_id': lion.organization_id,
  'primary_image_set_id': lion.primary_image_set_id,
                'trashed': lion.trashed };
      $scope.LincApiServices.Lions({'method': 'put', 'lion_id' : lion.id, 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Lion Info', message: 'Lion data successfully updated',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(lion, lion, response.data);
        lion.organization = _.find($scope.organizations, {id: lion.organization_id}).name;
        lion.change_mode = false;
        lion.selected = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to change Lion data',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
    if(mode == 'add'){
      var lion = $scope.Selecteds[0];
      var data = {'name': lion.name,
       'organization_id': lion.organization_id,
  'primary_image_set_id': lion.primary_image_set_id,
                'trashed': lion.trashed };
      $scope.LincApiServices.Lions({'method': 'post', 'data': data}).then(function(response){
        $scope.Notification.success({
          title: 'Lion Info', message: 'New Lion successfully created',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        _.merge(lion, lion, response.data);
        lion.change_mode = false;
      },
      function(error){
        $scope.Notification.error({
          title: "Fail", message: 'Fail to create new Lion',
          position: 'right', // right, left, center
          duration: 5000   // milisecond
        });
      });
    }
  }

}])

.controller('AdminImageSetsCtrl', ['$scope', function ($scope) {
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.ImageSet_Change = {'mode': '', 'label': 'Submit'};

  $scope.genders = [{'type': 'male', 'name' :'Male'},
                    {'type': 'female', 'name': 'Female'}];
  $scope.tags = [
    {'value':'EYE_DAMAGE_BOTH', 'label': 'Eye Damage Both'},
    {'value':'EYE_DAMAGE_LEFT', 'label': 'Eye Damage Left'},
    {'value':'EYE_DAMAGE_RIGHT', 'label': 'Eye Damage Right'},
    {'value':'TEETH_BROKEN_CANINE_LEFT', 'label': 'Broken Teeth Canine Left'},
    {'value':'TEETH_BROKEN_CANINE_RIGHT', 'label': 'Broken Teeth Canine Right'},
    {'value':'TEETH_BROKEN_INCISOR_LEFT', 'label': 'Broken Teeth Incisor Left'},
    {'value':'TEETH_BROKEN_INCISOR_RIGHT', 'label': 'Broken Teeth Incisor Right'},
    {'value':'EAR_MARKING_BOTH', 'label': 'Ear Marking Both'},
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
  ];


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
  $scope.Select_Imageset = function (imageset){
    imageset.selected = !imageset.selected;
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
    /*$scope.imagesets.unshift(
      { 'id': '',
      'lion_id': -1,
      'main_image_id': -1,
      'owner_organization_id': -1,
      'uploading_organization_id':-1,
      'uploading_user_id': -1,
      'latitude' : '',
      'longitude' : '',
      'date_stamp': '',
      'date_of_birth': '',
      'gender':
      'tags':
      'notes':
      'is_verified':
      'trashed': false,
      'selected': true, 'change_mode': true });*/

    $scope.btn_submit = 'Add New';
    $scope.ImageSet_Change = {'mode': mode, label: 'Submit'};
  };

  $scope.Edit_ImageSet = function() {
    if($scope.Selecteds.length == 1){
      $scope.Selecteds[0].change_mode = true;
      $scope.btn_submit = 'Update';
      mode = 'edit';
      $scope.ImageSet_Change = {'mode': mode, 'label': 'Submit'};
    }
  }

  $scope.Cancel_Edit_ImageSet = function(){
    if(mode == 'add'){
      _.remove($scope.imagesets, function(imageset) {
        return imageset == $scope.imagesets[0];
      });
    }
    if(mode == 'edit'){
      $scope.Selecteds[0].change_mode = false;
    }
    mode = '';
    $scope.ImageSet_Change.mode = '';
  }

  $scope.Delete_ImageSet = function() {

    $scope.Delete('Image Set')
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

.controller('AdminImagesCtrl', ['$scope', function ($scope) {
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.Image_Change = {};

  $scope.show_photo = function(url){
    var win = window.open(url, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=600");
    win.focus();
  }

  $scope.layoutDone = function(){
    console.log(new Date());
  }

/*
  $scope.check_all = function (val){
    _.forEach($scope.images, function(image) {
      image.selected = val;
      if(image.selected){
        if(!_.some($scope.Selecteds, image))
          $scope.Selecteds.push(image);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, image);
      }
    });
  }
  $scope.Select_Image = function (image){
    image.selected = !image.selected;
    if(image.selected){
      if(!_.some($scope.Selecteds, image))
        $scope.Selecteds.push(image);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, image);
    }
    if($scope.Selecteds.length != $scope.images.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }*/
}])

.controller('AdminCVRequestsCtrl', ['$scope', function ($scope) {
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.CVRequest_Change = {};
/*
  $scope.check_all = function (val){
    _.forEach($scope.cvrequests, function(cvrequest) {
      cvrequest.selected = val;
      if(cvrequest.selected){
        if(!_.some($scope.Selecteds, cvrequest))
          $scope.Selecteds.push(cvrequest);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, cvrequest);
      }
    });
  }
  $scope.Select_CVRequest = function (cvrequest){
    cvrequest.selected = !cvrequest.selected;
    if(cvrequest.selected){
      if(!_.some($scope.Selecteds, cvrequest))
        $scope.Selecteds.push(cvrequest);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, cvrequest);
    }
    if($scope.Selecteds.length != $scope.cvrequests.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }*/
}])

.controller('AdminCVResultsCtrl', ['$scope', function ($scope) {
  var mode = '';
  $scope.btn_submit = '';
  $scope.Selecteds = [];
  $scope.select_all = false;
  $scope.CVResult_Change = {};
/*
  $scope.check_all = function (val){
    _.forEach($scope.cvresults, function(cvresult) {
      cvresult.selected = val;
      if(cvresult.selected){
        if(!_.some($scope.Selecteds, cvresult))
          $scope.Selecteds.push(cvresult);
      }
      else {
        $scope.Selecteds = _.without($scope.Selecteds, cvresult);
      }
    });
  }
  $scope.Select_CVresult = function (cvresult){
    cvresult.selected = !cvresult.selected;
    if(cvresult.selected){
      if(!_.some($scope.Selecteds, cvresult))
        $scope.Selecteds.push(cvresult);
    }
    else {
      $scope.Selecteds = _.without($scope.Selecteds, cvresult);
    }
    if($scope.Selecteds.length != $scope.cvresults.length)
      $scope.select_all = false;
    else
      $scope.select_all = true;
  }*/
}])

.directive('nxEqualEx', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqualEx) {
                console.error('nxEqualEx expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqualEx, function (value) {
                // Only compare values if the second ctrl has a value.
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('nxEqualEx', value === model.$viewValue);
                }
            });
            model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                    model.$setValidity('nxEqualEx', true);
                    return value;
                }
                var isValid = value === scope.$eval(attrs.nxEqualEx);
                model.$setValidity('nxEqualEx', isValid);
                return isValid ? value : undefined;
            });
        }
    };
})

/*.directive('watchScope', [function () {
  return {
    scope: {
      item: '=watchScope'
    },
    link: function (scope, element, attrs) {
      console.log('element ' + scope.item.name + ' created');
    }
  };
}])*/

.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
    }
})
;
