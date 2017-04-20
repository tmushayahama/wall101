(function ()
{
 'use strict';

 angular
         .module('fuse')
         .run(runBlock);

 /** @ngInject */
 function runBlock($rootScope, $timeout, $state, editableThemes, localStorageService, $mdTheming, $mdDialog, $mdSidenav)
 {

  var removeFunction = $mdTheming.setBrowserColor({
   theme: 'lightBlueTheme',
   palette: 'primary',
   hue: '400' // Default is '800'
  });

  editableThemes.default.submitTpl = '<md-button class="md-icon-button" type="submit" aria-label="save"><md-icon md-font-icon="icon-checkbox-marked-circle" class="md-accent-fg md-hue-1"></md-icon></md-button>';
  editableThemes.default.cancelTpl = '<md-button class="md-icon-button" ng-click="$form.$cancel()" aria-label="cancel"><md-icon md-font-icon="icon-close-circle" class="icon-cancel"></md-icon></md-button>';

  // Activate loading indicator
  var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function ()
  {
   $rootScope.loadingProgress = true;
  });

  // De-activate loading indicator
  var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
  {
   $timeout(function ()
   {
    $rootScope.loadingProgress = false;
   });
  });

  // Store state in the root scope for easy access
  $rootScope.state = $state;

  // Cleanup
  $rootScope.$on('$stateChangeStart', function (event, toState) {
   $mdDialog.cancel();
   $mdSidenav("navigation").close();
   var user = JSON.parse(localStorageService.get('user'));
   if (user) {
    $rootScope.authenticated = true;
    $rootScope.user = user;
    if (toState.name === "apps.home") {
     event.preventDefault();
     $state.go('app.explorer');
    }
   } else {
    $rootScope.authenticated = false;
    //if (toState.name !== "auth") {
    // event.preventDefault();
    //  $state.go('auth');
    if (toState.name === "apps.home") {
     //event.preventDefault();
     //$state.go('auth');
    }
   }
  });

  $rootScope.$on('$destroy', function ()
  {
   stateChangeStartEvent();
   stateChangeSuccessEvent();
   removeFunction();
  });
 }
})();