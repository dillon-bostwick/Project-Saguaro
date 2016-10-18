'use strict';

angular.
    module('settings').
    component('settings', {
        templateUrl: 'components/settings/settings.template.html',
        controller: function SettingsController(api, $window, $location) {
        	var self = this;
            window.ctrl = self;
            self.path = $window.location.hash

            var DIRNAME = '/components/settings/';

            ////////////////////////////////////////////////////////////////////

            // External requests:
            self.Vendors = api.Vendor.query();
            self.Hoods = api.Hood.query();
            self.Expenses = api.Expense.query();
            self.Activities = api.Activity.query();
            self.Invoices = api.Invoice.query();
            self.CurrentUser = api.CurrentUser.get();
            self.Groups = api.Group.query();
            self.Users = api.User.query();

            ////////////////////////////////////////////////////////////////////

            /* .panel-default, .panel-primary, .panel-success, .panel-info, .panel-warning, or .panel-danger */
            self.viewPanels = [
                {
                    title: 'Define users and groups',
                    template: DIRNAME + 'user-define.partial.html',
                    class: 'panel-default'
                },
                {
                    title: 'Define invoice pipeline',
                    template: DIRNAME + 'pipeline-define.partial.html',
                    class: 'panel-default'
                },
                {
                    title: 'Update data',
                    template: DIRNAME + 'update-data.partial.html',
                    class: 'panel-default'
                }
            ];

            ////////////////////////////////////////////////////////////////////

            self.makeAdmin = function(user) {
                if (user.isAdmin) {
                    user.canOverride = true;
                    user.canCreate   = true;
                }
            };

            self.submitUserChange = function() {
                //TODO
            }
    	}
    });