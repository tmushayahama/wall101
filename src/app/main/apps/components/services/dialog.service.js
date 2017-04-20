(function ()
{
 'use strict';

 angular
         .module('app.components')
         .factory('DialogComponentService', DialogComponentService);

 /** @ngInject */
 function DialogComponentService($mdDialog, $document) {
  var service = {
   openCardDialog: openCardDialog,
  };

  //////////

  // ******************************
  // Internal methods
  // ******************************

  /**
   * Open card dialog
   *
   * @param ev
   * @param cardId
   */
  function openCardDialog(ev, cardId) {
   $mdDialog.show({
    templateUrl: 'src/app/main/apps/explorer/dialogs/card/card-dialog.html',
    controller: 'ExplorerCardDialogController',
    controllerAs: 'vm',
    parent: $document.find('#explorer'),
    targetEvent: ev,
    clickOutsideToClose: false,
    escapeToClose: true,
    locals: {
     cardId: cardId
    }
   });
  }

  return service;
 }
})();