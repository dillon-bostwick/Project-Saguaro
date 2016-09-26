'use strict';

angular.
    module('invoiceCreator').
    component('invoiceCreator', {
        templateUrl: 'components/invoice-creator/invoice-creator.template.html',
        controller: function InvoiceCreatorController($http, $window) {
            var self = this;

            //External requests:

            self.Vendors = [{_id: "123", name: "bob"}, {_id: "234", name: "jose"}]; // TODO: needs to HTTP request
            self.Hoods = [{_id: "123", name: "highgrove"}, {_id: "234", name: "lakeside"}]; // TODO: needs to HTTP request
            self.Expenses = [{_id: "123", name: "primaryexpense"}, {_id: "234", name: "secondaryexpense"}]; // TODO: needs to HTTP request

            //getting user data from server TODO: this must eventually be done for every page load, so maybe put it in global scope
            $http.get('/userdata').then(function success(res) {
                if (_.isEmpty(res.data)) {
                    // user was not authenticated - shut out
                    $window.location.href = '/'
                } else {
                    self.User = res.data;
                }
            }, httpError);

            /////////////////////////////////////////////////////////////////////////

            var now = new Date
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
                lineItem['amount'] = 0;

                if (lineItem.type === 'CIP' || lineItem.type === 'WARRANTY') {
                    lineItem['subHoods'] = [];
                    lineItem['addNewSubHood'] = function(subHood) { //getter-setter
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
                    var lineItem = {type: newType}

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
                var SubHoodOptions = ['hood', 'dev', 1, 2, 3];  // TODO: needs to HTTP request from lineItem._hood

                //Only show options that haven't been selected yet:
                return _.difference(SubHoodOptions, _.pluck(lineItem.subHoods, 'name'));
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

                if (self.serviceDate > now) {
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

                    if (lineItem.type == 'EXPENSE') {
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
                var newInvoice = {
                    serviceDate: self.serviceDate,
                    _vendor: self._vendor,
                    invNum: self.invNum,
                    lineItems: self.lineItems,
                    actions: [{
                        category: 'CREATED',
                        comment: self.comment,
                        date: Now,
                        _user: self.User._id
                    }]
                }

                //Some misc. parsing of line items so that it fits the DB model:
                for (var i = 0; i < newInvoice.lineItems.length; i++) {
                    var lineItem = newInvoice.lineItems[i];

                    //this is necessary because data is stored in subhoods even if the user checks the unknown box
                    //Note: there is a difference between subHoods == [] and subHoods == null. The former is used if
                    //the lineItem is an expense, indicating that subHoods can't exist. subHoods == null means that
                    //the lineItem is a cip or warranty but the user selected unknown
                    if (lineItem['unknown']) {
                        lineItem.subHoods = null;
                    }

                    //convert subhood from array of {name: "foo"}s to array of "foo"s
                    lineItem.subHoods = _.pluck(lineItem.subHoods, 'name');

                    //remove elements only used by the frontend form - don't need to save in DB
                    delete lineItem['unknown'];
                    delete lineItem['addNewSubHood'];
                    
                    //this always gets initialized as empty just for good practice, but only CIPs will eventually fill
                    lineItem['_activities'] = [];
                }

                console.log(newInvoice);

                //TODO: Needs to push to back of queue of next pipeline member (maybe all users that have QC - via DB query)

                //If all validation checks out:
                //post via $http, then redirect somewhere...
            }

            function throwValError(msg) {
                self.errors.push({ type: 'error', message: msg });
            }

            function throwValWarning(msg) {
                self.errors.push({ type: 'warning', message: msg });
            }

            function httpError(res) {
                alert('There was a problem loading data with $http: ' + res);
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



