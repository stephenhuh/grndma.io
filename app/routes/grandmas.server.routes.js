'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var grandmas = require('../../app/controllers/grandmas.server.controller');

	// Grandmas Routes
	app.route('/grandmas')
		.get(grandmas.list)
		.post(users.requiresLogin, grandmas.create);

	app.route('/grandmas/:grandmaId')
		.get(grandmas.read)
		.put(users.requiresLogin, grandmas.hasAuthorization, grandmas.update)
		.delete(users.requiresLogin, grandmas.hasAuthorization, grandmas.delete);

	// Finish by binding the Grandma middleware
	app.param('grandmaId', grandmas.grandmaByID);
};
