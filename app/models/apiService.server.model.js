'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var apiServiceSchema = new Schema({
	
	created: {
		type: Date,
		default: Date.now
	},

});
// apiServiceSchema.set('toJSON', { virtuals: true });

mongoose.model('apiService', apiServiceSchema);
