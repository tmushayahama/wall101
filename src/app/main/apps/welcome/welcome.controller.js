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

  $scope.upperIndex = [350, 330, 310, 290, 270, 250, 230, 210, 190, 170, 150, 130, 110, 90, 70, 50, 30, 10, 350, 330, 310, 290, 270, 250, 170, 150, 130, 110, 90, 70, 50, 30, 10];
  $scope.lowerIndex = [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3];

  $scope.images = [
   "https://c1.staticflickr.com/1/591/22665222766_07524ca21a_k.jpg",
   "https://farm4.staticflickr.com/3746/9503927685_970b5e141b_k_d.jpg",
   "https://farm1.staticflickr.com/661/21230969582_33e91e2a9a_o_d.jpg",
   "https://c2.staticflickr.com/8/7426/12233323463_57606d8e87_k.jpg",
   "https://farm1.staticflickr.com/648/20938457876_4d0924e380_o_d.jpg",
   "https://c1.staticflickr.com/9/8820/16523586334_4d22f1754b_k.jpg",
   "https://farm6.staticflickr.com/5688/21597873406_d19b851a96_o_d.jpg",
   "https://farm4.staticflickr.com/3876/14634078309_f77e77d6b9_o_d.jpg",
   "https://farm4.staticflickr.com/3860/14632678619_eb4f89ef85_o_d.jpg",
   "https://farm4.staticflickr.com/3844/14626558247_6aaa566397_o_d.jpg",
   "https://farm8.staticflickr.com/7425/14182933691_af44ff2a43_o_d.jpg",
   "https://farm4.staticflickr.com/3877/14847119920_7e5e9398e9_o_d.jpg",
   "https://farm9.staticflickr.com/8526/8546879452_2e097547a6_o_d.jpg",
   "https://farm6.staticflickr.com/5578/14847291760_a1945131e6_o_d.jpg",
   "https://farm6.staticflickr.com/5595/15030728651_753a31e3ca_o_d.jpg",
   "https://farm4.staticflickr.com/3869/14460157987_e0892869e2_o_d.jpg",
   "https://farm4.staticflickr.com/3947/15426357418_9976b269b0_o_d.jpg",
   "https://farm6.staticflickr.com/5817/21608154473_74bd18c61f_o_d.jpg",
   "https://farm6.staticflickr.com/5324/16622294523_67e373a118_o_d.jpg",
   "https://farm4.staticflickr.com/3734/11368642323_b4be377644_o_d.jpg",
   "https://farm4.staticflickr.com/3912/15030746921_c030b23b2b_o_d.jpg",
   "https://farm4.staticflickr.com/3899/14847155059_33ccd392b5_o_d.jpg",
   "https://c1.staticflickr.com/1547/24151972210_081aeaf891_o_d.jpg",
   "https://c1.staticflickr.com/1585/24339263532_4ddae26189_o_d.jpg",
   "https://c1.staticflickr.com/1524/24365150991_39fc7c5b35_o_d.jpg",
   "https://c1.staticflickr.com/1659/24079886189_8a475ff9cd_o_d.jpg",
   "https://farm4.staticflickr.com/3689/13202443445_00c76d4caa_o_d.jpg",
   "https://farm4.staticflickr.com/3679/11829226443_ef2a8482d1_o_d.jpg",
   "https://farm3.staticflickr.com/2939/14486898640_a42a82869b_o_d.jpg",
   "https://farm8.staticflickr.com/7476/15805694576_e56e29784e_o_d.jpg",
   "https://farm3.staticflickr.com/2817/9174896564_88ec346440_o_d.jpg",
   "https://farm8.staticflickr.com/7476/15805694576_e56e29784e_o_d.jpg",
   "https://farm3.staticflickr.com/2817/9174896564_88ec346440_o_d.jpg"
  ];

  $scope.getThumbnail = function (url)
  {
   if (url)
   {
    var index = url.lastIndexOf("/") + 1;
    var filename = url.substr(index);
    return 'src/assets/images/flickr/' + filename;
   }
   return "";
  }

  $scope.viewImage = function (imageURL) {
   window.location.assign('#/image?url=' + imageURL);
  }

  var scene = document.querySelector('a-scene');
  if (scene) {
   if (scene.hasLoaded) {
    scene.enterVR();
   } else {
    scene.addEventListener('loaded', scene.enterVR);
   }
  }

  $scope.gridsterOpts = {
   columns: 6, // the width of the grid, in columns
   pushing: true, // whether to push other items out of the way on move or resize
   floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
   swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
   width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
   colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
   rowHeight: '50', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
   margins: [8, 8], // the pixel distance between each widget
   outerMargin: false, // whether margins apply to outer edges of the grid
   sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
   isMobile: false, // stacks the grid items if true
   mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
   mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
   minColumns: 1, // the minimum columns the grid must have
   minRows: 2, // the minimum height of the grid, in rows
   maxRows: 6,
   defaultSizeX: 3, // the default width of a gridster item, if not specifed
   defaultSizeY: 2, // the default height of a gridster item, if not specified
   minSizeX: 1, // minimum column width of an item
   maxSizeX: 6, // maximum column width of an item
   minSizeY: 1, // minumum row height of an item
   maxSizeY: 6, // maximum row height of an item
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
     'cards': []
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