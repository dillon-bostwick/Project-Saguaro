var express = require('express');
var bodyParser = require('body-parser');
var qbws = require('qbws');

var app = express();

app.set('port', (process.env.PORT || 6000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', function(req, res) {
	var billData = req.body;

	qbws.run();
})

app.listen(app.get('port'), function() {
  console.log('qbhandler is running on port', app.get('port'));
});