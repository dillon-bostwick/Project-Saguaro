/**
 * bill.js
 */

var mongoose = require('mongoose');

var billSchema = new mongoose.Schema({
	_invoice: String,
	qbXmlGuid: String,
	xml: String
});

module.exports = mongoose.model('Bill', billSchema, 'bills');