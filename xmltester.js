/**
 * https://developer-static.intuit.com/qbsdk-current/common/newosr/index.html
 *
 * Notes re qbXML:
 *     - Node order matters
 *     - OSR syntax is not 1:1, so you have to find other examples
 *     - The validator is deprecated so debugging is guessing
 */


var builder = require('xmlbuilder');

inputXML = builder.create('QBXML', { version: '1.0'})
                     .instruction('qbxml', 'version="13.0"')
                     .ele('QBXMLMsgsRq', { onError: 'continueOnError' })
                        .ele('BillAddRq', { requestID: '3' })
                            .ele('BillAdd')
                                .ele('VendorRef')
                                    .ele('FullName')
                                        .text('Marsi Bostwick ~ NT')
                                    .up()
                                .up()
                                .ele('RefNumber')
                                    .text('123')
                                .up()
                                .ele('Memo')
                                    .text('Created by Saguaro')
                                .up()
                                .ele('ExternalGUID')
                                    .text('b0a6a2c7-adb0-465b-af3f-31b1c7d81ad4')
                                .up()
                                .ele('ExpenseLineAdd')
                                    .ele('AccountRef')
                                        .ele('FullName')
                                            .text('Uncategorized Expenses')
                                        .up()
                                    .up()
                                    .ele('Amount')
                                        .text('1.00')
                                    .up()
                                    .ele('Memo')
                                        .text('This is a line item specific memo')
                                    .up()
                                .up()
                                .ele('ExpenseLineAdd')
                                    .ele('AccountRef')
                                        .ele('FullName')
                                            .text('Uncategorized Expenses')
                                        .up()
                                    .up()
                                    .ele('Amount')
                                        .text('2.00')
                                    .up()
                                    .ele('Memo')
                                        .text('memo for a line item')
                                    .up()
                                .up()
                            .up()
                        .up()
                    .up()


module.exports = inputXML.end();