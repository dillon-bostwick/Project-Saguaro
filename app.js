/* Dillon Bostwick 2016
 * 
 * app.js establishes router with express.
 * 
 * Serves:
 * /api/... - RESTful connection to db
 * /wsdl - SOAP connection to qbwc
 * /#!/... - Angular app
 * mongoDB connection on port 27017
 */

//imported modules
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var path = require('path');
var passport = require('passport');
var expressSession = require('express-session');
var _ = require('underscore');
var dropboxStrategy = require('passport-dropbox-oauth2').Strategy;

//local modules
var qbws   = require('./qbws');
var router = require('./routes');
var User = _.find(require('./models'), function(model) { return model.modelName === 'user'});

//CONSTANTS:

var BRIGHTWATERDROPBOXTEAMID = 'dbtid:AADIihV4QHYt6wCTX1MN2VVwJmdBDiv7tc4';
var LOCALHOSTCALLBACK = 'http://localhost:5000/auth/dropbox/callback';
var HEROKUCALLBACK = 'http://saguaroqbtester.herokuapp.com/auth/dropbox/callback';

var DBSTRATEGYOPTIONS = {
  apiVersion: '2',
  clientID: 'o2h3e5h6mytkwvg',
  clientSecret: 'n59fazsvvrs7708',
  callbackURL: process.env.PORT ? HEROKUCALLBACK : LOCALHOSTCALLBACK //assuming that if process.env.PORT is truthy we're on heroku...
}

////////////////////////////////////
//DATABASE SETUP////////////////////
////////////////////////////////////

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/saguaro"); // db is called 'saguaro'

var db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection to MongoDB failed"));

db.once("open", function(callback) {
  console.log("Connection to MongoDB successful, running on 27017");
});

////////////////////////////////////
//OAUTH SETUP///////////////////////
////////////////////////////////////

passport.use(
  new dropboxStrategy(
    DBSTRATEGYOPTIONS,
    function(accessToken, refreshToken, profile, done) {
      if (!profile._json.team || profile._json.team.id != BRIGHTWATERDROPBOXTEAMID) {
        done('ERROR: User is valid Dropbox user but does not belong to the Brightwater Homes team', false);
      } else {
        User.findById(profile._json.account_id, function(err, data) {
          if (err) {
            done('An error occured while retrieving user from database:\n\n\n' + 
            JSON.stringify(err) + '\n\n\nYour Dropbox user ID: ' +
            profile._json.account_id, false);
          } else {
            data.currentToken = accessToken;

            data.save(function() {
              console.log(data);
              done(null, data);
            }); //end save
          } //end if
        }); //end findByIdandUpdate
      } //end if
    }) //end dropboxStrategy constructor
); //end passport.use

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//Declaring app after Oauth setup - see https://github.com/passport/express-4.x-twitter-example/blob/master/server.js
var app = express();

app.set('port', (process.env.PORT || 5000));
console.log('Express server running on 5000');

////////////////////////////////////
//MIDDLEWARE////////////////////////
////////////////////////////////////

app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public'))); // accesses Angular app, with ensureLoggedIn as middleware
app.use(expressSession({ secret: 'dillon', resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', router); // routes must declare after passport


////////////////////////////////////
//SERVER SETUP//////////////////////
////////////////////////////////////

//qbws takes care of linking the server to the soap at '/wsdl'...
//The server must get passed to run so that qbws knows
//where to listen

var server = http.createServer(app);
qbws.run(server);

module.exports = app;

////////////////////////////////////

/* Returns the _id of a user in the databse with the matching dropboxUid.
 * if no match, returns null
 */
function getUserIdByDropboxId(dropboxUid) {
  //find in models array
  _.find(models, function(model) { return model.modelName === 'user'})
  
  //db find given result of previous find
  .find({'dropboxUid': dropboxUid}, function(error, data) {
    return error ? null : data._id
  });
}
