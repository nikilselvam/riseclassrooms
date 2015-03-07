var db = require('./../db.js');
var resError = require('./messaging').resError;
var QuestionType = db.models.QuestionType;

exports.create = function(req, res) {
	// Check that the req object contains a name attribute. If not, return an error.
	if (!req.name) {
		return resError(res, 'Sorry, this keyword does not have a name.');
	}

	// Create new keyword.
	var questionType = new QuestionType({
		name: req.name,
		count: 0
	});

	// Save keyword to database.
	questionType.save(function(err, questionType){
		if (err) console.error(err);

		console.log(questionType);
	});
};