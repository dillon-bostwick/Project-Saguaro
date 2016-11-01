/**
 * TODO: Deep debug!
 */

var async = require('async');

const Invoice = require('../models/invoice');
const DropboxHandler = require('../dropboxHandler')
const globals = require('../globals')

var getInvoice = (req, res, next) => {
	var id = req.params.id;
	var user = req.user;
	var dropboxToken = globals.testingMode ? globals.dropboxTestToken : user.currentToken;
	var dropboxConnection = new DropboxHandler(dropboxToken);

	if (!id) {
		res.sendStatus(400);
	} 

	async.parallel([
		Invoice.findById(id, function(err, invoice) {
			if (err) {
				return next(err);
			} else if (!invoice) {
				res.sendStatus(404);
			} else if (invoice.isNew && !user.canCreate) {
				res.send(403).json({ error: 'You do not have permission to key new invoices' });
			} else {
				res.json(invoice);
			}
		}),

		dropboxConnection.getLink('/sampleinvoice.pdf', )




	])

	
}

module.exports = getInvoice;





