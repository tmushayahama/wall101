(function ()
{
 'use strict';

 angular
         .module('app.components')
         .factory('ComponentService', ComponentService);

 /** @ngInject */
 function ComponentService(_, msApi, $q) {
  var service = {
   components: {},
   foods: {
    options: [
     {
      'name': 'mouse',
      'picture_url': 'mouse.png',
      'animal': {
       "id": 2,
       "name": "cat"
      },
      'total': 10
     },
     {
      'name': 'treat',
      'picture_url': 'treat.png',
      'animal': {
       "id": 3,
       "name": "dog"
      },
      'total': 10
     },
     {
      'name': 'worm',
      'picture_url': 'worm.png',
      'animal': {
       "id": 4,
       "name": "chicken"
      },
      'total': 10
     },
     {
      'name': 'grass',
      'picture_url': 'grass.png',
      'animal': {
       "id": 5,
       "name": "cow"
      },
      'total': 10
     }
    ]
   },
   //Methods
   getComponent: getComponent,
   getComponents: getComponents,
   calibrateComponent: calibrateComponent
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
   * Get component data from the server
   *
   * @returns promise of the deferred response
   */
  function getComponents(animal, page) {
   // Create a new deferred object
   var deferred = $q.defer();

   msApi.request('components.components@get',
           {
            animal: animal.id,
            page: page
           },
           function (response) {
            if (!service.components[response.type]) {
             service.components[response.type] = {};
            }
            if (service.components[response.type].animals) {
             service.components[response.type].animals.push(response.components);
            } else {
             service.components[response.type].animals = response.components;
            }
            service.components[response.type].page = response.page;
            deferredHandler(response, deferred);
           },
           function (response) {
            deferred.reject(response);
           }
   );

   return deferred.promise;
  }

  /**
   * Get component data from the server
   *
   * @returns promise of the deferred response
   */
  function getComponentByLocation(animal, x, y) {
   // Create a new deferred object
   var deferred = $q.defer();

   msApi.request('components.componentByLocation@get',
           {
            animal: animal,
            x: x,
            y: y
           },
           function (response) {
            deferredHandler(response, deferred);
           },
           function (response) {
            deferred.reject(response);
           }
   );

   return deferred.promise;
  }

  /**
   * Get component from the local components
   *
   * @param animal The animal type
   * @returns promise of the deferred response
   */
  function getComponent(animal) {
   // Create a new deferred object
   var deferred = $q.defer();

   var animals = _.filter(service.components[animal.name].animals, {'type_id': animal.id});
   var result = _.sample(animals);

   deferredHandler(result, deferred);

   return deferred.promise;
  }

  /**
   * Get component data from the server
   *
   * @returns promise of the deferred response
   */
  function calibrateComponent(calibrateData) {
   // Create a new deferred object
   var deferred = $q.defer();

   msApi.request('components.component.calibrate@save',
           calibrateData,
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