/**
 * Given a invoice id, send back a filestream
 */

var fs = require('fs');
var mime = require('mime-types');

const DropboxHandler = require('../dropboxHandler')
const globals = require('../globals')

var getInvoiceFileStream = (req, res, next) => {
	var id = req.params.id;
	var dropboxToken = globals.testingMode ? globals.dropboxTestToken : user.currentToken;
	var dropboxConnection = new DropboxHandler(dropboxToken);
	var file;
	var fileType;

	if (!id) {
		res.sendStatus(400);
	}


	dropboxConnection.getLink('/sampleinvoice.pdf', (err, stream) => {
		if (err) return next(err);

		// var buffer = new Buffer(stream);

		// console.log(fs.createReadStream(buffer));
		// 
		
		console.log(stream);

		file = fs.createReadStream(stream);

		// try {
		// 	fileType = mime.lookup(stream);
		// } catch(err) {
		// 	next(err);
		// }
		
		res.writeHead(200, { 'Content-Type': 'image/png' });
    	res.end(file, 'binary');
	});
}

module.exports = getInvoiceFileStream;





