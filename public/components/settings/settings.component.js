'use strict';

angular.
    module('settings').
    component('settings', {
        templateUrl: 'components/settings/settings.template.html',
        controller: function SettingsController(api, $window, $location) {
        	var self = this;
            window.ctrl = self;
            self.path = $window.location.hash

            ////////////////////////////////////////////////////////////////////

            // External requests:
            self.Vendors = api.Vendor.query();
            self.Hoods = api.Hood.query();
            self.Expenses = api.Expense.query();
            self.Activities = api.Activity.query();
            self.Invoices = api.Invoice.query();
            self.CurrentUser = api.CurrentUser.get();

            ////////////////////////////////////////////////////////////////////

            self.groups = [
                {
                  title: 'Dynamic Group Header - 1',
                  template: 'hello.html'
                }
            ];


    	}
    });