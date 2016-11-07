/**
 * Given an invoice object, return a QbXml string.
 *
 * Test this out
 */

var builder = require('xmlbuilder');
var _ = require('underscore');

var billToQbXml = (invoice) => {
	// run a few util.dereference(invoice) on invoice!

	var invoice = {
		invNum: '123Foo',
		vendor: 'Marsi Bostwick ~ NT'
	}

	var expenseLines = _.filter(invoice.lineItems, (lineItem) => {
		return lineItem.category === 'EXPENSE' ||
			   lineItem.category === 'WARRANTY';
	});

	var itemLines = _.where(invoice.lineItems, { category: 'CIP' });


	var qbXml = builder.create('QBXML', { version: '1.0'})
					 .instruction('qbxml', 'version="13.0"')
                     .ele('QBXMLMsgsRq', { onError: 'continueOnError' })
                        .ele('BillAddRq', { requestID: '3' })
                            .ele('BillAdd')
                                .ele('VendorRef')
                                    .ele('FullName')
                                        .text(invoice.vendor)
                                    .up()
                                .up()
                                .ele('RefNumber')
                                    .text(invoice.invNum)
                                .up()
	
	_.each(expenseLines, (expenseLine) => {
		qbXml = qbXml.ele('ExpenseLineAdd')
						.ele('AccountRef')
                            .ele('FullName')
                                .text(expenseLine.expense)
                            .up()
                        .up()
                        .ele('Amount')
                            .text(expenseLine.amount)
                        .up()
                        .ele('Memo')
                            .text(expenseLine.desc)
                        .up()
                    .up()
	});
                                    
	_.each(itemLines, (itemLine) => {
		qbXml = qbXml.ele('ItemLineAdd')
						.ele('ItemRef')
                            .ele('FullName')
                                .text(itemLine.activities[0].desc)
                            .up()
                        .up()
                        .ele('Desc')
                            .text(itemLine.desc)
                        .up()
                        .ele('Amount')
                            .text(itemLine.amount)
                        .up()
                        .ele('CustomerRef')
                            .ele('FullName')
                                .text([itemLine.hood, itemLine.subHood].join(' '))
                            .up()
                        .up()
                    .up()
	});                                    

	return qbXml.end();
}

module.exports = billToQbXml;