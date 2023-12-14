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

angular.module('linc.autocropper.editor.directive', [])


    .directive('autoCropperEditor', ['$uibModal', function ($uibModal) {
        return {
            transclude: true,
            restrict: 'EA',
            template: function (element, attrs) {

                return '<button class="btn btn-primary" ng-disabled="item.isUploading" ng-click="initCropper()">{{ buttonText }}</button>';

            },
            scope: {
                useTemplateUrl: '@',
                useCtrl: '@',
                formSize: '@',
                imagesetId: '=',
                saveMetadataAction: '&',
                closeAction: '&',
                updateCoords: "&",
                runCropper: '&',
                btnSubmit: '&',
                imageUpdated: '&',
                debug: '=',
                disableUpload: '=',
                imageCoords: "=",
                item: "="
            },
            link: function (scope, element, attrs) {

                scope.buttonText = 'Run AutoCropper & Edit';

                scope.initCropper = function () {

                    scope.runCropper({item: scope.item, onSuccess: scope.showModal});
                }

                scope.showModal = function () {

                    var modalScope = scope.$new();
                    modalScope.debug = scope.debug;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: scope.useTemplateUrl,
                        controller: scope.useCtrl,
                        size: scope.formSize,
                        scope: modalScope,
                        resolve: {
                            options: function () {
                                return ({
                                    'isNew': true,
                                    'item': scope.item,
                                    'imagesetId': scope.imagesetId,
                                    'coords': scope.imageCoords[scope.item.file.name]
                                });
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {

                        scope.updateCoords({ result: result, item: scope.item });
                        scope.buttonText = 'Edit';
                        console.log(result);
                    }, function (result) {
                        scope.closeAction();
                    });

                }



            }
        };
    }]);
