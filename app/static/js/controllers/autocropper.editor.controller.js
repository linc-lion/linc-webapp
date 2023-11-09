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

angular.module('linc.autocropper.editor.controller', [])

    .controller('AutoCropperEditorCtrl', ['$http', '$scope', '$window', '$cookies', '$uibModalInstance', 'AutoCropperServices', '$bsTooltip', 'FileUploader', 'NotificationFactory', 'options', function ($http, $scope, $window, $cookies, $uibModalInstance, AutoCropperServices, $bsTooltip, FileUploader, NotificationFactory, options) {


        $scope.imagesetId = options.imagesetId;
        $scope.isNew = options.isNew;
        $scope.existing_coords = options.coords;
        $scope.isEdit = false;
        $scope.enablePan = false;


        let titles = {};
        titles['lions'] = 'Lion';
        titles['imagesets'] = 'Image Set';
        $scope.title = 'Auto Cropper Editor';
        $scope.content = 'Upload Images<br />Contents!';
        const canvas_size = {
            width: 0,
            height: 0
        }
        const scaled_img_res = {
            width: 0,
            height: 0
        }

        const org_img_res = {
            width: 0,
            height: 0
        }

        const rect_details = {};

        $scope.state = [];
        $scope.CurrentStateIndex = -1;


        $scope.img_coords_details = {
            'auto_cropper_coords': {},
            'manual_coords': {},
            'new_rect_coords': []
        }

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


        $scope.GoBack = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.Cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.Finish = function () {


            $scope.update_coordinates();

            //before going back to the main page, we need to rescale the coordinates
            //to the original image size
            $scope.rescale_coords(scaled_img_res, org_img_res);

            $uibModalInstance.close($scope.img_coords_details);
        };


        $scope.RunCropperController = function () {

            if ($scope.existing_coords) {

                setTimeout(function () {
                    $scope.initialize($scope.existing_coords);
                }, 100); // Adjust the delay as needed

            }

        };

        $scope.RunCropperController();


        $scope.initialize = function (coordinates) {
            // setup background image
            $scope.setup_image();

            // image is open for edit
            if ('auto_cropper_coords' in coordinates) {
                $scope.img_coords_details = coordinates;
                $scope.isEdit = true;


            } else {

                $scope.isEdit = false;
                $scope.img_coords_details['auto_cropper_coords'] = coordinates;
                for (let key in coordinates) {
                    $scope.img_coords_details['manual_coords'][key] = {};
                    $scope.img_coords_details['manual_coords'][key]['coords'] = coordinates[key];
                    $scope.img_coords_details['manual_coords'][key]['mapped'] = tags_mapping[key]
                }

            }

        }

        $scope.setup_bound_box = function () {
            //initialization of dropdown menu
            $scope.dropdown = document.getElementById('tag-dropdown');

            $scope.dropdown.addEventListener('change', function () {

                let selected_rect = $scope.canvas.getActiveObject();

                let coorindates = {
                    'left': selected_rect.left,
                    'top': selected_rect.top
                }

                $scope.onObjectChange(selected_rect, coorindates, this.value);
                $scope.canvas.discardActiveObject().renderAll();
                $scope.dropdown.style.display = 'none';
            });


            // rescale the coordinates before adding the rectangles to canvas
            $scope.rescale_coords(org_img_res, scaled_img_res);

            for (let key in $scope.img_coords_details['manual_coords']) {
                $scope.addRectangle($scope.img_coords_details['manual_coords'][key]);
            }

            for (let key in $scope.img_coords_details['new_rect_coords']) {

                $scope.addRectangle($scope.img_coords_details['new_rect_coords'][key]);
            }


        }

        $scope.scale_image = function (img) {

            org_img_res.height = img.height;
            org_img_res.width = img.width;

            if (img.height < canvas_size.height) {
                canvas_size.height = img.height;

            }

            if (img.width < canvas_size.width) {
                canvas_size.width = img.width;
            }

            scaled_img_res.height = canvas_size.height;

            //find the aspect ratio of the image
            let aspect_ratio = img.width / img.height

            //calculate the width of the image according to the height of the canvas
            const imageWidth = canvas_size.height * aspect_ratio

            scaled_img_res.width = imageWidth;
            canvas_size.width = imageWidth;

            // Set canvas width to match new scaled image width
            $scope.canvas.setHeight(canvas_size.height);
            $scope.canvas.setWidth(canvas_size.width);
            $scope.canvas.setDimensions({width: canvas_size.width, height: canvas_size.height});


        }

        $scope.reloadCanvasFromState = function(stateJSON) {


            $scope.canvas.off('object:modified');
            $scope.canvas.off('object:added');
            // $scope.canvas.off('object:removed');


            // Load the canvas from the JSON string
            $scope.canvas.loadFromJSON(stateJSON, function () {

                $scope.reapplyEventListeners();

                for (let object of $scope.canvas.getObjects()) {
                    $scope.addObjectListner(object);
                }

                // Re-render the canvas
                $scope.canvas.renderAll();

            });


        }

        $scope.uuidv4 = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        $scope.shouldDisable = function(){
            console.log($scope.CurrentStateIndex);

            if($scope.isEdit && $scope.CurrentStateIndex <= (Object.keys($scope.img_coords_details['manual_coords']).length + $scope.img_coords_details['new_rect_coords'].length ) -1)
            {
                return true;
            }

            if ($scope.CurrentStateIndex <= (Object.keys($scope.img_coords_details['auto_cropper_coords']).length) -1) {
                return true; // No states to revert to
            }
            return false;
        }

        $scope.undo = function ()
        {
            if ($scope.shouldDisable()) {
                return; // No states to revert to
            }

            $scope.CurrentStateIndex--;
            $scope.reloadCanvasFromState($scope.state[$scope.CurrentStateIndex]);

        }

        $scope.updateCanvasState= function() {
            let json = $scope.canvas.toJSON(['selectable', 'perPixelTargetFind', 'uniqueId', 'hasRotatingPoint']);
            let deleteCount = 0;
            if (($scope.state.length - 1 - $scope.CurrentStateIndex) > 0) {
                deleteCount = ($scope.state.length - 1 - $scope.CurrentStateIndex);
            }

            $scope.CurrentStateIndex++;
            $scope.state.splice($scope.CurrentStateIndex, deleteCount, json);
            $scope.$apply();

        }


         $scope.reapplyEventListeners = function() {
            $scope.canvas.on('object:modified', function (options) {
               if (options.target.type !== 'text') {
                    $scope.updateCanvasState();
                }
            });

            // $scope.canvas.on('object:removed', function (options) {
            //     if (options.target.type !== 'text') {
            //         $scope.updateCanvasState();
            //     }
            //
            // });

            $scope.canvas.on('object:added', function (options) {

                if (options.target.type !== 'text') {
                    $scope.updateCanvasState();
                }

            });
        }


        $scope.setup_image = function () {

            //setup canvas and its size according to window screen
            $scope.canvas = new fabric.Canvas('canvas', {
                selectionFullyContained: true
            });


            $scope.reapplyEventListeners();


            $scope.canvas.selection = true; // enable group selection


            const modalBody = document.querySelector('#canvasmodal');
            canvas_size.width = modalBody.clientWidth * 0.9;
            canvas_size.height = window.screen.height * 0.6;


            //read the image file and setup the canvas
            let reader = new FileReader();
            reader.onload = function (event) {
                let img = new Image();
                img.src = event.target.result;

                img.onload = function () {

                    //scale the image according to the canvas size
                    $scope.scale_image(img);

                    // Create a new image object
                    let fabricImg = new fabric.Image(img, {
                        left: 0,
                        top: 0,
                    });


                    // Calculate the scaling factor to fit the canvas size
                    let scaleFactor = Math.min(
                        $scope.canvas.width / org_img_res.width,
                        $scope.canvas.height / org_img_res.height
                    );

                    // Scale the image to fit the canvas
                    fabricImg.scale(scaleFactor);

                    // Add image to canvas
                    $scope.canvas.setBackgroundImage(fabricImg, $scope.canvas.renderAll.bind($scope.canvas));

                    //setup canvas callbacks
                    $scope.setup_canvas_callbacks()


                    $scope.setup_bound_box();


                };
            };

            reader.readAsDataURL($scope.item._file);

        }

        $scope.addObjectListner = function(object) {
            if (object.type === 'rect') {


                object.on('deselected', function (options) {
                    $scope.dropdown.style.display = 'none';
                    this.set({stroke: 'red'});
                });

                object.on('mousedown', function (options) {

                    this.set({stroke: 'blue'});
                    let scaledObject = $scope.canvas.getActiveObject();
                    let name_uuid = rect_details[scaledObject.uniqueId];
                    let name_object = $scope.canvas.getObjects().find(obj => obj.uniqueId === name_uuid);
                    $scope.dropdown.value = name_object.text;
                    $scope.dropdown.style.display = 'block';
                    name_object.bringToFront();

                });

            }

        }

        $scope.addRectangle = function (details) {

            const coordinate = details['coords'];


            // Create a rect object with coordinates and options
            let rect = new fabric.Rect({
                left: coordinate[0],
                top: coordinate[1],
                fill: '',
                width: coordinate[2] - coordinate[0],
                height: coordinate[3] - coordinate[1],
                stroke: 'red',
                strokeWidth: 1,
                opacity: 1,
                perPixelTargetFind: true,
                targetFindTolerance: 100,
                strokeUniform: true,
                hasControls: true,
                hasRotatingPoint: false
            });

            let rect_uuid = $scope.uuidv4();
            let name_uuid = $scope.uuidv4();

            rect.set('uniqueId', rect_uuid);


            // Create a text object with coordinates and options
            let name = new fabric.Text(details['mapped'], {
                left: rect.left + 3,
                top: rect.top,
                selectable: false,
                // width: rect.width - 10,
                fontSize: 10,
                fill: '#fff',
                overflow: 'hidden',
                hasControls: false,
                lockScalingX: true,
                lockScalingY: true
            });

            name.set('uniqueId', name_uuid);


            // Add mouse down event listener to text object
            // to open tags dropdown menu
            // and update the tag name

            $scope.addObjectListner(rect);


            // saves the rect and text objects in a list
            rect_details[rect_uuid] = name_uuid


            //link the rect and text objects to autocropper tags
            //so that when the rect is resize or moved
            //we can track the changes and update the coordinate of the correct tag
            details['current_elements'] = rect_uuid

            // Add the rect and text objects to canvas
            $scope.canvas.add(name);
            $scope.canvas.add(rect);



        }

        $scope.addRectanglefunc = function () {
            const new_rect = {
                'coords': [50, 200, 200, 300],
                'mapped': 'marking',
            }
            $scope.addRectangle(new_rect);
        }

        $scope.deleteRectanglefunc = function () {
            let selectedObject = $scope.canvas.getActiveObject();

            if (selectedObject._objects) {
                // $scope.canvas.off('object:removed');

                for (let i = 0; i < selectedObject._objects.length; i++){

                    $scope.removeObject(selectedObject._objects[i]);
                    if(i === selectedObject._objects.length-1){
                        $scope.updateCanvasState();
                        $scope.canvas.discardActiveGroup();
                        $scope.canvas.renderAll();

                    }

                }

            } else {
                $scope.removeObject(selectedObject);
                $scope.updateCanvasState();
                $scope.canvas.discardActiveObject();
                $scope.canvas.renderAll();
            }



        }

        $scope.removeObject = function (selectedObject) {


            let name_uuid = rect_details[selectedObject.uniqueId];
            let name_object = $scope.canvas.getObjects().find(obj => obj.uniqueId === name_uuid);

            $scope.canvas.remove(name_object);
            $scope.canvas.remove(selectedObject);

        }

        $scope.onObjectChange = function (scaledObject, coordinates, selected_text) {

            let name_uuid = rect_details[scaledObject.uniqueId];

            let name_object = $scope.canvas.getObjects().find(obj => obj.uniqueId === name_uuid);
            name_object.left = coordinates.left + 3;
            name_object.top = coordinates.top;
            name_object.setCoords();
            if (selected_text) {
                name_object.set({text: selected_text});
            }

        }

        $scope.adjust_coordinates = function (coordinates, org_img_res, scaled_img_res) {
            const newX1 = (coordinates[0] / org_img_res.width) * scaled_img_res.width;
            const newY1 = (coordinates[1] / org_img_res.height) * scaled_img_res.height;
            const newX2 = (coordinates[2] / org_img_res.width) * scaled_img_res.width;
            const newY2 = (coordinates[3] / org_img_res.height) * scaled_img_res.height;

            // Return the adjusted coordinates
            return [newX1, newY1, newX2, newY2];
        }

        $scope.togglePan = function(item){

            if (item.textContent === 'Enable Pan')
            {
                item.textContent = 'Disable Pan';
                $scope.enablePan = true;
                $scope.canvas.defaultCursor = 'grab';

            }
            else{
                item.textContent = 'Enable Pan';
                $scope.enablePan = false;
                $scope.canvas.defaultCursor = 'default';


            }
        }

        $scope.setup_canvas_callbacks = function () {

            $scope.canvas.on('mouse:down', function (opt) {
                let evt = opt.e;
                if ($scope.enablePan) {
                    this.isDragging = true;
                    this.selection = false;
                    this.lastPosX = evt.clientX;
                    this.lastPosY = evt.clientY;
                }
            });
            $scope.canvas.on('mouse:move', function (opt) {
                if (this.isDragging) {
                    let e = opt.e;
                    let vpt = this.viewportTransform;
                    vpt[4] += e.clientX - this.lastPosX;
                    vpt[5] += e.clientY - this.lastPosY;
                    this.requestRenderAll();
                    this.lastPosX = e.clientX;
                    this.lastPosY = e.clientY;
                }
            });
            $scope.canvas.on('mouse:up', function (opt) {
                // on mouse up we want to recalculate new interaction
                // for all objects, so we call setViewportTransform
                this.setViewportTransform(this.viewportTransform);
                this.isDragging = false;
                this.selection = true;
            });
            $scope.canvas.on('mouse:wheel', function (opt) {

                let delta = opt.e.deltaY;
                let zoom = $scope.canvas.getZoom();
                zoom *= 0.999 ** delta;
                if (zoom > 20) zoom = 20;
                if (zoom < 1) {
                    zoom = 1;
                    $scope.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                }
                $scope.canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();

            });
            $scope.canvas.on('object:moved', function (options) {

                if (options.target._objects) {
                    for (let movedObject of options.target._objects) {

                        let x1 = options.target.left + ((options.target.width / 2) * options.target.scaleX) + movedObject.left;
                        let y1 = options.target.top + ((options.target.height / 2) * options.target.scaleY) + movedObject.top;

                        let coordinates = {
                            'left': x1,
                            'top': y1
                        };

                        $scope.onObjectChange(movedObject, coordinates);

                    }
                } else {
                    let movedObject = options.target;

                    let coordinates = {
                        'left': movedObject.left,
                        'top': movedObject.top
                    };

                    $scope.onObjectChange(movedObject, coordinates);

                }

            });
            $scope.canvas.on('object:scaled', function (options) {


                if (options.target._objects) {
                    for (let movedObject of options.target._objects) {

                        let x1 = options.target.left + ((options.target.width / 2) * options.target.scaleX) + movedObject.left;
                        let y1 = options.target.top + ((options.target.height / 2) * options.target.scaleY) + movedObject.top;

                        let coordinates = {
                            'left': x1,
                            'top': y1
                        };

                        $scope.onObjectChange(movedObject, coordinates);

                    }
                } else {
                    let movedObject = options.target;

                    let coordinates = {
                        'left': movedObject.left,
                        'top': movedObject.top
                    };

                    $scope.onObjectChange(movedObject, coordinates);
                }

            });
            $scope.canvas.on('selection:created', function (options) {

                for (let object of options.selected) {
                    object.set({stroke: 'blue'});
                }
            });
            $scope.canvas.on('selection:cleared', function (options) {

                if (options.deselected) {
                    for (let object of options.deselected) {
                        object.set({stroke: 'red'});
                    }

                }


            });


        }

        $scope.update_coordinates = function () {

            const rectList = [];

            for (let object of $scope.canvas.getObjects()){
                if (object.type === 'rect'){
                    rectList.push(object.uniqueId);
                }
            }

            //delete all keys which rectangle is deleted
            Object.keys($scope.img_coords_details['manual_coords']).forEach((key) => {
                if (! ( rectList.includes($scope.img_coords_details['manual_coords'][key].current_elements)) ) {
                    delete $scope.img_coords_details['manual_coords'][key];
                }
            });

            $scope.img_coords_details['new_rect_coords'] = $scope.img_coords_details['new_rect_coords'].filter((key) => {
                return rectList.includes(key.current_elements);
            });



            for (let rect_uuid of rectList) {
                let rect_object = $scope.canvas.getObjects().find(obj => obj.uniqueId === rect_uuid);
                let text_object = $scope.canvas.getObjects().find(obj => obj.uniqueId === rect_details[rect_uuid]);
                let manualKey = null;

                let x1 = rect_object.left;
                let y1 = rect_object.top;
                let x2 = x1 + (rect_object.width * rect_object.scaleX);
                let y2 = y1 + (rect_object.height * rect_object.scaleY);
                let mapping_text = text_object.text;

                for (const [key, value] of Object.entries($scope.img_coords_details['manual_coords'])) {
                    if (value.current_elements === rect_object.uniqueId) {
                        manualKey = key;
                        $scope.img_coords_details['manual_coords'][manualKey].coords = [x1, y1, x2, y2];
                        $scope.img_coords_details['manual_coords'][manualKey].mapped = mapping_text;
                        break;
                    }
                }

                if (!manualKey) {

                    let newRectKey = null;
                    for (let rect of $scope.img_coords_details['new_rect_coords']) {
                        if (rect.current_elements === rect_object.uniqueId) {
                            newRectKey = rect;
                            rect.coords = [x1, y1, x2, y2];
                            rect.mapped = mapping_text;
                            break;
                        }
                    }

                    if (!newRectKey) {

                        const new_rect_details = {
                            'coords': [x1, y1, x2, y2],
                            'mapped': mapping_text
                        }

                        $scope.img_coords_details['new_rect_coords'].push(new_rect_details);
                    }

                }


            }
        }

        $scope.rescale_coords = function (org_img_res, scaled_img_res) {

            for (let key in $scope.img_coords_details['manual_coords']) {

                $scope.img_coords_details['manual_coords'][key]['coords'] = $scope.adjust_coordinates($scope.img_coords_details['manual_coords'][key]['coords'], org_img_res, scaled_img_res);
            }

            for (let key in $scope.img_coords_details['new_rect_coords']) {

                $scope.img_coords_details['new_rect_coords'][key]['coords'] = $scope.adjust_coordinates($scope.img_coords_details['new_rect_coords'][key]['coords'], org_img_res, scaled_img_res);
            }

        }


    }])
