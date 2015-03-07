var db = require('./../db.js');
var resError = require('./messaging').resError;
var Class = db.models.Class;

exports.create = function(req, res){
	// If the req object does not specify a name for the class or the teacher, return
	// an error.
	if(!req.name) {
		return resError(res, "Sorry, this class doesn't have a name.");
	}
	else if (!req.teacherId) {
		return resError(res, "Sorry, this class doesn't have a specified teacher.");
	}

	// Create a new class object with the class name and teacher specified.
	var classObject = new Class({
		name: req.name,
		teacherId: req.teacherId
	});;

	// Save the class to the database.
	classObject.save(function(err, classObject){
		if (err) return console.error(err);

		console.log classObject;
	});
};