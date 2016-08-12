var qbws = require('qbws');
var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();
var server = http.createServer(app);

app.set('port', (process.env.PORT || 5000));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
// app.use('/', routes);
// app.use('/users', users);

////////////////////////////////////
//ROUTES////////////////////////////
////////////////////////////////////



qbws.run();

////////////////////////////////////

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

//module.exports = app;
