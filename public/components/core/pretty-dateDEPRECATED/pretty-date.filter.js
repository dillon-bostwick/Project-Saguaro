'use strict';

angular.
	module('core').
	filter('prettyDate', function() {
		return function(date) {
			return moment(date).format('MM-DD-YYYY')
		};
	});