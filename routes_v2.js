/**
 * routes_v2.js
 *
 * API has been completely revamped.
 *
 */

var express = require('express');
var passport = require('passport');
var _ = require('underscore');

var TESTINGMODE = require('./lib/globals').testingMode;  //allows routes to be accessed without a session id (otherwise sends 401)
var RouteHandler = require('./lib/requestHandler')

var router = express.Router();

var AUTHREDIRECTS = {
	successRedirect: '/#!/dashboard',
    failureRedirect: '/#!/404'
}

router.get('/auth/dropbox', passport.authenticate('dropbox-oauth2'));
router.get('/auth/dropbox/callback', passport.authenticate('dropbox-oauth2', AUTHREDIRECTS));

router.get('/getinvoice', doRequest(RouteHandler.getInvoice));
router.get('/getownqueues', doRequest(RouteHandler.getOwnQueues));
router.get('/getbusinessproperties', doRequest(RouteHandler.getBusinessProperties));
router.post('/submitinvoice', doRequest(RouteHandler.submitInvoice));

/**
 * @param  {function(body)} - only body of request is exposed to handler
 * @return {void}
 *
 * A handler responds with an object containing
 * 		statusCode {Number}
 * 		errors {array of Strings}
 * 		data {Object}
 *
 * doRequest always sends a response to the client containg
 * 		user {Object}
 * 		errors {array of Strings}
 * 		data {Object}
 *
 * TODO: Abstract the try-catch for internal server errors to here - just put the 500 here
 */
function doRequest(handlerFunc) {
	return function(req, res) {
		var handlerResult

		//req.user==undefined means sid signature failed
		if (!req.user && !TESTINGMODE) {
			res.sendStatus(401);
			return;
		}

		handlerResult = handlerFunc(req);

		if (handlerResult.statusCode === 200) {
			res.json({
				user: req.user || null,
				data: handlerResult.data,
				errors: handlerResult.errors
			});
		} else {
			if (_.isEmpty(handlerResult.errors)) {
				res.sendStatus(handlerResult.statusCode)
			} else {
				res.status(handlerResult.statusCode)
				   .json({ errors: handlerResult.errors });
			}
		}
	}
}

module.exports = router;