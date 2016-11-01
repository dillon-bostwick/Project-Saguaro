/**
 * DropboxHandler handles all direct transactions with the
 * Dropbox API, which is a basic HTTP RESTful interface.
 */

var request = require('request');

/**
 * @param {String} OAuth 2.0 token of the current user. This is used
 *                 to validate all subsequent requests.
 */
function DropboxHandler(token) {
    this.token = token;
}

/**
 * @param  {String}
 * @param  {Function(error, link)} path of file in user's Dropbox directory
 *          -> error: {Object or null}
 *          -> link: {String} temporary link to downloadable file
 * @return {void}
 */
DropboxHandler.prototype.getLink = function(pathParam, callback) {
    return request.post({
        url: 'https://api.dropboxapi.com/2/files/get_temporary_link',
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            path: pathParam
        })
    },
    handleApiResponse(callback));
}

/**
 * @param  {String}   pathParam
 * @param  {Function} callback
 *         -> error: {Object or null}
 *         -> stream: {Binary}
 * @return {void}
 */
DropboxHandler.prototype.getStream = function(pathParam, callback) {
    return request.post({
        url: 'https://content.dropboxapi.com/2/files/download',
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Dropbox-API-Arg': JSON.stringify({
                path: pathParam
            })
        }
    },
    handleApiResponse(callback));
}

/**
 * @param  {String}
 * @param  {String}
 * @param  {Function(error)}
 * @return {void}
 */
DropboxHandler.prototype.moveFile = (oldPath, newPath, callback) => {
    //TODO
}



function handleApiResponse(callback) {
    return function(err, res, body) {
        if (err) {
            callback(err, null);
        } else if (res.statusCode !== 200) {
            callback(res.body, null);
        } else {
            callback(null, body);
        }
    }
}



module.exports = DropboxHandler;

