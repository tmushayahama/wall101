(function ()
{
 'use strict';

 angular
         .module('app.welcome')
         .controller('WelcomeController', WelcomeController);

 /** @ngInject */
 function WelcomeController(ComponentService, $scope, $rootScope)
 {
  var vm = this;

  // Data
  vm.componentService = ComponentService;
  vm.component = {};
  vm.columns = ComponentService.columns;
  vm.currentPage = 0;

  $scope.gridsterOpts = {
   columns: 6, // the width of the grid, in columns
   pushing: true, // whether to push other items out of the way on move or resize
   floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
   swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
   width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
   colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
   rowHeight: '40', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
   margins: [5, 5], // the pixel distance between each widget
   outerMargin: false, // whether margins apply to outer edges of the grid
   sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
   isMobile: false, // stacks the grid items if true
   mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
   mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
   minColumns: 1, // the minimum columns the grid must have
   minRows: 2, // the minimum height of the grid, in rows
   maxRows: 100,
   defaultSizeX: 2, // the default width of a gridster item, if not specifed
   defaultSizeY: 1, // the default height of a gridster item, if not specified
   minSizeX: 1, // minimum column width of an item
   maxSizeX: null, // maximum column width of an item
   minSizeY: 1, // minumum row height of an item
   maxSizeY: null, // maximum row height of an item
   resizable: {
    enabled: true,
    handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
    start: function (event, $element, widget) {}, // optional callback fired when resize is started,
    resize: function (event, $element, widget) {}, // optional callback fired when item is resized,
    stop: function (event, $element, widget) {} // optional callback fired when item is finished resizing
   },
   draggable: {
    enabled: true, // whether dragging items is supported
    handle: '.my-class', // optional selector for drag handle
    start: function (event, $element, widget) {}, // optional callback fired when drag is started,
    drag: function (event, $element, widget) {}, // optional callback fired when item is moved,
    stop: function (event, $element, widget) {} // optional callback fired when item is finished dragging
   }
  };

  $scope.standardItems = [
   {sizeX: 3, sizeY: 2, row: 0, col: 0},
   {sizeX: 3, sizeY: 2, row: 0, col: 3},
   {sizeX: 6, sizeY: 3, row: 2, col: 0},
   {sizeX: 2, sizeY: 1, row: 3, col: 0},
  ];


  //Method
  vm.getComponent = getComponent;
  vm.chooseFood = chooseFood;

  init();

  function init() {
   // chooseFood(vm.foods.options[0]);
   //  ComponentService.getComponents(vm.foods.selected.animal, vm.currentPage).then(function (data) {
   //  });
   for (var i = 0; i < 20; i++) {
    vm.columns.push({
     'name': 'mouse',
     'columnClass': 'colum-1',
    })
   }
  }

  function getComponents(animal, page) {
   ComponentService.getComponents(animal, page).then(function (data) {
   });
  }

  function getComponent(event) {
   var x = event.pageX;
   var animal = vm.foods.selected.animal;

   ComponentService.getComponent(animal).then(function (data) {
    vm.component = data;
    var w = 300;
    var h = w / (vm.component.ratio / 100);
    var left = w * (vm.component.location_x / 100);
    var top = h * (vm.component.location_y / 100);
    vm.component.pictureStyle = {
     'top': event.offsetY - top,
     'left': event.offsetX - left
    }
    vm.foods.selected.total--;
   });
  }

  function chooseFood(food) {
   vm.foods.selected = food;
   if (!ComponentService.components[food.animal.name]) {
    getComponents(food.animal, 0);
   }
  }

 }
})();