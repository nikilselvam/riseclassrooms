var db = require('./../db.js');
var resError = require('./messaging').resError;
var Session = db.models.Session;
var Feedback = db.models.Feedback;
var Keyword = db.models.Keyword;
var Question = db.models.Question;

var exec = require('child_process'),
	child;

var child_process = require('child_process');

function teacherRequest(fn) {
	return function (req, res) {
		if (req.user && userType(req.user) == "teacher") {
			fn(req, res);
		}
		else if (req.user && userType(req.user) == "student") {
			res.redirect('/student');
		}
		else {
			res.redirect('/');
		}
	}
}

function checkIfOneSessionIsActive(session){
	if (session.active == true) {
		return true;
	}
	else {
		return false;
	}
}

exports.home = function(req, res) {
	// Check if session is over and if a feedback object already exists.
	// If session is over and feedback exists, redirect to /feedback?fid.

	// If session is over and feedback does not exist, create feedback object
	// and then redirect to /feedback?fid.

	// If session is not over, delete feedback object if it does exist, create new
	// feedback object, and redirect to /feedback?fid.

	var sid = req.query.sid;
	var classroomName = req.query.classroomName;

	Session.findById(sid, function (err, session) {
		var isSessionActive = checkIfOneSessionIsActive(session);

		//  Session is active.
		if (isSessionActive) {
			console.log("Session is active.");

			// Delete existing feedback object and add a new one if a session has
			// a feedback object.
			if (session.feedback !== null) {
				session.feedback = null;

				createFeedback(session);
			}
			// Else if the session does not have a feedback object, create a new one.
			else {
				createFeedback(session);
			}
		}
		//  Session is not active.
		else {
			// Sessoin is not active.
			console.log("Session is not active. Creating new feedback obect.");

			// Delete existing feedback object and add a new one if a session has
			// a feedback object.
			session.feedback = null;

			createFeedback(session);

			// console.log("session before save");
			// console.log(session);

			// session.save(function(err, sessionObject) {
			// 	console.log("session after save");
			// 	console.log(sessionObject);

			// 	// Create new feedback object.
			// 	createFeedback(sessionObject);
			// });
		}

	});

	res.redirect('/feedback?sid=' + sid + '&classroomName=' + classroomName);

};

function createFeedback (session) {
	console.log("In createFeedback(session) function");
	console.log(session);

	// Get the question IDs in the session.
	var questionIds = session.questions;

	// Find the questions in the session.
	Question.find({"_id": { $in: questionIds}}, function(err, questions) {
		// Run the Python file to extract keyworsd.
		child = child_process.exec('python bin/keyword.py',			
			function(error, stdout, stderr) {
				console.log('stdout: ' + stdout);
			    console.log('stderr: ' + stderr);

			    if (error !== null) {
			      console.log('exec error: ' + error);
			    }

			    // Get keyword list.
			   	var phrases = stdout.replace(/['\n,[\]]/g,'').split(" ");

			    // console.log("phrases");
			    // console.log(phrases);

			    var keywordList = [];

			    for (var i = 0; i < phrases.length; i++) {
			    	keywordList.push(phrases[i]);
			    }

			    // console.log("keywordList");
			    // console.log(keywordList);

			    // Get question content only.
			    var questionContent = [];

		    	for (var i  = 0; i < questions.length; i++) {
			    	questionContent.push(questions[i].content);
			    }

			    function containsKeyword(element) {
			    	return element.toLowerCase().indexOf(this) != -1;
			    }

			    // Create new feedback object.
			    var feedbackObject = new Feedback({
			    	totalQuestionsAsked: questions.length,
			    	totalQuestionsAnswered: 0
			    });

			    // var allProcessedKeywords = [];

			    // For each keyword, find questions with that keyword.
			    for (var i = 0; i < keywordList.length; i++) {


				    var currentKeyword = keywordList[i].replace(/\s+/g, ' ');
				    var lowerCaseKeyword = currentKeyword.toLowerCase();
				    // console.log('currentKeyword is ' + currentKeyword);

			    	// Create new keyword.
		    		var keywordObject = new Keyword({
		    			name: currentKeyword,
		    			count: 0
		    		});

				    var filteredQuestions = questionContent.filter(containsKeyword, lowerCaseKeyword);
				    
				    // console.log("filteredQuestions");
				    // console.log(filteredQuestions);
				    // console.log();

			    	var questionCount = 0;
			    	var questionsToAdd = [];

				    // For each filtered question, find the questionId it is associated with, add this id to the keyword,
				    // and increment count by 1
				    for (var j = 0; j < filteredQuestions.length; j++) {

				    	var currentContent = filteredQuestions[j];

				    	// console.log("currentContent is " + currentContent);

				    	// Loop through all questions and find the question IDs.
				    	for (var k = 0; k < questions.length; k++) {
				    		var currentQuestion = questions[k];
				    		if (currentQuestion.content === currentContent) {
					    		//console.log("Question found!"+  currentQuestion);
					    		
					    		// Add this question ID to the keyword and increment count by 1.
					    		questionsToAdd.push(currentQuestion._id);
								questionCount++;
				    		}
				    	}
				    }

				    // After searching through all the filtered questions, save the question IDS
				    // and the overall count to the keyword.
					keywordObject.questions = questionsToAdd;
		    		keywordObject.count = questionCount;


		    		// Save keywords object to database.
					keywordObject.save(function(err, keywordObject){

						// console.log("Pushing keyword into allProcessedKeywords");
						// allProcessedKeywords.push(keywordObject._id);

						// If feedback object does not already contain keyword,
						// add keyword ID into feedback object.
						if (feedbackObject.keywords.indexOf(keywordObject._id) == -1) {
							feedbackObject.keywords.push(keywordObject._id);

							feedbackObject.save(function(err, feedbackObject){
								// console.log("feedbackObject.keywords");
								// console.log(feedbackObject.keywords);

								// Save feedback object to session.
								session.feedback = feedbackObject._id;

								session.save(function(err, sessionObject){
									console.log("session saved");
									// console.log(session);
								});
							});				
						}
					});
			    }
			});

		child.stdin.write("What is convergence?");

		// Could start reading from stdout here piecemeal.
		
	});
};