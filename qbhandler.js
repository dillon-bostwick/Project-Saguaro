var qbws = require('qbws');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('port', (process.env.PORT || 7000));

qbws.run();

// app.listen(app.get('port'), function() {
//   console.log('qbhandler running on ', app.get('port'));
// });