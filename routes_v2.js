/**
 * routes_v2.js
 *
 * API has been completely revamped, v1 deprecated as of Oct 28 2016.
 *
 */

var express = require('express');
var passport = require('passport');
var _ = require('underscore');

var router = express.Router();
var RequestProvider = require('./lib/requestProvider')

const TESTINGMODE = require('./lib/globals').testingMode;  //allows routes to be accessed without a session id (otherwise sends 401)

const AUTHREDIRECTS = {
	successRedirect: '/#!/dashboard',
    failureRedirect: '/#!/404'
}

router.get('/auth/dropbox', passport.authenticate('dropbox-oauth2'));
router.get('/auth/dropbox/callback', passport.authenticate('dropbox-oauth2', AUTHREDIRECTS));

router.get('/invoice/:id', doRequest(RequestProvider.getInvoice));
router.get('/getownqueues', doRequest(RequestProvider.getOwnQueues));
router.get('/getbusinessproperties', doRequest(RequestProvider.getBusinessProperties));
router.post('/submitinvoice', doRequest(RequestProvider.submitInvoice));

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
 * TODO: Should this be middleware (i.e. router.use) instead?
 */
function doRequest(handlerFunc) {
	return (req, res) => {
		var handlerResult;

		//req.user==undefined means sid signature failed
		if (!req.user && !TESTINGMODE) {
			res.sendStatus(401);
			return;
		}

		try {
			handlerResult = handlerFunc(req);
		} catch (error) {
			logError(handlerFunc.name, error)
			res.sendStatus(500);
			return;
		}

		if (!handlerResult) {
			logError(handlerFunc.name, 'No response')
			res.sendStatus(500);
		} else if (handlerResult.statusCode === 200) {
			res.json({
				user: req.user || null,
				data: handlerResult.data,
				errors: handlerResult.errors
			});
		} else if (_.isEmpty(handlerResult.errors)) {
			res.sendStatus(handlerResult.statusCode)
		} else {
			res.status(handlerResult.statusCode)
			   .json({ errors: handlerResult.errors });
		}
	}
}

function logError(funcName, errorMessage) {
	if (TESTINGMODE) {
		console.log('   Error: ' + funcName + ' returned:\n');
		console.log('   ' + errorMessage + '\n');
	}
}





module.exports = router;