var express = require('express');
var bodyParser = require('body-parser');
var qbws = require('qbws');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var routes = require('./routes/index');
// var users = require('./routes/users');

//qbws.run() //soap server is listening on port 8000

var app = express();

app.set('port', (process.env.PORT || 5000));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
 
// app.use('/', routes);
// app.use('/users', users);

////////////////////////////////////
//ROUTES////////////////////////////
////////////////////////////////////

app.post('/newbill', function(req, res) {
  //var foo = req.body;
  qbws.run()
})

app.post('/newinvoice', function(req, res) {
  var invoice = req.body;
})

app.get('/', function(req, res) {
  console.log("Someone's accessing root");
  res.send("hello");
})

////////////////////////////////////

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//module.exports = app;
