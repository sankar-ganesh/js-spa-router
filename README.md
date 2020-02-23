# js-spa-router
Simple JS Routing Framework for SPA. This is Work In Progress.

## Usage

```javascript
	// Sample JS SPA Router
  let hashOne = new JSSPARoute({
        name: 'hashOne',
        path: 'one',
        render: () => {
          return `
            <h1>Content for page hash one</h1>
          `;
        }
      }),
      hashTwo = new JSSPARoute({
        name: 'hashTwo',
        path: 'two',
        render: () => {
          return `
            <h1>Content for page hash two</h1>
          `;
        }
      }),
      pagePush = new JSSPARoute({
        name: 'Page Push',
        path: 'push',
        render: () => {
          return `
            <h1>Content for page push</h1>
          `;
        }
      }),
      pageReplace = new JSSPARoute({
        name: 'Page Replace',
        path: 'replace',
        render: () => {
          return `
            <h1>Content for page replace</h1>
          `;
        }
      });
  JSSPARouter.addRoutes([hashOne, hashTwo, pagePush, pageReplace]);
```

```html
      <button type="button" onclick="JSSPARouter.gotoHash(hashOne)">Hash One</button>
      <button type="button" onclick="JSSPARouter.gotoHash(hashTwo)">Hash Two</button>
      <button type="button" onclick="JSSPARouter.gotoRoute(pagePush)">Page Push</button>
      <button type="button" onclick="JSSPARouter.replaceRoute(pageReplace)">Page Replace</button>
```