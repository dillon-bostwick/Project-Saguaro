/**
 * TODO: Deep debug!
 */

const Invoice = require('../models/invoice');

var getInvoice = (req, res, next) => {
	var id = req.params.id;
	var user = req.user;

	if (!id) {
		res.sendStatus(400);
	} 

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
	});
}

module.exports = getInvoice;





