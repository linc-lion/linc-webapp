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



        var titles = {};
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

        const rect_details = [];


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

            } else {

                $scope.img_coords_details['auto_cropper_coords'] = coordinates;
                for (let key in coordinates) {
                    $scope.img_coords_details['manual_coords'][key] = {};
                    $scope.img_coords_details['manual_coords'][key]['coords'] = coordinates[key];
                    $scope.img_coords_details['manual_coords'][key]['mapped'] = tags_mapping[key]
                }

            }

        }

        $scope.setup_bound_box = function ()
        {
            //initialization of dropdown menu
            $scope.dropdown = document.getElementById('tag-dropdown');

            $scope.dropdown.addEventListener('change', function () {

                let selected_rect = $scope.canvas.getActiveObject();
                $scope.onObjectChange(selected_rect, this.value);
                $scope.canvas.renderAll();
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

            if (img.height < canvas_size.height)
            {
                canvas_size.height = img.height;

            }

            if (img.width < canvas_size.width)
            {
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


        $scope.setup_image = function () {

            //setup canvas and its size according to window screen
            $scope.canvas = new fabric.Canvas('canvas', {selection: false});

            $scope.canvas.selection = false; // disable group selection



            // fabric.Object.prototype._drawControl = controlHandles
            // fabric.Object.prototype.cornerSize = 20
            //
            // function controlHandles(control, ctx, methodName, left, top) {
            //     if (!this.isControlVisible(control)) {
            //         return
            //     }
            //     var size = this.cornerSize
            //
            //     // Note 1: These are standard HTML5 canvas properties, not fabric.js.
            //     // Note 2: Order matters, for instance putting stroke() before strokeStyle may result in undesired effects.
            //     ctx.beginPath()
            //     ctx.arc(left + size / 4, top + size / 4, size / 4, 0, 2 * Math.PI, false);
            //     ctx.fillStyle = "pink"
            //     ctx.fill()
            //     ctx.lineWidth = 3
            //     ctx.strokeStyle = "red"
            //     ctx.stroke()
            // }

            const modalBody = document.querySelector('#canvasmodal');
            canvas_size.width = modalBody.clientWidth * 0.9;
            canvas_size.height = window.screen.height * 0.6;


            //read the image file and setup the canvas
            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.src = event.target.result;

                img.onload = function () {

                    //scale the image according to the canvas size
                    $scope.scale_image(img);

                    // Create a new image object
                    var fabricImg = new fabric.Image(img, {
                        left: 0,
                        top: 0,
                    });


                    // Calculate the scaling factor to fit the canvas size
                    var scaleFactor = Math.min(
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
                strokeWidth: 3,
                opacity: 1,
                perPixelTargetFind: true,
                strokeUniform: true,
                noScaleCache: false,
                hasControls: true,
                lockUniScaling: false,
            });


            // Create a text object with coordinates and options
            let name = new fabric.Text(details['mapped'], {
                left: rect.left,
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

            // Add mouse down event listener to text object
            // to open tags dropdown menu
            // and update the tag name

            rect.on('deselected', function (options) {

                    rect.set({ stroke: 'red' });
                    $scope.dropdown.style.display = 'none';
            });

            rect.on('mousedown', function (options) {

                rect.set({ stroke: 'blue' });

                let scaledObject = $scope.canvas.getActiveObject();

                for (let rect in rect_details) {

                    if (rect_details[rect]['rect'] === scaledObject) {

                        $scope.dropdown.value = rect_details[rect]['name'].text;
                        $scope.dropdown.style.display = 'block';

                        rect_details[rect]['name'].bringToFront();
                        break;
                    }
                }


            });

            // saves the rect and text objects in a list
            const current_elements = {
                'rect': rect,
                'name': name,
            }
            rect_details.push(current_elements);

            //link the rect and text objects to autocropper tags
            //so that when the rect is resize or moved
            //we can track the changes and update the coordinate of the correct tag
            details['current_elements'] = current_elements

            // Add the rect and text objects to canvas
            $scope.canvas.add(rect);
            $scope.canvas.add(name);


        }


        $scope.addRectanglefunc = function () {
            const new_rect = {
                'coords': [50, 200, 200, 300],
                'mapped': 'marking',
            }
            $scope.img_coords_details['new_rect_coords'].push(new_rect);
            $scope.addRectangle(new_rect);
        }

        $scope.deleteRectanglefunc = function () {
            var selectedObject = $scope.canvas.getActiveObject();
            for (let key in $scope.img_coords_details['manual_coords']) {
                const current = $scope.img_coords_details['manual_coords'][key]['current_elements'];
                if (current['name'] == selectedObject || current['rect'] == selectedObject) {
                    delete $scope.img_coords_details['manual_coords'][key];
                    $scope.canvas.remove(current['name']);
                    $scope.canvas.remove(current['rect']);
                    $scope.canvas.renderAll();
                }
            }

            for (let rect in $scope.img_coords_details['new_rect_coords']) {

                const current = $scope.img_coords_details['new_rect_coords'][rect]['current_elements'];
                if (current['name'] == selectedObject || current['rect'] == selectedObject) {
                    $scope.canvas.remove(current['name']);
                    $scope.canvas.remove(current['rect']);
                    $scope.img_coords_details['new_rect_coords'].splice(rect, 1);
                    $scope.canvas.renderAll();

                }


            }
        }

        $scope.onObjectChange = function (scaledObject, selected_text) {

            let updated_text_element = null;

            for (let rect in rect_details) {

                //find the resized rect and update the text position
                if (rect_details[rect]['rect'] === scaledObject) {

                    rect_details[rect]['name'].left = scaledObject.left + 3;
                    rect_details[rect]['name'].top = scaledObject.top;
                    rect_details[rect]['name'].setCoords();
                    if (selected_text) {
                        updated_text_element = rect_details[rect]['name'];
                        rect_details[rect]['name'].set({text: selected_text});

                    }
                }
            }

            //check if the resized rect is in the manual_coords or new_rect_coords
            //and update the coordinates

            for (let key in $scope.img_coords_details['manual_coords']) {

                const current_obj = $scope.img_coords_details['manual_coords'][key];
                if (current_obj['current_elements']['rect'] === scaledObject) {
                    let x1 = scaledObject.left;
                    let y1 = scaledObject.top;
                    let x2 = scaledObject.left + (scaledObject.width * scaledObject.scaleX);
                    let y2 = scaledObject.top + (scaledObject.height * scaledObject.scaleY);
                    $scope.img_coords_details['manual_coords'][key]['coords'] = [x1, y1, x2, y2];
                }

                if (current_obj['current_elements']['name'] === updated_text_element) {
                    current_obj['mapped'] = selected_text;
                }

            }

            for (let key in $scope.img_coords_details['new_rect_coords']) {

                const current_obj = $scope.img_coords_details['new_rect_coords'][key]

                if (current_obj['current_elements']['rect'] === scaledObject) {
                    console.log(key)
                    let x1 = scaledObject.left;
                    let y1 = scaledObject.top;
                    let x2 = scaledObject.left + (scaledObject.width * scaledObject.scaleX);
                    let y2 = scaledObject.top + (scaledObject.height * scaledObject.scaleY);
                    $scope.img_coords_details['new_rect_coords'][key]['coords'] = [x1, y1, x2, y2];
                }

                if (current_obj['current_elements']['name'] == updated_text_element) {
                    current_obj['mapped'] = selected_text;
                }

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


        $scope.setup_canvas_callbacks = function () {

            $scope.canvas.on('mouse:down', function (opt) {
                var evt = opt.e;
                if (evt.altKey === true) {
                    this.isDragging = true;
                    this.selection = false;
                    this.lastPosX = evt.clientX;
                    this.lastPosY = evt.clientY;
                }
            });
            $scope.canvas.on('mouse:move', function (opt) {
                if (this.isDragging) {
                    var e = opt.e;
                    var vpt = this.viewportTransform;
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

                var delta = opt.e.deltaY;
                var zoom = $scope.canvas.getZoom();
                zoom *= 0.999 ** delta;
                if (zoom > 20) zoom = 20;
                if (zoom < 1)
                {
                    zoom = 1;
                    $scope.canvas.setViewportTransform([1,0,0,1,0,0]);
                }
                $scope.canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();

            });


            $scope.canvas.on('object:moved', function (options) {
                var movedObject = options.target; // Get the object that has been moved
                $scope.onObjectChange(movedObject);

            });

            $scope.canvas.on('object:scaled', function (options) {


                setTimeout(function () {
                    var scaledObject = options.target;
                    $scope.onObjectChange(scaledObject);
                }, 0);



            });

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
