'use strict';

angular.
    module('userDashboard').
    component('userDashboard', {
        templateUrl: 'components/user-dashboard/user-dashboard.template.html',
        controller: function UserDashboardController(api, $window, $q) {
        	var self = this;
            window.ctrl = self; // For debugging

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

            //Filter fields:
            self.filterVendor = '';
            self.sortBy = '';

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
            self.getDetailStr = function(invoice) {
                var detailStr = 'foo';
                //stub
                return detailStr;
            }

            self.getVendorNameById = function(id) {
                return _.findWhere(self.Vendors, { _id: id }).name;
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