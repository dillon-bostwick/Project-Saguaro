var express = require('express');
var _ = require('underscore');
var schema = require('../schema');

var router = express.Router();

//All database CRUD Routes:

_.map(schema.models, function(model) {
	return model;
}).forEach(function(model) {

	/* POST (CREATE)
	 * Pass an object (note: mongoose doesn't validate)
	 * Nothing is sent back.
	 */
	router.post('/' + model.modelName + 's', function(req, res) {
		model(req.body).save(mongoLog);
	})

	/* GET (READ)
	 * Pass a standard MongoDB query as params
	 * The entire object is sent back.
	 */
	router.get('/' + model.modelName + 's', function(req, res) {
		model.find(req.query, function(error, data) {
			if (error) {throw error;}

			res.send(data);
		})
	})

	/* PUT (UPDATE)
	 * Pass a standard MongoDB query as params
	 * Any updates to elements (adding elements, etc.) pass as body
	 * Imposible to remove single elements but an array can be fully replaced.
	 *
	 * Nothing is sent back.
	 */
	 router.put('/' + model.modelName + 's', function(req, res) {
		model.find(req.query, function(error, data) {
			if (error) {throw error}

			var updated = _.extend(req.body, data)

			model.update(req.query, updated, mongoLog);
 		})
	})

 	/* DELETE
 	 * Pass a standard MongoDB query as params
 	 * Nothing is sent back.
 	 */
	router.delete('/' + model.modelName + 's', function(req, res) {
		console.log(req);
		model.remove(req.query, mongoLog);
	}) 
});


// //Helper (saves boilerplating the error callback)
var mongoLog = function(error) {
	if (error) {throw error;}

	console.log("Successful write to MongoDB");
}


module.exports = router;