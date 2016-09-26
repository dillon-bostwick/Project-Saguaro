/* Define all schema via Mongoose for MongoDB.
 * All models are exported under schema.models.
 * For example, to access the Invoice model,
 * schema.models.invoice
 */

 //TODO: Payable bills, archive (archive actually needs some logic - maybe a different schema? Different options for organization)

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

function reference(model) {
	return { type: mongoose.Schema.ObjectId, ref: model };
}

var Money = { type: Number, min: 0, max: [150000, 'Amount cannot exceed 150K'] };
var Now = { type: Date, default: Date.now };
var ActionsCategoryEnum = ['CREATED', 'SHORTPAY', 'BACKCHARGE', 'DNP', 'HOODUPDATE', 'LOTUPDATE', 'PARTIALDNP', 'HOLD', 'APPROVED'];
var UserCategoryEnum = ['DATAENTRY', 'QUALITYCONTROL', 'BUILDER', 'EXEC'];
var LineItemCategories = ['CIP', 'EXPENSE', 'WARRANTY'];

//Schema:

var schemas = {
	invoice: new Schema({
		serviceDate: Date,
		_vendor: reference('vendor'),
		invNum: { type: Number, required: true },
		lineItems: [{
			category: {type: String, enum: LineItemCategories},
			_hood: reference('hood'), // if EXPENSE: must be empty
			subHoods: [String], // if CIP or WARRANTY: can vary: null (i.e. unknown), hood, dev, or just a number. If EXPENSE: must be empty
			_activities: [reference('activity')], // if CIP starts as empty and gets filled. If EXPENSE or WARRANTY: must be empty
			_expense: reference('expense'), // if CIP or WARRANTY: must be empty
			amount: Money //required
		}],
		actions: [{
			category: { type: String, enum: ActionsCategoryEnum },
			comment: String,
			changes: String, //TODO: this for now, probably will change
			date: Now,
			_user: reference('user')
		}]
		//pdf or image upload - or link to dropbox file?
	}),

	vendor: new Schema({
		name: String
	}),

	user: new Schema({
		name: String,
		dropboxUid: Number,
		_invoiceQueue: [reference('invoice')],
		category: [{ type: String, enum: UserCategoryEnum }]
	}),

	activity: new Schema({
		code: Number,
		desc: String
	}),

	expense: new Schema({
		name: String
	}),

	hood: new Schema({
		name: String,
		dev: Boolean,
		hood: Boolean,
		numLots: Number
	}),

	bills: new Schema({
		_bills: [reference('invoice')]
	})
}


schemas['invoice'].virtual('total').get(function() {
	var total = 0;

	for (var category in this.entries) {
		for (var entry in this.entries[category]) {
			total += entry.amount;
		}
	}

	return total;
})



var models = {};

for (var key in schemas) {
	models[key] = mongoose.model(key, schemas[key])
}

module.exports = models;

