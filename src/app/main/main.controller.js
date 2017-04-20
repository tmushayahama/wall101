(function ()
{
 'use strict';

 angular
         .module('fuse')
         .controller('MainController', MainController);

 /** @ngInject */
 function MainController($scope, $rootScope)
 {
  // Data

  //////////

  // Remove the splash screen
  /*
   $scope.$on('$viewContentAnimationEnded', function (event)
   {
   if (event.targetScope.$id === $scope.$id)
   {
   $rootScope.$broadcast('msSplashScreen::remove');
   }
   });
   */

  function scrollArrowShow() {
   var maxScroll = ($('#inner-wrap').width() - $('#slide-wrap').scrollLeft()) - $('#slide-wrap').width();
   if (0 == $('#slide-wrap').scrollLeft()) {
    $('#scroll_L_Arrow').css({visibility: 'hidden'});
   } else {
    $('#scroll_L_Arrow').css({visibility: 'visible'});
   }
   if (0 == maxScroll) {
    $('#scroll_R_Arrow').css({visibility: 'hidden'});
   } else {
    $('#scroll_R_Arrow').css({visibility: 'visible'});
   }
  }

  function scrollThumb(direction) {
   if (direction == 'Go_L') {
    $('#slide-wrap').animate({
     scrollLeft: "-=" + 250 + "px"
    }, function () {
     scrollArrowShow();
    });
   } else
   if (direction == 'Go_R') {
    $('#slide-wrap').animate({
     scrollLeft: "+=" + 250 + "px"
    }, function () {
     // createCookie('scrollPos', $('#slide-wrap').scrollLeft());
     scrollArrowShow();
    });
   }
  }


  function moveBy(scrollId, delta) {

   var selector = scrollId;
   var $scrollable = $(selector);//.find('.gb-horizontal-scrollable');
   var curScroll = $scrollable.scrollLeft();
   var scrollTo = curScroll + delta;
   /*
    scrollTo = (delta > 0)
    ? Math.min(scrollTo, $(window).width())
    : Math.max(scrollTo, 0);
    */

   $scrollable.animate({
    scrollLeft: +scrollTo + "px"
   }, function () {
    scrollArrowShow();
   });

   //scrollLeft(scrollTo);

  }

  $rootScope.scrollHorizontal = function (sectionId, delta) {
   moveBy(sectionId, delta);
  };

  $rootScope.settings = {
   color: "#027887"
  };

  $rootScope.generateBackgroundPattern = function () {
   function getRandom(min, max) {
    if (min > max) {
     return -1;
    }

    if (min == max) {
     return min;
    }

    var r;

    do {
     r = Math.random();
    } while (r == 1.0);

    return min + parseInt(r * (max - min + 1));
   }

   function checkBrowserName(name) {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf(name.toLowerCase()) > -1) {
     return true;
    }
    return false;
   }

   if (checkBrowserName('safari')) {
    var rot = getRandom(0, 255);
    var blau = getRandom(0, 255);
    var gruen = getRandom(0, 255);
    var rot_zwei = getRandom(0, rot);
    var blau_zwei = getRandom(0, blau);
    var gruen_zwei = getRandom(0, gruen);
    var transparent = getRandom(2, 5);
    var backgroundStyle = '-webkit-linear-gradient(rgba(' + rot + ',' + blau + ',' + gruen + ',.' + transparent + ') 0%, rgba(' + rot_zwei + ',' + blau_zwei + ',' + gruen_zwei + ',.8) 100%)';




    for (var i = 0; i < 6; i++) {

     var rot = getRandom(0, 255);
     var blau = getRandom(0, 255);
     var gruen = getRandom(0, 255);
     var transparent = getRandom(5, 5);
     var grad = getRandom(-45, 45);
     var prozent_eins = getRandom(0, (screen.width / 4) * 3);
     var prozent_zwei = getRandom(prozent_eins, screen.width);
     backgroundStyle = backgroundStyle + ' ,-webkit-linear-gradient(' + grad + 'deg,transparent 0,transparent ' + prozent_eins + 'px, rgba(' + rot + ',' + blau + ',' + gruen + ',.' + transparent + ') ' + prozent_eins + 'px, rgba(' + rot + ',' + blau + ',' + gruen + ',.' + transparent + ') ' + prozent_zwei + 'px,transparent ' + prozent_zwei + 'px,transparent 100%)';
    }

   } else {

    if (checkBrowserName('firefox')) {

     var rot = getRandom(0, 255);
     var blau = getRandom(0, 255);
     var gruen = getRandom(0, 255);
     var rot_zwei = getRandom(0, rot);
     var blau_zwei = getRandom(0, blau);
     var gruen_zwei = getRandom(0, gruen);
     var transparent = getRandom(2, 5);
     var backgroundStyle = '-moz-linear-gradient(rgba(' + rot + ',' + blau + ',' + gruen + ',.' + transparent + ') 0%, rgba(' + rot_zwei + ',' + blau_zwei + ',' + gruen_zwei + ',.8) 100%)';




     for (var i = 0; i < 6; i++) {

      var rot = getRandom(0, 255);
      var blau = getRandom(0, 255);
      var gruen = getRandom(0, 255);
      var transparent = getRandom(5, 5);
      var grad = getRandom(-45, 45);
      var prozent_eins = getRandom(0, (screen.width / 4) * 3);
      var prozent_zwei = getRandom(prozent_eins, screen.width);
      backgroundStyle = backgroundStyle + ' ,-moz-linear-gradient(' + grad + 'deg,transparent 0,transparent ' + prozent_eins + 'px, rgba(' + rot + ',' + blau + ',' + gruen + ',.' + transparent + ') ' + prozent_eins + 'px, rgba(' + rot + ',' + blau + ',' + gruen + ',.' + transparent + ') ' + prozent_zwei + 'px,transparent ' + prozent_zwei + 'px,transparent 100%)';
     }


    } else {
     var rot = getRandom(0, 255);
     var blau = getRandom(0, 255);
     var gruen = getRandom(0, 255);
     var rot_zwei = getRandom(0, rot);
     var blau_zwei = getRandom(0, blau);
     var gruen_zwei = getRandom(0, gruen);
     var transparent = getRandom(2, 5);
     var backgroundStyle = 'linear-gradient(rgba(' + rot + ',' + blau + ',' + gruen + ',.' + transparent + ') 0%, rgba(' + rot_zwei + ',' + blau_zwei + ',' + gruen_zwei + ',.8) 100%)';




     for (var i = 0; i < 6; i++) {

      var rot = getRandom(0, 255);
      var blau = getRandom(0, 255);
      var gruen = getRandom(0, 255);
      var transparent = getRandom(5, 5);
      var grad = getRandom(-45, 45);
      var prozent_eins = getRandom(0, (screen.width / 4) * 3);
      var prozent_zwei = getRandom(prozent_eins, screen.width);
      backgroundStyle = backgroundStyle + ' ,linear-gradient(' + grad + 'deg,transparent 0,transparent ' + prozent_eins + 'px, rgba(' + rot + ',' + blau + ',' + gruen + ',.' + transparent + ') ' + prozent_eins + 'px, rgba(' + rot + ',' + blau + ',' + gruen + ',.' + transparent + ') ' + prozent_zwei + 'px,transparent ' + prozent_zwei + 'px,transparent 100%)';
     }

    }
   }
   return backgroundStyle;
  };


 }
})();