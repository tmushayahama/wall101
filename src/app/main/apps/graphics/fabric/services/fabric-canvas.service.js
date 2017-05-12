(function () {
 'use strict';

 angular
         .module('app.graphics.fabric')
         .factory('FabricConstants', fabricConstants)
         .factory('FabricWindow', fabricWindow)
         .service('FabricCanvas', fabricCanvas)
         .service('FabricDirtyStatus', fabricDirtyStatus);

 /** @ngInject */
 function fabricWindow($window) {
  return $window.fabric;
 }
 ;

 /** @ngInject */
 function fabricDirtyStatus($window) {
  var service = {
   dirty: false
  };

  function checkSaveStatus() {
   if (service.isDirty()) {
    return "Oops! You have unsaved changes.\n\nPlease save before leaving so you don't lose any work.";
   }
  }

  service.endListening = function () {
   $window.onbeforeunload = null;
   $window.onhashchange = null;
  };

  service.startListening = function () {
   $window.onbeforeunload = checkSaveStatus;
   $window.onhashchange = checkSaveStatus;
  };

  service.isDirty = function () {
   return service.dirty;
  };

  service.setDirty = function (value) {
   service.dirty = value;
  };

  return service;

 }
 ;

 /** @ngInject */
 function fabricCanvas(FabricWindow, $rootScope) {
  var service = {
   canvasId: null,
   element: null,
   canvas: null
  };

  function createId() {
   return Math.floor(Math.random() * 10000);
  }

  service.setElement = function (element) {
   service.element = element;
   $rootScope.$broadcast('canvas:element:selected');
  };

  service.createCanvas = function () {
   service.canvasId = 'fabric-canvas-' + createId();
   service.element.attr('id', service.canvasId);
   service.canvas = new FabricWindow.Canvas(service.canvasId);
   $rootScope.$broadcast('canvas:created');

   return service.canvas;
  };

  service.getCanvas = function () {
   return service.canvas;
  };

  service.getCanvasId = function () {
   return service.canvasId;
  };

  return service;

 }

 /** @ngInject */
 function fabricConstants() {
  var objectDefaults = {
   rotatingPointOffset: 20,
   padding: 0,
   borderColor: 'EEF6FC',
   cornerColor: 'rgba(64, 159, 221, 1)',
   cornerSize: 10,
   transparentCorners: false,
   hasRotatingPoint: true,
   centerTransform: true
  };

  return {
   presetSizes: [
    {
     name: 'Portrait (8.5 x 11)',
     height: 1947,
     width: 1510
    },
    {
     name: 'Landscape (11 x 8.5)',
     width: 1947,
     height: 1510
    },
    {
     name: 'Business Card (3.5 x 2)',
     height: 368,
     width: 630
    },
    {
     name: 'Postcard (6 x 4)',
     height: 718,
     width: 1068
    },
    {
     name: 'Content/Builder Product Thumbnail',
     height: 400,
     width: 760
    },
    {
     name: 'Badge',
     height: 400,
     width: 400
    },
    {
     name: 'Facebook Profile Picture',
     height: 300,
     width: 300
    },
    {
     name: 'Facebook Cover Picture',
     height: 315,
     width: 851
    },
    {
     name: 'Facebook Photo Post (Landscape)',
     height: 504,
     width: 403
    },
    {
     name: 'Facebook Photo Post (Horizontal)',
     height: 1008,
     width: 806
    },
    {
     name: 'Facebook Full-Width Photo Post',
     height: 504,
     width: 843
    }
   ],
   fonts: [
    {name: 'Arial'},
    {name: 'Lora'},
    {name: 'Croissant One'},
    {name: 'Architects Daughter'},
    {name: 'Emblema One'},
    {name: 'Graduate'},
    {name: 'Hammersmith One'},
    {name: 'Oswald'},
    {name: 'Oxygen'},
    {name: 'Krona One'},
    {name: 'Indie Flower'},
    {name: 'Courgette'},
    {name: 'Gruppo'},
    {name: 'Ranchers'}
   ],
   shapeCategories: [
    {
     name: 'Popular Shapes',
     shapes: [
      'arrow6',
      'bubble4',
      'circle1',
      'rectangle1',
      'star1',
      'triangle1'
     ]
    },
    {
     name: 'Simple Shapes',
     shapes: [
      'circle1',
      'heart1',
      'rectangle1',
      'triangle1',
      'star1',
      'star2',
      'star3',
      'square1'
     ]
    },
    {
     name: 'Arrows & Pointers',
     shapes: [
      'arrow1',
      'arrow9',
      'arrow3',
      'arrow6',
     ]
    },
    {
     name: 'Bubbles & Balloons',
     shapes: [
      'bubble5',
      'bubble4'
     ]
    },
    {
     name: 'Check Marks',
     shapes: [
     ]
    },
    {
     name: 'Badges',
     shapes: [
      'badge1',
      'badge2',
      'badge4',
      'badge5',
      'badge6'
     ]
    }
   ],
   JSONExportProperties: [
    'height',
    'width',
    'background',
    'objects',
    'originalHeight',
    'originalWidth',
    'originalScaleX',
    'originalScaleY',
    'originalLeft',
    'originalTop',
    'lineHeight',
    'lockMovementX',
    'lockMovementY',
    'lockScalingX',
    'lockScalingY',
    'lockUniScaling',
    'lockRotation',
    'lockObject',
    'id',
    'isTinted',
    'filters'
   ],
   shapeDefaults: angular.extend({
    fill: '#0088cc'
   }, objectDefaults),
   textDefaults: angular.extend({
    originX: 'left',
    scaleX: 1,
    scaleY: 1,
    fontFamily: 'Arial',
    fontSize: 40,
    fill: '#454545',
    textAlign: 'left'
   }, objectDefaults)

  };
 }
})();