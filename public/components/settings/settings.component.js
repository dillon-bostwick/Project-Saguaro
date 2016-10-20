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

            self.isLoading = false;
            self.alertMessage = ''; //This should never get a alert from a query string as long as in settings - because no redirects to here

            //UI
            self.showAdder = false;
            self.newGroupName = '';

            ////////////////////////////////////////////////////////////////////

            // self.viewGroups = [];

            //  Groups are by default structured as a linked list, so that is more efficient
            //  * when invoices are pushed from user to user. However, we want to restructure
            //  * as an ordered array so that it can bind to an Angular repeater. Starting where
            //  * isHead, create realGroups until _nextGroup === null)
             
            // self.Groups.$promise.then(function(groups) {
            //     var currentGroup = _.findWhere(groups, { isHead: true });

            //     while (currentGroup._nextGroup) {
            //         self.viewGroups.push(currentGroup);
            //         currentGroup = currentGroup._nextGroup
            //     }
            // });

            ////////////////////////////////////////////////////////////////////

            /* .panel-default, .panel-primary, .panel-success, .panel-info, .panel-warning, or .panel-danger */
            self.viewPanels = [
                {
                    title: 'Define users',
                    template: DIRNAME + 'user-define.partial.html',
                    class: 'panel-default'
                },
                {
                    title: 'Define pipeline',
                    template: DIRNAME + 'pipeline-define.partial.html',
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

            self.getUserNamesForGroup = function(group) {
                var users = _.where(self.Users, {_group: group._id});

                return _.pluck(users, 'firstName');
            }

            self.submitUserChange = function() {
                self.isLoading = true;

                //Update each invoice individually
                _.each(self.Users, function(user) {
                    user.$update(function() {

                    //When last one complete:
                    if (_.last(self.Users) == user) {
                            self.isLoading = false;
                            self.alertMessage = 'Successfully updated users';
                            self.Users = api.User.query();
                        }
                    });
                });
            }

            self.submitGroupChange = function() {
                //stub
            }

            self.addNewGroup = function() {
                self.Groups.push({
                    name: self.newGroupName,
                    pipelineIndex: self.Groups.length,
                    _nextGroup: null,
                    isHead: false
                })
            }




        }
    });