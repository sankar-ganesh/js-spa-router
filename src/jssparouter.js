'use strict';

import JSSPAObserver from './objects/observer';
import FSM from 'js-finite-state-machine';

var JSSPARouter = (function() {
	var instance,
      rendered = false,
			routers = {},
      currentRoute = null;

  function Router() {
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
          pathname = location.pathname && location.pathname.replace('/', ''),
          routedPath = hash || pathname;
      if (routedPath) {
        this.transitionRoute(this.getRoute(routedPath));
      }
      console.log('Claiming Pop State');
    });

    instance = this;
  }

  Router.prototype.changeURL = function(hash) {
    let href = window.location.href.split('#')[0];
    if (href) {
      window.location.href = `${href}#${hash}`;
    }
  };

  Router.prototype.pushURL = function(urlobj) {
    var stateObj = { page: urlobj.title };
    history.pushState(stateObj, urlobj.title, urlobj.url);
  };

  Router.prototype.replaceURL = function(urlobj) {
    var stateObj = { page: urlobj.title };
    history.replaceState(stateObj, urlobj.title, urlobj.url);
  };

  Router.prototype.addRoute = function(route) {
  	if (route && route.path) {
  		routers[route.path] = route;
  	}
  	return this;
  };

  Router.prototype.deleteRoute = function(route) {
  	if (route && route.path) {
  		delete routers[path];
  	}
  	return this;
  };

  Router.prototype.getRoute = function(path) {
    return routers && routers[path];
  };

  Router.prototype.addRoutes = function(routes) {
  	let routesType = routes && routes.constructor,
				isArray = routesType && routesType.name === "Array";

		if (isArray) {
			routes.forEach(route => this.addRoute(route));
		}

		return this;
  };

  Router.prototype.gotoHash = function(route) {
    let path = route && route.path,
        router = path && routers[path];
    if (path) {
      this.transitionRoute(router);
      this.changeURL(path);
    }
  };

  Router.prototype.gotoRoute = function(route) {
  	let path = route && route.path,
        name = route && route.name,
        router = path && routers[path];
    if (path) {
      this.transitionRoute(router);
      this.pushURL({title: name, url: path});
  	}
  };

  Router.prototype.replaceRoute = function(route) {
    let path = route && route.path,
        router = path && routers[path];
    if (path) {
      this.transitionRoute(router);
  		this.replaceURL({title: name, url: path});
  	}
  };

  Router.prototype.transitionRoute = function(route) {
    this.renderRouter();
    if (route) {
      route.clean('Transitioning');
      if (currentRoute) {
        currentRoute.dissolve();
      }
      route.update(route.render());
      currentRoute = route;
    }
  };

  Router.prototype.renderRouter = function() {
    if (!rendered || !document.getElementById('jssparouter_body')) {
      let jssparouter_body = document.createElement('div');
      jssparouter_body.id = 'jssparouter_body';
      document.body.appendChild(jssparouter_body);
      rendered = true;
    }
  };

  return new Router();
})();

export default JSSPARouter;