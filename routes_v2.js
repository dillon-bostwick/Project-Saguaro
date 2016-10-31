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
var Controllers = require('./lib/Controllers')

const TESTINGMODE = require('./lib/globals').testingMode;  //allows routes to be accessed without a session id (otherwise sends 401)

const authRedirects = {
	successRedirect: '/#!/dashboard',
    failureRedirect: '/#!/404'
}


router.get('/auth/dropbox', passport.authenticate('dropbox-oauth2'));
router.get('/auth/dropbox/callback', passport.authenticate('dropbox-oauth2', authRedirects));

/**
 * pre-response middleware:
 *
 * Verify valid SID - respond with 401 status code if not logged in
 */
router.use((req, res, next) => {
	if (!req.user && !TESTINGMODE) {
		res.sendStatus(401)
	} else {
		next();
	}
});


router.get('/invoice/:id', Controllers.getInvoice);
router.get('/getownqueues', Controllers.getOwnQueues);
router.get('/getbusinessproperties', Controllers.getBusinessProperties);
router.post('/submitinvoice', Controllers.submitInvoice);

/**
 * Error-handling middleware:
 *
 * Log error stack to console then respond with a 500 status code
 */
router.use((err, req, res, next) => {
	if(err.stack) {
		console.log(err.stack);
	} else {
		console.log(err);
	}
	
	res.sendStatus(500);
	next();
});






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
		//req.user==undefined means sid signature failed
		if (!req.user && !TESTINGMODE) {
			res.sendStatus(401);
			return;
		}

		try {
			handlerFunc(req, function(res) {
				
			});
		}

		catch (error) {
			logError(handlerFunc.name, error)
			res.sendStatus(500);
			return;
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