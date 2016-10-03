'use strict';

angular.
    module('userDashboard').
    component('userDashboard', {
        templateUrl: 'components/user-dashboard/user-dashboard.template.html',
        controller: function UserDashboardController(api, $window) {
        	var self = this;

            // External requests:
            self.Vendors = api.Vendor.query();
            self.Hoods = api.Hood.query();
            self.Expenses = api.Expense.query();
            self.Activities = api.Activity.query();
            self.Invoices = api.Invoice.query();
            self.CurrentUser = api.currentUser.get();

            //Must be one of [QUEUE, TEAM, ARCHIVE] - QUEUE by default
            self.view = 'QUEUE';
            //The list of invoices to reveal - user queue by default because above
            self.invList = getUserQueue();

            //Filter fields:
            self.filterVendor = '';
            self.sortBy = '';

            ////////////////////////////////////////////////////////////////////

            self.updateInvList = function() {
                switch(self.view) {
                    case 'QUEUE':
                        invList = getUserQueue(self);
                        break;
                    case 'TEAM':
                        invList = getAllUserQueues(self);
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
            self.getDetailStr = function(invoice) {
                var detailStr = 'foo';
                //stub
                return detailStr;
            }

            /* Given an invoice _id, redirect to the page for that invoice
             */
            self.redirectInvoiceDetail = function(_id) {
                $window.location.href = '/#!/invoices/' + _id;
            }

            ////////////////////////////////////////////////////////////////////

            /* Returns an array of invoice objects that correspond to 
             * all the invoice ids in the _invoiceQueue of CurrentUser.
             */
             //TODO: NOT TESTED!
           function getUserQueue(self) {
                console.log(self.Invoices);
                console.log(self.CurrentUser);

                return _.filter(self.Invoices, function(Invoice) {
                    return _.contains(self.CurrentUser._invoiceQueue, Invoice._id)
                });
            }

            function getAllUserQueues(self) {
                //TODO stub
                return foo;
            }
		}
    });