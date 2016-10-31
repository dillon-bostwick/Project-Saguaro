/**
 * TODO: everything!!
 */

const Invoice = require('../models/invoice');

var getInvoice = function(req) {
	var id = req.params.id;
	var user = req.user;

	if (!id) {
		return { statusCode: 400 }
	}

	Invoice.find({}, function(error, invoice) {
		if (error) {
			console.log(error);
			//could be 404 or maybe 422?
		} else {
			if (invoice.isNew && !user.canCreate) {
				return {
					statusCode: 403,
					errors: ['You do not have permission to key new invoices']
				}
			} else {
				return {
					statusCode: 200,
					data: invoice.isNew ? { fileId: invoice.fileId } : invoice
				}
			}
		}
	});
}

module.exports = getInvoice;