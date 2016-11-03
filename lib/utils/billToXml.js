/**
 * Given an invoice object, return a QbXml string.
 */

var xmlBuilder = require('xmlbuilder');

var billToQbXml = (invoice) => {
	//get vendor name
	var vendorName = '';
	var today = new Date();

	var expenses = _.each()


	var qbXml = builder.create('QBXML', { version: '1.0'})
					 .instruction('qbxml', 'version=13.0')
					 .ele('QBXLMMsgsRq', { 'onError': 'stopOnError' })
					 	.ele('IBillAdd', { 'requestID': invoice._id })
				 			.ele('RefNumber')
				 				.text(invoice.invNum)
					 		.ele('VendorRef')
					 			.ele('FullName')
					 				.text(vendorName)
					 		.ele('TxnDate')
				 				.text(today)
				 			.ele('memo')
				 				.text('Added by Saguaro for Brightwater Homes')

					 .end();

	return qbXml;
}

module.exports = billToQbXml;