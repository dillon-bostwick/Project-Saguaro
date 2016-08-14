//npm modules
var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var path = require('path');

//made by Dillon
var qbws = require('./qbws');
var models = require('./schema');
var routes = require('./routes/index');

var app = express();
app.set('port', (process.env.PORT || 5000));
console.log('Express server running on 5000');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));

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

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
app.use('/', routes);
// app.use('/users', users);

////////////////////////////////////
//SERVER SETUP//////////////////////
////////////////////////////////////

//qbws takes care of linking the server to the soap at '/wsdl'...
//The server must get passd to qbws.run(server) so that it knows
//where to listen

var server = http.createServer(app);
qbws.run(server);

//module.exports = app;
