'use strict';

angular.
    module('core.dropboxWrapper')
    .factory('dropboxWrapper', function($http) {
        var token = '';

        var logFailure = function(error) {
            console.log("dropboxWrapper - Something went wrong: ", error);
        }

        return {
            setToken: function(token) {
                this.token = token;
            },

            getFile: function(pathParam) {
                $http({
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
                .then(function(response) {
                    console.log(response);
                },
                logFailure)
            },

            addFile: function(file) {
                return 'stub';
            },

            setFile: function(file, invoiceId) {
                return 'stub';
            }
        };
    });



            // $.ajax({
            //     url: 'https://api.dropboxapi.com/2/files/list_folder',
            //     method: 'POST',
            //     dataType: 'json',

            //     data: JSON.stringify({
            //         path: '',
            //         recursive: false,
            //         include_media_info: false,
            //         include_deleted: false,
            //         include_has_explicit_shared_members: false
            //     }),

            //     headers: {
            //         "Authorization": "Bearer 3uSEkSqtVsEAAAAAAAAXd-5yT8CClQxvZZjgCvcqcaXEXKTD0m4N8Abiv0PcfpTR",
            //         "Content-Type": "application/json"
            //     }
            // })
            // .done(function(data) {
            //     console.log("Successful dropbox connection returned: ", data);
            // })
            // .fail(function(data) {
            //     console.log("Connection to Dropbox failed. Payload from server: ", data);
            // });


