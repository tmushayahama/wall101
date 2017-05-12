(function () {
 'use strict';

 angular
         .module('app.graphics.fabric')
         .controller('gbColumnController', gbColumnController)
         .directive('gbColumn', gbColumnDirective)
         .directive('fabric', gbFabricDirective)
         .directive('parentClick', parentClick);

 /** @ngInject */
 function gbColumnController($scope, $http, $window, Fabric, FabricConstants) {

  $scope.fabric = {};
  $scope.FabricConstants = FabricConstants;

  //
  // Creating Canvas Objects
  // ================================================================
  $scope.addShape = function (path) {
   $scope.fabric.addShape('http://fabricjs.com/assets/15.svg');
  };

  $scope.addRect = function () {
   $scope.fabric.addRect();
  };

  $scope.addOval = function () {
   $scope.fabric.addOval();
  };

  $scope.addImage = function (image) {
   var data = {
    left: -1000,
    top: 300,
    angle: 0
   };
   $scope.fabric.addImage('src/assets/images/backgrounds/column-1.png', data);
  };

  $scope.addImageUpload = function (data) {
   var obj = angular.fromJson(data);
   $scope.addImage(obj.filename);
  };

  //
  // Editing Canvas Size
  // ================================================================
  $scope.selectCanvas = function () {
   $scope.canvasCopy = {
    width: $window.innerWidth,
    height: $window.innerHeight
   };
  };

  $scope.setCanvasSize = function () {
   $scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
   $scope.fabric.setDirty(true);
   delete $scope.canvasCopy;
  };

  $scope.move = function (value) {
   $scope.fabric.move(value);
  };

  //
  // Init
  // ================================================================
  $scope.init = function () {
   $scope.fabric = new Fabric({
    JSONExportProperties: FabricConstants.JSONExportProperties,
    textDefaults: FabricConstants.textDefaults,
    shapeDefaults: FabricConstants.shapeDefaults,
    json: {}
   });
   $scope.fabric.setCanvasSize(300, 300);
   $scope.addRect();
   $scope.addImage();
   //$scope.move(2);
  };

  $scope.$on('canvas:created', $scope.init);



  //Keypress.onSave(function () {
  //   $scope.updatePage();
  //});
 }

 /** @ngInject */
 function gbFabricDirective($timeout, FabricCanvas, $window) {
  return {
   scope: {
    fabric: '='
   },
   controller: function ($scope, $element) {
    FabricCanvas.setElement($element);
    FabricCanvas.createCanvas();

    // Continue rendering the canvas until the user clicks
    // to avoid the "calcOffset" bug upon load.
    $('body').on('click', 'canvas', function () {
     if ($scope.fabric.setUserHasClickedCanvas) {
      $scope.fabric.setUserHasClickedCanvas(true);
     }
    });

    //
    // Watching Controller Variables
    // ============================================================
    $scope.$watch('fabric.canvasBackgroundColor', function (newVal) {
     if ($scope.fabric.setCanvasBackgroundColor) {
      $scope.fabric.setCanvasBackgroundColor(newVal);
     }
    });

    $scope.$watch('fabric.selectedObject.text', function (newVal) {
     if (typeof newVal === 'string') {
      $scope.fabric.setText(newVal);
      $scope.fabric.render();
     }
    });

    $scope.$watch('fabric.selectedObject.fontSize', function (newVal) {
     if (typeof newVal === 'string' || typeof newVal === 'number') {
      $scope.fabric.setFontSize(newVal);
      $scope.fabric.render();
     }
    });

    $scope.$watch('fabric.selectedObject.lineHeight', function (newVal) {
     if (typeof newVal === 'string' || typeof newVal === 'number') {
      $scope.fabric.setLineHeight(newVal);
      $scope.fabric.render();
     }
    });

    $scope.$watch('fabric.selectedObject.textAlign', function (newVal) {
     if (typeof newVal === 'string') {
      $scope.fabric.setTextAlign(newVal);
      $scope.fabric.render();
     }
    });

    $scope.$watch('fabric.selectedObject.fontFamily', function (newVal) {
     if (typeof newVal === 'string' && newVal) {
      $scope.fabric.setFontFamily(newVal);
      $scope.fabric.render();
     }
    });

    $scope.$watch('fabric.selectedObject.opacity', function (newVal) {
     if (typeof newVal === 'string' || typeof newVal === 'number') {
      $scope.fabric.setOpacity(newVal);
      $scope.fabric.render();
     }
    });

    $scope.$watch('fabric.selectedObject.fill', function (newVal) {
     if (typeof newVal === 'string') {
      $scope.fabric.setFill(newVal);
      $scope.fabric.render();
     }
    });

    $scope.$watch('fabric.selectedObject.tint', function (newVal) {
     if (typeof newVal === 'string') {
      $scope.fabric.setTint(newVal);
      $scope.fabric.render();
     }
    });


    $window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
     $scope.fabric.setCanvasSize($window.innerWidth, $window.innerHeight);
     $scope.fabric.render();
    }

    resizeCanvas();
   }
  };
 }

 /** @ngInject */
 function gbColumnDirective() {
  return {
   restrict: 'EA',
   scope: {
    templatePath: '=template',
    card: '=ngModel',
    vm: '=viewModel'
   },
   controller: 'gbColumnController',
   template: '<div class="gb-column-content-wrapper" ng-include="templatePath" onload="cardTemplateLoaded()"></div>',
   compile: function (tElement) {
    // Add class
    // tElement.addClass('ms-card');

    return function postLink(scope, iElement) {
     // Methods
     scope.cardTemplateLoaded = cardTemplateLoaded;

     //////////

     /**
      * Emit cardTemplateLoaded event
      */
     function cardTemplateLoaded() {
      //scope.$emit('msCard::cardTemplateLoaded', iElement);

     }
    };
   }
  };
 }

 /** @ngInject */
 function parentClick($timeout) {
  return {
   scope: {
    parentClick: '&'
   },
   link: function (scope, element) {
    element.mousedown(function () {
     $timeout(function () {
      scope.parentClick();
     });
    })
            .chilgben()
            .mousedown(function (e) {
             e.stopPropagation();
            });
   }
  };
 }
})();