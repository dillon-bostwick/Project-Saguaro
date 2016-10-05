'use strict';

angular.
    module('invoiceDetail').
    component('invoiceDetail', {
        templateUrl: 'components/invoice-detail/invoice-detail.template.html',
        controller: function InvoiceDetailController(api, $routeParams, $window) {
            var self = this;
            window.ctrl = self; // For debugging

            // External requests:
            self.Vendors = api.Vendor.query();
            self.Hoods = api.Hood.query();
            self.Expenses = api.Expense.query();
            self.Activities = api.Activity.query();
            self.CurrentUser = api.CurrentUser.get();
            self.Users = api.User.query();

            // Whether the invoice is new:
            self.isNew = $routeParams.id === 'new';
            // Whether is in the current user's queue:
            self.canReview = _.contains(self.CurrentUser._invoiceQueue, $routeParams.id);
            // Whether it can be edited at all:
            self.canEdit = self.isNew || self.canReview

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
                        _user: self.CurrentUser._id
                    }]
                })
                : api.Invoice.get({ id: $routeParams.id });

                self.foo = ''

            ////////////////////////////////////////////////////////////////////
            //CTRL METHODS

            //lineItem logic:

            /* Pushes a new lineItem to self.lineItems.
             * Note: it is a angular getter/setter, hence must check args
             */
            self.addLineItem = function() {
                self.Invoice.lineItems.push({
                    category: 'CIP',
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
                if (lineItem._hood == '') { return []; }

                var hood = _.find(self.Hoods, function(hood) {
                    return hood._id === lineItem._hood
                });

                //All the lots up to numLots excluding completedLots:
                var subHoodOptions = _.difference(_.range(1, hood.numLots + 1), hood.completedLots);

                //Then add hood or dev as appropriate:
                if (hood.hoodable) { subHoodOptions.unshift('hood'); }
                if (hood.devable) { subHoodOptions.unshift('dev'); }

                return subHoodOptions
            }

            /* Given a subHood (dev, hood, or a number), determine which activities
             * can be applicable to that subHood. Follows Brightwater logic:
             * 0000-0399 = Dev
             * 0400-0999 = Hood
             * 1000-9999 = Lots
             */
            self.getActivityOptions = function(lineItem) {
                //TODO: need to test
                switch(lineItem.subHood) {
                    case '':
                        return [];
                    case 'dev':
                        return _.filter(self.Activities, function(activity) {
                            return   0 <= activity.code && 
                                   399 >= activity.code
                        });

                        break;
                    case 'hood':
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
                lineItem.amount = eval(lineItem.amount);
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

            /* Return whether Invoice.amount is NaN - useful for seeing whether
             * all expressions in "amount" in view have been evaluated.
             */
            self.amountIsNaN = function() {
                return isNaN(self.Invoice.amount);
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
                    console.log(self.Invoice);
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