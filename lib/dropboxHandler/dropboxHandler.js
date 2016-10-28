/**
 * DropboxHandler handles all direct transactions with the
 * Dropbox API, which is a basic HTTP RESTful interface.
 *
 * Public method summary:
 *    DropboxHandler(token)
 *    getLink(path, callback) -> function(error, link)
 *    moveFile(oldPath, newPath, callback) -> function(error)
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
 *          -> error: Object or null
 *          ->link: {String} temporary link to downloadable file
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
    function(error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null, JSON.parse(body).link);
        } else {
            callback(error, null);
        }
    })
}

/**
 * @param  {String}
 * @param  {String}
 * @param  {Function(error)}
 * @return {void}
 */
DropboxHandler.prototype.moveFile = function(oldPath, newPath, callback) {
    //TODO
}



module.exports = DropboxHandler;

