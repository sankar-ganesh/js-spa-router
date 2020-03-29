'use strict';

import Router from './router';

var RouterMap = (function() {
	var instance,
			routers = {},
			currentRouter = null,
			indexPath = null;

	// Constructor RouterM
	function RouterM() {
		if (instance) {
			return instance;
		}
		instance = this;
	}

	RouterM.prototype.addIndexPath = function(path) {
		indexPath = path;
	};

	RouterM.prototype.iteratePath = function(path) {
		let paths = [];
		while (path) {
			paths.push(path);
			path = path.substr(0, path.lastIndexOf('/'));
		}
		return paths;
	};

	RouterM.prototype.getRouters = function() {
		return routers;
	};

	RouterM.prototype.getRoute = function(path) {
		return routers[path].route;
	};

	RouterM.prototype.getRouter = function(path) {
		return routers[path];
	};

	RouterM.prototype.getCurrentRoute = function() {
		return currentRouter;
	};

	RouterM.prototype.createRoute = function(routeJSON) {
		let router = new Router(routeJSON);
		routers[router.getRoutePath()] = router;
		return router;
	};

	RouterM.prototype.enterRoute = function(path) {
		/*
		 * Exit if root / path is reached
		 * Exit if current path & path matches
		 * Exit if current path matches in iteration path
		 */
		let routePath = currentRouter && currentRouter.getRoutePath(),
				routers = this.iteratePath(path);
		while (routePath && routePath !== '/' && routePath !== path && !routers.includes(routePath)) {
			this.exitRoute(routePath);
			routePath = currentRouter && currentRouter.getRoutePath();
		}

		if (currentRouter === null || path === indexPath) {
			this.transitionToRoute('/');
			return;
		}

		// Use hierarchical routing technique to enter
		if (routePath !== path) {
			while (routers.length) {
				let pathToTraverse = routers.pop();
				if (routePath.indexOf(pathToTraverse) === -1) {
					this.transitionToRoute(pathToTraverse);
				}
			}
		}
	};

	RouterM.prototype.transitionToRoute = function(routePath) {
		let router = this.getRouter(routePath),
				route = router && router.getRoute();
		if (route) {
			router.queueTransition('mountRoute');
			router.queueTransition('loadData');
			router.queueTransition('render');
			currentRouter = router;
		}		
	};

	RouterM.prototype.exitRoute = function(routePath) {
		let router = this.getRouter(routePath),
				route = router && router.getRoute();
		if (route) {
			router.queueTransition('unloadData');
			router.queueTransition('unmountRoute');
			router.queueTransition('destroy');
			currentRouter = router.getRouteParent();
		}
	};

	RouterM.prototype.getInstance = function() {
		return instance || new RouterM();
	};

	return new RouterM();
})();

export default RouterMap;