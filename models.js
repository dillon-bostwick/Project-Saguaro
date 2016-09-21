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
var ActionsCategoryEnum = ['SHORTPAY', 'BACKCHARGE', 'DNP', 'HOODUPDATE', 'LOTUPDATE', 'PARTIALDNP', 'HOLD', 'COMMENT'];
var UserCategoryEnum = ['DATAENTRY', 'QUALITYCONTROL', 'BUILDER', 'EXEC'];

//Schema:

var schemas = {
	invoice: new Schema({
		createdDate: Now,
		serviceDate: Date,
		_vendor: reference('vendor'),
		invNum: Number,
		memo: String,
		_createdBy: reference('user'),
		_reviewers: [reference('user')],
		lineItems: {
			cips: [{
				_hood: reference('hood'),
				subHoods: [String], // can vary: nullable, or an enum, or just a number
				_activities: [reference('activity')], // must have at least one, but can be many
				amount: Money
			}],
			expenses: [{
				_expense: reference('expense'),
				amount: Money
			}],
			warrants: [{
				_hood: reference('hood'),
				subHoods: [
					{name: String
				}], // can vary: nullable, or an enum, or just a number
				amount: Money
			}],
		},
		actions: [{
			category: [{ type: String, enum: ActionsCategoryEnum }],
			comment: String,
			date: Now,
			_user: reference('user')
		}]
		//pdf or image upload - or link to dropbox file?
	}),

	vendor: new Schema({
		name: String
	}),

	user: new Schema({
		//validation
		name: String,
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

