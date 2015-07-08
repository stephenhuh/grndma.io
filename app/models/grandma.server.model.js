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
		default: 'grandma',
		required: 'Please fill name',
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
		street: {
			type: String
		},
		city: {
			type: String
		},
		state: {
			type: String
		},
		zip: {
			type: Number
		},
		lat: {
			type: Number,
			default: 0,
			trim: true
		},
		lon: {
			type: Number,
			default: 0,
			trim: true
		},
	},

	rootTreeMenu: { type: Schema.Types.ObjectId, ref: 'treeMenu' }
	//rootTreeMenu: [mongoose.model('treeMenu').schema]
});

GrandmaSchema.virtual('address.full').get(function() {
	return this.address.street + ',  ' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip ;
});

mongoose.model('Grandma', GrandmaSchema);
