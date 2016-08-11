var qbws = require('qbws');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('port', (process.env.PORT, 5000)); //ALWAYS LOCAL HOST!

qbws.run();

app.post('/', function(req, res) {
	var billData = req.body;

	//do something with billData
})

app.listen(app.get('port'), function() {
  console.log('Feed data to qbhandler on ', app.get('port'));
});