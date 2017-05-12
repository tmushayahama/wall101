(function ()
{
 'use strict';

 /**
  * Main module of the Fuse
  */
 angular
         .module('fuse', [
          // Common 3rd Party Dependencies
          'uiGmapgoogle-maps',
          'textAngular',
          'xeditable',
          'ui.tree',
          'gridster',
          // Core
          'app.core',
          'app.common',
          'app.navigation',
          'app.toolbar',
          'app.login-panel',
          'app.registration-panel',
          // Apps
          'app.welcome',
          'app.components',
          'app.graphics.fabric'
         ]);
})();
