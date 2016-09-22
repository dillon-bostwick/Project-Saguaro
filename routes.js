var express = require('express');
var _ = require('underscore');
var mongoose = require('mongoose');
var passport = require('passport');
var restify = require('express-restify-mongoose');
var ensureLogin = require('connect-ensure-login');
var models = require('./models');

var router = express.Router();
var User = models['user'];

////////////////////////////////////////////////////////////////////////

//initial authentication send
router.get('/auth/dropbox', passport.authenticate('dropbox'));

//callback from dropbox after authentication
router.get('/auth/dropbox/callback',
           passport.authenticate('dropbox', {
                                  successRedirect: '/#!/home',
                                  failureRedirect: '/#!/angularroutenotfound',
                                  failureFlash: true }));

//get user data
router.get('/userdata', function(req, res) {
    if (req.user === undefined) {
        res.json({}); // The user is not logged in
    } else {
        res.json({ //TODO: currently req.user stores the user _id of the current user whenver this call is made. instead of responding with some static test full user object, take req.user and query DB by id for actual usuer object, which should be responded 
            name: 'Marsi Bostwick'
        });
    }
});

////////////////////////////////////////////////////////////////////////

//RESTful endpoints automated for all database collections:
//TODO: Validation with connect-ensure-login as middleware for every endpoint, but make sure it doesn't cause a redirect to an OAuth page after every single request
//TODO: Figure out how this framework deals with POST json syntax

_.map(models, function(model) {
	return model; //first param is name, uri suffix as string
}).forEach(function(model) {
	var uri = restify.serve(router, model);

	console.log("Restful endpoint served at: " + uri);
});

module.exports = router;