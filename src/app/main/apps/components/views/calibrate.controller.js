(function ()
{
 'use strict';

 angular
         .module('app.components')
         .controller('ComponentCalibrateController', ComponentCalibrateController);

 /** @ngInject */
 function ComponentCalibrateController($document, $timeout, $scope, $mdSidenav, ComponentService, $mdDialog)
 {
  var vm = this;

  // Data
  vm.componentService = ComponentService;
  vm.component = {};
  vm.foods = ComponentService.foods;
  vm.currentPage = 0;

  //Method
  vm.calibrateComponent = calibrateComponent;
  vm.getComponent = getComponent;
  vm.chooseFood = chooseFood;

  init();

  function init() {
   chooseFood(vm.foods.options[0]);
   ComponentService.getComponents(vm.foods.selected.animal, vm.currentPage).then(function (data) {
   });

  }

  function getComponents(animal, page) {
   ComponentService.getComponents(animal, page).then(function (data) {
   });

  }

  function getComponent() {
   var animal = vm.foods.selected.animal;

   ComponentService.getComponent(animal).then(function (data) {
    vm.component = data;
   });
  }

  function chooseFood(food) {
   vm.foods.selected = food;
   if (!ComponentService.components[food.animal.name]) {
    getComponents(food.animal, 0);
   }
  }

  function calibrateComponent(event) {
   var el = $("#ct-calibrate-img");
   var w = el.width();
   var h = el.height();
   var calibrateData = {
    id: vm.component.id,
    locationX: Math.floor((event.offsetX / w) * 100),
    locationY: Math.floor((event.offsetX / h) * 100),
    ratio: Math.floor((w / h) * 100),
   };
   ComponentService.calibrateComponent(calibrateData).then(function (data) {
   });
  }

 }

})();