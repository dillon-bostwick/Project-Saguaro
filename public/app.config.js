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
        when('/dashboard', {
          template: '<user-dashboard></user-dashboard>'
        }).
        when('/invoices/:id', {
          template: '<invoice-detail></invoice-detail>'
        }).
        
        when('/', {
          template: '<a href="/auth/dropbox"><button>Log In with Dropbox</button></a>'
        }).
        
        when('/home', {
          template: 'Hello'
        }).
        when('/404', {
          template: '<h2>404</h2><p>I can\'t find what you\'re looking for</p>'
        }).
        otherwise('/404');
    }
  ]);