'use strict';

angular.
    module('settings').
    component('settings', {
        templateUrl: 'components/settings/settings.template.html',
        controller: function SettingsController(api, $window) {
        	var self = this;
            window.ctrl = self;
            self.path = $window.location.hash

            ////////////////////////////////////////////////////////////////////

            
    	}
    });