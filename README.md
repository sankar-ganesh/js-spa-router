# js-spa-router
Simple JS Routing Framework for SPA. Doesn't use external libraries. The underlying state management system is also built natively. This is WIP but still you can try and give your feedback.

## API

### Lifecycle Hooks

In SPA Router every route has a list of state or otherwise called as route hooks which enables the developer to configure appropriate callback actions.

**Hooks**

- `mountRoute` Mounts the current route and setup the foundation. You can initialize the route context here.
- `loadData` Load the data for the current route. Any call to server can be configured here.
- `render` Render the UI for the current route. Initialize all components and perform other page specific activities.
- `unloadData` Remove unwanted data from the current route context. Unloads all data that are not needed in the future.
- `unmountRoute` Remove / Clears the current route context.
- `destroy` Destructor for the current route.

### Transition

Transition logically notifies the state change. It happens in three phases as given below:

**Syntax**

`JSSPARouter.transitions()` Returns all possible transitions

**Example**

- `transition.before` called before the transition starts
- `transition.start` called during the transition
- `transition.after` called after the transition completes

### State

Every state get executed in a sequence of five phases. This will be super useful when you logically want to split your action.

**Syntax**

`JSSPARouter.states()` Returns all possible states

**Example**

- `state.leave` Before the current state leaves
- `state.left` After the current state left
- `state.enter` When the current state enter
- `state.reached` When the current state reach
- `state.entered` After the current state entered

## Usage

```javascript
	// Sample JS SPA Router

  /*
   * @method callback
   * @description Hook to handle route state change and route transitions
   * @param {string} type Describes The Transition Type
   * @param {object} transition The real transition object
   * @param {object} currentRoute The current route object
   */
  let callback = function(type, transition, currentRoute) {
    // 
  };

  // Sample JS SPA Router Config Payload
  let jssparouter = JSSPARouter.map({
    "/": {
      id: 'root',
      path: '/',
      callback: callback,
      index: '/',
      child: {
        "categories": {
          id: 'categories',
          path: 'categories',
          callback: callback,
          child: {
            "mobile": {
              id: 'mobile',
              path: 'mobile',
              callback: callback
            },
            "desktop": {
              id: 'desktop',
              path: 'desktop',
              callback: callback
            },
            "laptop": {
              id: 'laptop',
              path: 'laptop',
              callback: callback
            }
          }
        },
        "support": {
          id: 'support',
          path: 'support',
          callback: callback,
          child: {
            "email": {
              id: 'email',
              path: 'email',
              callback: callback
            },
            "phone": {
              id: 'phone',
              path: 'phone',
              callback: callback
            }
          }
        }
      }
    }
  });
```

```html
  <button type="button" onclick="JSSPARouter.gotoPath('/categories')">Categories</button>
  <button type="button" onclick="JSSPARouter.gotoPath('/categories/mobile')">Mobile</button>
  <button type="button" onclick="JSSPARouter.gotoPath('/categories/laptop')">Laptop</button>
  <button type="button" onclick="JSSPARouter.gotoPath('/categories/desktop')">Desktop</button>
  <button type="button" onclick="JSSPARouter.gotoPath('/support')">Support</button>
  <button type="button" onclick="JSSPARouter.gotoPath('/support/email')">Email</button>
  <button type="button" onclick="JSSPARouter.gotoPath('/support/phone')">Phone</button>
```

## Installation

* `yarn add js-spa-router`