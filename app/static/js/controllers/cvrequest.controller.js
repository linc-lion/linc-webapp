'use strict';

angular.module('lion.guardians.cvrequest.controller', ['lion.guardians.cvrequest.directive'])

.controller('CVRequesCtrl', ['$scope', '$window', '$uibModalInstance', 'LincServices', 'imagesetId', function ($scope, $window, $uibModalInstance, LincServices, imagesetId) {

    $scope.title = 'Lion Search';
    $scope.content = 'Search';
    //ng-init="lions=[{hasResults:true},{pending:true},{ verified:true}]">
    $scope.lions_filter = function() {
      var filter = {hasResults: true, pending: true, verified: true}
      return (filter);
    };

    $scope.Close = function () {
      $uibModalInstance.close("ok");
    };
    $scope.requestCV = function () {
      var lions_id = _.pluck(_.filter($scope.lions, 'selected', true), 'id');
      console.log('image set: ' + imagesetId + ' lions: ' + lions_id)
      var data = {imageset_id: imagesetId, lions_id: lions_id};
      LincServices.requestCV(data, function(result){
        
      });
    //  $uibModalInstance.close(items);
    };
    $scope.Cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    $scope.checkAll = function (check) {
      $scope.lions.forEach(function(lion){
        lion.selected = check;
      });
    };
    $scope.checked_count = 0;
    $scope.count = function(check){
      if(check)
        $scope.checked_count++;
      else $scope.checked_count--;
      console.log("checked" + $scope.checked_count);
    }

    LincServices.getlists(['lions'],function(data){
      $scope.lions = data['lions'];
    });

    /*$scope.lions = [{ id: 1, name: 'leão 1', age: 13, url_small: "/static/images/square-small/lion1.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false},
                           { id: 2, name: 'leão 2', age: 14, url_small: "/static/images/square-small/lion2.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: false, selected: false},
                           { id: 3, name: 'leão 3', age: 15, url_small: "/static/images/square-small/lion3.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false},
                           { id: 4, name: 'leão 4', age: 8, url_small: "/static/images/square-small/lion4.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 5, name: 'leão 5', age: 8, url_small: "/static/images/square-small/lion5.jpg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: false, primary: true, verified: true, selected: false },
                           { id: 6, name: 'leão 6', age: 9, url_small: "/static/images/square-small/lion6.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: false, primary: true, verified: true, selected: false },
                           { id: 7, name: 'leão 7', age: 6, url_small: "/static/images/square-small/lion7.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: false, pending: true, primary: true, verified: true, selected: false },
                           { id: 8, name: 'leão 8', age: 2, url_small: "/static/images/square-small/lion8.jpeg", gender: 'female', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false },
                           { id: 9, name: 'leão 9', age: 7, url_small: "/static/images/square-small/lion9.jpg", gender: 'female', organization: 'Lion Guardians', hasResults: false, pending: false, primary: false, verified: true, selected: false },
                           { id: 10, name: 'leão 10', age: 10, url_small: "/static/images/square-small/lion10.jpeg", gender: 'male', organization: 'Lion Guardians', hasResults: true, pending: true, primary: true, verified: true, selected: false }];
*/


}]);
