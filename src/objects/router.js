'use strict';

import FSM from 'js-finite-state-machine/src/fsm';
import Entity from 'js-finite-state-machine/src/objects/entity';
import State from 'js-finite-state-machine/src/objects/state';
import Transition from 'js-finite-state-machine/src/objects/transition';

function Router(router) {
	let id = router && router.id,
			path = router && router.path,
			parent = router && router.parent,
			callback = router && router.callback,
			unmounted = new State({
				id: `js_spa_route_state_unmount_${id}`,
				name: 'unmounted'
			}),
			mounted = new State({
				id: `js_spa_route_state_mount_${id}`,
				name: 'mounted'
			}),
			loaded = new State({
				id: `js_spa_route_state_loaded_${id}`,
				name: 'loaded'
			}),
			unloaded = new State({
				id: `js_spa_route_state_unloaded_${id}`,
				name: 'unloaded'
			}),
			rendered = new State({
				id: `js_spa_route_state_rendered_${id}`,
				name: 'rendered'
			}),
			mountRoute = new Transition({
				id: `js_spa_route_transition_mount_route_${id}`,
				name: 'mountRoute',
				from: [unmounted],
				to: mounted
			}),
			unmountRoute = new Transition({
				id: `js_spa_route_transition_unmount_route_${id}`,
				name: 'unmountRoute',
				from: [mounted, unloaded],
				to: unmounted
			}),
			loadData = new Transition({
				id: `js_spa_route_transition_load_data_${id}`,
				name: 'loadData',
				from: [mounted],
				to: loaded
			}),
			unloadData = new Transition({
				id: `js_spa_route_transition_unload_data_${id}`,
				name: 'unloadData',
				from: [loaded, rendered],
				to: unloaded
			}),
			render = new Transition({
				id: `js_spa_route_transition_render_${id}`,
				name: 'render',
				from: [loaded],
				to: rendered
			}),
			destroy = new Transition({
				id: `js_spa_route_transition_destroy_${id}`,
				name: 'destroy',
				from: [rendered, unloaded, unmounted],
				to: unmounted
			});
	this._queue = [];
	this._callback = callback;
	this._route = new FSM({
		id: `js_spa_route_fsm_${id}`,
		entity: new Entity({id: `js_spa_route_entity_${id}`, state: unmounted}),
		states: [mounted, unmounted, loaded, unloaded, rendered],
		transitions: [mountRoute, unmountRoute, loadData, unloadData, render, destroy],
		callback: this.routerCallback.bind(this)
	});
	let routeParent = parent && parent.getRouteParent(),
			routeParentPath = parent && parent.getRoutePath(),
			routePath = routeParent? `${routeParentPath}/${path}` : parent? `/${path}` : `/`;
	this._next = parent || null;
	this._id = id;
	this._path = routePath;
	this._transitioning = false;
	return this;
}

Router.prototype.getRoute = function() {
	return this._route;
};

Router.prototype.getRouteId = function() {
	return this._id;
};

Router.prototype.getRouteName = function() {
	return this._route.getEntityName();
};

Router.prototype.getRouteParent = function() {
	return this._next;
};

Router.prototype.getRoutePath = function() {
	return this._path;
};

Router.prototype.getRouteCallback = function() {
	return this._callback;
};

Router.prototype.getCurrentState = function() {
	return this._route.getEntityState();
};

Router.prototype.callTransition = function(fn) {
	let trns = fn && this._route[fn];
	if (trns && typeof trns === 'function') {
		this._transitioning = true;
		trns(this);
	}
};

Router.prototype.queueTransition = function(fn) {
	if (this._transitioning) {
		this._queue.push(fn);
	} else {
		this.callTransition(fn);
	}
};

Router.prototype.routerCallback = function(type, transition, payload) {
	this.getRouteCallback()(type, transition, payload);

	// On Every Transition Start
	if (type === 'transition.before') {
		this._transitioning = true;
	}

	// On Every Transition Complete Check For Queued Transitions
	if (type === 'transition.after') {
		// Reset Transition When it ends
		this._transitioning = false;
		let fn = this._queue.shift();
		this.callTransition(fn);
	}
};

export default Router;