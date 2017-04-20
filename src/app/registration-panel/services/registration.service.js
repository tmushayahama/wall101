(function ()
{
 'use strict';

 angular
         .module('app.registration-panel')
         .factory('RegistrationService', RegistrationService);

 /** @ngInject */
 function RegistrationService(msApi, $q) {
  var service = {
   data: [],
   createInvite: createInvite
  };


  // ******************************
  // Internal methods
  // ******************************

  function deferredHandler(data, deferred, defaultMsg) {
   var error = '';
   if (!data || typeof data !== 'object') {
    error = 'Error';
   }
   if (!error && data.result && data.result.error) {
    error = data.result.error;
   }
   if (!error && data.error) {
    error = data.error.message;
   }
   if (!error && defaultMsg) {
    error = defaultMsg;
   }
   if (error) {
    return deferred.reject(data);
   }
   return deferred.resolve(data);
  }

  /**
   * Create a User Invite
   *
   * @param userData
   *
   * @returns promise of the deferred response
   */
  function createInvite(userData) {
   // Create a new deferred object
   var deferred = $q.defer();

   msApi.request('user.createInvite@save', userData,
           function (response) {
            deferredHandler(response, deferred);
           },
           function (response) {
            deferred.reject(response);
           }
   );
   return deferred.promise;
  }

  return service;
 }
})();