/**
 * user.js
 *
 * TODO: More validation
 * TODO: Should String be ObjectId referencing?
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	_id: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	_personalQueue: { type: [String], default: [] },
	canKey: { type: Boolean, default: false },
	canOverride: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false },
	_groups: { type: [String], default: [] },
	currentToken: String
});

userSchema.set('versionKey', false);

module.exports = mongoose.model('User', userSchema, 'users');