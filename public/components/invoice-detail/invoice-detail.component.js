'use strict';

angular.
    module('invoiceDetail').
    component('invoiceDetail', {
        templateUrl: 'components/invoice-detail/invoice-detail.template.html',
        controller: function InvoiceDetailController(api, $routeParams, $window, $filter) {
            var self = this;
            window.ctrl = self; // For debugging

            // External requests:
            self.Vendors = api.Vendor.query();
            self.Hoods = api.Hood.query();
            self.Expenses = api.Expense.query();
            self.Activities = api.Activity.query();
            self.Users = api.User.query();

            /* Note: self.isNew can be processed on page load because $routeParams 
             * processes on page load. For self.canReview and self.canEdit, must
             * wait for the CurrentUser to be fetched from the api (via a server
             * round trip processing SID cookie). Note that the camelCased currentUser
             * is different from the PascalCased self.CurrentUser. The former is
             * the returned data from the promise, while the latter is used to
             * bind to the view (which obviously Angular knows when to update).
             * Enjoy!
             */
            self.CurrentUser = api.CurrentUser.get().$promise.then(function(currentUser) {
                // Whether is in the current user's queue:
                self.canReview = _.contains(currentUser._invoiceQueue, $routeParams.id);
                // Whether it can be edited at all:
                self.canEdit = self.isNew || self.canReview;

                // See self.Invoice declaration for this:
                if (self.isNew) {
                    self.Invoice.actions[0]._user = currentUser._id;
                }
            });

            // Whether the invoice is new:
            self.isNew = $routeParams.id === 'new';
            
            // Either Invoice is retrived from DB or it gets a starter template:
            self.Invoice = self.isNew
                ? new api.Invoice({
                    serviceDate: new Date,
                    _id: '',
                    _vendor: '',
                    lineItems: [],
                    comment: '',
                    actions: [{
                        desc: 'CREATED',
                        comment: '',
                        date: new Date,
                        _user: undefined // Wait for CurrentUser promise resolution to fill
                    }]
                })
                : api.Invoice.get({ id: $routeParams.id });

            ////////////////////////////////////////////////////////////////////
            //CTRL METHODS

            //lineItem logic:

            /* Pushes a new lineItem to self.lineItems.
             * Note: it is a angular getter/setter, hence must check args
             */
            self.addLineItem = function() {
                self.Invoice.lineItems.push({
                    category: 'CIP', //default behavior is CIP
                    _hood: '',
                    subHood: '',
                    _activities: [],
                    _expense: '',
                    amount: undefined
                });
            }

            /* Given a lineItem, pushes an empty object literal to
             * the back of the _activities array of the lineItem
             */
            self.addActivity = function(lineItem) {
                lineItem._activities.push('')
            }

            /* getSubHoodOptions takes a lineItem and returns
             * the possible options that can be selected for ANOTHER subHood.
             */
            self.getSubHoodOptions = function(lineItem) {
                return lineItem._hood
                    ? self.getElementById(lineItem._hood, 'subHoodOptions', 'Hoods')
                    : [];
            }

            /* Given a subHood (dev, hood, or a number), determine which activities
             * can be applicable to that subHood. Follows Brightwater logic:
             * 0000-0399 = Dev
             * 0400-0999 = Hood
             * 1000-9999 = else
             */
            self.getActivityOptions = function(lineItem) {
                switch(lineItem.subHood) {
                    case '':
                        return [];
                    case 'Dev':
                        return _.filter(self.Activities, function(activity) {
                            return   0 <= activity.code && 
                                   399 >= activity.code
                        });

                        break;
                    case 'Hood':
                        return _.filter(self.Activities, function(activity) {
                            return 400 <= activity.code &&
                                   999 >= activity.code
                        });

                        break;
                    default: // i.e. is number so lots
                        return _.filter(self.Activities, function(activity) {
                            return 1000 <= activity.code &&
                                   9999 >= activity.code
                        });
                }
            }

            /* Given a lineItem, runs the JS native eval() function on the
             * lineItem's amount - in other words, if the amount is a string
             * including operators, it will evaluate the operators and convert
             * it to a Number. Also updates total amount upon change
             */
            self.evaluateAmount = function(lineItem) {
                lineItem.amount = $filter('currency')(eval(lineItem.amount), '');
                self.updateAmount();
            }

            /* Given an array activities, sorts the array alphabetically
             * according to the 'desc' property of each objet in the array.
             * returns the sorted array
             */
            self.sortByDesc = function(activities) {
                return activities.sort(function(a, b) {
                    if (a.desc < b.desc) { return -1; }
                    if (a.desc > b.desc) { return 1; }

                    return 0;
                });
            }

            /* To be ran every time an amount changes - updates Invoice.amount with
             * the correct amount, or sets to NaN if a view expression has not
             * been evaluated with eval()
             */
            self.updateAmount = function() {
                self.Invoice.amount = _.pluck(self.Invoice.lineItems, 'amount')
                .reduce(function(a, b) {
                    return Number(a) + Number(b);
                }, 0);
            }

            self.submit = function(another) {
                var _receivers = ['64374526']; //TODO: this needs logic

                //Push the invoice id to the necessary receivers
                pushInvoiceToReceivers(_receivers, self.Invoice._id, self.Users);

                // If the invoice is new, it must get pushed to Invoices
                if (self.isNew) {
                    self.Invoice.$save(function() {
                        console.log(self.Invoice);
                        if (another) {
                            $window.location.reload();
                        } else {
                            $window.location.href = '/#!/dashboard'
                        }
                    });
                } else { // Otherwise, already exists, but gets updated
                    //TODO: needs testing
                    self.invoice.$update(function() {
                        if (another) {
                            //Stub
                        } else {
                            $window.location.href = '/#!/dashboard'
                        }
                    });
                }
            }

            self.hold = function () {
                //Stub
            }

            ////////////////////////////////////////////////////////////////////
            //db getters

            /* Given an id and a collection, return the name of that document
             * 
             * Warning: this is reproduced elsewhere (as of writing, in user-dashboard).
             *  Consider moving to core!
             */
            self.getNameById = function(id, collection) {
                var document = _.findWhere(self[collection], { _id: id })

                return (document.name || [document.firstName, document.lastName].join(' '));
            }

            self.getElementById = function(id, element, collection) {
                return _.findWhere(self[collection], { _id: id })[element];
            }

            ////////////////////////////////////////////////////////////////////
            //HELPER METHODS

            /* Given a list of receivers (array of ids),
             * one invoice (id)
             * and a list of all users in the model (array of ids)
             * each receiver gets the invoice pushed to the back of their
             * personal invoice queue.
             */
            function pushInvoiceToReceivers(_receivers, _invoice, _users) {
                var receiverModel;

                _.each(_receivers, function(_receiver) {
                    receiverModel = _.find(_users, function(user) {
                        return user._id === _receiver;
                    });

                    receiverModel._invoiceQueue.push(_invoice);
                    receiverModel.$update();
                });
            }


        } // end controller
    }); // end component