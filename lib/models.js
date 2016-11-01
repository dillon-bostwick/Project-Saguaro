/* Dillon Bostwick 2016
 * 
 * Boilerplate for defining Mongoose models.
 *
 * TODO: the more logic-heavy models shouldn't be in boilerplate. Give them
 * their own file - you don't need to set module.exports! Mongoose will remember
 * all model definitions without exporting -- but unfortunately some controller
 * code still uses this old way so you will have to refactor to read straight
 * from the Mongoose object.
 */

var mongoose = require('mongoose');
var _ = require('underscore');

const Schema = mongoose.Schema;

const Money = { type: Number, min: 0, max: [150000, 'Amount cannot exceed 150K']};
const Now = { type: Date, default: Date.now };
const UserCategoryEnum = ['DATAENTRY', 'QUALITYCONTROL', 'BUILDER', 'EXEC'];

var models = {};

//Schema:

var schemas = {
	vendor: new Schema({
		name: { type: String, required: true },
		active: Boolean
	}),

	user: new Schema({
		_id: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		_invoiceQueue: [String],
		canCreate: Boolean,
		canOverride: Boolean,
		isAdmin: Boolean,
		_group: String,
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
		_nextGroup: String, // or null for bill
		isHead: Boolean
	})
}


// overriding versioning for schema with mutable arrays
schemas.user.set('versionKey', false);



_.each(schemas, function(schema, key) {
	models[key] = mongoose.model(key, schema);
})

module.exports = models

