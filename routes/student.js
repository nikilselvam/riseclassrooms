//student.js

var db = require('./../db.js');
var resError = require('./messaging').resError;
var Student = db.models.Student;


exports.create = function(req, res){
	//console.log(req.body.firstName);
	if(!req.body.email) {
		return resError(res, "Please include an email address");
	}
	else if (!req.body.password) {
		return resError(res, "Please include a password");
	}
	else if (!req.body.firstName) {
		return resError(res, "Please include your first name");
	}
	else if (!req.body.lastName) {
		return resError(res, "Please include your last name");
	}

	var student1 = new Student({
		name: req.body.email,
		password: req.body.password,
		firstName: req.body.firstName,
		lastName: req.body.lastName
	});;

	student1.save(function(err, student1) {
		if (err) return console.error(err);
		console.log(student1);
	});
};
