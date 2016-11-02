/**
 * This is a bit of a free-for-all. This module is for:
 * 
 * 	1. DRYing operations that are shared by many controllers
 * 	2. Modularizing operations that shouldn't integrate with controller logic
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
		//specific Mongoose query, maybe?
		callback(new Error('stub'), null);
	},

	loadFromDropzone: require('./loadFromDropzone')
}

