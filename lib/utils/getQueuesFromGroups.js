var async = require('async');
var mongoose = require('mongoose');
var _ = require('underscore');

const Group = require('../models/group');
const invoice = require('../models/invoice');

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

	if (_.isEmpty(groupIds)) return callback(null, [])

	// get all groups
	Group.find({}, (err, allGroups) => {
		if (err) return callback(err, null);

		targetGroups = getTargetGroups(allGroups, groupIds);

		if (_.isEmpty(targetGroups)) {
			return callback('No group matches found. IDs might be outdated or malformed', null);
		}

		async.each(targetGroups, getGroupQueue, (err, queues) => {
			if (err) return callback(err, null);
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
			return (err || !invoice) 
					? callback(err, 'Cant find invoice ' + invoiceId)
					: callback(null, invoice);
		});
	}, callback);
}



module.exports = getQueuesFromGroups