var express = require('express');
var _ = require('underscore');
var mongoose = require('mongoose');
var passport = require('passport');
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
                                  failureRedirect: '/#!/404'}));

//get user data
router.get('/userdata', function(req, res) {
    if (req.user === undefined) {
        res.json({}); // The user is not logged in
    } else {
        res.json({ //TODO: currently req.user stores the user _id of the current user whenever this call is made. Instead of responding with some static test full user object, take req.user and query DB by id for actual user object, which should be responded 
            name: 'Marsi Bostwick',
            _id: '123'
        });
    }
});

////////////////////////////////////////////////////////////////////////

//RESTful endpoints manually created for each database collections:
//TODO: Validation with connect-ensure-login as middleware for every endpoint, but make sure it doesn't cause a redirect to an OAuth page after every single request

_.map(models, function(model) { return model; }).forEach(function(model) {

    /* POST (CREATE)
    * Pass an object (note: mongoose doesn't validate)
    * Nothing is sent back.
    */
    router.post('/api/' + model.modelName, function(req, res) {
        model(req.body).save(function(error) {
            res.send(error);
        });
    });

    /* GET (READ)
    * Pass a standard MongoDB query as params
    * The entire object is sent back.
    */
    router.get('/api/' + model.modelName, function(req, res) {
        model.find(req.query, function(error, data) {
            if (error) {
                res.send(error);
            } else {
                res.send(data);
            }
        });
    });

    /* PUT (UPDATE)
    * Pass a standard MongoDB query as params
    * Any updates to elements (adding elements, etc.) pass as body
    * Imposible to remove single elements but an array can be fully replaced.
    *
    * Nothing is sent back.
    */
    router.put('/api/' + model.modelName, function(req, res) {
        model.find(req.query, function(error, data) {
            if (error) {
                res.send(error);
            } else {
                var updated = _.extend(req.body, data)

                model.update(req.query, updated, mongoLog);
            }
        });
    })

    /* DELETE
    * Pass a standard MongoDB query as params
    * Nothing is sent back.
    */
    router.delete('/api/' + model.modelName, function(req, res) {
        model.remove(req.query, function(error) {
            res.send(error);
        });
    });
});


module.exports = router;


//This is the module way of doing it:
// .forEach(function(model) {
// 	var uri = require('express-restify-mongoose').serve(router, model);

// 	console.log("Restful endpoint served at: " + uri);
// });



