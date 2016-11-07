/**
 * vendor.js
 */

var mongoose = require('mongoose');

var vendorSchema = new mongoose.Schema({
	name: { type: String, required: true },
	active: Boolean
})

module.exports = mongoose.model('Vendor', vendorSchema, 'vendors');