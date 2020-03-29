'use strict';

import JSSPAObserver from './objects/observer';
import RouterMap from './objects/router_map';

var JSSPARouter = (function() {
	var instance,
      transitionRoute = (path) => RouterMap.enterRoute(path);

  function SPARouter() {
    if (instance) {
      return instance;
    }

    // Initializing Observers for Window History API
    JSSPAObserver.attach(window.history, 'pushState', () => {
      console.log('Claiming Push State');
    });
    JSSPAObserver.attach(window.history, 'replaceState', () => {
      console.log('Claiming Replace State');
    });

    window.addEventListener('hashchange', () => {
      console.log('Claiming Hash Change');
    });
    window.addEventListener('popstate', () => {
      let hash = location.hash && location.hash.replace('#', ''),
          pathname = location.pathname,
          routedPath = hash || pathname;
      if (routedPath) {
        transitionRoute(routedPath);
      }
      console.log('Claiming Pop State');
    });

    instance = this;
  }

  SPARouter.prototype.changeURL = function(hash) {
    let href = window.location.href.split('#')[0];
    if (href) {
      window.location.href = `${href}#${hash}`;
    }
  };

  SPARouter.prototype.pushURL = function(urlobj) {
    var stateObj = { page: urlobj.title };
    history.pushState(stateObj, urlobj.title, urlobj.url);
  };

  SPARouter.prototype.replaceURL = function(urlobj) {
    var stateObj = { page: urlobj.title };
    history.replaceState(stateObj, urlobj.title, urlobj.url);
  };

  SPARouter.prototype.gotoHash = function(path) {
    let router = RouterMap.getRouter(path);
    if (router) {
      this.changeURL(path);
      transitionRoute(path);
    }
  };

  SPARouter.prototype.gotoPath = function(path) {
    let router = RouterMap.getRouter(path);
    if (router) {
      this.pushURL({title: router.id, url: path});
      transitionRoute(path);
    }
  };

  SPARouter.prototype.replacePath = function(path) {
    let router = RouterMap.getRouter(path);
    if (router) {
      this.replaceURL({title: router.id, url: path});
      transitionRoute(path);
    }
  };

  SPARouter.prototype.addRoute = function(id, path, parent) {
  	return RouterMap.createRoute(id, path, parent);
  };

  SPARouter.prototype.map = function(routerJSON) {
  	let root = routerJSON && routerJSON['/'];
  	if (root) {
      // ADD Root Index
      RouterMap.addIndexPath(root.index);

      // Create Router Mapping
  		let rootRoute = this.addRoute({
        id: root.id,
        path: root.path,
        callback: root.callback
      });
  		if (root.child) {
				this.addRoutes(root.child, rootRoute);
  		}

      // GOTO Root Route
  		RouterMap.enterRoute('/');
  	}
  };

  SPARouter.prototype.addRoutes = function(routesJSON, parent) {
  	for (let k in routesJSON) {
  		if (routesJSON.hasOwnProperty(k)) {
  			let routeConfig = routesJSON[k];
  			let route = this.addRoute({
          id: routeConfig.id,
          path: routeConfig.path || routeConfig.hash,
          callback: routeConfig.callback,
          parent: parent
        });
  			if (routeConfig.child) {
  				this.addRoutes(routeConfig.child, route);
  			}
  		}
  	}
  };

  SPARouter.prototype.getCurrentRoute = function() {
    return RouterMap.getCurrentRoute();
  };

  return new SPARouter();
})();

export default JSSPARouter;