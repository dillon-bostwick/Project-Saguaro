/**
 * group.js
 *
 * TODO: More validation
 * TODO: Should String be ObjectId referencing?
 */

var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
	name: { type: String, required: true },
	pipelineIndex: { type: Number, required: true },
	_queue: { type: [String], default: [] },
	_nextGroup: String, // or null for bill
	isHead: { type: Boolean, default: false }
});

module.exports = mongoose.model('Group', groupSchema, 'groups');