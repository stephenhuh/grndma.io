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
	rootTreeMenu: [mongoose.model('treeMenu').schema]
	//	rootTreeMenu: { type: Schema.Types.ObjectId, ref: 'treeMenu' }
	//apparently you can't have single (non-aray) external schema definitions.
	//but including it is the nosql way as far as I can tell.
	//so will address as rootTreeMenu[0]
});

GrandmaSchema.virtual('address.full').get(function() {
	return this.address.street + '\n  ' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip ;
});
GrandmaSchema.set('toJSON', { virtuals: true });

mongoose.model('Grandma', GrandmaSchema);
