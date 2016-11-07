/**
 * Given an invoice Object or just an invoice Id, return a new Object with no
 * ids referencing other objects - for example
 * _vendor: 83720 becomes
 * vendor: { name: 'foo' }
 *
 * callback form: (err, invoice)
 *
 *
 *
 *
 *
 * Just use mongoose population
 */

var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');
var clone = require('clone');

const Invoice = require('../Models/invoice');
const Vendor = require('../Models/vendor');
const User = require('../Models/user');
const Hood = require('../Models/hood.js');
const Activity = require('../Models/activity.js');

//todo expense


var dereferenceInvoice = (invoiceOrInvoiceId, callback) => {
	try {
		if (mongoose.Types.ObjectId.isValid(invoiceOrInvoiceId)) {
			//first arg is an Id
			Invoice.findById(invoiceOrInvoiceId, (err, invoice) => {
				if (err) throw err
				if (!invoice) throw new Error('No invoice found');

				return doDereference(invoice, callback);
			})
		} else if (_.isObject(invoiceOrInvoiceId)) {
			//assume first arg is invoice object
			var invoiceCopy = clone(invoiceOrInvoiceId);
			return doDereference(invoiceCopy, callback);
		} else {
			throw new Error('Improper argument');
		}
	} catch(err) {
		callback(err, null)
	}
}

/**
 * @param  {Invoice} - invoice will mutate. Only pass a deep copy
 * @param  {Function(err, invoice)}
 */
function doDereference(invoice, callback) {
	var getVendor = (callback) => {
		Vendor.findById(invoice._vendor, (err, vendor) => {
			if (err) throw err;
			if (!vendor) throw new Error('Cant find vendor ' + invoice._vendor);

			invoice.vendor = vendor;
			delete invoice._vendor;
			return callback(err, vendor);
		});
	}

	var getLineItems = (callback) => {
		if (_.isEmpty(invoice.lineItems)) callback(null);

		async.each(invoice.lineItems, (lineItem, callback) => {
			async.parallel([
				//get hood
				(callback) => {
					Hood.findById(lineItem._hood, (err, hood) => {
						if (err) throw err;
						if (!hood) throw new Error('Cant find hood ' + lineItem._hood);

						lineItem.hood = hood;
						delete lineItem._hood;
						return callback(null);
					})
				},

				(callback) => {
					Expense.findById(lineItem._expense, (err, expense) => {
						if (err) throw err;
						if (!hood) throw new Error('Cant find expense ' + lineItem._hood);

						lineItem.expense = expense;
						delete lineItem._expense;
						return callback(null);
					})
				},

				//get all activities
				(callback) => {
					async.each(lineItem._activities, (err, _activity) => {
						Activity.findById(_activity, (err, activity) => {
							if (err) throw err;
							if (!actvitity) throw new Error('Cant find activity ' + _activity);

							return callback(err, activity);
						})
					}, (err, activities) => {
						if (err) throw error;

						lineItem.activities = activities;
						delete lineItem._activities;
						return callback(null);
					})
				}
			], callback);
		})
	}

	var getActions = (callback) => {
		if (_.isEmpty(invoice.actions)) callback(null);

		async.each(invoice.actions, (action, callback) => {
			User.findById(action._user, (err, user) => {
				if (err) throw err;
				if (!user) throw new Error('Cant find user ' + action._user);

				action.user = user;
				delete action._user;
				return callback(null);
			})
		}, callback);
	}

	async.parallel({
		vendor: getVendor,
		lineItems: getLineItems,
		actions: getActions
	}, (err) => {
		return callback(err, invoice);
	});
}

module.exports = dereferenceInvoice;