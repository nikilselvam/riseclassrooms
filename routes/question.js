var db = require('./../db.js');
var resError = require('./messaging').resError;
var Question = db.models.Question;


exports.record = function(req, res){
	// If the req object does not specify a question or any of the fields
	// inside the question object, return an error.
	if(!req.author) {
		return resError(res, "Sorry, this question doesn't have an author");
	}
	else if (!req.content) {
		return resError(res, "Sorry, there is invalid question content");
	}
	else if (!req.timeAsk) {
		return resError(res, "Sorry, the system is unsure of when the question was asked.");
	}
	else if (!req.isStudentQuestion) {
		return resError(res, "Sorry, this is not a student question.");
	}
	else if (!req.session) {
		return resError(res, "Sorry, this class doesn't have a session.");
	}

	// Create a new question object with the author, content, time asked, whether it is
	// a student question and a session object
	var questionObject = new Question({
		author: req.author,
		content: req.content,
		timeAsk: req.timeAsk,
		isStudentQuestion: req.isStudentQuestion,
		session: req.session
	});

	// Save the question to the database.
	questionObject.save(function(err, questionObject){
		if (err) return console.error(err);

		console.log(questionObject);
	});
};