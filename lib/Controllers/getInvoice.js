/**
 * TODO: everything!!
 */

var async = require('async');

const Invoice = require('../models/invoice');
const DropboxHandler = require('../dropboxHandler')

var getInvoice = (req, res, next) => {
	var id = req.params.id;
	var user = req.user;
	var dropboxConnection = new DropboxHandler(user.currentToken)

	if (!id) {
		res.sendStatus(400);
	}

	//Async query dropbox for file link

	Invoice.findById(id, function(err, invoice) {
		if (err) {
			throw err;
		} else if (!invoice) {
			res.sendStatus(404);
		} else if (invoice.isNew && !user.canCreate) {
			res.send(403).json({ error: 'You do not have permission to key new invoices' });
		} else {
			res.json(invoice.isNew ? { fileLink: 'stub' } : invoice);
		}
	});
}

module.exports = getInvoice;

async.parallel({
	getInvoice: {},
	getDropboxLink: {}
}, function(err, results) {
	if (err) throw err;

	console.log(results);
})