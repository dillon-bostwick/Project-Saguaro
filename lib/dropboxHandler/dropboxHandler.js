/* DropboxHandler handles all direct transactions with the
 * Dropbox API, which is a basic HTTP RESTful interface.
 *
 * Public method summary:
 *    DropboxHandler(token)
 *    getLink(path, callback) -> function(error, link)
 *    moveFile(oldPath, newPath, callback) -> function(error)
 */

var request = require('request');

/* constructor: DropboxHandler(token)
 *    token: (String) then OAuth 2.0 token of the current user. This is used
 *           to validate all subsequent requests.
 *
 *    returns void
 */
function DropboxHandler(token) {
    this.token = token;
}

/* getLink(path, callback)
 *
 *    pathParam: (String) path of file in user's Dropbox directory
 *    callback: (function(error, link))
 *       -> error: Object or null
 *       -> link: (String) temporary link to the downloadable file
 *
 *    returns void
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

/* moveFile(oldPath, newPath, callback)
 * 
 *    oldPath: String
 *    newPath: String
 *    callback: function(error)
 */
DropboxHandler.prototype.moveFile = function(oldPath, newPath, callback) {
    //TODO
}



module.exports = DropboxHandler;

