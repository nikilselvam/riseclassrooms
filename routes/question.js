var db = require('./../db.js');
var resError = require('./messaging').resError;
var Question = db.models.Question;
var Session = db.models.Session;

exports.create = function(req, res){
	// If the req object does not specify a question or any of the fields
	// inside the question object, return an error.
	if (!req.body.content) {
		return resError(res, "Sorry, there is invalid question content.");
	}
	else if (!req.body.sessionId) {
		return resError(res, "Sorry, this class doesn't have a session.");
	}
    else if ((!req.user) || ! (req.user instanceof db.models.Student)) {
        return resError(res, "Please sign in to a Student account.");
    }

    var sessionId = req.body.sessionId;

	// Create a new question object with the author, content, time asked, whether it is
	// a student question and a session object
	var questionObject = new Question({
		author				: req.user.id,
		content				: req.body.content,
		timeAsked 			: Date.now(),
		isStudentQuestion	: true,
		sessionId			: sessionId
	});

	console.log("Question created.");
	console.log(questionObject);	

	// Save the question to the database.
	questionObject.save(function(err, questionObject){
		if (err) return console.error(err);

		console.log("Question saved!");

		Session.findById(sessionId, function (err, session) {
			session.questions.push(questionObject._id);

			session.numberOfQuestions = session.questions.length;

			session.save(function(err, session){
				if (err) {
					console.log("Session could not be saved.");
				}
				else {
					console.log("Session saved.");
					console.log(session);
				}

				res.redirect('/');
			});

		});
	});
};
