(function ()
{
 'use strict';

 angular
         .module('app.welcome',
                 [
                 ]
                 )
         .config(config);

 /** @ngInject */
 function config($stateProvider, msApiProvider)
 {
  // State
  $stateProvider.state('app.welcome', {
   url: '/welcome',
   views: {
    'content@app': {
     templateUrl: 'src/app/main/apps/welcome/welcome.html',
     controller: 'WelcomeController as vm'
    }
   },
   resolve: {
    /*
     DashboardData: function (msApi)
     {
     return msApi.resolve('welcome.server@get');
     }
     */
   },
   bodyClass: 'gb-welcome'
  });

  // Api
  msApiProvider.register('welcome.components', ['/api/components/listformat/:listFormat',
   {
    listFormat: "@listFormat"
   }]);
 }

})();