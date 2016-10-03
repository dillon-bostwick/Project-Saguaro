'use strict';

angular.
    module('core.api').
    factory('api', ['$resource', function($resource) {
        var collNames = [
            'Invoice',
            'Vendor',
            'User',
            'Activity',
            'Expense',
            'Hood',
            'Bills',
            'currentUser'
        ]

        //returns an object literal with full $resource for each collection
        return _.object(collNames, _.map(collNames, function(collName) {
            return $resource('/api/' + collName + '/:id', { id: '@_id' },
            {
                update: { method: 'PUT' }
            })
        }));
    }])


// In case you want to do the force logout logic in the client (not recommended):
//set a $http factory with the logic below for user checking
//Find a way for User to be in $scope so it can literally be accessed anywhere including index.html without any explicit requests


            // $http.get('/api/currentuser').then(function success(res) {
            //     if (res.data.error) { // user was not authenticated - shut out
            //         $window.location.href = '/'
            //     } else {
            //         self.User = res.data;
            //     }
            // }, httpError);

            // function httpError(res) {
            //     alert('500: There was a problem loading data with $http: ' + res);
            // }