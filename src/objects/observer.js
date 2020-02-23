'use strict';

/*
 *  Observer is a singleton object which allows you to attach observers for any existing events
 *
 *  attach - {scope, eventName, observer} adds the observer to the scope for the eventName
 *  
 *  detach - {scope, eventName} removes the observer added to the scope for the eventName
 *
 *  Invoking Methods:
 *
 *  Observer.attach(window.history, 'pushState', () => {
 *    // Inside Push State
 *  });
 *
 *  Observer.attach(window.history, 'replaceState', () => {
 *    // Inside Replace State
 *  });
 *
 *  Observer.detach(window.history, 'pushState');
 *
 *  Observer.detach(window.history, 'replaceState');
 *
 */

var JSSPAObserver = (function() {
  var instance,
      _observer = {},
      _attach = function(scope, eventName) {
        // Assign the original event function
        _observer[eventName] = scope[eventName];

        // Attach the new event function
        scope[eventName] = function() {
          // Create the invoker event
          var evt = _observer[eventName].apply(scope, arguments);

          // Call the overrided observer
          var observerEvent = scope[`${eventName}_observer`];
          if (typeof observerEvent === 'function') {
            observerEvent();
          }

          // Return the invoker event
          return evt;
        }
      },
      _detach = function(scope, eventName) {
        if (_observer[eventName]) {
          // Detach the new event function
          delete scope[eventName];

          // Assign the original event function
          scope[eventName] = _observer[eventName];

          delete _observer[eventName];
        }
      };

  function Observer() {
    if (instance) {
      return instance;
    }
    instance = this;
  }

  Observer.prototype.attach = function(scope, eventName, observer) {
    if (scope[eventName] && observer) {
      scope[`${eventName}_observer`] = observer;
      _attach(scope, eventName);
    }
  };

  Observer.prototype.detach = function(scope, eventName) {
    if (scope[eventName] && scope[`${eventName}_observer`]) {
      scope[`${eventName}_observer`] = void 0;
      _detach(scope, eventName);
    }
  };

  return new Observer();
})();

export default JSSPAObserver;