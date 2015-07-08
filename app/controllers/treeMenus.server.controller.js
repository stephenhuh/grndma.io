'use strict';

/** WHY SO MUCH REDUNDANT CODE ARGH

 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	//this mongoose/express thing of using capitals and plural is kind of a nightmare
	TreeMenu = mongoose.model('treeMenu'),
	_ = require('lodash');

/**
 * Create
 */
exports.create = function(req, res) {
	var treeMenu = new TreeMenu(req.body);
	treeMenu.user = req.user;

	treeMenu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(treeMenu);
		}
	});
};

/**
 * Show the current treeMenu
 */
exports.read = function(req, res) {
	res.jsonp(req.treeMenu);
};

/**
 * Update a treeMenu
 */
exports.update = function(req, res) {
	var treeMenu = req.treeMenu ;

	treeMenu = _.extend(treeMenu , req.body);

	treeMenu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(treeMenu);
		}
	});
};

/**
 * Delete an treeMenu
 */
exports.delete = function(req, res) {
	var treeMenu = req.treeMenu ;

	treeMenu.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(treeMenu);
		}
	});
};

/**
 * List of treeMenus
 */
exports.list = function(req, res) {
	TreeMenu.find().sort('-created').populate('user', 'displayName').exec(function(err, treeMenus) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(treeMenus);
		}
	});
};

/**
 * treeMenu middleware
 */
exports.treeMenuByID = function(req, res, next, id) {
	TreeMenu.findById(id).populate('user', 'displayName').exec(function(err, treeMenu) {
		if (err) return next(err);
		if (! treeMenu) return next(new Error('Failed to load treeMenu ' + id));
		req.treeMenu = treeMenu ;
		next();
	});
};

/**
 * treeMenu authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.treeMenu.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
