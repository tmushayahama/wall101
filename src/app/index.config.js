(function ()
{
 'use strict';

 angular
         .module('fuse')
         .config(config);

 /** @ngInject */
 function config($mdThemingProvider, $translateProvider, $provide, $authProvider, localStorageServiceProvider) {

  localStorageServiceProvider
          .setPrefix('gb102')
          .setStorageType('localStorage')
          .setNotify(true, true);

  function redirectWhenLoggedOut($q, $injector, localStorageService) {
   return {
    responseError: function (rejection) {

     // Need to use $injector.get to bring in $state or else we get
     // a circular dependency error
     var $state = $injector.get('$state');
     // Instead of checking for a status code of 400 which might be used
     // for other reasons in Laravel, we check for the specific rejection
     // reasons to tell us if we need to redirect to the login state
     var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];
     // Loop through each rejection reason and redirect to the login
     // state if one is encountered
     angular.forEach(rejectionReasons, function (value, key) {
      if (rejection.data.error === value) {
       localStorageService.remove('user');
       $state.go('apps.home');
      }
     });
     return $q.reject(rejection);
    }
   }
  }

  // Setup for the $httpInterceptor
  //$provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);
  // Push the new factory onto the $http interceptor array
  //$httpProvider.interceptors.push('redirectWhenLoggedOut');
  $authProvider.loginUrl = '/api/authenticate';
  $authProvider.signupUrl = '/api/user/invite';
  //$urlRouterProvider.otherwise('/');

  // angular-translate configuration
  $translateProvider.useLoader('$translatePartialLoader', {
   urlTemplate: '{part}/i18n/{lang}.json'
  });
  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitize');

  // Text Angular options
  $provide.decorator('taOptions', [
   '$delegate', function (taOptions)
   {
    taOptions.toolbar = [
     ['bold', 'italics', 'underline', 'ul', 'ol', 'quote']
    ];

    taOptions.classes = {
     focussed: 'focussed',
     toolbar: 'ta-toolbar',
     toolbarGroup: 'ta-group',
     toolbarButton: 'md-button',
     toolbarButtonActive: 'active',
     disabled: '',
     textEditor: 'form-control',
     htmlEditor: 'form-control'
    };

    return taOptions;
   }
  ]);

  // Text Angular tools
  $provide.decorator('taTools', [
   '$delegate', function (taTools)
   {
    taTools.quote.iconclass = 'icon-format-quote';
    taTools.bold.iconclass = 'icon-format-bold';
    taTools.italics.iconclass = 'icon-format-italic';
    taTools.underline.iconclass = 'icon-format-underline';
    taTools.strikeThrough.iconclass = 'icon-format-strikethrough';
    taTools.ul.iconclass = 'icon-format-list-bulleted';
    taTools.ol.iconclass = 'icon-format-list-numbers';
    taTools.redo.iconclass = 'icon-redo';
    taTools.undo.iconclass = 'icon-undo';
    taTools.clear.iconclass = 'icon-close-circle-outline';
    taTools.justifyLeft.iconclass = 'icon-format-align-left';
    taTools.justifyCenter.iconclass = 'icon-format-align-center';
    taTools.justifyRight.iconclass = 'icon-format-align-right';
    taTools.justifyFull.iconclass = 'icon-format-align-justify';
    taTools.indent.iconclass = 'icon-format-indent-increase';
    taTools.outdent.iconclass = 'icon-format-indent-decrease';
    taTools.html.iconclass = 'icon-code-tags';
    taTools.insertImage.iconclass = 'icon-file-image-box';
    taTools.insertLink.iconclass = 'icon-link';
    taTools.insertVideo.iconclass = 'icon-filmstrip';

    return taTools;
   }
  ]);
 }

})();