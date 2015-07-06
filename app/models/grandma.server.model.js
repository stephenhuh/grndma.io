'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('./treeMenu.server.model.js');
/**
 * Grandma Schema
 */
var GrandmaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Grandma name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	phone: {
		type: Number,
		trim:true,
		required: 'Please fill phone'
	},
	address: {
		type: String,
		required: 'Please fill address'
	},
	lat:{
		type: Number,
		default: 0,
		trim: true
	},
	lon: {
		type: Number,
		default: 0,
		trim: true
	},
	// rootTreeMenu: { type: Schema.Types.ObjectId, ref: 'treeMenu' }
	rootTreeMenu: [mongoose.model('treeMenu').schema]
});

mongoose.model('Grandma', GrandmaSchema);
