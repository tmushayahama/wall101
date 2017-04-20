(function ()
{
 'use strict';

 angular
         .module('app.components', [])
         .config(config);

 /** @ngInject */
 function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {


//State
  $stateProvider.state('app.component', {
   abstract: true,
   url: '/component',
   views: {
    'content@app': {
     templateUrl: 'src/app/main/apps/components/components.html',
     controller: 'ComponentsController as componentsCtrl'
    }
   }
  }).state('app.component.calibrate', {
   url: '/calibrate',
   views: {
    'component': {
     templateUrl: 'src/app/main/apps/components/views/calibrate.html',
     controller: 'ComponentCalibrateController as calibrateCtrl'
    }
   }
  });

  // Translation
  $translatePartialLoaderProvider.addPart('src/app/main/apps/components');

  // Api
  msApiProvider.register('components.components', ['/api/components/animal/:animal/page/:page',
   {
    animal: "@animal",
    page: "@page"
   }]);
  msApiProvider.register('components.component.calibrate', ['/api/components/component/:componentId/calibrate',
   {
    "componentId": "@id"
   }]);
 }

})();