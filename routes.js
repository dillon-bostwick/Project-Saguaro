var express = require('express');
var _ = require('underscore');
var mongoose = require('mongoose');
var passport = require('passport');
var restify = require('express-restify-mongoose');
var models = require('./models');

var router = express.Router();
var User = models['user'];

////////////////////////////////////////////////////////////////////////

// API for registering new users and logging in:

router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

////////////////////////////////////////////////////////////////////////

//RESTful endpoints automated for all database collections:
//TODO: Validation - especially for delete (due to accidents) and post (due to XSS?)

_.map(models, function(model) {
	return model; //first param is name, uri suffix as string
}).forEach(function(model) {
	var uri = restify.serve(router, model);

	console.log("Restful endpoint served at: " + uri);
});

module.exports = router;