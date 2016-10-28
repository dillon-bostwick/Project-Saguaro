/**
 * api.service.js
 *
 * factory for deprecated v1 api. Use $resource instead of $http because the v1
 * api is a standard RESTful API conforming with basic CRUD operations
 */

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
            'Group',
            'CurrentUser'
        ]

        //returns an object literal with full $resource for each collection
        return _.object(collNames, _.map(collNames, function(collName) {
            return $resource('/api/v1/' + collName + '/:id', { id: '@_id' },
            {
                update: { method: 'PUT' }
            })
        }));
    }])