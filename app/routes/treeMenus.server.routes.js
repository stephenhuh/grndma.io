'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var treeMenus = require('../../app/controllers/treeMenus.server.controller');

	// menus Routes
	app.route('/treeMenus')
		.get(treeMenus.list)
		.post(users.requiresLogin, treeMenus.create);

	app.route('/treeMenus/:treeMenuId')
		.get(treeMenus.read)
		.put(users.requiresLogin, treeMenus.hasAuthorization, treeMenus.update)
		.delete(users.requiresLogin, treeMenus.hasAuthorization, treeMenus.delete);

	// Finish by binding the menu middleware
	app.param('treeMenuId', treeMenus.treeMenuByID);
};
