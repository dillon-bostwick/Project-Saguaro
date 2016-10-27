/*
 * submitInvoice(request, callback)
 *
 * params:
 *	  invoice: (Object) This is a 1:1 map of invoice in database
 *
 *	  meta: Object
 *       -> _user: (String) Mongo ID of request submitter
 *		 -> isNew: (Boolean) used to assert a db lookup error. Request will fail
 *                 if this doesn't correlate with existence of invoice id in
 *				   database
 *		
 *	  callback: function(error)
 *       -> error: Object or null
 *
 * returns void
 *
 * NOTE: more elements can be added to meta later such as if pipeline override
 * feature must be implemented, or if a fileUri must get passed from frontend
 * for a browser-based file upload
 */
var submitInvoice = function(invoice, meta, callback) {
	var validationError = validateInvoice(invoice);

	if (validationError) {
		throw new Error(validationError);
	}

	//TODO: STEPS (and this will require carefully navigating callback hell)

	//lookup in database
	//fail if isNew !== (id in db)

	//get pipeline from database

	//find next pipeline

	//push to queue of all next pipeline

	//if new, then move dropbox file to appropriate location

	//DropboxID should be generated for the invoice here, and NOT on the frontend


	//..... execute callback(error) when finished

	catch(error) {
		callback(error);
		return;
	} finally {
		callback(null);
	}
}

/* validateInvoice(invoice)
 *
 * param:
 *	invoice: (Object) invoice object to be evaluated
 *
 * actions:
 *  throws an error if validation of invoice object fails. Purpose is for
 *  preliminary backend validation in case client sends bad object.
 *
 * returns String describing an error, or null if validation passes
 */
function validateInvoice(invoice) {
	//TODO
}

/* findOrCreate(invoiceId)
 *
 * params:
 *   invoiceId: (String)
 *   callback: function(error, createdNew)
 *      -> error: Object or null
 *      -> createdNew: (Boolean) true if invoice did not already exist
 *
 * actions:
 *   If the invoice _id exists in the database, will update the old invoice to
 *   match the one passed. Otherwise, will create a new document in the database
 *   for that invoice.
 *
 * returns void
 */
function findOrCreate(invoice, callback) {
	//TODO
}

/* getNextInPipeline(userId)
 *
 * params:
 *   submitterId: (String) Mongo reference id of submitting user
 *   callback: function(error, receiverId)
 *      -> error: (Object or null) if Mongo lookup fails
 *      -> receiverId: (String) Mongo id of user that is next in pipeline
 * 
 * returns: Mongo reference id of user to receive the invoice
 */
function getNextUserInPipeline(submitterId, callback) {
	//TODO
}

/* pushToUserQueue(userId)
 *
 * params:
 *   userId: String
 *   callback: function(error)
 *      -> error: Object or null
 *
 * returns: void
 */
function pushToUserQueue(userId, callback) {
	//TODO
}

/* popFromUserQueue(userId)
 *
 * params:
 *   userId: String
 *   callback: function(error)
 *      -> error: Object or null
 *
 * returns: void
 */
function popFromUserQueue(userId, callback) {
	//TODO
}


module.exports = submitInvoice;
