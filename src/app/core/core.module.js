(function ()
{
 'use strict';

 angular
         .module('app.core',
                 [
                  'ngAnimate',
                  'ngAria',
                  'ngCookies',
                  'ngMessages',
                  'ngResource',
                  'ngSanitize',
                  'ngMaterial',
                  'satellizer',
                  'pascalprecht.translate',
                  'ui.router',
                  "ui.bootstrap",
                  "LocalStorageModule"
                 ]);
})();