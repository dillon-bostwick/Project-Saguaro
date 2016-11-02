var async = require('async');
var _ = require('underscore');

const Invoice = require('../models/invoice')
const User = require('../models/user')
const DropboxHandler = require('../dropboxHandler');
const globals = require('../globals');


/**
	 * Scan Dropbox "dropzone" directory, whose path is specified in globals,
	 * and load all the new ones into the database as keyable invoices.
	 *
	 * @param  {token} String - needed to authenticate dropbox connection
	 * @param  {Function(err)} callback with only error param because no payload
	 * @return {void}
*/
var loadFromDropzone = (token, callback) => {
	var dropboxToken = globals.testingMode ? globals.dropboxTestToken : token;
	var dropboxConnection = new DropboxHandler(dropboxToken);

	dropboxConnection.getDirList(globals.dropzonePath, (err, dirList) => {
		if (err) callback(err);

		//filter out folders etc
		let files = _.where(dirList.entries, { '.tag': 'file' });

		console.log(files);

		//run fileToActive on each file
		async.each(files, processFileToActive(dropboxConnection), callback);
	});
}

/**
 * processFileToActive
 *
 * returns a function that can then be executed on any Dropbox file object
 *
 * Given a file object from Dropbox, move it to the appropriate place in Dropbox
 * then create a new invoice object to be saved to the database. This is
 * intended for when a new invoice is to be uploaded with core metadata only
 * linked to the file - before a user manually keys the rest of the data.
 * 
 * @param  {Object} instance of a DropboxHandler logged in to a user
 * @return {Function(file, callback)}
 *         -> file: file object (see Dropbox)
 *         -> callback is Function(err) because no payload
 */
var processFileToActive = (dropboxConnection) => {
	// returns a function that can be executed on any Dropbox file object
	return (file, callback) => {
		// name of file itself must suffix dir path for moveFile
		var oldPath = file.path_lower
		var newPath = [globals.currentFilesPath, file.name].join('/')

		var tasks = [
			// #0: Move file from dropzone path to current files path
			(callback) => { dropboxConnection.moveFile(oldPath, newPath, callback) },
			// #1: make a new invoice object in the databse to correspond
			(callback) => { Invoice(generateInvFromFile(file)).save(callback) }
		];

		async.parallel(tasks, callback);
	}
}


/**
 * makeInvFromFile
 *
 * Given a file object from Dropbox, create a new invoice object to be saved to
 * the database. This is intended for when a new invoice is to be uploaded with
 * core metadata only linked to the file - before a user manually keys the rest
 * of the data.
 * 
 * @param  {Object} file object (see Dropbox)
 * @return {Object} invoice object (see Mongoose)
 */
function generateInvFromFile(file) {
	return {
		serviceDate: null,
		_vendor: null,
		invNum: null,
		amount: 0,
		lineItems: [],
		actions: [{
			desc: 'File uploaded to Dropbox ' + getCopyright() + 'Dropzone',
			date: file.client_modified,
			comment: null,
			_user: null
		}],
		fileId: file.id,
		toKey: true
	}
}

function getCopyright() {
	return String.fromCharCode(169);
}


module.exports = loadFromDropzone;