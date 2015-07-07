'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Menu Object: INFINITE RECURSION
 * Should it have user and menu link or just menu?
 * auto-increment phonetree numbers unless specified
 */
var treeMenuSchema = new Schema({
	name: {
		type: String,
		default: 'A menu',
//		required: 'Please fill menu name',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
  digit: {
    type: Number,
		trim: true,
		required: 'please enter a digit '
		//todo: default auto increment
  },
  IVRText: {
    type: String
//TODO: default: name
  },
	created: {
		type: Date,
		default: Date.now
	},
	grandmaID: {
		type: Schema.ObjectId,
		ref: 'Grandma'
	},
  //children can be Menus or ServiceActions
	children: [treeMenuSchema]
});

mongoose.model('treeMenu', treeMenuSchema);
