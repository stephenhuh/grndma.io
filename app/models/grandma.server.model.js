'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('./treeMenu.server.model.js');
require('./apiService.server.model.js');

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
	tree: [mongoose.model('treeMenu').schema],
  apiServices: [mongoose.model('apiService').schema]
});

GrandmaSchema.virtual('address.full').get(function() {
	return this.address.street + '\n  ' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip ;
});
GrandmaSchema.set('toJSON', { virtuals: true });

mongoose.model('Grandma', GrandmaSchema);
