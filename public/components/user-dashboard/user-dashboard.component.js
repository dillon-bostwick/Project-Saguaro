'use strict';

angular.
    module('userDashboard').
    component('userDashboard', {
        templateUrl: 'components/user-dashboard/user-dashboard.template.html',
        controller: function UserDashboardController(api, $window) {
        	var self = this;

            self.prettyQueue = [];
            self.searchVendor = '';

            //Queue gets filled when the User request is complete
            self.User = api.currentUser.get(function() {
                _.each(self.User._invoiceQueue, function(inv_id) {
                    var invoice = api.Invoice.get({ id: inv_id }, function() {
                        self.prettyQueue.push(prettify(invoice));
                    });
                });
            });
            
            //TODO: THIS IS A TOTAL MESS!

            /* Given a full invoice object, will return a new object with four
             * elements:
             * _id: exact same
             * vendor: vendor name as string
             * hoods: pretty list of comma-delimited hoods as string
             * subhoods: pretty list of comma-delimited subhoods as string
             */
            function prettify(invoice) {
                var hoodNames = [];
                var vendorName = '';
                var subHoods = _.pluck(invoice.lineItems, 'subHoods');

                //Get the hood names based on _hood id for each line item
                _.each(_.pluck(invoice.lineItems, '_hood'), function(_hood) { //get each id
                    if (!_.isUndefined(_hood)) { // in case an expense line item
                        var hood = api.Hood.get({ id: _hood}, function() { //get the actual object
                            hoodNames.push(hood.name); //add to the list
                        });
                    }
                });

                //Remove empty strings and nulls:
                hoodNames = hoodNames.filter(function(val) { return val != '' })
                subHoods = subHoods.filter(function(val) {return (val != '' && val != null)})

                //subHoods might be multidimensional, so:
                subHoods = _.flatten(subHoods);

                //Remove duplicates:
                hoodNames = Array.from(new Set(hoodNames));
                subHoods = Array.from(new Set(subHoods));

                return {
                    _id: invoice._id,
                    vendor: api.Vendor.get({ id: invoice._vendor }).name,
                    hoods: hoodNames.join(', '),
                    subHoods: subHoods.join(', ')
                };
            }

            /* Given an invoice _id, redirect to the page for that invoice
             */
            self.redirectInvoiceDetail = function(_id) {
                $window.location.href = '/#!/invoices/' + _id;
            }
		}
    });