'use strict';

/** WHY SO MUCH REDUNDANT CODE ARGH

 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	menu = mongoose.model('Menu'),
	_ = require('lodash');

/**
 * Create
 */
exports.create = function(req, res) {
	var menu = new menu(req.body);
	menu.user = req.user;

	menu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menu);
		}
	});
};

/**
 * Show the current menu
 */
exports.read = function(req, res) {
	res.jsonp(req.menu);
};

/**
 * Update a menu
 */
exports.update = function(req, res) {
	var menu = req.menu ;

	menu = _.extend(menu , req.body);

	menu.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menu);
		}
	});
};

/**
 * Delete an menu
 */
exports.delete = function(req, res) {
	var menu = req.menu ;

	menu.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menu);
		}
	});
};

/**
 * List of menus
 */
exports.list = function(req, res) {
	menu.find().sort('-created').populate('user', 'displayName').exec(function(err, menus) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menus);
		}
	});
};

/**
 * menu middleware
 */
exports.menuByID = function(req, res, next, id) {
	menu.findById(id).populate('user', 'displayName').exec(function(err, menu) {
		if (err) return next(err);
		if (! menu) return next(new Error('Failed to load menu ' + id));
		req.menu = menu ;
		next();
	});
};

/**
 * menu authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.menu.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
