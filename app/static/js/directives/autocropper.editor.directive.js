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

                const canvas_size = {
                    width: 0,
                    height: 0
                }
                const new_image = {
                    width: 0,
                    height: 0
                }

                const rect_details = [];

                const old_image = {
                    width: 0,
                    height: 0
                }

                 scope.img_coords_details = {
                    'auto_cropper_coords': {},
                    'manual_coords': {},
                    'new_rect_coords' : []
                }

                let tags_names =
                    {

                        'cv': 'CV Image',
                        'full-body': 'Full Body',
                        'main-id': 'Main Id',
                        'marking': 'Marking',
                        'whisker': 'Whisker (Do not use in Algorithm)',
                        'whisker-left': 'Whisker Left',
                        'whisker-right': 'Whisker Right'
                    };

                let tags_mapping =
                    {
                        'cv-dl': 'cv',
                        'cv-dr': 'cv',
                        'cv-f': 'cv',
                        'cv-sl': 'cv',
                        'cv-sr': 'cv',
                        'ear-dl-l': 'marking',
                        'ear-dl-r': 'marking',
                        'ear-dr-l': 'marking',
                        'ear-dr-r': 'marking',
                        'ear-fl': 'marking',
                        'ear-fr': 'marking',
                        'ear-sl': 'marking',
                        'ear-sr': 'marking',
                        'eye-dl-l': 'marking',
                        'eye-dl-r': 'marking',
                        'eye-dr-l': 'marking',
                        'eye-dr-r': 'marking',
                        'eye-fl': 'marking',
                        'eye-fr': 'marking',
                        'eye-sl': 'marking',
                        'eye-sr': 'marking',
                        'nose-dl': 'marking',
                        'nose-dr': 'marking',
                        'nose-f': 'marking',
                        'nose-sl': 'marking',
                        'nose-sr': 'marking',
                        'whisker-sl': 'whisker-left',
                        'whisker-sr': 'whisker-right',
                        'whisker-dl': 'whisker',
                        'whisker-dr': 'whisker',
                        'whisker-f': 'whisker',
                    };


                let dropdown = null;
                let dropdownoptions = `
                 <option value="cv">CV Image</option>
                 <option value="full-body">Full Body</option>
                 <option value="main-id">Main Id</option>
                 <option value="marking">Marking</option>
                 <option value="whisker">Whisker (Do not use in Algorithm)</option>
                 <option value="whisker-left">Whisker Left</option>
                 <option value="whisker-right">Whisker Right</option>
                `;

                scope.adjust_coordinates = function (coordinates, old_image, new_image) {
                    const newX1 = (coordinates[0] / old_image.width) * new_image.width;
                    const newY1 = (coordinates[1] / old_image.height) * new_image.height;
                    const newX2 = (coordinates[2] / old_image.width) * new_image.width;
                    const newY2 = (coordinates[3] / old_image.height) * new_image.height;

                    // const adjustedX1 = Math.round(newX1);
                    // const adjustedY1 = Math.round(newY1);
                    // const adjustedX2 = Math.round(newX2);
                    // const adjustedY2 = Math.round(newY2);

                    // Return the adjusted coordinates
                    return [newX1, newY1, newX2, newY2];
                }

                scope.initialize = function (coordinates) {
                    // setup background image
                    scope.addimage();

                    // image is open for edit
                    if ('auto_cropper_coords' in coordinates) {
                        scope.img_coords_details = coordinates;

                    } else {

                        scope.img_coords_details['auto_cropper_coords'] = coordinates;
                        for (let key in coordinates) {
                            scope.img_coords_details['manual_coords'][key] = {};
                            scope.img_coords_details['manual_coords'][key]['coords'] = coordinates[key];
                            scope.img_coords_details['manual_coords'][key]['mapped'] = tags_mapping[key]
                        }

                    }


                }

                scope.setup_bound_box = function () {

                    for (let key in scope.img_coords_details['manual_coords']) {
                        scope.addRectangle(scope.img_coords_details['manual_coords'][key]);
                    }

                    for (let key in scope.img_coords_details['new_rect_coords']) {
                        scope.addRectangle(scope.img_coords_details['new_rect_coords'][key]);
                    }


                }


                scope.addimage = function () {

                    scope.canvas = new fabric.Canvas('canvas', {selection: false});
                    scope.rectanglelist = [];

                    const modalBody = document.querySelector('#canvasmodal');
                    canvas_size.width = modalBody.clientWidth * 0.9;
                    canvas_size.height = window.screen.height * 0.6;


                    var reader = new FileReader();

                    reader.onload = function (event) {
                        var img = new Image();
                        img.src = event.target.result;

                        img.onload = function () {

                            old_image.height = img.height;
                            old_image.width = img.width;

                            const imageHeight = canvas_size.width * (old_image.height / old_image.width)

                            new_image.width = canvas_size.width;
                            new_image.height = imageHeight;


                            scope.canvas.setHeight(canvas_size.height);
                            scope.canvas.setWidth(canvas_size.width); // Set canvas width to match image width



                            var fabricImg = new fabric.Image(img, {
                                left: 0,
                                top: 0,
                            });

                            scope.canvas.setDimensions({ width: canvas_size.width, height: canvas_size.height });

                            // Calculate the scaling factor to fit the canvas size
                            var scaleFactor = Math.min(
                                scope.canvas.width / old_image.width,
                                scope.canvas.height / old_image.height
                            );

                            // Scale the image to fit the canvas
                            fabricImg.scale(scaleFactor);

                            scope.canvas.setBackgroundImage(fabricImg, scope.canvas.renderAll.bind(scope.canvas));


                            scope.canvas.on('mouse:wheel', function(opt) {

                                var delta = opt.e.deltaY;
                                var zoom = scope.canvas.getZoom();
                                zoom *= 0.999 ** delta;
                                if (zoom > 20) zoom = 20;
                                if (zoom < 1) zoom = 1;
                                scope.canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
                                opt.e.preventDefault();
                                opt.e.stopPropagation();
                                var vpt = this.viewportTransform;
                                if (zoom < 400 / 1000) {
                                    vpt[4] = 200 - 1000 * zoom / 2;
                                    vpt[5] = 200 - 1000 * zoom / 2;
                                } else {
                                    if (vpt[4] >= 0) {
                                        vpt[4] = 0;
                                    } else if (vpt[4] < scope.canvas.getWidth() - 1000 * zoom) {
                                        vpt[4] = scope.canvas.getWidth() - 1000 * zoom;
                                    }
                                    if (vpt[5] >= 0) {
                                        vpt[5] = 0;
                                    } else if (vpt[5] < scope.canvas.getHeight() - 1000 * zoom) {
                                        vpt[5] = scope.canvas.getHeight() - 1000 * zoom;
                                    }
                                }


                             });



                            scope.canvas.on('object:moved', function (options) {
                                var movedObject = options.target; // Get the object that has been moved
                                scope.onbjectchange(movedObject);

                            });

                            scope.canvas.on('object:scaled', function (options) {
                                var scaledObject = options.target;
                                scope.onbjectchange(scaledObject);

                            });


                            scope.setup_bound_box();
                        };
                    };

                    reader.readAsDataURL(scope.item._file);

                }

                scope.addRectangle = function (details) {

                    const coordinate = details['coords'];

                    let rect = new fabric.Rect({
                        left: coordinate[0],
                        top: coordinate[1],
                        fill: '',
                        width: coordinate[2] - coordinate[0],
                        height: coordinate[3]- coordinate[1],
                        stroke: 'red',
                        strokeWidth: 5,
                        opacity: 1,
                        perPixelTargetFind: true,
                        strokeUniform: true,
                        noScaleCache: false,
                        hasControls: true, // Enable scaling controls for the rectangle
                        lockUniScaling: false, // Allow non-uniform scaling for the rectangle
                    });

                    let name = new fabric.Text(details['mapped'], {
                        left: rect.left + 5,
                        top: rect.top + 5,
                        selectable: false,
                        width: rect.width -10,
                        fontSize: 10,
                        fill: '#fff',
                        overflow: 'hidden',
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true
                    });

                    name.on('mousedown', function (options) {

                        console.log('working');

                        if (dropdown) {
                            return;
                        }

                        dropdown = document.createElement('select');

                        dropdown.innerHTML = dropdownoptions;
                        dropdown.style.position = 'absolute';
                        dropdown.style.left = options.target.left + 'px';
                        dropdown.style.top = (options.target.top + 30) + 'px';
                        scope.canvas.wrapperEl.appendChild(dropdown);
                        dropdown.value = details['mapped'];

                        dropdown.addEventListener('change', function () {
                            name.set({text: this.value});
                            dropdown.remove();
                            dropdown = null;
                            details['mapped'] = this.value;
                            scope.canvas.renderAll();

                        });


                    });

                    const current_elements = {
                            'rect': rect,
                            'name': name,
                        }

                    rect_details.push(current_elements);
                    details['current_elements'] = current_elements

                    scope.canvas.add(rect);
                    scope.canvas.add(name);





                }

                scope.initCropper = function () {
                    scope.runCropper({item: scope.item, onSuccess: scope.showOnly});
                }

                scope.showOnly = function () {

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
                                    'coords': scope.imageCoords[scope.item.nickname]
                                });
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        // scope.updateCoords();
                        scope.updateCoords({ result: result, item: scope.item });
                        scope.buttonText = 'Edit';
                        console.log(result);
                    }, function (result) {
                        scope.closeAction();
                    });


                }

                scope.addRectanglefunc = function () {
                    const new_rect = {
                        'coords': [50, 200, 200, 300],
                        'mapped': 'marking',
                    }
                    scope.img_coords_details['new_rect_coords'].push(new_rect);
                    scope.addRectangle(new_rect);
                }

                scope.deleteRectanglefunc = function () {
                    var selectedObject = scope.canvas.getActiveObject();
                    for (let key in scope.img_coords_details['manual_coords']) {
                        const current = scope.img_coords_details['manual_coords'][key]['current_elements'];
                        if (current['name'] == selectedObject || current['rect'] == selectedObject)
                        {
                            delete scope.img_coords_details['manual_coords'][key];
                            scope.canvas.remove(current['name']);
                            scope.canvas.remove(current['rect']);
                            scope.canvas.renderAll();
                        }
                    }

                    for (let rect in scope.img_coords_details['new_rect_coords']) {

                        const current = scope.img_coords_details['new_rect_coords'][rect]['current_elements'];
                        if (current['name'] == selectedObject || current['rect'] == selectedObject)
                        {
                            scope.canvas.remove(current['name']);
                            scope.canvas.remove(current['rect']);
                            scope.img_coords_details['new_rect_coords'].splice(rect, 1);
                            scope.canvas.renderAll();

                        }


                    }
                }


                scope.onbjectchange = function (scaledObject)
                {

                    for (let rect in rect_details)
                    {
                        if (rect_details[rect]['rect'] == scaledObject)
                        {

                            rect_details[rect]['name'].left = scaledObject.left + 5;
                            rect_details[rect]['name'].top = scaledObject.top + 5;
                            rect_details[rect]['name'].width = scaledObject.width -10;
                            rect_details[rect]['name'].setCoords();
                        }
                    }



                    for (let key in scope.img_coords_details['manual_coords'])
                    {

                        const current_obj = scope.img_coords_details['manual_coords'][key]['current_elements'];
                        if (current_obj['rect'] == scaledObject)
                        {
                            console.log(key)
                            const coordinates = scaledObject.getBoundingRect();
                            var x1 = coordinates.left;
                            var y1 = coordinates.top;
                            var x2 = coordinates.left + coordinates.width;
                            var y2 = coordinates.top + coordinates.height;
                            scope.img_coords_details['manual_coords'][key]['coords'] = [x1, y1, x2, y2];
                        }
                    }

                    for (let key in scope.img_coords_details['new_rect_coords'])
                    {

                        const current_obj = scope.img_coords_details['new_rect_coords'][key]['current_elements']

                        if (current_obj['rect'] == scaledObject) {
                            console.log(key)
                            const coordinates = scaledObject.getBoundingRect();
                            var x1 = coordinates.left;
                            var y1 = coordinates.top;
                            var x2 = coordinates.left + coordinates.width;
                            var y2 = coordinates.top + coordinates.height;
                            scope.img_coords_details['new_rect_coords'][key]['coords'] = [x1, y1, x2, y2];
                        }

                    }


                }

            }
        };
    }]);
