'use strict';

angular.
    module('userDashboard').
    component('userDashboard', {
        templateUrl: 'components/user-dashboard/user-dashboard.template.html',
        controller: function UserDashboardController(api, $window, $q) {
        	var self = this;
            window.ctrl = self; // For debugging
            self.path = $window.location.hash

            ////////////////////////////////////////////////////////////////////
            //Constants:

            self.FILTEROPTIONS = [
                {
                    desc: 'Vendor name',
                    value: ''
                },
                {
                    desc: 'Hood name',
                    value: ''
                },
                {
                    desc: 'Expense',
                    value: ''
                }
            ]

            self.SORTOPTIONS = [
                {
                    desc: 'Service date (oldest first)',
                    value: ''
                },
                {
                    desc: 'Service date (newest first)',
                    value: ''
                },
                {
                    desc: 'Received date (oldest first)',
                    value: ''
                },
                {
                    desc: 'Received date (newest first)',
                    value: ''
                },
                {
                    desc: 'Keyed date (oldest first)',
                    value: ''
                },
                {
                    desc: 'Keyed date (newest first)',
                    value: ''
                },
                {
                    desc: 'Amount (greatest first)',
                    value: ''
                },
                {
                    desc: 'Amount (least first)',
                    value: ''
                }
            ]

            ////////////////////////////////////////////////////////////////////

            // External requests:
            self.Vendors = api.Vendor.query();
            self.Hoods = api.Hood.query();
            self.Expenses = api.Expense.query();
            self.Activities = api.Activity.query();
            self.Invoices = api.Invoice.query();
            self.CurrentUser = api.CurrentUser.get();

            //Must be one of [QUEUE, TEAM, ARCHIVE] - QUEUE by default
            self.view = 'QUEUE';
            self.invList = []; //Gets initially filled by $q promise below
            self.filters = [];
            self.sorter = self.SORTOPTIONS[0];

            /* Wait for the CurrentUser and Invoices to both load before
             * initiating the first queue view. When the page loads it always
             * starts as getUserQueue (i.e. self.view == 'QUEUE')
             */
            $q.all([
                self.CurrentUser.$promise,
                self.Invoices.$promise
            ]).then(function(data) {
                self.invList = getUserQueue(self.CurrentUser, self.Invoices);
            })

            ////////////////////////////////////////////////////////////////////

            self.updateInvList = function() {
                switch(self.view) {
                    case 'QUEUE':
                        self.invList = getUserQueue(self.CurrentUser, self.Invoices);
                        break;
                    case 'TEAM':
                        self.invList = getAllUserQueues(self);
                        break;
                    case 'ARCHIVE':
                        alert('Archive function is not ready!') //TODO
                        break;
                    default:
                        throw new Error;
                }
            }

            /* Given an invoice, return a single string that gives relevant info
             * and a summary of all line items
             */

             //TODO: not putting too much effort into this because it will change later
            self.getDetailStr = function(invoice) {
                // Get lists of ids excluding empty strings
                var hoods =   _.pluck(invoice.lineItems, '_hood').filter(Boolean);
                var expenses = _.pluck(invoice.lineItems, '_expense').filter(Boolean);

                // Dereference from ids to names
                hoods = _.map(hoods, function(id) {return self.getElementById(id, 'shortHand', 'Hoods'); });
                expenses = _.map(expenses, function(id) { return self.getNameById(id, 'Expenses'); });

                return  [
                            _.uniq(expenses).join(', '),
                            _.uniq(hoods).join(', ')
                        ]
                        .filter(Boolean)
                        .join(' / ')
                        || 'N/A';
            }

            

            /* Given an invoice _id, redirect to the page for that invoice
             */
            self.redirectInvoiceDetail = function(id) {
                console.log(id);
                $window.location.href = '/#!/invoices/' + id;
            }

            ////////////////////////////////////////////////////////////////////
            //db getters

            /* Given an id and a collection, return the name of that document
             * 
             * Warning: this is reproduced elsewhere (as of writing, in user-dashboard).
             *  Consider moving to core!
             */
            self.getNameById = function(id, collection) {
                var doc = _.findWhere(self[collection], { _id: id })

                // If not found return null, otherwise return the name or
                // '[FIRSTNAME] [LASTNAME]'
                return doc
                    ? doc.name
                    || [doc.firstName, doc.lastName].join(' ')
                    : null;
            }

            self.getElementById = function(id, element, collection) {
                var doc = _.findWhere(self[collection], { _id: id })[element];

                return doc ? doc[element] : null;
            }

            ////////////////////////////////////////////////////////////////////

            /* Returns an array of invoice objects that correspond to 
             * all the invoice ids in the _invoiceQueue of CurrentUser.
             */
             //TODO: NOT TESTED!
           function getUserQueue(CurrentUser, Invoices) {
                return _.filter(Invoices, function(Invoice) {
                    return _.contains(CurrentUser._invoiceQueue, Invoice._id)
                });
            }

            function getAllUserQueues(self) {
                //TODO stub
                return foo;
            }
		}
    });