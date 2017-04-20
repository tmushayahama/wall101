(function ()
{
 'use strict';

 angular
         .module('app.components')
         .controller('ComponentsController', ComponentsController);

 /** @ngInject */
 function ComponentsController($document, $timeout, $scope, $mdSidenav, ComponentService, $mdDialog)
 {
  var vm = this;

  // Data
  //vm.components = ComponentService.data;

  //////////


 }

})();