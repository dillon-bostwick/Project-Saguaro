'use strict';

angular.
    module('userDashboard').
    component('userDashboard', {
        templateUrl: 'components/user-dashboard/user-dashboard.template.html',
        controller: function UserDashboardController($compile) {
        	var ctrl = this;

        	ctrl.searchVendor = '';


        	ctrl.USER = {name: 'Marsi', }; // TODO: connect to the global user finder http request

        	var QUEUE = [{
        		vendor: 'Bob',
        		lineItems: [
        			{
        				hood: 'Highgrove',
        				subHoods: ['dev']
        			}, {
        				hood: 'Lakeside',
        				subHoods: ['hood', 'dev']
        			}
        		]
        	}, {
        		vendor: 'Jon',
        		lineItems: [
        			{
        				hood: 'Highgrove',
        				subHoods: [1]
        			}, {
        				hood: 'Lakeside',
        				subHoods: [3, 4, 3]
        			}, {
        				hood: '9 Chastain',
        				subHoods: ['dev']
        			}
        		]
        	}, {

        	}] //TODO: Should be list of actual invoice objects from a DB query using the USER's _invoiceQueue, which are just ids


        	ctrl.queueView = [];

        	for (var i = 0; i < QUEUE.length; i++) {
        		var invoice = QUEUE[i];

        		ctrl.queueView[i] = {
        			vendor: invoice.vendor,
        			_id: invoice._id,
        			hoods: _.pluck(invoice.lineItems, 'hood').join(', '),
        			subHoods: _.pluck(invoice.lineItems, 'subHoods').sort().join(', ')
        		}
        	}


		}
    });