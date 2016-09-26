'use strict';

angular.
    module('userDashboard').
    component('userDashboard', {
        templateUrl: 'components/user-dashboard/user-dashboard.template.html',
        controller: function UserDashboardController($window) {
        	var self = this;

        	self.searchVendor = '';


        	self.User = {name: 'Marsi', }; // TODO: connect to the global user finder http request

        	var Queue = [{
                _id: '123',
        		vendor: 'Bob',
        		lineItems: [
        			{
        				_hood: 'Highgrove',
        				subHoods: ['dev']
        			}, {
        				_hood: 'Lakeside',
        				subHoods: ['hood', 'dev']
        			}
        		]
        	}, {
                _id: '234',
        		vendor: 'Jon',
        		lineItems: [
        			{
        				_hood: 'Highgrove',
        				subHoods: [1]
        			}, {
        				_hood: 'Lakeside',
        				subHoods: [3, 4, 3]
        			}, {
        				_hood: 'Highgrove',
        				subHoods: null
        			}, {
        				_hood: '', //i.e. this is an expense
        				subHoods: []
        			}
        		]
        	}, {

        	}] //TODO: Should be list of actual invoice objects from a DB query using the USER's _invoiceQueue, which are just ids (the query gives all the user's queue)


        	self.prettyPrintQueue = [];

        	/* Many operations must be performed on the hoods and subHoods to make them
        	 * ready for printing in the queue. Must perform for each invoice in queue.
        	 * Intentionally fleshed out this process avoiding one-liners so it can be changed
        	 * later if necessary
        	 */
        	_.each(Queue, function(invoice) {
        		var hoods = _.pluck(invoice.lineItems, '_hood');
        		var subHoods = _.pluck(invoice.lineItems, 'subHoods');

        		//TODO: lookup hood names from _hood (will require a DB http as well as another pluck to get the name)

        		//Remove empty strings and nulls:
        		hoods = hoods.filter(function(val) { return val != '' })
        		subHoods = subHoods.filter(function(val) { return (val != '' && val != null)})

        		//subHoods might be 2D array, so:
        		subHoods = _.flatten(subHoods)

        		//Remove duplicates:
        		hoods = Array.from(new Set(hoods));
        		subHoods = Array.from(new Set(subHoods));

        		subHoods = subHoods.sort();

        		self.prettyPrintQueue.push({
                    _id: invoice._id,
        			vendor: invoice.vendor,
        			hoods: hoods.join(', '),
        			subHoods: subHoods.join(', ')
        		});
        	});




            self.showInvoice = function(_id) {
                $window.location.href = '/#!/invoices/' + _id;
            }
		}
    });