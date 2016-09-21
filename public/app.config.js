'use strict';

angular.
	module('saguaro').
	config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
    	$locationProvider.hashPrefix('!');

    	$routeProvider.
        when('/creator', {
          template: '<invoice-creator></invoice-creator>'
        }).
        otherwise('/creator');
    }
  ]);
