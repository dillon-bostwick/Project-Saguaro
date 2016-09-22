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
        when('/userdashboard', {
          template: '<user-dashboard></user-dashboard>'
        }).
        when('/', {
          template: '<a href="/auth/dropbox"><button>Log In with Dropbox</button></a>'
        }).
        when('/home', {
          template: '<p>Site map</p><a href="/#!/creator">Invoice creator</a><br><a href="/#!/userdashboard">User dashboard</a>'
        }).
        when('/angularroutenotfound', {
          template: '<p>Angular location provider found hash prefix "!#" in scope but no route</p>'
        }).
        otherwise('/angularroutenotfound');
    }
  ]);