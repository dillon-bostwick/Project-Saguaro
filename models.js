/* Dillon Bostwick 2016
 * 
 * Define all schema via Mongoose for MongoDB.
 * All models are exported under schema.models.
 * For example, to access the Invoice model,
 * schema.models.invoice
 */

 //TODO: Payable bills, archive (archive actually needs some logic - maybe a different schema? Different options for organization)

var mongoose = require('mongoose');
var _ = require('underscore');

var Schema = mongoose.Schema;

function reference(model) {
	return { type: String }; //Fuck - I gave up
}

var Money = { type: Number, min: 0, max: [150000, 'Amount cannot exceed 150K']};
var Now = { type: Date, default: Date.now };
var UserCategoryEnum = ['DATAENTRY', 'QUALITYCONTROL', 'BUILDER', 'EXEC'];
var LineItemCategories = ['CIP', 'EXPENSE', 'WARRANTY', 'HOA'];

//Schema:

var schemas = {
	invoice: new Schema({
		_id: String,
		serviceDate: Date,
		_vendor: String,
		invNum: String,
		amount: Money,
		lineItems: [{
			category: {type: String, enum: LineItemCategories},
			_hood: reference('hood'), // if EXPENSE: must be empty
			subHood: String, // if CIP or WARRANTY: can vary: null (i.e. unknown), hood, dev, or just a number. If EXPENSE: must be []]
			_activities: [reference('activity')], // if CIP starts as [] and gets filled. If EXPENSE or WARRANTY: must be []]
			_expense: reference('expense'), // if CIP or WARRANTY: must be ''.
			amount: Money, //required
			desc: String
		}],
		actions: [{
			desc: String,
			comment: String,
			date: Now,
			_user: String // ref
		}],
		file: {
			data: String, //data uri goes here
			name: String,
			type: String
		}
	}),

	vendor: new Schema({
		name: { type: String, required: true },
		active: Boolean
	}),

	user: new Schema({
		_id: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		_invoiceQueue: [reference('invoice')],
		canCreate: Boolean,
		canOverride: Boolean,
		isAdmin: Boolean,
		_group: reference('group'),
		currentToken: String
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
		shortHand: { type: String, required: true },
		subHoodOptions: [String]
	}),

	group: new Schema({
		name: String,
		pipelineIndex: Number,
		_nextGroup: reference('group'), // or null for bill
		isHead: Boolean
	})
}


schemas.invoice.virtual('total').get(function() {
	var total = 0;

	//Have to do it manually
	for (var category in this.entries) {
		for (var entry in this.entries[category]) {
			total += entry.amount;
		}
	}

	return total;
})

schemas.invoice.set('versionKey', false);
schemas.user.set('versionKey', false);


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

