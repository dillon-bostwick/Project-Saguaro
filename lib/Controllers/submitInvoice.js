/**
 *
 * Possible client errors: 400, 403, 404, 422
 */

var mongoose = require('mongoose');

const Invoice = mongoose.model('Invoice');

var submitInvoice = function(req, res, next) {
	var newInvoice = req.body.invoice;
	var valErr;

	if (!newInvoice) { // malformed request (i.e. pre deeper validation)
		res.sendStatus(400);
		return;
	}

	(new Invoice(newInvoice)).validate((err) => { // custom logical validation
		if (err) {
			res.status(422).send(err);
			return;
		}

		locateInvoice((err, currentGroup) => {
			if (err) {
				res.status(403).send(err); // user not allowed to submit invoice
				return
			}

			Invoice.findById(newInvoice._id, (err, oldInvoice) => {
				if (err) {
					next(err);
					return;
				} else if (!oldInvoice) { // invoice not found
					res.sendStatus(404);
					return;
				}

				valErr = validateAgainstCustoms(oldInvoice, newInvoice, req.user, currentGroup); // custom user-requirements validation

				if (valErr) {
					res.status(403).send(valErr);
					return;
				}

				moveInvoice(newInvoice, currentGroup, (err) => {
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
function validateAgainstCustoms(oldInvoice, newInvoice, user, group) {
	return null; // string if error, null if pass
}

/**
 * [checkUserQueue description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function locateInvoice(callback) {

	//null seecond argument ALWAYS means that it is in fact in user's own queue.
	callback(null, { id: 'foo' });
};

/**
 * [moveInvoice description]
 * @param  {[type]}   existingInvoice [description]
 * @param  {[type]}   currentGroup    [description]
 * @param  {Function} callback        [description]
 * @return {[type]}                   [description]
 *
 * Callback signature only has err argument
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

	callback(null, null);
}




