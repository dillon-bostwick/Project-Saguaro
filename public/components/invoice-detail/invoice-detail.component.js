'use strict';

angular.
    module('invoiceDetail').
    component('invoiceDetail', {
        templateUrl: 'components/invoice-detail/invoice-detail.template.html',
        controller: function InvoiceDetailController($routeParams) {
            var self = this;

            self.invoice_id = Number($routeParams.invoice_id)

            //TODO: need to make a dereference on each element prefixed by an underscore...

            self.total = 259.47; //needto sum

            self.newAction = {
                comment: ''
            };

            self.User = {invoiceQueue: [123]};

            self.Invoice = { // TODO: see phone-detail.component.js for example of how to do a get with this from invoice_id. If the invoice cannot be found, must redirect to a 404 (maybe angular phonecat has an example?)
                serviceDate: new Date,
                vendor: 'Bob',
                invNum: 'ifj230f',
                memo: 'missing stamp',
                lineItems: [{
                    category: 'CIP',
                    hood: 'Highgrove', // if EXPENSE: must be empty
                    subHoods: ['dev', 'hood'], // if CIP or WARRANTY: can vary: null (i.e. unknown), hood, dev, or just a number. If EXPENSE: must be empty
                    activities: [2430, 2250, 1500], // if CIP starts as empty and gets filled. If EXPENSE or WARRANTY: must be empty
                    expense: '', // if CIP or WARRANTY: must be empty
                    amount: 100.99 //required
                }, {
                    category: 'EXPENSE',
                    hood: '', // if EXPENSE: must be empty
                    subHoods: [], // if CIP or WARRANTY: can vary: null (i.e. unknown), hood, dev, or just a number. If EXPENSE: must be empty
                    activities: [], // if CIP starts as empty and gets filled. If EXPENSE or WARRANTY: must be empty
                    expense: 'primary expense', // if CIP or WARRANTY: must be empty
                    amount: 159.47 //required
                }],
                actions: [{
                    category: 'CREATED',
                    comment: '',
                    changes: '',
                    date: new Date,
                    user: 'Lauren Gibbs'
                }, {
                    category: 'APPROVED',
                    comment: 'Had to add 4240 because its a cabinet',
                    changes: 'Added activity: 4240',
                    date: new Date,
                    user: 'Bob the Builder'
                }, {
                    category: 'HOLD',
                    comment: 'Holding because they forgot something',
                    changes: '',
                    date: new Date,
                    user: 'Charlie Bostwick'
                }]
            };

            //These got dereferenced so they are not members of invoice
            self.Vendor = 'Bob';
            self.CreatedBy = 'Lauren';
            self.Reviewers = 'Joel, Marsi';
        }
    });