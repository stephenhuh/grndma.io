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
var MenuSchema = new Schema({
	name: {
		type: String,
		default: 'A menu',
//		required: 'Please fill menu name',
		trim: true
	},
  number: {
    type: Number,
    unique: true,
    required: 'type a number that doesn\'t break stuff'
  },
  IVRText: {
    type: String
//TODO: default: name
  },
	created: {
		type: Date,
		default: Date.now
	},
	menu: {
		type: Schema.ObjectId,
		ref: 'menu'
	},
  //children can be Menus or ServiceActions
	children: [Schema.Types.ObjectId]
});

mongoose.model('Menu', MenuSchema);
