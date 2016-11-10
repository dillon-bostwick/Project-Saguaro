/**
 * billToQbXml.js
 *
 * by Dillon Bostwick
 */

var builder = require('xmlbuilder');
var Money = require('js-money');
var copy = require('deep-copy')
var _ = require('underscore');


/**
 * Given a populated invoice object, return a QbXml string.
 *
 * qbXML reference:
 * https://developer-static.intuit.com/qbsdk-current/common/newosr/index.html
 * 
 * @param  {Object} populatedInvoice [Must be already populated when called]
 * @param  {String or Number} requestId [Useful for sending series of requests]
 * @return {String} [The valid qbXml to be sent directly to QuickBooks SDK]
 */
var billToQbXml = (populatedInvoice, requestId) => {
    if (!_.isString(requestId)) requestId = requestId.toString();

    populatedInvoice = copy(populatedInvoice); // in case a reference is passed

    var cipLines = _.where(populatedInvoice.lineitems, { category: 'CIP' });
    var warrantyLines = _.where(populatedInvoice.lineItems, { category: 'WARRANTY' });

    // Final lines to be exported to QuickBooks as 'bill' lines. Warranty lines
    // don't have activities so don't need flattenByActivities, so qbItemLines
    // includes both the flattened cipLines and the warrantyLines.
    // qbExpenseLines are simply EXPENSE lineItems without further modification
    var qbExpenseLines = _.where(populatedInvoice.lineItems, { category: 'EXPENSE' });
    var qbItemLines = flattenByActivities(cipLines).concat(warrantyLines);

    // General invoice metadata
	var qbXml = builder.create('QBXML', { version: '1.0'})
					 .instruction('qbxml', 'version="13.0"')
                     .ele('QBXMLMsgsRq', { onError: 'continueOnError' })
                        .ele('BillAddRq', { requestID: requestId })
                            .ele('BillAdd')
                                .ele('VendorRef')
                                    .ele('FullName')
                                        .text(populatedInvoice._vendor.name)
                                    .up()
                                .up()
                                .ele('RefNumber')
                                    .text(populatedInvoice.invNum)
                                .up()
	
    // Add QB expense lines
	_.each(qbExpenseLines, (expenseLine) => {
		qbXml.ele('ExpenseLineAdd')
				.ele('AccountRef')
                    .ele('FullName')
                        .text(expenseLine._expense.name || 'Uncategorized Expenses')
                    .up()
                .up()
                .ele('Amount')
                    .text(expenseLine.amount)
                .up()
                .ele('Memo')
                    .text(expenseLine.desc || 'no memo')
                .up()
            .up()
	});

    // Add QB item lines
	_.each(qbItemLines, (itemLine) => {
		qbXml.ele('ItemLineAdd')
				.ele('ItemRef')
                    .ele('FullName')
                        .text(itemLine.activity || 'Warranty')
                    .up()
                .up()
                .ele('Desc')
                    .text(itemLine.desc || 'no memo')
                .up()
                .ele('Amount')
                    .text(itemLine.amount)
                .up()
                .ele('CustomerRef')
                    .ele('FullName')
                        .text([itemLine._hood.shortHand, itemLine.subHood].join(' '))
                    .up()
                .up()
            .up()
	});                                    

	return qbXml.end();
}

/**
 * Given an array of lines with a nested array of activities, flatten to
 * an array of lines with only a single activity per line. The amount of the old
 * line is divvied among the new lines.
 * 
 * @param  {Array of database-style line items} nonExpenseLines
 * @return {Array of QuickBooks-style lines}
 */
function flattenByActivities(cipLines) {
    var qbItemLines = [];
    var shares;
    var qbItemLine;

    _.each(cipLines, (line) => {
        if (_.isEmpty(line._activities)) {
            qbItemLine = line;

            line.activity = 'No activity';

            delete qbItemLine._activities;

            qbItemLines.push(qbItemLine);
        } else {
            sharesDivvied = divvyAmount(line.amount, line._activities.length);

            _.each(line._activities, (activity, i) => {
                qbItemLine = line;

                qbItemLine.activity = activity;
                qbItemLine.amount = sharesDivvied[i];

                delete qbItemLine._activities;

                qbItemLines.push(qbItemLine);
            })
        }
    })

    return qbItemLines;
}

/**
 * Returns array of amounts by divying up the amount by the quantity of
 * receivers. Rounds to the nearest cent while still accounting for rounding
 * errors due to remainders. In this case each final amount should never deviate
 * by more than a cent
 *
 * Accurate rounding is acheived with the Money.allocate method. See docs here:
 * https://www.npmjs.com/package/js-money
 * 
 * @param  {Number} amount    [ amount to divide]
 * @param  {Number} quantity  [integer - number of receivers]
 * @return {Array of Numbers} [how much each receiver gets]
 */
function divvyAmount(amount, quantity) {
    // Get array of Moneys
    var divvyedMoneys = (Money.fromDecimal(amount, Money.USD))
                        .allocate(Array(quantity).fill(1));

    // The amount property of a Money is an integer representing cents
    return _.map(divvyedMoneys, (divvyedMoney) => {
        return divvyedMoney.amount / 100;
    })
}

module.exports = billToQbXml;