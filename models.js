/* Define all schema via Mongoose for MongoDB.
 * All models are exported under schema.models.
 * For example, to access the Invoice model,
 * schema.models.invoice
 */

 //TODO: Payable bills, archive (archive actually needs some logic - maybe a different schema? Different options for organization)

var mongoose = require('mongoose');
var _ = require('underscore');

var Schema = mongoose.Schema;

function reference(model) {
	return { type: mongoose.Schema.ObjectId, ref: model };
}

var Money = { type: Number, min: 0, max: [150000, 'Amount cannot exceed 150K'], required: true };
var Now = { type: Date, default: Date.now };
var ActionsCategoryEnum = ['CREATED', 'SHORTPAY', 'BACKCHARGE', 'DNP', 'HOODUPDATE', 'LOTUPDATE', 'PARTIALDNP', 'HOLD', 'APPROVED'];
var UserCategoryEnum = ['DATAENTRY', 'QUALITYCONTROL', 'BUILDER', 'EXEC'];
var LineItemCategories = ['CIP', 'EXPENSE', 'WARRANTY'];

//Schema:

var schemas = {
	invoice: new Schema({
		serviceDate: { type: Date, required: true },
		_vendor: String,
		invNum: { type: String, required: true },
		lineItems: [{
			category: {type: String, enum: LineItemCategories, required: true },
			_hood: reference('hood'), // if EXPENSE: must be empty
			subHoods: [String], // if CIP or WARRANTY: can vary: null (i.e. unknown), hood, dev, or just a number. If EXPENSE: must be []]
			_activities: [reference('activity')], // if CIP starts as []] and gets filled. If EXPENSE or WARRANTY: must be []]
			_expense: reference('expense'), // if CIP or WARRANTY: must be ''.
			amount: Money //required
		}],
		actions: [{
			category: { type: String, enum: ActionsCategoryEnum, required: true },
			comment: String,
			changes: String, //TODO: this for now, probably will change
			date: Now,
			_user: reference('user')
		}]
		//pdf or image upload - or link to dropbox file?
	}),

	vendor: new Schema({
		name: { type: String, required: true }
	}),

	user: new Schema({
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		dropboxUid: { type: Number, required: true },
		_invoiceQueue: [reference('invoice')],
		category: { type: String, enum: UserCategoryEnum, required: true }
	}),

	activity: new Schema({
		code: { type: Number, required: true },
		desc: String
	}),

	expense: new Schema({
		name: { type: String, required: true }
	}),

	hood: new Schema({
		name: { type: String, required: true },
		devable: Boolean,
		hoodable: Boolean,
		numLots: { type: Number, required: true }
	}),

	bills: new Schema({
		_bill: reference('invoice'),
	})
}


schemas['invoice'].virtual('total').get(function() {
	var total = 0;

	//Have to do it manually
	for (var category in this.entries) {
		for (var entry in this.entries[category]) {
			total += entry.amount;
		}
	}

	return total;
})


//Everything is required:
module.exports = _.map(schemas, function(schema, key) {
	_.each(schema, function(elem, key) {
		elem = ({
			type: elem,
			required: true
		})
	})

	return mongoose.model(key, schema);
})

