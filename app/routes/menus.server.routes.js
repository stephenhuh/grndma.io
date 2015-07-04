'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var menus = require('../../app/controllers/menus.server.controller');

	// menus Routes
	app.route('/menus')
		.get(menus.list)
		.post(users.requiresLogin, menus.create);

	app.route('/menus/:menuId')
		.get(menus.read)
		.put(users.requiresLogin, menus.hasAuthorization, menus.update)
		.delete(users.requiresLogin, menus.hasAuthorization, menus.delete);

	// Finish by binding the menu middleware
	app.param('menuId', menus.menuByID);
};
