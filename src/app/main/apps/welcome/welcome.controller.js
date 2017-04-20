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
  vm.foods = ComponentService.foods;
  vm.currentPage = 0;

  //Method
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