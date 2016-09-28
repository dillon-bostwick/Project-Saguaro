'use strict';

angular.
    module('invoiceDetail').
    component('invoiceDetail', {
        templateUrl: 'components/invoice-detail/invoice-detail.template.html',
        controller: function InvoiceDetailController(api, $routeParams) {
            var self = this;

            self.Invoice = api.Invoice.get({ id: $routeParams.invoice_id })

            //TODO: eventually build everything found in the template (underscored things
            // that must be dereferenced will be root on self, not element of Invoice)

            

            self.newAction = {
                comment: '',
                _user: '' // TODO
            };

            self.User = {invoiceQueue: ['57eb6374ca3683110180e05e']}; //TODO






            self.total = _.pluck(self.Invoice.lineItems, 'amount').reduce(function(a, b) { return a + b; }, 0);
        }
    });