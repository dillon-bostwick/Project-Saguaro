/**
 * invoice.js
 *
 * TODO: More validation
 * TODO: Should String be ObjectId referencing?
 */

var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
	name: String,
	pipelineIndex: Number,
	_queue: [String],
	_nextGroup: String, // or null for bill
	isHead: Boolean
});

module.exports = mongoose.model('Group', groupSchema, 'groups');