/**
 * activity.js
 */

var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
		code: { type: Number, required: true },
		desc: String
	});

module.exports = mongoose.model('Activity', activitySchema, 'activities');