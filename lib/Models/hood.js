/**
 * hood.js
 */

var mongoose = require('mongoose');

var hoodSchema = new mongoose.Schema({
	name: { type: String, required: true },
	shortHand: { type: String, required: true },
	subHoodOptions: [String]
});

module.exports = mongoose.model('Hood', hoodSchema, 'hoods');