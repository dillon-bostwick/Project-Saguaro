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
	_invoiceQueue: [String],
	canKey: Boolean,
	canOverride: Boolean,
	isAdmin: Boolean,
	_groups: [String],
	currentToken: String
});

module.exports = mongoose.model('User', userSchema, 'users');