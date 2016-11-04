/**
 * invoice.js
 *
 * TODO: Refactor the schema definition. Some of it validates and some doesn't do anything.
 * TODO: And a lot of stuff is ugly.
 * TODO: And we need more virtuals.
 * TODO: And get total needs to be debugged
 * TODO: And other stuff.
 * TODO: Should String be ObjectId referencing?
 */

var mongoose = require('mongoose');

const LineItemCategories = ['CIP', 'EXPENSE', 'WARRANTY', 'HOA'];
const Money = { type: Number, min: 0, max: [150000, 'Amount cannot exceed 150K']};
const Now = { type: Date, default: Date.now };


var invoiceSchema = new mongoose.Schema({
	serviceDate: Date,
	_vendor: String,
	invNum: String,
	amount: Money,
	lineItems: [{
		category: {type: String, enum: LineItemCategories},
		_hood: String, // if EXPENSE: must be empty
		subHood: String, // if CIP or WARRANTY: can vary: null (i.e. unknown), hood, dev, or just a number. If EXPENSE: must be []]
		_activities: [String], // if CIP starts as [] and gets filled. If EXPENSE or WARRANTY: must be []]
		_expense: String, // if CIP or WARRANTY: must be ''.
		amount: Money, //required
		desc: String
	}],
	actions: [{
		desc: String,
		comment: String,
		date: Now,
		_user: String // ref
	}],
	dropboxId: String, // or null
	toKey: Boolean
	// qbXmlGuid: { type: String, default: '' },  // if not empty, means it has been set to bill i.e. archived
	// qbResponse: { type: Object, default: null }
});

invoiceSchema.set('versionKey', false);

invoiceSchema.virtual('total').get(function() {
	var total = 0;

	for (var category in this.entries) {
		for (var entry in this.entries[category]) {
			total += entry.amount;
		}
	}

	return total;
})

module.exports = mongoose.model('Invoice', invoiceSchema, 'invoices');