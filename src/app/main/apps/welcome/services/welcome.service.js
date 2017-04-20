(function ()
{
 'use strict';

 angular
         .module('app.welcome')
         .factory('WelcomeService', WelcomeService);

 /** @ngInject */
 function WelcomeService($q, msApi)
 {
  var service = {
   data: {},
  };

  return service;
 }
})();