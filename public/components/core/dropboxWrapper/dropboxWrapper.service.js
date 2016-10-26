/*
    getters return promises

 */

'use strict';

angular.
    module('core.dropboxWrapper')
    .factory('dropboxWrapper', function($http, $q) {
        var token = '';

        var logFailure = function(error) {
            console.log("dropboxWrapper - Something went wrong: ", error);
            return error;
        }

        return {
            setToken: function(token) {
                this.token = token;
            },

            getFile: function(pathParam) {
                return $http({
                    url: 'https://content.dropboxapi.com/2/files/download',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                        'Dropbox-API-Arg': JSON.stringify({ path: pathParam })
                    }
                    // data: JSON.stringify({
                    //     path: pathParam
                    // })
                })
            },

            getLink: function(pathParam) {
                return $http({
                    url: 'https://api.dropboxapi.com/2/files/get_temporary_link',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.token,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        path: pathParam
                    })
                })
            },

            addFile: function(file) {
                return 'stub';
            },

            setFile: function(file, invoiceId) {
                return 'stub';
            }
        };
    });



