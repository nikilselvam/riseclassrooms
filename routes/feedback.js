var db = require('./../db.js');
var resError = require('./messaging').resError;
var Session = db.models.Session;
var Feedback = db.models.Feedback;
var Keyword = db.models.Keyword;
var Question = db.models.Question;
var pos = require('pos');
var natural = require('natural');
stemmer = natural.PorterStemmer;


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

function deleteFeedback (session, res, classroomName) {
	// console.log("In deleteFeedback function");
	// console.log(session);

	var feedbackId = session.feedback;

	Feedback.findById(feedbackId, function(err, feedbackObject){
		// Find keywords.
		var keywordIds = feedbackObject.keywords;
		// Remove associated keywords.

		keywordIds.map(function(keywordId){
			Keyword.findByIdAndRemove(keywordId, function(err){
				if (err){
					console.log("Could not remove keyword");
				}
			});
		});

		// Remove feedback object.
		Feedback.findByIdAndRemove(feedbackId, function(err){
			if (err){
				console.log("Could not remove feedback object");
			}
		});

		// Set session's feedback attribute to null and then create feedabck object.
		session.feedback = undefined;

		session.save(function(err, sessionObject){
			createFeedback(session, res, classroomName);
		});
	});
};

exports.home = function(req, res) {
	// Check if session is over and if a feedback object already exists.
	// If session is over and feedback exists, redirect to /feedback?fid.

	// If session is over and feedback does not exist, create feedback object
	// and then redirect to /feedback?fid.

	// If session is not over, delete feedback object if it does exist, create new
	// feedback object, and redirect to /feedback?fid.

	console.log("In exports.home of routes/feedback");

	var sid = req.query.sid;
	var classroomName = req.query.classroomName;

	Session.findById(sid, function (err, session) {
		var isSessionActive = checkIfOneSessionIsActive(session);

		//  Session is active.
		if (isSessionActive) {
			console.log("Session is active.");

			// Delete existing feedback object and add a new one if a session has
			// a feedback object.
			if (session.feedback !== undefined) {
				console.log("Deleting and redirecting feedback");
				deleteFeedback(session, res, classroomName);
			}
			// Else if the session does not have a feedback object, create a new one.
			else {
				console.log("Just creating feedback");
				createFeedback(session, res, classroomName);
			}
		}
		//  Session is not active.
		else {
			// Session is not active.
			// console.log("Session is not active. Creating new feedback obect.");
			// console.log("session.feedback = " + session.feedback);
			// console.log("session.feedback !== null: " + (session.feedback !== null));
			// console.log("session.feedback !== undefined: " + (session.feedback !== undefined));
			// console.log("!session.feedback: " + !session.feedback);			

			// Delete existing feedback object and add a new one if a session has
			// a feedback object.
			if (session.feedback !== undefined) {
				console.log("In !session.feedback if statement");
				// Delete reference to feedback object.
				deleteFeedback(session, res, classroomName);
			}
			else {
				console.log("In else statement");
				createFeedback(session, res, classroomName);
			}
		}

	});
};

function findKeywords(questions) {
	var keywords = {};


	for (var j = 0; j < questions.length; j++) {
		var question = questions[j];
		console.log("question is " + question);

		var words = new pos.Lexer().lex(question);

		console.log("words is " + words);

		var taggedWords = new pos.Tagger().tag(words);

		// console.log("taggedWords is " + taggedWords);

		for (i in taggedWords) {
			var taggedWord = taggedWords[i];
			var word = taggedWord[0];
			var tag = taggedWord = taggedWord[1];
			console.log(word + " has tag " + tag);

			var keyword;

			if (word === "I" || tag === "." || tag === "PRP" || tag === "MD" || tag === "IN" || tag == "DT"
					|| word.length < 3) {
				// console.log("end of sentence found! " + word);
				continue;
			} else if (tag === "NNP" || tag === "NNPS") {
				// console.log("Proper noun found! " + word);
				keyword = word;
			} else {
				// Stem the word.
				stem = stemmer.stem(word);
				// console.log("Valid word found!");
				// console.log("word = " + word + ", stem = " + stem);
				keyword = stem;
			}

			console.log("keyword = " + keyword);
			// Push the keyword into the dictionary.
			if (keyword in keywords) {
				console.log("keyword " + keyword + " in keywords!");
				console.log("value = " + keywords[keyword] + "\n");
				keywords[keyword] = keywords[keyword] + 1;
			}
			else {
				console.log("New entry!\n");
				keywords[keyword] = 1;
			}
		}
	}

	// Print keywords.
	for (keyword in keywords) {
		console.log("keyword = " + keyword + ", value = " + keywords[keyword]);
	}

	// Sort keywords.
	var tuples = [];

	for (var key in keywords) {
		tuples.push([key, keywords[key]]);
	}

	tuples.sort(function(a, b){
		a = a[1];
		b = b[1];

		return a < b ? -1 : (a > b ? 1 : 0);
	});

	tuples.reverse();

	console.log("After sorting\n");

	// Print all keywords now.
	for (var j = 0; j < tuples.length; j++) {
		console.log("tuples[" + j + "] = " + tuples[j][0] + ", value = " + tuples[j][1]);
	}

	// Get the top 5 keywords.
	top5Keywords = [];

	// Return the top keywords (up to 5 total).

	var keywordsToReturn = 0;

	if (tuples.length < 5) {
		keywordsToReturn = tuples.length;
	} 
	else {
		keywordsToReturn = 5;
	}


	for (var j = 0; j < keywordsToReturn; j++) {
		top5Keywords.push(tuples[j][0]);
		console.log("top5Keywords[" + j + "] = " + top5Keywords[j]);
	}

	return top5Keywords;

}

exports.getKeywords = function(req, res) {
	var sid = req.query.sid;
	// console.log("sid is " + sid);

	Session.findById(sid, function (err, session) {
		var questionIds = session.questions;

		Question.find({"_id": {$in: questionIds}}, function(err, questions) {
			// console.log("questions is " + questions);

			var questionContent = [];

			for (var i = 0; i < questions.length; i++) {
				var question = questions[i];
				// console.log("question is " + question);
				questionContent.push(question.content);
			}

			console.log("questionContent is " + questionContent);

			findKeywords(questionContent);
			res.redirect('/');
		});
	});
}

function createFeedback (session, res, classroomName) {
	// Get the question IDs in the session.
	var questionIds = session.questions;

	// Find the questions in the session.
	Question.find({"_id": { $in: questionIds}}, function(err, questions) {
				var questionContent = [];

				for (var i = 0; i < questions.length; i++) {
					var question = questions[i];
					questionContent.push(question.content);
				}

			    var keywordList = findKeywords(questionContent);
			    console.log(keywordList);

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

			    var savedKeywords = 0;

			    console.log("keywordList.length = " + keywordList.length);

			    // Handle the case where 0 keywords are returned.
			    if (savedKeywords === keywordList.length) {
			    	feedbackObject.save(function(err, feedbackObject){
						if (err) {
							console.log("feedbackObject could not be saved");
							console.log("error is " + err);
							return;
						}

						// Save feedback object to session.
						session.feedback = feedbackObject._id;

						session.save(function(err, sessionObject){
							res.redirect('/feedback?sid=' + session._id + '&classroomName=' + classroomName);
						});
					});
			    }

			    // For each keyword, find questions with that keyword.
			    for (var i = 0; i < keywordList.length; i++) {


				    var currentKeyword = keywordList[i].replace(/\s+/g, ' ');
				    var displayedKeyword;
				    var searchedKeyword;


				   	// If the last character is 'i', replace it with 'y' for the displayed keyword 
				   	// and remove the final character altogher for the searched keyword.
				   	if (currentKeyword.substr(currentKeyword.length - 1, 1) === "i") {
				   		searchedKeyword = currentKeyword.substr(0, currentKeyword.length-1);
				   		displayedKeyword = searchedKeyword + 'y';
				   	} else {
				   		searchedKeyword = currentKeyword;
				   		displayedKeyword = currentKeyword;
				   	}

				    var lowerCaseKeyword = searchedKeyword.toLowerCase();

				   	// console.log("currentKeyword is " + currentKeyword);
				   	// console.log("searchedKeyword is " + searchedKeyword);
				   	// console.log("displayedKeyword is " + displayedKeyword);
				   	// console.log("lowerCaseKeyword is " + lowerCaseKeyword);

			    	// Create new keyword.
		    		var keywordObject = new Keyword({
		    			name: displayedKeyword,
		    			count: 0
		    		});

				    var filteredQuestions = questionContent.filter(containsKeyword, lowerCaseKeyword);

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

				    // After searching through all the filtered questions, save the question IDs
				    // and the overall count to the keyword.
					keywordObject.questions = questionsToAdd;
		    		keywordObject.count = questionCount;


		    		// Save keywords object to database.
					keywordObject.save(function(err, keywordObject){

						// If feedback object does not already contain keyword,
						// add keyword ID into feedback object.
						if (feedbackObject.keywords.indexOf(keywordObject._id) == -1) {
							feedbackObject.keywords.push(keywordObject._id);

							feedbackObject.save(function(err, feedbackObject){
								if (err) {
									console.log("feedbackObject could not be saved");
									console.log("error is " + err);
									return;
								}

								// Save feedback object to session.
								session.feedback = feedbackObject._id;

								session.save(function(err, sessionObject){
									// console.log("session saved");
									// console.log(session);

									savedKeywords++;

									if (savedKeywords == keywordList.length) {
										res.redirect('/feedback?sid=' + session._id + '&classroomName=' + classroomName);
									}
								});
							});				
						}
					});
			    }
	});
};