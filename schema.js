var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectID = mongoose.Schema.ObjectId;




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

var Invoice = mongoose.model('Invoice', invoiceSchema);
var Vendor = mongoose.model('Vendor', vendorSchema);
var User = mongoose.model('User', userSchema);
var Activity = mongoose.model('Vendor', vendorSchema);
var Hood = mongoose.model('Hood', hoodSchema);
var archivedInvoice = mongoose.model('archivedInvoice', invoiceSchema);

module.exports = Invoice;
module.exports = Vendor;
module.exports = User;
module.exports = Activity;
module.exports = Hood;