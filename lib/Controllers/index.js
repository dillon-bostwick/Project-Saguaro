/**
 * requestProvider defines functions for every direct transactions. They are all
 * passed req and cb. Data corresponds with the body of the request user is an object
 * providing all user data. requestHandlers will only
 * be called after the user authentication is validated, meaning that these
 * functions should only deal with underlying request logic.
 *
 * all routeHandler cb set res as an object with the following elements:
 *
 * {
 * 		statusCode: (Number)
 * 		data: (Object)
 * 		errors: (array of strings or of objects)
 * }
 * 
 */

module.exports = {
	getInvoice: require('./getInvoice'),
	submitInvoice: require('./submitInvoice'),
	refreshDropzone: require('./refreshDropzone')
};