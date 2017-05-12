(function () {
 'use strict';

 angular
         .module('app.graphics.fabric')
         .factory('Fabric', Fabric)

 /** @ngInject */
 function Fabric(FabricWindow, $timeout, $window, FabricCanvas, FabricDirtyStatus) {

  return function (options) {

   var canvas;
   var JSONObject;
   var service = angular.extend({
    canvasBackgroundColor: 'transparent',
    canvasWidth: 300,
    canvasHeight: 300,
    canvasOriginalHeight: 300,
    canvasOriginalWidth: 300,
    maxContinuousRenderLoops: 25,
    continuousRenderTimeDelay: 500,
    editable: true,
    JSONExportProperties: [],
    loading: false,
    dirty: false,
    initialized: false,
    userHasClickedCanvas: false,
    downloadMultipler: 2,
    imageDefaults: {},
    textDefaults: {},
    shapeDefaults: {},
    windowDefaults: {
     transparentCorners: false,
     rotatingPointOffset: 25,
     padding: 0
    },
    canvasDefaults: {
     selection: false
    }
   }, options);

   function capitalize(string) {
    if (typeof string !== 'string') {
     return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
   }

   function getActiveStyle(styleName, object) {
    object = object || canvas.getActiveObject();

    if (typeof object !== 'object' || object === null) {
     return '';
    }

    return (object.getSelectionStyles && object.isEditing) ? (object.getSelectionStyles()[styleName] || '') : (object[styleName] || '');
   }

   function setActiveStyle(styleName, value, object) {
    object = object || canvas.getActiveObject();

    if (object.setSelectionStyles && object.isEditing) {
     var style = {};
     style[styleName] = value;
     object.setSelectionStyles(style);
    } else {
     object[styleName] = value;
    }

    service.render();
   }

   function getActiveProp(name) {
    var object = canvas.getActiveObject();

    return typeof object === 'object' && object !== null ? object[name] : '';
   }

   function setActiveProp(name, value) {
    var object = canvas.getActiveObject();
    object.set(name, value);
    service.render();
   }

   function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
     var slice = byteCharacters.slice(offset, offset + sliceSize);

     var byteNumbers = new Array(slice.length);
     for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
     }

     var byteArray = new Uint8Array(byteNumbers);

     byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
   }

   function isHex(str) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/gi.test(str);
   }

   //
   // Canvas
   // ==============================================================
   service.renderCount = 0;
   service.render = function () {
    var objects = canvas.getObjects();
    for (var i in objects) {
     objects[i].setCoords();
    }

    canvas.calcOffset();
    canvas.renderAll();
    service.renderCount++;
    // console.log('Render cycle:', service.renderCount);
   };

   service.move = function (value) {
    var objects = canvas.getObjects();
    for (var i in objects) {
     objects[i].setCoords();
     objects[i].animate('left', objects[i].getLeft() + value, {
      duration: 1000,
      onChange: canvas.renderAll.bind(canvas),
      onComplete: function () {
       console.log("moved");
       //service.move(200);
      },
     });
    }
   };

   service.setCanvas = function (newCanvas) {
    canvas = newCanvas;
    canvas.selection = service.canvasDefaults.selection;
   };

   service.setTextDefaults = function (textDefaults) {
    service.textDefaults = textDefaults;
   };

   service.setJSONExportProperties = function (JSONExportProperties) {
    service.JSONExportProperties = JSONExportProperties;
   };

   service.setCanvasBackgroundColor = function (color) {
    service.canvasBackgroundColor = color;
    canvas.setBackgroundColor(color);
    service.render();
   };

   service.setCanvasWidth = function (width) {
    service.canvasWidth = width;
    canvas.setWidth(width);
    service.render();
   };

   service.setCanvasHeight = function (height) {
    service.canvasHeight = height;
    canvas.setHeight(height);
    service.render();
   };

   service.setCanvasSize = function (width, height) {
    service.stopContinuousRendering();
    var initialCanvasScale = service.canvasScale;
    service.resetZoom();

    service.canvasWidth = width;
    service.canvasOriginalWidth = width;
    canvas.originalWidth = width;
    canvas.setWidth(width);

    service.canvasHeight = height;
    service.canvasOriginalHeight = height;
    canvas.originalHeight = height;
    canvas.setHeight(height);

    service.canvasScale = initialCanvasScale;
    service.render();
    service.setZoom();
    service.render();
    service.setZoom();
   };

   service.isLoading = function () {
    return service.isLoading;
   };

   service.deactivateAll = function () {
    canvas.deactivateAll();
    service.deselectActiveObject();
    service.render();
   };

   service.clearCanvas = function () {
    canvas.clear();
    canvas.setBackgroundColor('');
    service.render();
   };

   //
   // Creating Objects
   // ==============================================================
   service.addObjectToCanvas = function (object) {
    object.originalScaleX = object.scaleX;
    object.originalScaleY = object.scaleY;
    object.originalLeft = object.left;
    object.originalTop = object.top;

    canvas.add(object);
    service.setObjectZoom(object);
    canvas.setActiveObject(object);
    object.bringToFront();
    // service.center();
    service.render();
   };

   //
   // Image
   // ==============================================================
   service.addImage = function (imageURL, properties) {
    fabric.Image.fromURL(imageURL, function (object) {
     object.id = service.createId();
     object.set(properties);

     // Add a filter that can be used to turn the image
     // into a solid colored shape.
     /*
      var filter = new fabric.Image.filters.Tint({
      color: '#ffffff',
      opacity: 0
      });
      object.filters.push(filter);
      object.applyFilters(canvas.renderAll.bind(canvas));
      */
     service.addObjectToCanvas(object);
    });
   };


   //
   // Shape
   // ==============================================================
   service.addShape = function (svgURL) {
    fabric.loadSVGFromURL(svgURL, function (objects) {
     var object = fabric.util.groupSVGElements(objects, service.shapeDefaults);
     object.id = service.createId();

     for (var p in service.shapeDefaults) {
      object[p] = service.shapeDefaults[p];
     }

     if (object.isSameColor && object.isSameColor() || !object.paths) {
      object.setFill('#0088cc');
     } else if (object.paths) {
      for (var i = 0; i < object.paths.length; i++) {
       object.paths[i].setFill('#0088cc');
      }
     }

     service.addObjectToCanvas(object);
    });
   };

   //
   // Oval
   //
   service.addOval = function () {
    var object = new FabricWindow.Rect({
     radius: 50, left: 275, top: 75, fill: '#aac'
    });

    object.id = service.createId();

    service.addObjectToCanvas(object);
   };

   //
   // Rect
   //
   service.addRect = function () {
    var object = new FabricWindow.Rect({
     width: 200, height: 100, left: 0, top: 50, angle: 0,
     fill: 'rgba(255,0,0,0.5)'
    });

    object.id = service.createId();

    service.addObjectToCanvas(object);
   };


   //
   // Text
   // ==============================================================
   service.addText = function (str) {
    str = str || 'New Text';
    var object = new FabricWindow.Text(str, service.textDefaults);
    object.id = service.createId();

    service.addObjectToCanvas(object);
   };

   service.getText = function () {
    return getActiveProp('text');
   };

   service.setText = function (value) {
    setActiveProp('text', value);
   };

   //
   // Font Size
   // ==============================================================
   service.getFontSize = function () {
    return getActiveStyle('fontSize');
   };

   service.setFontSize = function (value) {
    setActiveStyle('fontSize', parseInt(value, 10));
    service.render();
   };

   //
   // Text Align
   // ==============================================================
   service.getTextAlign = function () {
    return capitalize(getActiveProp('textAlign'));
   };

   service.setTextAlign = function (value) {
    setActiveProp('textAlign', value.toLowerCase());
   };

   //
   // Font Family
   // ==============================================================
   service.getFontFamily = function () {
    var fontFamily = getActiveProp('fontFamily');
    return fontFamily ? fontFamily.toLowerCase() : '';
   };

   service.setFontFamily = function (value) {
    setActiveProp('fontFamily', value.toLowerCase());
   };

   //
   // Lineheight
   // ==============================================================
   service.getLineHeight = function () {
    return getActiveStyle('lineHeight');
   };

   service.setLineHeight = function (value) {
    setActiveStyle('lineHeight', parseFloat(value, 10));
    service.render();
   };

   //
   // Bold
   // ==============================================================
   service.isBold = function () {
    return getActiveStyle('fontWeight') === 'bold';
   };

   service.toggleBold = function () {
    setActiveStyle('fontWeight',
            getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
    service.render();
   };

   //
   // Italic
   // ==============================================================
   service.isItalic = function () {
    return getActiveStyle('fontStyle') === 'italic';
   };

   service.toggleItalic = function () {
    setActiveStyle('fontStyle',
            getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');
    service.render();
   };

   //
   // Underline
   // ==============================================================
   service.isUnderline = function () {
    return getActiveStyle('textDecoration').indexOf('underline') > -1;
   };

   service.toggleUnderline = function () {
    var value = service.isUnderline() ? getActiveStyle('textDecoration').replace('underline', '') : (getActiveStyle('textDecoration') + ' underline');

    setActiveStyle('textDecoration', value);
    service.render();
   };

   //
   // Linethrough
   // ==============================================================
   service.isLinethrough = function () {
    return getActiveStyle('textDecoration').indexOf('line-through') > -1;
   };

   service.toggleLinethrough = function () {
    var value = service.isLinethrough() ? getActiveStyle('textDecoration').replace('line-through', '') : (getActiveStyle('textDecoration') + ' line-through');

    setActiveStyle('textDecoration', value);
    service.render();
   };

   //
   // Text Align
   // ==============================================================
   service.getTextAlign = function () {
    return getActiveProp('textAlign');
   };

   service.setTextAlign = function (value) {
    setActiveProp('textAlign', value);
   };

   //
   // Opacity
   // ==============================================================
   service.getOpacity = function () {
    return getActiveStyle('opacity');
   };

   service.setOpacity = function (value) {
    setActiveStyle('opacity', value);
   };

   //
   // FlipX
   // ==============================================================
   service.getFlipX = function () {
    return getActiveProp('flipX');
   };

   service.setFlipX = function (value) {
    setActiveProp('flipX', value);
   };

   service.toggleFlipX = function () {
    var value = service.getFlipX() ? false : true;
    service.setFlipX(value);
    service.render();
   };

   //
   // Align Active Object
   // ==============================================================
   service.center = function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
     activeObject.center();
     service.updateActiveObjectOriginals();
     service.render();
    }
   };

   service.centerH = function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
     activeObject.centerH();
     service.updateActiveObjectOriginals();
     service.render();
    }
   };

   service.centerV = function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
     activeObject.centerV();
     service.updateActiveObjectOriginals();
     service.render();
    }
   };

   //
   // Active Object Layer Position
   // ==============================================================
   service.sendBackwards = function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
     canvas.sendBackwards(activeObject);
     service.render();
    }
   };

   service.sendToBack = function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
     canvas.sendToBack(activeObject);
     service.render();
    }
   };

   service.bringForward = function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
     canvas.bringForward(activeObject);
     service.render();
    }
   };

   service.bringToFront = function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
     canvas.bringToFront(activeObject);
     service.render();
    }
   };

   //
   // Active Object Tint Color
   // ==============================================================
   service.isTinted = function () {
    return getActiveProp('isTinted');
   };

   service.toggleTint = function () {
    var activeObject = canvas.getActiveObject();
    activeObject.isTinted = !activeObject.isTinted;
    activeObject.filters[0].opacity = activeObject.isTinted ? 1 : 0;
    activeObject.applyFilters(canvas.renderAll.bind(canvas));
   };

   service.getTint = function () {
    var object = canvas.getActiveObject();

    if (typeof object !== 'object' || object === null) {
     return '';
    }

    if (object.filters !== undefined) {
     if (object.filters[0] !== undefined) {
      return object.filters[0].color;
     }
    }
   };

   service.setTint = function (tint) {
    if (!isHex(tint)) {
     return;
    }

    var activeObject = canvas.getActiveObject();
    if (activeObject.filters !== undefined) {
     if (activeObject.filters[0] !== undefined) {
      activeObject.filters[0].color = tint;
      activeObject.applyFilters(canvas.renderAll.bind(canvas));
     }
    }
   };

   //
   // Active Object Fill Color
   // ==============================================================
   service.getFill = function () {
    return getActiveStyle('fill');
   };

   service.setFill = function (value) {
    var object = canvas.getActiveObject();
    if (object) {
     if (object.type === 'text') {
      setActiveStyle('fill', value);
     } else {
      service.setFillPath(object, value);
     }
    }
   };

   service.setFillPath = function (object, value) {
    if (object.isSameColor && object.isSameColor() || !object.paths) {
     object.setFill(value);
    } else if (object.paths) {
     for (var i = 0; i < object.paths.length; i++) {
      object.paths[i].setFill(value);
     }
    }
   };

   //
   // Canvas Zoom
   // ==============================================================
   service.resetZoom = function () {
    service.canvasScale = 1;
    service.setZoom();
   };

   service.setZoom = function () {
    var objects = canvas.getObjects();
    for (var i in objects) {
     objects[i].originalScaleX = objects[i].originalScaleX ? objects[i].originalScaleX : objects[i].scaleX;
     objects[i].originalScaleY = objects[i].originalScaleY ? objects[i].originalScaleY : objects[i].scaleY;
     objects[i].originalLeft = objects[i].originalLeft ? objects[i].originalLeft : objects[i].left;
     objects[i].originalTop = objects[i].originalTop ? objects[i].originalTop : objects[i].top;
     service.setObjectZoom(objects[i]);
    }

    service.setCanvasZoom();
    service.render();
   };

   service.setObjectZoom = function (object) {
    var scaleX = object.originalScaleX;
    var scaleY = object.originalScaleY;
    var left = object.originalLeft;
    var top = object.originalTop;

    var tempScaleX = scaleX * service.canvasScale;
    var tempScaleY = scaleY * service.canvasScale;
    var tempLeft = left * service.canvasScale;
    var tempTop = top * service.canvasScale;

    object.scaleX = tempScaleX;
    object.scaleY = tempScaleY;
    object.left = tempLeft;
    object.top = tempTop;

    object.setCoords();
   };

   service.setCanvasZoom = function () {
    var width = service.canvasOriginalWidth;
    var height = service.canvasOriginalHeight;

    var tempWidth = width * service.canvasScale;
    var tempHeight = height * service.canvasScale;

    canvas.setWidth(tempWidth);
    canvas.setHeight(tempHeight);
   };

   service.updateActiveObjectOriginals = function () {
    var object = canvas.getActiveObject();
    if (object) {
     object.originalScaleX = object.scaleX / service.canvasScale;
     object.originalScaleY = object.scaleY / service.canvasScale;
     object.originalLeft = object.left / service.canvasScale;
     object.originalTop = object.top / service.canvasScale;
    }
   };

   //
   // Active Object Lock
   // ==============================================================
   service.toggleLockActiveObject = function () {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
     activeObject.lockMovementX = !activeObject.lockMovementX;
     activeObject.lockMovementY = !activeObject.lockMovementY;
     activeObject.lockScalingX = !activeObject.lockScalingX;
     activeObject.lockScalingY = !activeObject.lockScalingY;
     activeObject.lockUniScaling = !activeObject.lockUniScaling;
     activeObject.lockRotation = !activeObject.lockRotation;
     activeObject.lockObject = !activeObject.lockObject;
     service.render();
    }
   };

   //
   // Active Object
   // ==============================================================
   service.selectActiveObject = function () {
    var activeObject = canvas.getActiveObject();
    if (!activeObject) {
     return;
    }

    service.selectedObject = activeObject;
    service.selectedObject.text = service.getText();
    service.selectedObject.fontSize = service.getFontSize();
    service.selectedObject.lineHeight = service.getLineHeight();
    service.selectedObject.textAlign = service.getTextAlign();
    service.selectedObject.opacity = service.getOpacity();
    service.selectedObject.fontFamily = service.getFontFamily();
    service.selectedObject.fill = service.getFill();
    service.selectedObject.tint = service.getTint();
   };

   service.deselectActiveObject = function () {
    service.selectedObject = false;
   };

   service.deleteActiveObject = function () {
    var activeObject = canvas.getActiveObject();
    canvas.remove(activeObject);
    service.render();
   };

   //
   // State Managers
   // ==============================================================
   service.isLoading = function () {
    return service.loading;
   };

   service.setLoading = function (value) {
    service.loading = value;
   };

   service.setDirty = function (value) {
    FabricDirtyStatus.setDirty(value);
   };

   service.isDirty = function () {
    return FabricDirtyStatus.isDirty();
   };

   service.setInitalized = function (value) {
    service.initialized = value;
   };

   service.isInitalized = function () {
    return service.initialized;
   };

   //
   // JSON
   // ==============================================================
   service.getJSON = function () {
    var initialCanvasScale = service.canvasScale;
    service.canvasScale = 1;
    service.resetZoom();

    var json = JSON.stringify(canvas.toJSON(service.JSONExportProperties));

    service.canvasScale = initialCanvasScale;
    service.setZoom();

    return json;
   };

   service.loadJSON = function (json) {
    service.setLoading(true);
    canvas.loadFromJSON(json, function () {
     $timeout(function () {
      service.setLoading(false);

      if (!service.editable) {
       service.disableEditing();
      }

      service.render();
     });
    });
   };

   //
   // Download Canvas
   // ==============================================================
   service.getCanvasData = function () {
    var data = canvas.toDataURL({
     width: canvas.getWidth(),
     height: canvas.getHeight(),
     multiplier: service.downloadMultipler
    });

    return data;
   };

   service.getCanvasBlob = function () {
    var base64Data = service.getCanvasData();
    var data = base64Data.replace('data:image/png;base64,', '');
    var blob = b64toBlob(data, 'image/png');
    var blobUrl = URL.createObjectURL(blob);

    return blobUrl;
   };

   service.download = function (name) {
    // Stops active object outline from showing in image
    service.deactivateAll();

    var initialCanvasScale = service.canvasScale;
    service.resetZoom();

    // Click an artifical anchor to 'force' download.
    var link = document.createElement('a');
    var filename = name + '.png';
    link.download = filename;
    link.href = service.getCanvasBlob();
    link.click();

    service.canvasScale = initialCanvasScale;
    service.setZoom();
   };

   //
   // Continuous Rendering
   // ==============================================================
   // Upon initialization re render the canvas
   // to account for fonts loaded from CDN's
   // or other lazy loaded items.

   // Prevent infinite rendering loop
   service.continuousRenderCounter = 0;
   service.continuousRenderHandle;

   service.stopContinuousRendering = function () {
    $timeout.cancel(service.continuousRenderHandle);
    service.continuousRenderCounter = service.maxContinuousRenderLoops;
   };

   service.startContinuousRendering = function () {
    service.continuousRenderCounter = 0;
    service.continuousRender();
   };

   // Prevents the "not fully rendered up upon init for a few seconds" bug.
   service.continuousRender = function () {
    if (service.userHasClickedCanvas || service.continuousRenderCounter > service.maxContinuousRenderLoops) {
     return;
    }

    service.continuousRenderHandle = $timeout(function () {
     service.setZoom();
     service.render();
     service.continuousRenderCounter++;
     service.continuousRender();
    }, service.continuousRenderTimeDelay);
   };

   //
   // Utility
   // ==============================================================
   service.setUserHasClickedCanvas = function (value) {
    service.userHasClickedCanvas = value;
   };

   service.createId = function () {
    return Math.floor(Math.random() * 10000);
   };

   //
   // Toggle Object Selectability
   // ==============================================================
   service.disableEditing = function () {
    canvas.selection = false;
    canvas.forEachObject(function (object) {
     object.selectable = false;
    });
   };

   service.enableEditing = function () {
    canvas.selection = true;
    canvas.forEachObject(function (object) {
     object.selectable = true;
    });
   };


   //
   // Set Global Defaults
   // ==============================================================
   service.setCanvasDefaults = function () {
    canvas.selection = service.canvasDefaults.selection;
   };

   service.setWindowDefaults = function () {
    FabricWindow.Object.prototype.transparentCorners = service.windowDefaults.transparentCorners;
    FabricWindow.Object.prototype.rotatingPointOffset = service.windowDefaults.rotatingPointOffset;
    FabricWindow.Object.prototype.padding = service.windowDefaults.padding;
   };

   //
   // Canvas Listeners
   // ============================================================
   service.startCanvasListeners = function () {
    canvas.on('object:selected', function () {
     service.stopContinuousRendering();
     $timeout(function () {
      service.selectActiveObject();
      service.setDirty(true);
     });
    });

    canvas.on('selection:created', function () {
     service.stopContinuousRendering();
    });

    canvas.on('selection:cleared', function () {
     $timeout(function () {
      service.deselectActiveObject();
     });
    });

    canvas.on('after:render', function () {
     canvas.calcOffset();
    });

    canvas.on('object:modified', function () {
     service.stopContinuousRendering();
     $timeout(function () {
      service.updateActiveObjectOriginals();
      service.setDirty(true);
     });
    });
   };

   //
   // Constructor
   // ==============================================================
   service.init = function () {
    canvas = FabricCanvas.getCanvas();
    service.canvasId = FabricCanvas.getCanvasId();
    canvas.clear();

    // For easily accessing the json
    JSONObject = angular.fromJson(service.json);
    service.loadJSON(service.json);

    JSONObject = JSONObject || {};

    service.canvasScale = 1;

    JSONObject.background = JSONObject.background || '';
    service.setCanvasBackgroundColor(JSONObject.background);

    // Set the size of the canvas
    JSONObject.width = JSONObject.width || 300;
    service.canvasOriginalWidth = JSONObject.width;

    JSONObject.height = JSONObject.height || 300;
    service.canvasOriginalHeight = JSONObject.height;

    service.setCanvasSize(service.canvasOriginalWidth, service.canvasOriginalHeight);

    service.render();
    service.setDirty(false);
    service.setInitalized(true);

    service.setCanvasDefaults();
    service.setWindowDefaults();
    service.startCanvasListeners();
    service.startContinuousRendering();
    FabricDirtyStatus.startListening();
   };

   service.init();

   return service;

  };

 }
})();
