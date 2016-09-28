'use strict';

angular.
    module('invoiceCreator').
    component('invoiceCreator', {
        templateUrl: 'components/invoice-creator/invoice-creator.template.html',
        controller: function InvoiceCreatorController(api, $window) {
            var self = this;

            // External:
            self.Vendors = api.Vendor.query();
            self.Hoods = api.Hood.query();
            self.Expenses = api.Expense.query();
            self.User = api.currentUser.get();

            // Local:
            self.serviceDate = new Date;
            self.invNum = '';
            self._vendor = '';
            self.lineItems = [];
            self.total = 0;
            self.comment = '';


            /* Create a new template lineItem object for cip, warranty, or expense.
             * Takes the lineItem by reference to be templated
             */        
            self.loadNewLineItem = function(lineItem) {
                lineItem.amount = 0;

                if (lineItem.category === 'CIP' || lineItem.category === 'WARRANTY') {
                    lineItem._hood = '';
                    lineItem.subHoods = [];

                    lineItem.addNewSubHood = function(subHood) { //getter-setter
                        if (!_.isEmpty(arguments)) { //if no arguments we know its a getter
                            return (this.subHoods.push({name: subHood}));
                        }
                    }
                }
            }

            /* Pushes a new lineItem to self.lineItems.
             */
            self.addNewLineItem = function(newType) {
                if (!_.isEmpty(arguments)) {
                    var lineItem = {category: newType}

                    self.lineItems.push(lineItem);
                    self.loadNewLineItem(lineItem);
                }
            }

            /* getSubHoodOptions takes a lineItem and returns
             * the possible options that can be selected for ANOTHER subHood.
             * It needs the lineItem because first of all it needs the _hood to decide
             * what subHoods exist for that hood, but it also needs lineItem.subHoods so that
             * it removes duplicates.
             */
            self.getSubHoodOptions = function(lineItem) {
                var hood = _.find(self.Hoods, function(hood) {
                    return hood._id === lineItem._hood
                });

                var subHoodOptions = _.range(1, hood.numLots + 1);

                if (hood.hoodable) { subHoodOptions.unshift('hood'); }
                if (hood.devable) { subHoodOptions.unshift('dev'); }

                // Only show options that haven't been selected yet:
                lineItem.subHoodOptions = _.difference(subHoodOptions, _.pluck(lineItem.subHoods, 'name'));
            }

            /* validate() should run after every change to the form
             * Will update self.errors with objects with the keys 'type' and 'message'
             * type is either 'error' or 'warning'.
             * returns false if there are any objects in errors where type === 'error'
             * i.e., will return true even if there are some warnings
             */
            self.validate = function() {
                self.errors = [];

                if (_.isEmpty(self.invNum)) {
                    throwValWarning("Invoice number cannot be blank");
                }

                if (self.serviceDate > new Date) {
                    throwValError("Service date cannot be in future");
                }

                //if service date is more than 6 months ago
                if (moment(self.serviceDate).add(6, 'months') < moment()) {
                    throwValWarning("Service date is over 6 months ago");
                }

                if (_.isEmpty(self._vendor)) {
                    throwValError("Vendor cannot be blank");
                }

                if (_.isEmpty(self.lineItems)) {
                    throwValError("Must include at least one line item");
                }

                //now validating each lineItem:
                for (var i = 0; i < self.lineItems.length; i++) {
                    var lineItem = self.lineItems[i];

                    if (lineItem.category == 'EXPENSE') {
                        if (_.isEmpty(lineItem._expense)) {
                            throwValError("In line item #" + (i + 1) + ": expense cannot be blank");
                        }
                    } else { //is cip or warranty
                        if (_.isEmpty(lineItem._hood)) {
                            throwValError("In line item #" + (i + 1) + ": hood cannot be blank");
                        }

                        if (!lineItem.unknown && _.isEmpty(lineItem.subHoods)) {
                            throwValError("In line item #" + (i + 1) + ": must select at least one subhood or check unknown");
                        }
                    }

                    if (lineItem.amount < 0 || lineItem.amount == null) {
                        throwValError("In line item #" + (i + 1) + ": amount must be nonnegative");
                    }

                    if (lineItem.amount === 0) {
                        throwValWarning("In line item #" + (i + 1) + ": amount is zero");
                    }

                    if (lineItem.amount > 50000) {
                        throwValWarning("In line item #" + (i + 1) + ": amount is greater than 50K");
                    }
                }

                if (self.total < 0) {
                    throwValError("Total must be nonnegative");
                }

                if (self.total === 0 || self.total == null) {
                    throwValWarning("Total is zero");
                }

                if (self.total > 150000) {
                    throwValWarning("Total is greater than 150K");
                }

                //Find sum of all line items for comparison
                var lineItemSum = _.pluck(self.lineItems, 'amount').reduce(function(a, b) { return a + b; }, 0);

                if (self.total != lineItemSum) {

                    throwValError('The total you entered does not equal the sum of all line items. Total: $' + ((lineItem.amount == null) ? 0 : lineItem.amount) + '. Sum of line items: $' + ((lineItem.amount == null) ? 0 : lineItem.amount) + '.');
                }

                //false if any obj in errors has property type: error -- i.e. warnings are okay
                return !_.contains(_.pluck(self.errors, 'type'), 'error'); 
            }

            self.submit = function() {
                if (!self.validate()) { return; }; //can't submit if validation doesn't pass

                //Create the invoice object that will be stored in DB:
                var newInvoice = new api.Invoice({
                    serviceDate: self.serviceDate,
                    _vendor: self._vendor,
                    invNum: self.invNum,
                    lineItems: self.lineItems,
                    actions: [{
                        category: 'CREATED',
                        comment: self.comment,
                        date: new Date,
                        _user: self.User._id
                    }]
                });

                //Some misc. parsing of line items so that it fits the DB model:
                _.each(newInvoice.lineItems, function(lineItem) {

                    //this is necessary because data is stored in subhoods even if the user checks the unknown box
                    //Note: there is a difference between subHoods == [] and subHoods == null. The former is used if
                    //the lineItem is an expense, indicating that subHoods can't exist. subHoods == null means that
                    //the lineItem is a cip or warranty but the user selected unknown
                    if (lineItem['unknown']) {
                        lineItem.subHoods = null;
                    }

                    //convert subhood from array of {name: "foo"}s to array of "foo"s
                    //the also sort them
                    lineItem.subHoods = _.pluck(lineItem.subHoods, 'name').sort();

                    //remove elements only used by the frontend form - don't need to save in DB
                    delete lineItem.unknown;
                    delete lineItem.addNewSubHood;
                    delete lineItem.subHoodOptions;
                    
                    //this always gets initialized as empty just for good practice, but only CIPs will eventually fill
                    lineItem['_activities'] = [];
                });

                //TODO: Needs to push to back of queue of next pipeline member (maybe all users that have QC - via DB query)

                //DEBUG: post and redirect
                newInvoice.$save(function() {
                    console.log($window);
                    $window.location.href = '/#!/userdashboard'; //TODO what should this do?
                });
            }

            function throwValError(msg) {
                self.errors.push({ type: 'error', message: msg });
            }

            function throwValWarning(msg) {
                self.errors.push({ type: 'warning', message: msg });
            }
        }
    });



// All input validation errors:

// invoice # cannot be empty
// service date cannot be in future
// service date is more than 6 months old -> WARNING
// vendor not selected
// must have at least one line item

// for each line item:
//     if expense
//         expense must be selected
//     if cip or warranty
//         hood must be selected
//         if not unknown
//             at least one subhood must be selected
//     amount cannot be less than zero
//     amount is more than 50K -> WARNING

// total cannot be less than zero
// amount on total is more than 150K -> WARNING
// user entered total must equal sum of all line item amounts



