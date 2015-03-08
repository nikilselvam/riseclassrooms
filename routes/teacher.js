//teacher.js

var db = require('./../db.js');
var resError = require('./messaging').resError;
var Teacher = db.models.Teacher;

exports.create = function(req, res){

	if(!req.body.username) {
		return resError(res, "Please include a username");
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


	var teacher1 = new Teacher({
		username: req.body.username,
		password: req.body.password,
		firstName: req.body.firstName,
		lastName: req.body.lastName
	});;


	teacher1.save(function(err, teacher1) {
		if (err) return console.error(err);
		
		console.log(teacher1);
	});
};
