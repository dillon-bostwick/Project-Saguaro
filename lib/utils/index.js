/**
 * 
 */

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

	loadFromDropzone: require('./loadFromDropzone')
}

