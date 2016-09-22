//npm modules
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var path = require('path');
var passport = require('passport');
var expressSession = require('express-session');
var ensureLogin = require('connect-ensure-login');
var dropboxStrategy = require('passport-dropbox').Strategy;

//local imports
var qbws   = require('./qbws');
var router = require('./routes');

var BRIGHTWATERDROPBOXTEAMID = 'dbtid:AADIihV4QHYt6wCTX1MN2VVwJmdBDiv7tc4';

////////////////////////////////////
//OAUTH SETUP///////////////////////
////////////////////////////////////
passport.use(new dropboxStrategy({
    consumerKey: 'bj9n6iwwtrj0hbg',
    consumerSecret: 'qtiymyui2i9yjtv',
    callbackURL: 'http://localhost:5000/auth/dropbox/callback'
  }, function(token, tokenSecret, profile, done) {
  		var _user = getUserIdByDropboxId(profile._json.uid); // TODO: needs query callback with err: if no match, return done(null, false, { message: 'Welcome Brightwater member. Have you not logged in to Saguaro yet? Contact an admin with the following unique Dropbox UID: ' + profile._json.uid})

  		if (profile._json.team.team_id != BRIGHTWATERDROPBOXTEAMID) {
  			return done('user is not in brightwater', false, { message: 'User is valid Dropbox user but does not belong to the Brightwater Homes team'})
  		}

    	return done(null, _user, { message: 'Welcome back' });
}));

//Serialize user by 
passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  	cb(null, obj);
});



//Declaring app after Oauth setup - see https://github.com/passport/express-4.x-twitter-example/blob/master/server.js
var app = express();

app.set('port', (process.env.PORT || 5000));
console.log('Express server running on 5000');

////////////////////////////////////
//DATABSE SETUP/////////////////////
////////////////////////////////////

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/saguaro");

var db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection to MongoDB failed"));
db.once("open", function(callback) {
	console.log("Connection to MongoDB successful, running on 27017");
});

////////////////////////////////////
//MIDDLEWARE////////////////////////
////////////////////////////////////

app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public'))); // accesses Angular app, with ensureLoggedIn as middleware
app.use(expressSession({ secret: 'the future is bright', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', router); // routes must declare after passport


////////////////////////////////////
//SERVER SETUP//////////////////////
////////////////////////////////////

//qbws takes care of linking the server to the soap at '/wsdl'...
//The server must get passd to run so that qbws knows
//where to listen

var server = http.createServer(app);
qbws.run(server);


module.exports = app;

////////////////////////////////////

function getUserIdByDropboxId(id) {
	return '123'; //TODO
}
