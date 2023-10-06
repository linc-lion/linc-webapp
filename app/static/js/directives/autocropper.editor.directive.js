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
            template: function () {
                return '<button class="btn btn-primary btn-block" ng-click="showOnly()">Run AutoCropper & Edit</button>';
            },
            scope: {
                useTemplateUrl: '@',
                useCtrl: '@',
                formSize: '@',
                imagesetId: '=',
                saveMetadataAction: '&',
                closeAction: '&',
                btnSubmit: '&',
                imageUpdated: '&',
                debug: '=',
                disableUpload: '=',
                item: "="
            },
            link: function (scope, element, attrs) {

                const canvas_size = {
                    width: 0,
                    height: 0
                }
                const new_image = {
                    width: 0,
                    height: 0
                }

                const old_image = {
                    width: 0,
                    height: 0
                }

                const img_coords_details = {
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

                    img_coords_details['auto_cropper_coords'] = coordinates;

                    for (let key in coordinates) {
                        img_coords_details['manual_coords'][key] = {};
                        img_coords_details['manual_coords'][key]['coords'] = coordinates[key];
                        img_coords_details['manual_coords'][key]['mapped'] = tags_mapping[key]
                    }

                    //original coordiantes
                    scope.coordinates = coordinates;

                }

                scope.setup_bound_box = function () {

                    for (let key in img_coords_details['manual_coords']) {
                        scope.addRectangle(img_coords_details['manual_coords'][key]);
                    }
                }


                scope.addimage = function () {

                    scope.canvas = new fabric.Canvas('canvas', {selection: false});
                    scope.rectanglelist = [];

                    const modalBody = document.querySelector('#canvasmodal');
                    canvas_size.width = modalBody.clientWidth * 0.9;
                    canvas_size.height = window.screen.height * 0.6;
                    scope.canvas.setHeight(canvas_size.height);
                    scope.canvas.setWidth(canvas_size.width); // Set canvas width to match image width

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


                            var fabricImg = new fabric.Image(img, {
                                left: 0,
                                top: 0,
                                width: new_image.width,
                                height: new_image.height,
                                selectable: false,
                            });

                            scope.canvas.setBackgroundImage(fabricImg, scope.canvas.renderAll.bind(scope.canvas));



                            // scope.canvas.on('mouse:wheel', function(opt) {
                            //
                            //     var delta = opt.e.deltaY;
                            //     var zoom = scope.canvas.getZoom();
                            //     zoom *= 0.999 ** delta;
                            //     if (zoom > 20) zoom = 20;
                            //     if (zoom < 1) zoom = 1;
                            //     scope.canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
                            //     opt.e.preventDefault();
                            //     opt.e.stopPropagation();
                            //     var vpt = this.viewportTransform;
                            //     if (zoom < 400 / 1000) {
                            //         vpt[4] = 200 - 1000 * zoom / 2;
                            //         vpt[5] = 200 - 1000 * zoom / 2;
                            //     } else {
                            //         if (vpt[4] >= 0) {
                            //             vpt[4] = 0;
                            //         } else if (vpt[4] < scope.canvas.getWidth() - 1000 * zoom) {
                            //             vpt[4] = scope.canvas.getWidth() - 1000 * zoom;
                            //         }
                            //         if (vpt[5] >= 0) {
                            //             vpt[5] = 0;
                            //         } else if (vpt[5] < scope.canvas.getHeight() - 1000 * zoom) {
                            //             vpt[5] = scope.canvas.getHeight() - 1000 * zoom;
                            //         }
                            //     }
                            //
                            //
                            //  });

                            var clickableMargin = 15;

                            // scope.canvas.on('object:moved', function (options) {
                            //     var movedObject = options.target; // Get the object that has been moved
                            //     console.log("Object has been moved:", movedObject);
                            //     scope.onbjectchange(movedObject);
                            //
                            // });

                            // scope.canvas.on('object:scaled', function (options) {
                            //     var scaledObject = options.target;
                            //     console.log("Object is being resized:", scaledObject);
                            //     scope.onbjectchange(movedObject);
                            //
                            // });

                            // fabric.Canvas.prototype._checkTarget = function (pointer, obj, globalPointer) {
                            //     if (obj &&
                            //         obj.visible &&
                            //         obj.evented &&
                            //         this.containsPoint(null, obj, pointer)) {
                            //         if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
                            //             var isTransparent = this.isTargetTransparent(obj, globalPointer.x, globalPointer.y);
                            //             if (!isTransparent) {
                            //                 return true;
                            //             }
                            //         } else {
                            //             var isInsideBorder = this.isInsideBorder(obj);
                            //             if (!isInsideBorder) {
                            //                 return true;
                            //             }
                            //         }
                            //     }
                            // }
                            //
                            // fabric.Canvas.prototype.isInsideBorder = function (target)
                            // {
                            //     try {
                            //
                            //         var pointerCoords = target.getLocalPointer();
                            //         if (pointerCoords.x > clickableMargin && pointerCoords.x < target.getScaledWidth() - clickableMargin &&
                            //             pointerCoords.y > clickableMargin &&
                            //             pointerCoords.y < target.getScaledHeight() - clickableMargin) {
                            //             return true;
                            //         }
                            //     }
                            //     catch (e) {
                            //         console.log(e);
                            //         return false;
                            //     }
                            //
                            // }

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
                    });

                    let name = new fabric.Text(details['mapped'], {
                        left: rect.left + 5,
                        top: rect.top + 5,
                        selectable: false,
                        width: rect.width -10,
                        fontSize: 10,
                        fill: '#fff',
                        overflow: 'hidden',
                    });

                    const group = new fabric.Group([rect, name], {
                        // subTargetCheck: true,
                        // hasControls: false, // Disable scaling controls
                    })

                    details['group'] = group;

                    let dropdown = null;

                    name.on('mousedown', function (options) {

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

                    scope.canvas.add(group);

                    rect.set({
                        hasControls: true, // Enable scaling controls for the rectangle
                        lockUniScaling: false, // Allow non-uniform scaling for the rectangle
                    });

                    name.set({
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                    });


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
                                });
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        scope.closeAction();
                        console.log(result);
                    }, function (result) {
                        scope.closeAction();
                    });


                }

                scope.addRectanglefunc = function () {
                    const new_rect = {
                        'coords': [50, 50, 100, 100],
                        'mapped': 'marking',
                    }
                    img_coords_details['new_rect_coords'].push(new_rect);
                    scope.addRectangle(new_rect);
                }

                scope.deleteRectanglefunc = function () {
                    var selectedObject = scope.canvas.getActiveObject();
                    for (let key in img_coords_details['manual_coords']) {
                        if (img_coords_details['manual_coords'][key]['group'] == selectedObject) {
                            delete img_coords_details['manual_coords'][key];
                            scope.canvas.remove(selectedObject);
                            scope.canvas.renderAll();
                        }
                    }

                    for (let rect in img_coords_details['new_rect_coords']) {
                        if (rect['group'] == selectedObject) {
                            img_coords_details['new_rect_coords'].splice(rect, 1);
                            scope.canvas.remove(selectedObject);
                            scope.canvas.renderAll();
                        }
                    }
                }

                scope.onbjectchange = function (scaledObject) {
                    for (let key in img_coords_details['manual_coords']) {
                        if (img_coords_details['manual_coords'][key]['group'] == scaledObject) {
                            console.log(key)
                            const coordinates = scaledObject.getBoundingRect();
                            var x1 = coordinates.left;
                            var y1 = coordinates.top;
                            var x2 = coordinates.left + coordinates.width;
                            var y2 = coordinates.top + coordinates.height;
                            img_coords_details['manual_coords'][key]['coords'] = [x1, y1, x2, y2];
                        }
                    }

                    for (let rect in img_coords_details['new_rect_coords']) {

                        if (rect['group'] == scaledObject) {
                            console.log(rect)
                            const coordinates = scaledObject.getBoundingRect();
                            var x1 = coordinates.left;
                            var y1 = coordinates.top;
                            var x2 = coordinates.left + coordinates.width;
                            var y2 = coordinates.top + coordinates.height;
                            rect['coords'] = [x1, y1, x2, y2];
                        }

                    }


                }

            }
        };
    }]);
