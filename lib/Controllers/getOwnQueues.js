/**
 * Only need user from req - no custom params
 *
 * res.queues is an array of Objects of the form: { name: String, invoices:
 * array of invoice Objects }
 *
 * NOTE: Dropbox has a 'dropzone' directory for every file that hasn't been
 * keyed yet. All users where canKey==true have a 'to key from dropzone' queue
 * that corresponds with the files in that directory. The way this is
 * implemented is that brand new files in the 'dropzone' directory become
 * invoices, i.e. they are added to database, when a user with canKey==true
 * requests getOwnQueues. This eliminates the need for WebHoooks and server-side
 * workers, while also preventing any loss of resources - the first time anyone
 * will ever need to see the invoice object is when they are being keyed.
 *
 * Possible client errors: none. Due to nature of request any error is 500
 */

var _ = require('underscore');

const Invoice = require('../models/invoice');
const Group = require('../models/group');
const utils = require('../utils')

var getOwnQueues = (req, res, next) => {
	var user = globals.testingMode ? globals.testUser : req.user;

	var tasks = user.canKey ? [getKeyQueue, getGroupsQueues]
						    : [getGroupsQueues];

	async.parallel(tasks, (err, results) => {
		err ? next(err) : res.json(results);
	});
}

////////////////////////////////////////////////////////////////////////////////


//Get group via group id from user.
var getGroupsQueues = (callback) => {
	utils.getQueuesFromGroups(user._groups, callback);
};

//
var getKeyQueue = (callback) => {
	utils.loadNewFromDropzone(user.currentToken, (err) => {
		if (err) callback(err, null);

		//No manual error handling necessary - ok if response is empty:
		Invoice.query({ toKey: true }, callback);
	});
};




module.exports = getOwnQueues;