const DropboxHandler = require('../dropboxHandler');
const globals = ('../globals');

module.exports = {

	/**
	 * Get a list of all invoice objects in the database that still need to be
	 * keyed.
	 * 
	 * @param  {Function(err, invoices)} invoices is an array of objects
	 * @return {void}
	 */
	getKeyableInvoices: (callback) => {
		callback(new Error('stub'), null);
	},


	/**
	 * Scan Dropbox "dropzone" directory, whose path is specified in globals,
	 * and load all the new ones into the database as keyable invoices.
	 *
	 * @param  {token} String - needed to authenticate dropbox connection
	 * @param  {Function(err)} callback with only error param because no payload
	 * @return {void}
	 */
	loadNewFromDropzone: (token, callback) => {

		var dropboxToken = globals.testingMode ? globals.dropboxTestToken : token;
		var dropboxConnection = new DropboxHandler(dropboxToken);

		dropboxConnection.

		callback(new Error('stub'), null);
	}

}