'use strict';

angular.module('lion.guardians.metadata.controller', ['lion.guardians.metadata.directive'])

.controller('MetadataCtrl', ['$scope', '$window', '$uibModalInstance', 'LincServices', 'NotificationFactory', 'optionsSet', '$timeout', '$q',  function ($scope, $window, $uibModalInstance, LincServices, NotificationFactory, optionsSet,  $timeout, $q) {

  $scope.debug = false;
  $scope.optionsSet = optionsSet;

  var titles = {}; titles['lions'] = 'Lion Metadata'; titles['imagesets'] = 'Image Set Metadata';

  $scope.showLionName = (optionsSet.type === 'lions' || (optionsSet.type === 'imagesets' && optionsSet.edit === 'edit'));
  $scope.isReadOnly = (optionsSet.edit === 'edit');
  $scope.isNew = (optionsSet.edit === 'new');
  // Title
  $scope.title = titles[optionsSet.type];
  $scope.content = 'Form';

  $scope.LoadMetaData = function (){
    LincServices.getMetadata($scope.id,function(metadata){
      $scope.selected = metadata;
    });
  }

  //if(optionsSet.edit == 'edit') $scope.LoadMetaData();

  $scope.Cancel = function () {
   $uibModalInstance.dismiss('cancel');
  };
  // Save and Close
  $scope.SaveClose = function(){
    console.log("Save Imagesets");
    $scope.metadataId = {id: 5};
    NotificationFactory.success({
      title: "Save", message:'Metadata saved with success',
      position: "right", // right, left, center
      duration: 2000     // milisecond
    });
    $uibModalInstance.close($scope.metadataId);
  }
  // Save
  $scope.Save = function(){
    var deferred = $q.defer();

    $timeout(function() {
       $scope.optionsSet.data = { id: 1, name: 'leão 1', age: 13, thumbnail: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false};
        ;
        console.log("Save Imagesets");
        NotificationFactory.success({
          title: "Save", message:'Metadata saved with success',
          position: "right", // right, left, center
          duration: 2000     // milisecond
        });
        $scope.metadataId = {id: 5};
        deferred.resolve($scope.optionsSet);
    }, 1000);
    return deferred.promise;
  }
  $scope.Close = function(){
    console.log("Close UploadImages");
    $scope.metadataId = {id: 5};
    $uibModalInstance.close($scope.metadataId);
  }

  LincServices.getlists(['organizations'],function(data){
    $scope.organizations = data['organizations'];
  });
  // Result Datas
  $scope.selected = { name: "", organization: "", dateOfBirth: new Date(), dateStamp: new Date(),
    geopos: {lat:"", lng: ""}, gender: "", markings: [],
    teeth: [], eye_damage: [], nose_color: [], scars: [], notes: "Notes here"
  }

  // Datas
  $scope.genders = [{value: 'male', label: 'Male'},
                    {value: 'female',label: 'Female'}];

  $scope.markings = [{value: 'ear',  label: 'Ear', allText : 'All Ear Markings',
                      items: [ //{value: 'EAR_MARKING_BOTH}', label: 'Both'},
                               {value: 'EAR_MARKING_LEFT',  label: 'Left'},
                               {value: 'EAR_MARKING_RIGHT', label: 'Right'}
                              ]},
                     {value: 'mount', label: 'Mouth', allText: 'All Mouth Markings',
                      items: [ {value: 'MOUTH_MARKING_BACK',  label: 'Back'},
                               {value: 'MOUTH_MARKING_FRONT', label: 'Front'},
                               {value: 'MOUTH_MARKING_LEFT',  label: 'Left'},
                               {value: 'MOUTH_MARKING_RIGHT', label: 'Right'} ]},
                     {value: 'tail', label: 'Tail',  allText: 'All Tail Markings',
                      items: [{value: 'TAIL_MARKING_MISSING_TUFT', label: 'Missing Tuft'}]}];

  $scope.eye_damage = [ //{value: 'EYE_DAMAGE_BOTH',  label: 'Both'}
                        {value: 'EYE_DAMAGE_LEFT',  label: 'Left'},
                        {value: 'EYE_DAMAGE_RIGHT', label: 'Right'}
                      ];

  $scope.nose_color = [{value: 'NOSE_COLOUR_BLACK',   label: 'Black'},
                       {value: 'NOSE_COLOUR_PATCHY',  label: 'Patchy'},
                       {value: 'NOSE_COLOUR_PINK',    label: 'Pynk'},
                       {value: 'NOSE_COLOUR_SPOTTED', label: 'Spotted'}];

  $scope.broken_teeth = [{value: 'TEETH_BROKEN_CANINE_LEFT', label: 'Canine Left'},
                         {value: 'TEETH_BROKEN_CANINE_RIGHT', label: 'Canine Right'},
                         {value: 'TEETH_BROKEN_INCISOR_LEFT', label: 'Incisor Left'},
                         {value: 'TEETH_BROKEN_INCISOR_RIGHT', label: 'Incisor Right'}
                        ];

  $scope.scars = [{value: 'SCARS_BODY_LEFT', label: 'Body Left' },
                  {value: 'SCARS_BODY_RIGHT', label: 'Body Right'},
                  {value: 'SCARS_FACE', label: 'Face'},
                  {value: 'SCARS_TAIL', label: 'Tail'}
                 ];
  $scope.notes = "Notes here";

  function getAge(birthDate) {
    var now = new Date();

    function isLeap(year) {
      return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }
    //function isLeap(year) {
    //return(new Date(year, 1, 29).getMonth() == 1)
    //}
    // days since the birthdate
    var days = Math.floor((now.getTime() - birthDate.getTime())/1000/60/60/24);
    var age = 0;
    // iterate the years
    for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++){
      var daysInYear = isLeap(y) ? 366 : 365;
      if (days >= daysInYear){
        days -= daysInYear;
        age++;
        // increment the age only if there are available enough days for the year.
      }
    }
    return age;
  }

  $scope.Calc_Age = function(){
    $scope.selected.age = getAge($scope.selected.dateOfBirth);
  }

}]);
