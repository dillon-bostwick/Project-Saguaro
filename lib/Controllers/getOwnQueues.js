/**
 * Only need user from req - no custom params
 *
 * res.queues is an array of Objects of the form:
 * {
 * 		name: String,
 * 		invoices: array if invoice Objects
 * }
 * 
 * NOTE:
 * 		Dropbox has a 'dropzone' directory for every file that hasn't
 * 		been keyed yet. All users where canKey==true have a 'to key from dropzone'
 * 		queue that corresponds with the files in that directory. The way this is
 * 		implemented is that brand new files in the 'dropzone' directory become
 * 		invoices, i.e. they are added to database, when a user with canKey==true
 * 		requests getOwnQueues. This makes sense - the first time anyone will ever
 * 		need to see the invoices is when they are being keyed.
 *
 * Possible client errors: 
 * 
 */

var _ = require('underscore');

const Invoice = require('../models/invoice');
const Group = require('../models/group')
const DropboxHandler = require('../dropboxHandler')
const globals = require('../globals')

var getOwnQueues = (req, res, next) => {
	var user = req.user;
	var queues = [];

	var tasks = user.canKey ? [getKeyableInvoices, getQueuesFromGroups]
						    : [getQueuesFromGroups];

	async.parallel(tasks, (err, results) => {
		if (err) next(err);

		res.json(results);
	});
}

getQueuesFromGroups = (groupIds) => {
	return (callback) => {

	}
}

getQueuesFromGroups(groupIds)(callback);

////////////////////////////////////////////////////////////////////////////////

/**
 * [getQueuesFromGroups description]
 * @param  {[type]}   groupIds [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var getQueuesFromGroups = (groupIds, callback) => {
	//Get group via group id from user.
	async.each(user._groups, (groupId, groupCb) => {
		Group.findById(groupId, (err, group) => {
			if (err) groupCb(err, null);

			//On response get invoice via invoice id from group
			async.each(group._queue, Invoice.findById(invoiceId, invoiceCb), groupCb);
		});
	},
	callback
}

////////////////////////////////////////////////////////////////////////////////

/**
 * [getKeyableInvoices description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var getKeyableInvoices = (callback) => {

}


/**
 * [loadNewFromDropzone description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function loadNewFromDropzone(callback) {
	callback(null);
}









module.exports = getOwnQueues;