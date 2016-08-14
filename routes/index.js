var express = require('express');
var models = require('../schema');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("msg");
});

router.get('/support', function(req, res) {
	console.log("Accessing support route");
});

router.get('/debug', function(req, res) {

})

//Pass an invoice object JSON
router.post('/writeinvoice', function(req, res) {
	models.Invoice({
		vendor: req.body.vendor,
		created: Date.now,
		amount: req.body.amount,
		memo: req.body.memo,
		activities: req.body.activities,
		hoods: req.body.hoods
	}).save(mongoWriteLog);
})



//////HELPERS/////////

var mongoWriteLog = function(error) {
	if (error) {
		console.log("Attempt to write to DB failed");
	} else {
		console.log("Successfully wrote to DB");
	}
}



module.exports = router;