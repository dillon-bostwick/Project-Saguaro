'use strict';

angular.
    module('invoiceDetail').
    component('invoiceDetail', {
        templateUrl: 'components/invoice-detail/invoice-detail.template.html',
        controller: function InvoiceDetailController(api, $routeParams) {
            var self = this;

            // External retrievals:
            self.Vendors = api.Vendor.query();
            self.Hoods = api.Hood.query();
            self.Expenses = api.Expense.query();
            self.Activities = api.Activity.query();
            self.CurrentUser = api.currentUser.get();

            self.total = 0;

            // Whether the invoice is new:
            self.isNew = $routeParams.id === 'new';
            // Whether is in the current user's queue:
            self.canReview = _.contains(self.CurrentUser._invoiceQueue, $routeParams.id);
            // Whether it can be edited at all:
            self.canEdit = self.isNew || self.canReview

            // Either Invoice is retrived from DB or it gets a starter template:
            self.Invoice = self.isNew
                ? {
                    serviceDate: new Date,
                    invNum: '',
                    _vendor: '',
                    lineItems: [],
                    comment: '',
                    actions: [{
                        desc: 'CREATED',
                        comment: '',
                        date: new Date,
                        _user: self.CurrentUser._id
                    }]
                }
                : api.Invoice.get({ id: $routeParams.id });

            ////////////////////////////////////////////////////////////////////
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
                lineItem._activities.push({})
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
             * it to a Number. Also updates total upon change
             */
            self.evaluateAmount = function(lineItem) {
                lineItem.amount = eval(lineItem.amount);
                self.updateTotal();
            }

            /*
             */
            self.sort



            ////////////////////////////////////////////////////////////////////


            self.updateTotal = function() {
                self.total = _.pluck(self.Invoice.lineItems, 'amount')
                .reduce(function(a, b) {
                    console.log(a);
                    console.log(b);
                    return Number(a) + Number(b);
                }, 0);

                return true;
            }

            self.submit = function() {
                
            }
    
        }
    });