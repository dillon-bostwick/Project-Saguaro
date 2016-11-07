/**
 * routes_v2.js
 *
 * API has been completely revamped, v1 deprecated as of Oct 28 2016.
 *
 */

var express = require('express');
var passport = require('passport');
var _ = require('underscore');
var bunyanLogger = require('express-bunyan-logger');

var router = express.Router();
var Controllers = require('./lib/Controllers')
var utils = require('./lib/utils')

const TESTINGMODE = require('./lib/globals').testingMode;  //allows routes to be accessed without a session id (otherwise sends 401)

const authRedirects = {
	successRedirect: '/#!/dashboard',
    failureRedirect: '/#!/404' // TODO
}

router.get('/auth/dropbox', passport.authenticate('dropbox-oauth2'));
router.get('/auth/dropbox/callback', passport.authenticate('dropbox-oauth2', authRedirects));

/**
 * Error-handling for auth routes
 * 
 * TODO: Should the view for error handling for auth routes be rendered by Express or by Angular?
 * TODO: Shouldn't always send 500 - sometimes its 4xx depending on what happened
 */
router.use((err, req, res, next) => {
	res.status(500).send(err)
});

/**
 * pre-response middleware:
 *
 * Verify valid SID - respond with 401 if not logged in
 */
router.use((req, res, next) => {
	if (!req.user && !TESTINGMODE) {
		res.sendStatus(401)
	} else {
		next();
	}
});


router.get('/invoice/:id', Controllers.getInvoice);
router.get('/refreshdropzone', Controllers.refreshDropzone)
router.post('/submitinvoice', Controllers.submitInvoice);


/**
 * Error-handling for core api v2 routes:
 *
 * Log error stack then respond with 500
 *
 * Don't expose error message to client
 */
router.use((err, req, res, next) => {
	if(err.stack) {
		console.log(err.stack);
	} else {
		console.log(err || 'Error-handling middleware called with no error');
	}
	
	res.sendStatus(500); 
});




module.exports = router;