'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var grandmas = require('../../app/controllers/grandmas.server.controller');

	// Grandmas Routes
	//TODO: how to only show grandmas they created in list? 
	app.route('/grandmas')
		.get(users.requiresLogin, grandmas.list)
		.post(users.requiresLogin, grandmas.create);

	app.route('/grandmas/:grandmaId')
		.get(users.requiresLogin, grandmas.hasAuthorization, grandmas.read)
		.put(users.requiresLogin, grandmas.hasAuthorization, grandmas.update)
		.delete(users.requiresLogin, grandmas.hasAuthorization, grandmas.delete);

	// Finish by binding the Grandma middleware
	app.param('grandmaId', grandmas.grandmaByID);
};
