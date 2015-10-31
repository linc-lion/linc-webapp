'use strict';

angular.module('lion.guardians.metadata.controller', ['lion.guardians.metadata.directive'])

.controller('MetadataCtrl', ['$scope', '$window', '$uibModalInstance', 'LincServices', 'notificationFactory', 'modalOptions', function ($scope, $window, $uibModalInstance, LincServices, notificationFactory, modalOptions) {

  //$scope.selectedDate = new Date();
  //$scope.selectedDateAsNumber = Date.UTC(1986, 1, 22);

  $scope.debug = false;
  // Btn Save and Update
  $scope.show = {save: modalOptions.btn.save, upload: modalOptions.btn.update};
  // Close
  $scope.Close = function () {
   $uibModalInstance.close('close');
  };
  $scope.Cancel = function () {
   $uibModalInstance.dismiss('cancel');
  };
  // Save
  $scope.Save = function(){
    console.log("Save Imagesets");
    $uibModalInstance.close("save");
  }
  // Title
  $scope.title = modalOptions.title;
  $scope.content = 'Form';

  LincServices.getlists(['organizations'],function(data){
    $scope.organizations = data['organizations'];
  });
  // Result Datas
  $scope.selected = { name: "", organization: "", dateOfBirth: new Date(), datastamp: new Date(),
    geopos: {lat:"", lng: ""}, gender: "", markings: [],
    teeth: [], eye_damage: [], nose_color: [], scars: [], notes: "Notes here"
  }

  $scope.Calc_Age = function(){
    $scope.selected.age = getAge($scope.selected.dateOfBirth);
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
                               {value: 'MOUTH_MARKING_FRONT', lbael: 'Front'},
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
}]);
