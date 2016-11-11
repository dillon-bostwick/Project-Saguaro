/**
 * group.js
 *
 * TODO: More validation
 * TODO: Should String be ObjectId referencing?
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var groupSchema = new mongoose.Schema({
	name: { type: String, required: true },
	_queue: [{ type: ObjectId, ref: 'Invoice' }],
	_nextGroup: { type: ObjectId, ref: 'Group' },
	_user: { type: ObjectId, ref: 'User' },
	required: {
		serviceDate: Boolean,
		vendor: Boolean,
		invNum: Boolean,
		lineItem: Boolean,
		hoods: Boolean,
		lots: Boolean,
		activities: Boolean,
		expenses: Boolean
	}
});

module.exports = mongoose.model('Group', groupSchema, 'groups');


