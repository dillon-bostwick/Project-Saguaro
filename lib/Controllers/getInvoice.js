/**
 * TODO: everything!!
 */

var async = require('async');

const Invoice = require('../models/invoice');
const DropboxHandler = require('../dropboxHandler')
const globals = require('./globals')

var getInvoice = (req, res, next) => {
	var id = req.params.id;
	var user = req.user;
	var dropboxToken = globals.testingMode : user.currentToken ? globals.dropboxTestToken
	var dropboxConnection = new DropboxHandler(dropboxToken);

	if (!id) {
		res.sendStatus(400);
	}

	//Async query dropbox for file link

	async.parallel({

		getInvoiceObject: (callback) => {
			Invoice.findById(id, function(err, invoice) {
				if (err) {
					throw err;
				} else if (!invoice) {
					res.sendStatus(404);
				} else if (invoice.isNew && !user.canCreate) {
					res.send(403).json({ error: 'You do not have permission to key new invoices' });
				} else {
					callback(null, invoice)
				}
			})
		},

		getLinkFromDropbox: (callback) =>  {
			//dropbox method callback already has same args desired by async
			dropboxConnection.getLink(id, callback);
		}

	}, function(err, asyncResults) {
		if (err) throw err;



		res.json({
			file: asyncResults.getLinkFromDropbox,
			invoice: asyncResults.getInvoiceObject
		});
	});
}

module.exports = getInvoice;





