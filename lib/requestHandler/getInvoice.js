/**
 * TODO: debug everything!!
 */

var mongoose = require('mongoose');
var models = require('../models')

var getInvoice = function(req) {
	console.log(req)

	if (!body.id) {
		return { statusCode: 400 }
	}

	console.log(models);

	models.invoice.findById(body.id, function(error, data) {
		if (error) {
			//could be 404 or maybe 422?
			console.log(error);
			console.log({ error: error });
		} else {
			//if user cankey != isnew, 403
			//isnew ? return dropbox fileId (or maybe just path) : return entire inv object
		}
	});
}

module.exports = getInvoice;