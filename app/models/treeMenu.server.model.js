'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
require('./apiService.server.model.js');
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
	// hopefully user isn't needed since they're all in the same doc
	// user: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// },
  digit: {
    type: Number,
		trim: true,
		//doing the digits automatically removes duplicate troubles
	//	required: 'please enter a digit '
		//todo: default auto increment
  },
	// serviceID: {
	// 	type: String
	// },
	serviceID: {
		type: Schema.ObjectId
//		ref: 'ApiService'
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
  //treeMenus are menus or endpoints
	tree: [treeMenuSchema]
});
treeMenuSchema.set('toJSON', { virtuals: true });

mongoose.model('treeMenu', treeMenuSchema);
