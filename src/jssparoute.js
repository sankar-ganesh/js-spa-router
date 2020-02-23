'use strict';

function JSSPARoute(route) {
	this.id = route.id || `jssparoute_id_${new Date().getTime()}` || route.id;
	this.name = route.name || `jssparoute_name_${new Date().getTime()}` || route.name;
	this.path = route.path;
	if (route.render) {
		this.render = route.render;
	}
	if (route.dissolve) {
		this.dissolve = route.dissolve;
	}
	this.html = `<div id="jssparoute_render">JS SPA Sample</div>`;
	return this;
}

JSSPARoute.prototype.setId = function(id) {
	this.id = id;
	return this;
};

JSSPARoute.prototype.setName = function(name) {
	this.name = name;
	return this;
};

JSSPARoute.prototype.setPath = function(path) {
	this.path = path;
	return this;
};

JSSPARoute.prototype.getId = function() {
	return this.id;
};

JSSPARoute.prototype.getName = function() {
	return this.name;
};

JSSPARoute.prototype.getPath = function() {
	return this.path;
};

JSSPARoute.prototype.render = function() {
	this.clean('Render');
	return this.html;
};

JSSPARoute.prototype.dissolve = function() {
	this.clean('Dissolve');
};

JSSPARoute.prototype.clean = function(caller) {
	console.log(`Called JS SPA Sample ${caller}`);
	document.getElementById('jssparouter_body').innerHTML = "";
};

JSSPARoute.prototype.update = function(html) {
	document.getElementById('jssparouter_body').innerHTML = html || this.html;
};

export default JSSPARoute;