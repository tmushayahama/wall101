(function ()
{
 'use strict';

 angular
         .module('app.components')
         .controller('ComponentDialogController', ComponentDialogController);

 /** @ngInject */
 function ComponentDialogController(add_component_tabs, level_categories, $scope, $document, $mdDialog, fuseTheming, fuseGenerator, msUtils, ComponentService, componentId)
 {
  var vm = this;

  // Data
  vm.tabs = add_component_tabs;
  vm.privacy = level_categories.privacy;
  vm.board = [];
  vm.component = {}; //vm.board.components.getById(cardId);
  vm.newLabelColor = 'red';
  vm.members = vm.board.members;
  vm.labels = vm.board.labels;

  // Methods
  vm.createComponent = createComponent;
  vm.updateComponentDescription = updateComponentDescription;
  vm.updateComponentBackground = updateComponentBackground;
  vm.palettes = fuseTheming.getRegisteredPalettes();
  vm.rgba = fuseGenerator.rgba;
  vm.toggleInArray = msUtils.toggleInArray;
  vm.exists = msUtils.exists;
  vm.closeDialog = closeDialog;
  // vm.getCardList = getCardList;
  vm.removeCard = removeCard;
  /* Attachment */
  vm.toggleCoverImage = toggleCoverImage;
  vm.removeAttachment = removeAttachment;
  /* Labels */
  vm.labelQuerySearch = labelQuerySearch;
  vm.filterLabel = filterLabel;
  vm.addNewLabel = addNewLabel;
  vm.removeLabel = removeLabel;
  /* Members */
  vm.memberQuerySearch = memberQuerySearch;
  vm.filterMember = filterMember;
  /* Checklist */
  vm.updateCheckedCount = updateCheckedCount;
  vm.addCheckItem = addCheckItem;
  vm.removeChecklist = removeChecklist;
  vm.removeChecklistItem = removeChecklistItem;
  vm.createCheckList = createCheckList;
  /* Comment */
  vm.addNewComment = addNewComment;

  init();

  //////////


  /**
   * Create a new component
   *
   * @param {type} component a parent component
   */
  function createComponent(component) {
   if (!component.newComponent.title) {
    return;
   }
   var data = {
    title: component.newComponent.title,
    description: "",
    parentComponentId: vm.component.id, //parent component
    typeId: component.id,
    privacyId: vm.privacy.public
   };
   ComponentService.createComponent(data).then(function (response) {
    component.components.push(response);
    component.newComponent.title = "";
   });
  }

  /**
   * Update a component title and background
   *
   * @param {type} component to ve updated
   */
  function updateComponentDescription(component) {
   if (!component.title) {
    return;
   }
   var data = {
    componentId: component.id,
    title: component.title,
    description: component.description
   };
   ComponentService.updateComponentDescription(data).then(function (response) {
    // component.components.push(response);
   });
  }

  /**
   * Update a component background
   *
   * @param {type} component to ve updated
   */
  function updateComponentBackground(component) {
   var data = {
    componentId: component.id,
    backgroundColor: component.background_color
   };
   ComponentService.updateComponentBackground(data).then(function (response) {
    // component.components.push(response);
   });
  }

  /**
   * Close Dialog
   */
  function closeDialog()
  {
   $mdDialog.hide();
  }

  /**
   * Get Card List
   */
  function getCardList()
  {
   var response;
   for (var i = 0, len = vm.board.lists.length; i < len; i++)
   {
    if (vm.board.lists[i].idCards.indexOf(vm.component.id) > -1)
    {
     response = vm.board.lists[i];
     break;
    }
   }
   return response;
  }

  /**
   * Remove card
   *
   * @param ev
   */
  function removeCard(ev)
  {
   var confirm = $mdDialog.confirm({
    title: 'Remove Card',
    parent: $document.find('#'),
    textContent: 'Are you sure want to remove card?',
    ariaLabel: 'remove card',
    targetEvent: ev,
    clickOutsideToClose: true,
    escapeToClose: true,
    ok: 'Remove',
    cancel: 'Cancel'
   });

   $mdDialog.show(confirm).then(function ()
   {
    var cardList = getCardList();

    cardList.idCards.splice(cardList.idCards.indexOf(vm.component.id), 1);

    vm.board.components.splice(vm.board.components.indexOf(vm.component), 1);

   }, function ()
   {
    // Canceled
   });
  }

  /**
   * Toggle cover image
   *
   * @param attachmentId
   */
  function toggleCoverImage(attachmentId)
  {
   if (attachmentId === vm.component.idAttachmentCover)
   {
    vm.component.idAttachmentCover = null;
   } else
   {
    vm.component.idAttachmentCover = attachmentId;
   }
  }

  /**
   * Remove attachment
   *
   * @param item
   */
  function removeAttachment(item)
  {
   if (vm.component.idAttachmentCover === item.id)
   {
    vm.component.idAttachmentCover = '';
   }
   vm.component.attachments.splice(vm.component.attachments.indexOf(item), 1);
  }

  /**
   * Add label chips
   *
   * @param query
   * @returns {filterFn}
   */
  function labelQuerySearch(query)
  {
   return query ? vm.labels.filter(createFilterFor(query)) : [];
  }

  /**
   * Label filter
   *
   * @param label
   * @returns {boolean}
   */
  function filterLabel(label)
  {
   if (!vm.labelSearchText || vm.labelSearchText === '')
   {
    return true;
   }

   return angular.lowercase(label.name).indexOf(angular.lowercase(vm.labelSearchText)) >= 0;
  }

  /**
   * Add new label
   */
  function addNewLabel()
  {
   vm.board.labels.push({
    id: msUtils.guidGenerator(),
    name: vm.newLabelName,
    color: vm.newLabelColor
   });

   vm.newLabelName = '';
  }

  /**
   * Remove label
   */
  function removeLabel()
  {
   var arr = vm.board.labels;
   arr.splice(arr.indexOf(arr.getById(vm.editLabelId)), 1);

   angular.forEach(vm.board.components, function (card)
   {
    if (card.idLabels && card.idLabels.indexOf(vm.editLabelId) > -1)
    {
     card.idLabels.splice(card.idLabels.indexOf(vm.editLabelId), 1);
    }
   });

   vm.newLabelName = '';
  }

  /**
   * Add member chips
   *
   * @param query
   * @returns {Array}
   */
  function memberQuerySearch(query)
  {
   return query ? vm.members.filter(createFilterFor(query)) : [];
  }

  /**
   * Member filter
   *
   * @param member
   * @returns {boolean}
   */
  function filterMember(member)
  {
   if (!vm.memberSearchText || vm.memberSearchText === '')
   {
    return true;
   }

   return angular.lowercase(member.name).indexOf(angular.lowercase(vm.memberSearchText)) >= 0;
  }

  /**
   * Update check list stats
   * @param list
   */
  function updateCheckedCount(list)
  {
   var checkItems = list.checkItems;
   var checkedItems = 0;
   var allCheckedItems = 0;
   var allCheckItems = 0;

   angular.forEach(checkItems, function (checkItem)
   {
    if (checkItem.checked)
    {
     checkedItems++;
    }
   });

   list.checkItemsChecked = checkedItems;

   angular.forEach(vm.component.checklists, function (item)
   {
    allCheckItems += item.checkItems.length;
    allCheckedItems += item.checkItemsChecked;
   });

   vm.component.checkItems = allCheckItems;
   vm.component.checkItemsChecked = allCheckedItems;
  }

  /**
   * Add checklist item
   *
   * @param text
   * @param checkList
   */
  function addCheckItem(text, checkList)
  {
   if (!text || text === '')
   {
    return;
   }

   var newCheckItem = {
    'name': text,
    'checked': false
   };

   checkList.checkItems.push(newCheckItem);

   updateCheckedCount(checkList);
  }

  /**
   * Remove checklist
   *
   * @param item
   */
  function removeChecklist(item)
  {
   vm.component.checklists.splice(vm.component.checklists.indexOf(item), 1);

   angular.forEach(vm.component.checklists, function (list)
   {
    updateCheckedCount(list);
   });
  }

  /**
   * Remove checklist Item
   *
   * @param item
   */
  function removeChecklistItem(item, list)
  {
   list.splice(list.indexOf(item), 1);

   angular.forEach(vm.component.checklists, function (list)
   {
    updateCheckedCount(list);
   });
  }

  /**
   * Create checklist
   */
  function createCheckList()
  {
   vm.component.checklists.push({
    id: msUtils.guidGenerator(),
    name: vm.newCheckListTitle,
    checkItemsChecked: 0,
    checkItems: []
   });

   vm.newCheckListTitle = '';
  }

  /**
   * Add new comment
   *
   * @param newCommentText
   */
  function addNewComment(newCommentText)
  {
   var newComment = {
    idMember: '36027j1930450d8bf7b10158',
    message: newCommentText,
    time: 'now'
   };

   vm.component.comments.unshift(newComment);
  }

  /**
   * Filter for chips
   *
   * @param query
   * @returns {filterFn}
   */
  function createFilterFor(query)
  {
   var lowercaseQuery = angular.lowercase(query);
   return function filterFn(item)
   {
    return angular.lowercase(item.name).indexOf(lowercaseQuery) >= 0;
   };
  }

  function init() {
   ComponentService.getComponent(componentId, 2).then(function (data) {
    vm.component = data;
   });
  }

  $scope.$watch(
          "vm.component.background_color",
          function handleBackgroundChange(newValue, oldValue) {
           if (newValue && oldValue && newValue !== oldValue) {
            updateComponentBackground(vm.component);
            console.log("vm.fooCount:", newValue);
           }
          }
  );
 }
})();