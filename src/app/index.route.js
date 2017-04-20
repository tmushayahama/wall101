(function ()
{
 'use strict';

 angular
         .module('fuse')
         .config(routeConfig);

 /** @ngInject */
 function routeConfig($stateProvider, $urlRouterProvider, $locationProvider)
 {
  // $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/welcome');

  /**
   * Layout Style Switcher
   *
   * This code is here for demonstration purposes.
   * If you don't need to switch between the layout
   * styles like in the demo, you can set one manually by
   * typing the template urls into the `State definitions`
   * area and remove this code
   */
  // Inject $cookies
  var $cookies;

  angular.injector(['ngCookies']).invoke([
   '$cookies', function (_$cookies)
   {
    $cookies = _$cookies;
   }
  ]);

  // State definitions
  $stateProvider
          .state('app', {
           abstract: true,
           views: {
            'main@': {
             templateUrl: 'src/app/core/layouts/main.html',
             controller: 'MainController as vm'
            },
            'toolbar@app': {
             templateUrl: 'src/app/toolbar/toolbar.html',
             controller: 'ToolbarController as vm'
            },
            'navigation@app': {
             templateUrl: 'src/app/navigation/navigation.html',
             controller: 'NavigationController as vm'
            },
            'loginPanel@app': {
             templateUrl: 'src/app/login-panel/login-panel.html',
             controller: 'LoginPanelController as vm'
            },
            'registrationPanel@app': {
             templateUrl: 'src/app/registration-panel/registration-panel.html',
             controller: 'RegistrationPanelController as vm'
            }
           }
          });
 }

})();