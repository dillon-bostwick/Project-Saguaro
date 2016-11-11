/**
 * user.js
 *
 * TODO: More validation
 * TODO: Should String be ObjectId referencing?
 */

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	_personalQueue: { type: [String], default: [] },
	_groups: [{ type: ObjectId, ref: 'Group' }],
	canKey: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false },
	currentToken: String
});

userSchema.plugin(deepPopulate, {});

userSchema.set('versionKey', false);

module.exports = mongoose.model('User', userSchema, 'users');