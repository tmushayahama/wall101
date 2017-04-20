(function ()
{
 'use strict';

 angular
         .module('app.registration-panel')
         .controller('RegistrationPanelController', RegistrationPanelController);

 /** @ngInject */
 function RegistrationPanelController(msApi, $mdToast, $mdSidenav, $http, RegistrationService, $rootScope, $state, localStorageService)
 {
  var vm = this;

//Data
  vm.user;

  //Methods
  vm.createInvite = createInvite


  function createInvite() {
   RegistrationService.createInvite(vm.user).then(function (data) {
    $mdToast.show(
            $mdToast.simple()
            .textContent(data.message)
            .position("top right")
            .hideDelay(20000)
            );
   }, function (error) {
    $mdToast.show(
            $mdToast.simple()
            .textContent(error.data.message)
            .position("top right")
            .hideDelay(8000)
            );
   });
  }

 }

})();