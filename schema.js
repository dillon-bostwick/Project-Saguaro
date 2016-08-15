/* Define all schema via Mongoose for MongoDB.
 * All models are exported under schema.models.
 * For example, to access the Invoice model,
 * schema.models.invoice
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectID = mongoose.Schema.ObjectId;

//Schema:

var invoiceSchema = new Schema({
	vendor: ObjectID,
	created: Date,
	amount: { type: Number, min: 0},
	memo: String,
	activities: [ObjectID],
	hoods: [ObjectID],
	currentQueue: ObjectID,
	comments: [{
		body: String, 
		date: Date, 
		user_ID: ObjectID,
		shortPay: Boolean,
		backCharge: Boolean}]
	//pdf upload
})

var userSchema = new Schema({
	name: String,
	password: String,
	invoiceQueue: [ObjectID]
})

var vendorSchema = new Schema({
	name: String
})

var activitySchema = new Schema({
	code: Number,
	desc: String
})

var hoodSchema = new Schema({
	name: String
})

//Should payableBills (just an array of invoice IDs) be a schema? it has to be a collection...

//All the models go in .models

module.exports.models = {
	invoice: mongoose.model('Invoice', invoiceSchema),
	vendor: mongoose.model('Vendor', vendorSchema),
	user: mongoose.model('User', userSchema),
	activity: mongoose.model('Vendor', vendorSchema),
	hood: mongoose.model('Hood', hoodSchema),
}