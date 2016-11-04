/**
 * TODO: Currently optimized for many invoices - i.e. individual parallel query from db
 * instead of returning entire set. This can be made easier.
 */

var async = require('async');
var mongoose = require('mongoose');
var _ = require('underscore');

const Group = require('../Models').Group;
const Invoice = require('../Models').Invoice;

/**
	 * Given an array of group IDs, callback an array of arrays of invoices
	 * corresponding with the queue of that group. IDs are not returned with the
	 * queues but the indices match
	 * 
	 * @param  {groupIds} Array of Mongoose IDs
	 * @param  {Function(err, queues)
	 *         	-> queues is array of { name: String, queue: Array of Invoices }
	 */
var getQueuesFromGroups = (groupIds, callback) => {
	var targetGroups = [];
	var queueMap = new Map();

	if (_.isEmpty(groupIds)) return callback(null, new Map())

	// get all groups
	Group.find({}, (err, allGroups) => {
		if (err) return callback(err, null);

		targetGroups = getTargetGroups(allGroups, groupIds);

		if (_.isEmpty(targetGroups)) {
			return callback(new Error('No group matches found for IDs ' + groupIds + '. They might be outdated or malformed'), null);
		}
		
		async.each(targetGroups, getGroupQueue, (err, queues) => {
			if (err) return callback(err, null);

			//Map queues to group names by matching indices:
			for (var i = 0; i < queues.length; i++) {
				queueMap[targetGroups[i]] = queues[i];
			}

			return callback(null, queueMap);			
		});
	});
}


/**
 * Get list of groups in allGroups that match an id from groupIds
 * 
 * @param  {ID} allGroups
 * @param  {ID} groupIds
 * @return {Array of Objects}
 */
function getTargetGroups(allGroups, groupIds) {
	var targetGroups = [];

	_.each(allGroups, (group) => {
		_.each(groupIds, (targetId) => {
			if (group._id.equals(targetId)) {
				targetGroups.push(group);
			}
		});
	});

	return targetGroups;
}

/**
 * Callback an array of invoices corresponding with the queue of given group
 * 
 * @param  {Group Object}   group
 * @param  {Function(err, invoices)} callback
 *          ->invoices: {array of Invoice Objects}
 */
var getGroupQueue = (group, callback) => {
	var invoiceIds = group._queue;

	async.each(invoiceIds, (invoiceId, callback) => {

		Invoice.findById(invoiceId, (err, invoice) => {
			console.log(err, invoice);

			if (err) {
				callback(err, null);
			} else if (!invoice) {
				callback(new Error('Cant find invoice ' + invoiceId + ' from group ' + group), null);
			} else {
				callback(null, invoice);
			}
		});
	}, callback);
}



module.exports = getQueuesFromGroups