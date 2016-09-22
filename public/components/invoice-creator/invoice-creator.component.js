'use strict';

angular.
    module('invoiceCreator').
    component('invoiceCreator', {
        templateUrl: 'components/invoice-creator/invoice-creator.template.html',
        controller: function InvoiceCreatorController($http, $window) {
            var ctrl = this;

            //External requests:

            ctrl.VENDORS = [{_id: "123", name: "bob"}, {_id: "234", name: "jose"}]; // TODO: needs to HTTP request
            ctrl.HOODS = [{_id: "123", name: "highgrove"}, {_id: "234", name: "lakeside"}]; // TODO: needs to HTTP request
            ctrl.EXPENSES = [{_id: "123", name: "primaryexpense"}, {_id: "234", name: "secondaryexpense"}]; // TODO: needs to HTTP request

            //getting user data from server TODO: this must eventually be done for every page load, so maybe put it in global scope
            $http.get('/userdata').then(function success(res) {
                if (_.isEmpty(res.data)) {
                    // user was not authenticated - shut out
                    $window.location.href = '/'
                } else {
                    ctrl.USER = res.data;
                }
            }, httpError);

            /////////////////////////////////////////////////////////////////////////

            var now = new Date
            ctrl.serviceDate = new Date;
            ctrl.invNum = '';
            ctrl._vendor = '';
            ctrl.lineItems = [];
            ctrl.total = 0;
            ctrl.memo = '';


            //Create template for cip, warrant, or expense:           
            ctrl.loadNewLineItem = function(lineItem) {
                lineItem['amount'] = 0;

                if (lineItem.type === 'cip' || lineItem.type === 'warrant') {
                    lineItem['subHoods'] = [];
                    lineItem['addNewSubHood'] = function(subHood) { //getter-setter
                        if (!_.isEmpty(arguments)) {
                            return (this.subHoods.push({name: subHood}));
                        }
                    }
                }
            }

            ctrl.addNewLineItem = function(newType) {
                if (!_.isEmpty(arguments)) {
                    var lineItem = {type: newType}

                    ctrl.lineItems.push(lineItem);
                    ctrl.loadNewLineItem(lineItem);
                }
            }

            ctrl.getSubHoodOptions = function(lineItem) {
                var SUBHOODOPTIONS = ['hood', 'dev', 1, 2, 3];  // TODO: needs to HTTP request from lineItem._hood

                //Only show options that haven't been selected yet:
                return _.difference(SUBHOODOPTIONS, _.pluck(lineItem.subHoods, 'name'));
            }

            ctrl.validate = function() {
                ctrl.errors = [];

                if (_.isEmpty(ctrl.invNum)) {
                    throwValError("Invoice number cannot be blank");
                }

                if (ctrl.serviceDate > now) {
                    throwValError("Service date cannot be in future");
                }

                //if service date is more than 6 months ago
                if (moment(ctrl.serviceDate).add(6, 'months') < moment()) {
                    throwValWarning("Service date is over 6 months ago");
                }

                if (_.isEmpty(ctrl._vendor)) {
                    throwValError("Vendor cannot be blank");
                }

                if (_.isEmpty(ctrl.lineItems)) {
                    throwValError("Must include at least one line item");
                }

                //now validating all line items:
                for (var i = 0; i < ctrl.lineItems.length; i++) {
                    var lineItem = ctrl.lineItems[i];

                    if (lineItem.type == 'expense') {
                        if (_.isEmpty(lineItem._expense)) {
                            throwValError("In line item #" + (i + 1) + ": expense cannot be blank");
                        }
                    } else { //is cip or warrant
                        if (_.isEmpty(lineItem._hood)) {
                            throwValError("In line item #" + (i + 1) + ": hood cannot be blank");
                        }

                        if (!lineItem.unknown && _.isEmpty(lineItem.subHoods)) {
                            throwValError("In line item #" + (i + 1) + ": must select at least one subhood or check unknown");
                        }
                    }

                    if (lineItem.amount < 0) {
                        throwValError("In line item #" + (i + 1) + ": amount must be nonnegative");
                    }

                    if (lineItem.amount === 0) {
                        throwValWarning("In line item #" + (i + 1) + ": amount is zero");
                    }

                    if (lineItem.amount > 50000) {
                        throwValWarning("In line item #" + (i + 1) + ": amount is greater than 50K");
                    }
                }

                if (ctrl.total < 0) {
                    throwValError("Total must be nonnegative");
                }

                if (ctrl.total === 0) {
                    throwValWarning("Total is zero");
                }

                if (ctrl.total > 150000) {
                    throwValWarning("Total is greater than 150K");
                }

                //Find sum of all line items for comparison
                var lineItemSum = _.pluck(ctrl.lineItems, 'amount').reduce(function(a, b) { return a + b; }, 0);

                if (ctrl.total != lineItemSum) {
                    throwValError('The total you entered does not equal the sum of all line items. Total: $' + ctrl.total + '. Sum of line items: $' + lineItemSum + '.');
                }

                return _.contains(_.pluck(ctrl.errors, 'type'), 'error');
            }

            ctrl.submit = function() {
                if (!ctrl.validate()) { return; }; //can't submit if validation doesn't pass at least errors
                
                //Create the invoice object:
                var newInvoice = {
                    createdDate: now,
                    serviceDate: ctrl.serviceDate,
                    _vendor: ctrl._vendor,
                    invNum: ctrl.invNum,
                    memo: ctrl.memo,
                    _createdBy: ctrl.USER._id,
                    _reviewers: [],
                    actions: [],
                    lineItems: {
                        cips:     _.filter(ctrl.lineItems, function(obj) { return obj['type'] == 'cip'}),
                        expenses: _.filter(ctrl.lineItems, function(obj) { return obj['type'] == 'expenses'}),
                        warrants: _.filter(ctrl.lineItems, function(obj) { return obj['type'] == 'warrants'})
                    }
                }

                //Some misc. parsing of line items so that it fits the DB model:
                for (var lineItemCat in newInvoice.lineItems) {
                    var lineItems = newInvoice.lineItems[lineItemCat];

                    for (var i = 0; i < lineItems.length; i++) {
                        var lineItem = lineItems[i];

                        //this is necessary because data is stored in subhoods even if the user checks the unknown box
                        if (lineItem['unknown']) {
                            lineItem.subHoods = [];
                        }

                        //convert subhood from array of {name: "foo"}s to array of "foo"s
                        lineItem.subHoods = _.pluck(lineItem.subHoods, 'name');

                        //remove elements only used by the frontend form - don't need to save in DB
                        delete lineItem['type'];
                        delete lineItem['unknown'];
                        delete lineItem['addNewSubHood'];

                        //If is cip, initiate the activities array as empty
                        if (lineItemCat === 'cip') {
                            lineItem['_activities'] = [];
                        }
                    }
                }

                //TODO: Needs to push to back of queue of next pipeline member (maybe all users that have QC - via DB query)

                //If all validation checks out:
                //post via $http, then redirect somewhere...
            }

            function throwValError(msg) {
                ctrl.errors.push({ type: 'error', message: msg });
            }

            function throwValWarning(msg) {
                ctrl.errors.push({ type: 'warning', message: msg });
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
//     if cip or warrant
//         hood must be selected
//         if not unknown
//             at least one subhood must be selected
//     amount cannot be less than zero
//     amount is more than 50K -> WARNING

// total cannot be less than zero
// amount on total is more than 150K -> WARNING
// user entered total must equal sum of all line item amounts



