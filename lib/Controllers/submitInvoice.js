/**
 *
 * Possible client errors: 400, 403, 404, 422
 */

var mongoose = require('mongoose');

const Invoice = mongoose.model('Invoice');

var submitInvoice = function(req, res, next) {
	var newInvoice = req.body.invoice;

	if (!newInvoice) {
		res.sendStatus(400);
		return;
	}

	newInvoice.validate((err) => {
		if (err) {
			res.status(422).send(err);
			return;
		}

		checkUserQueue((err, currentGroup) => {
			if (err) {
				res.status(403).send(err);
				return
			}

			var valErr = validateAgainstCustoms(newInvoice, req.user, currentGroup);

			if (valErr) {
				res.status(403).send(valErr);
				return;
			}

			Invoice.findById(req.invoice._id, (err, oldInvoice) => {
				if (err) {
					next(err);
					return;
				} else if (!oldInvoice) {
					res.sendStatus(404);
					return;
				}

				moveInvoice(req.invoice, currentGroup, (err) => {
					if (err) {
						res.status(err.statusCode).send(err.message); // multiple possible error codes - see moveInvoice definition
					} else {
						res.sendStatus(200);
					}
				});
			});
		})
	});
}

module.exports = submitInvoice;

/**
 * [validateAgainstCustoms description]
 * @param  {[type]} invoice [description]
 * @param  {[type]} user    [description]
 * @param  {[type]} group   [description]
 * @return {[type]}         [description]
 */
function validateAgainstCustoms(invoice, user, group) {

	return 'foo';
}

/**
 * [checkUserQueue description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function checkUserQueue(callback) {

	callback(null, { id: 'foo' });
};

/**
 * [moveInvoice description]
 * @param  {[type]}   existingInvoice [description]
 * @param  {[type]}   currentGroup    [description]
 * @param  {Function} callback        [description]
 * @return {[type]}                   [description]
 */
function moveInvoice(newInvoice, currentGroup, callback) {
	// is ready to bill?
	// 		parse to qbxml and then add to bill in db
	// 		Move to archives in dropbox
	// 	else
	// 		pop from the current group / isnew = false / pop from current queue, then
	// 		push to the right next place (possibility of 404ing)

	var err = {
		statusCode: 420,
		message: 'foo'
	}

	callback(err, null);
}




