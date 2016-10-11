/* TODO FINAL:
 * - reinsert ensureLoggedIn('/') as middleware (second argument) for get/post/put methods
 */

var express = require('express');
var _ = require('underscore');
var mongoose = require('mongoose');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var models = require('./models');

var router = express.Router();

var userModel = _.find(models, function(model) { return model.modelName === 'user'})

////////////////////////////////////////////////////////////////////////

//initial authentication send
router.get('/auth/dropbox', passport.authenticate('dropbox'));

//callback from dropbox after authentication
router.get('/auth/dropbox/callback',
           passport.authenticate('dropbox',
                                 {
                                    successRedirect: '/#!/dashboard',
                                    failureRedirect: '/#!/404'
                                 }));

////////////////////////////////////////////////////////////////////////

/* get user data from cookie (requires round trip due to sid instead of jwt).
 * Returns entire user document, not just the _id
 * Note: you can check success with returnedObject.error == false
 */
router.get('/api/currentuser', function(req, res) {
    // In this case, req.user is actually the _id of the current user
    if (req.user === undefined) {
        res.send({ loggedIn: false }); // The user is not logged in
    } else {
        userModel.findById(req.user, function(error, data) { // (async)
            if (error) {
                res.send({ error: error }) // User id missing from DB
            } else {
                res.send(data);
            }
        });        
    }
});

////////////////////////////////////////////////////////////////////////

//RESTful endpoints manually created for each database collections:

_.map(models, function(model) { return model; }).forEach(function(model) {

    /* POST (CREATE)
     * Pass an object (note: mongoose doesn't validate)
     * Nothing is sent back.
     * anything as an extram URI param has no effect (wildcard)
     */
    router.post('/api/' + model.modelName + '/:wildcard', function(req, res) {
        model(req.body).save(function(error) {
            console.log(error);
            if (error) {
                console.log('Error:\n' + JSON.stringify(error));
                res.send(error);
            } else {
                res.send({ success: true })
            }
        });
    });

    /* GET (READ) by query
     * Pass a standard MongoDB query as params
     * The entire object is sent back.
     */
    router.get('/api/' + model.modelName, function(req, res) {
        model.find(req.query, function(error, data) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                res.send(data);
            }
        });
    });

    /* GET by id
     * same as get by query except the id is passed as part of the URI
     */
    router.get('/api/' + model.modelName + '/:id', function(req, res) {
        model.findById(req.params.id, function(error, data) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                res.send(data);
            }
        });
    });

    /* PUT (UPDATE) by id
    * Any updates to elements (adding elements, etc.) pass as body
    * Imposible to remove single elements but an array can be fully replaced.
    *
    * Nothing is sent back.
    */
    router.put('/api/' + model.modelName + '/:id', function(req, res) {
        model.findById(req.params.id, function(error, data) {
            if (error) {
                console.log("Error with finding id:\n" + error);
                res.json(error);
            } else {
                _.extend(data, req.body)
                .save(function(error, data) {
                    if (error) {
                        console.log("Error updating model:\n" + error);
                        res.json(error);
                    } else {
                        res.json({ success: true });
                    }
                });
            }
        });
    })

    /* DELETE by id
    * Pass a standard MongoDB query as params
    * Nothing is sent back.
    */
    router.delete('/api/' + model.modelName + '/:id', function(req, res) {
        model.findByIdAndRemove(req.params.id, function(error) {
            console.log(error);
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.json({ success: true });
            }
        });
    });
});


module.exports = router;













//This is the module way of doing it:
// .forEach(function(model) {
//  var uri = require('express-restify-mongoose').serve(router, model);

//  console.log("Restful endpoint served at: " + uri);
// });
