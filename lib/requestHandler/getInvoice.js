/**
 * TODO: debug everything!!
 */

var mongoose = require('mongoose');
var models = require('../models')

var getInvoice = function(body, user) {
	if (!core.isValidRequest(['id'])) {
		return {
			statusCode: 400
		};
	}

	models.findById(body.id, function(error, data) {
		if (error) {
			return {
				statusCode: 404
			};
		} else {
			//if user cankey != isnew, 403
	//isnew ? return dropbox fileId (or maybe just path) : return entire inv object
		}
	});

	return {
		statusCode: 500
	};
}

module.exports = getInvoice;