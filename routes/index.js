var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	console.log("msg");
});

router.get('/support', function(req, res) {
	console.log("Accessing support route");
});

router.get('/debug', function(req, res) {

})

module.exports = router;