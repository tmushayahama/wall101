(function ()
{
 'use strict';

 angular
         .module('app.registration-panel', [])
         .config(config);

 /** @ngInject */
 function config($translatePartialLoaderProvider, msApiProvider)
 {
  // Translation
  $translatePartialLoaderProvider.addPart('src/app/registration-panel');

  // Api
  msApiProvider.register('user.createInvite', ['/api/user/invite']);
 }
})();
