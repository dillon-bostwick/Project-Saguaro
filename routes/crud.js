var express = require('express');
var schema = require('../schema')

var router = express.Router();

//All database CRUD Routes:

for (var key in schema.models) {
	var model = schema.models[key];

	/* Pass an object (if it is missing key value pairs,
	 * mongoose will figure out the rest).
	 * Nothing is sent back.
	 */
	router.post('/create' + model.modelName, function(req, res) {
		model(req.body).save(mongoLog);
	})

	/* Pass a standard MongoDB query.
	 * The entire object is sent back.
	 */
	router.post('/read' + model.modelName, function(req, res) {
		model.find(req.body, function(error, data) {
			if (error) {throw error;}

			res.send(data);
		})
	})

	/* Will only reset an entire object to a new one. All logic of element
	 * updating (including pushing to arrays) must be handled by the client.
	 * 
	 * Data must be in the format:
	 * {
	 *   query: {},
	 *	 updated: {}
	 * }
	 *
	 * Nothing is sent back.
	 *
	 * TODO: DEBUG FROM THE CLIENT SIDE (CURL isn't working) - NOT TESTED YET!
	 */
	router.post('/update' + model.modelName, function(req, res) {
		console.log(req.body);
		model.findOneAndUpdate(req.body.query, req.body.updated, mongoLog);
	})

	/* Pass a standard MongoDB query.
	 * Nothing is sent back.
	 */
	router.post('/delete' + model.modelName, function(req, res) {
		model.findOneAndRemove(req.body, mongoLog);
	})
}

//Helper (saves boilerplating the error callback)
var mongoLog = function(error) {
	if (error) {throw error;}

	console.log("Successful write to MongoDB");
}

module.exports = router;