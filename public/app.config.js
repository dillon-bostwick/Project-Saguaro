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
        when('/', {
          template: '<a href="/auth/dropbox"><button>Log In with Dropbox</button></a>'
        }).
        when('/home', {
          template: '<p>Homepage under construction</p><a href="/#!/creator">Invoice creator</a>'
        }).
        when('/angularroutenotfound', {
          template: '<p>Angular location provider found hash prefix "!#" in scope but no route</p>'
        }).
        otherwise('/angularroutenotfound');
    }
  ]);