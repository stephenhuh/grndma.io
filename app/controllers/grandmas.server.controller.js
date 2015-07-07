'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Grandma = mongoose.model('Grandma'),
	_ = require('lodash');

/**
 * Create a Grandma
 */
exports.create = function(req, res) {
	var grandma = new Grandma(req.body);
	grandma.user = req.user;

	grandma.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grandma);
		}
	});
};

/**
 * Show the current Grandma
 */
exports.read = function(req, res) {
	res.jsonp(req.grandma);
};

/**
 * Update a Grandma
 */
exports.update = function(req, res) {
	var grandma = req.grandma ;

	grandma = _.extend(grandma , req.body);

	grandma.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grandma);
		}
	});
};

/**
 * Delete an Grandma
 */
exports.delete = function(req, res) {
	var grandma = req.grandma ;

	grandma.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grandma);
		}
	});
};

/**
 * List of Grandmas
 */
exports.list = function(req, res) {
	Grandma.find({'user' : req.user.id}).sort('-created').populate('user', 'displayName').exec(function(err, grandmas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grandmas);
		}
	});
};

/**
 * Grandma middleware
 */
exports.grandmaByID = function(req, res, next, id) {
	Grandma.findById(id).populate('user', 'displayName').exec(function(err, grandma) {
		if (err) return next(err);
		if (! grandma) return next(new Error('Failed to load Grandma ' + id));
		req.grandma = grandma ;
		next();
	});
};

/**
 * Grandma authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
//	console.log('hi ' + req.grandma.user.id + ' user: ' + req.user.id);
	if (req.grandma.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
