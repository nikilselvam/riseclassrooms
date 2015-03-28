/*
 * GET home page.
 */

var db = require('./../db.js');
var resError = require('./messaging').resError;
var Session = db.models.Session;
var Class = db.models.Class;
var Student = db.models.Student;
var Teacher = db.models.Teacher;
var Question = db.models.Question;
var Feedback = db.models.Feedback;
var Keyword = db.models.Keyword;

var exec = require('child_process'),
    child;

var child_process = require('child_process');

function userType(user) {
	if (user.__proto__.collection.collection.collectionName == "student") {
		return "student";
	}
	else if (user.__proto__.collection.collection.collectionName == "teacher") {
		return "teacher";
	} else {
		return null;
	}
}

function authRequest(fn) {
	return function (req, res) {
		if (req.user) {
			res.redirect("/" + userType(req.user));
		}
		else {
			fn(req, res);
		}
	};
}

exports.signin = authRequest(function(req, res) {
	res.render('signin', {
		title: "Sign In",
        showLogout: true,
		partials: {
			layout: 'layout'
		}
	});
});

exports.signup = authRequest(function(req, res) {
	res.render('signup', {
		title: "Sign Up",
        showLogout: true,
		partials: {
			layout: 'layout'
		}
	});
});

function studentRequest(fn) {
	return function (req, res) {
		if (req.user && userType(req.user) == "student") {
			fn(req, res);
		}
		else if (req.user && userType(req.user) == "teacher") {
			res.redirect('/teacher');
		}
		else {
			console.log("Redirect to '/'");
			res.redirect('/');
		}
	};
}

exports.studentAddClass = studentRequest(function(req,res) {
	Class.find(
		{},
		function (err, classes) {
			if (!err) {
				res.render('studentAddClass', {
					title: 'Add A Class',
					classes: classes,
					partials: {
						layout: 'layout'
					}
				});
			}
		});

});

function findActiveSession(user, callback) {
    var query = Session.findOne();
    query = query.where("startTime").lt(new Date());
    query = query.where("endTime").gt(new Date());
    query = query.where("classId").in(user.classes);
    query.exec(callback);
}

exports.studentHome = studentRequest(function (req, res) {
	function renderStudentHome(err, session) {
		var classIds = req.user.classes;

		var sessionId = null;

		if (session !== null) {
			sessionId = session.id;
		}

		Class.find({
			'_id' : { $in: classIds } 
		}, function (err, classes) {
			var tmpl = {
			title: 'Student Classes',
			session: session,
			sessionId: sessionId,
			classroom: null,
			classes: classes,
			partials: {
				layout: 'layout'
				}
			};

			if (session) {
				var classroom = Class.findById(session.classId, function (err, classroom) {
					tmpl.classroom = classroom;
					res.render('studentHome', tmpl);
				});
			}
			else {
				res.render('studentHome', tmpl);
			}
		});
	}

	findActiveSession(req.user, renderStudentHome);
});

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

exports.teacherHome = teacherRequest(function(req, res) {
	var classIds = req.user.classes;

	Class.find({
		'_id' : { $in: classIds }
	}, function (err, classes) {
		res.render('teacherHome', {
			title: 'Classes',
			classes: classes,
			partials: {
			layout: 'layout'
			}
		});
	});
});

function checkIfSessionIsActive(sessions){
	//console.log("sessions are " + sessions);

	for (var i = 0; i < sessions.length; i++) {
		var session = sessions[i];
		//console.log("session is " + session);

		if (session.active == true) {
			var endTime = session.endTime.getTime();
			var currentTime = new Date().getTime();
			var isActiveSession = endTime >= currentTime;

			if (!isActiveSession) {
				session.active = false;

				session.save(function (err, session) {
				});
			}

		}
	}
}

exports.session = teacherRequest(function(req, res) {
	var cid = req.query.cid;
	console.log(req.query);

	Class.findById(cid, function (err, classroom) {
		var sessionIds = classroom.sessions;

		Session.find({"_id": { $in: sessionIds}}, function(err, sessions) {
			checkIfSessionIsActive(sessions);

			// Sort sessions by end time and then pass in sessions into
			// the 'session' template.
			
			sessions.sort(function(a, b) {
			    a = new Date(a.startTime);
			    b = new Date(b.startTime);
			    return a>b ? -1 : a<b ? 1 : 0;
			});

			for (var i = 0; i < sessions.length; i++) {
				var sT= sessions[i].startTime;
				console.log("session time is " + sT);
			}


			res.render('session', {
				title: 'Session',
				classroom: classroom,
				sessions: sessions,
				partials: {
					layout: 'layout'
				}
			});
		})
	});
});

exports.feedback = teacherRequest(function(req, res) {
	var sid = req.query.sid;
	console.log(req.query);

	function onFinishedExecution(error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);

	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }

	    console.log("questions is " + questions);

	    // Get keyword list.
	    var keywordList = stdout;
	    // console.log("keywordList is " + keywordList);


	    // Replace commas, brackets, and other basic elements from keywordList.
	    var updatedKeywordList = keywordList.replace(/[',[\]]/g,'');
	    // console.log("updatedKeywordList is " + updatedKeywordList);

	    // Split updatedKeywordList by " " and get list of keywords and percentages.
	    var phrases = updatedKeywordList.split(" ");
	    var keywords = [];
	    var percentages = [];

	    // console.log("phrases is " + phrases);
	    // console.log("phrases.length is " + phrases.length);

	    // for (var i = 0; i < phrases.length; i++) {
	    // 	console.log("phrases[" + i + "] is " + phrases[i]);

	    // 	if (i % 2 == 0) {
	    // 		keywords.push(phrases[i]);
	    // 	}
	    // 	else {
	    // 		percentages.push(phrases[i]);
	    // 	}
	    // }

    	// for (var i = 0; i < keywords.length; i++) {
	    // 	console.log("keywords[" + i + "] is " + keywords[i]);
	    // }

    	// for (var i = 0; i < percentages.length; i++) {
	    // 	console.log("percentages[" + i + "] is " + percentages[i]);
	    // }

	    // Create new feedback object.

	    // Create new keywords objects with the name and count specified from stdout.

		// Save keywords objects to feedback.keywords.

		// Save feedback object to session.feedback.

		// Pass in keywords array into res.render.

	    res.render('feedback', {
			title: 'Feedback',
			phrases: phrases,
			partials: {
				layout: 'layout'
			}
		});
	}

	Session.findById(sid, function (err, session) {
		var questionIds = session.questions;

		console.log("questionIds is " + questionIds);

		Question.find({"_id": { $in: questionIds}}, function(err, questions) {
			/*
			checkIfSessionIsActive(sessions);

			// Sort sessions by end time and then pass in sessions into
			// the 'session' template.
			
			sessions.sort(function(a, b) {
			    a = new Date(a.startTime);
			    b = new Date(b.startTime);
			    return a>b ? -1 : a<b ? 1 : 0;
			});


			for (var i = 0; i < sessions.length; i++) {
				var sT= sessions[i].startTime;
				console.log("session time is " + sT);
			}
			*/

			console.log("questions before function is " + questions);

			child = child_process.exec('python bin/keyword.py',			
				function(error, stdout, stderr) {
					console.log('stdout: ' + stdout);
				    console.log('stderr: ' + stderr);

				    if (error !== null) {
				      console.log('exec error: ' + error);
				    }

				    // Get keyword list.
				    var keywordList = stdout;


				    // Replace commas, brackets, and other basic elements from keywordList.
				    var updatedKeywordList = keywordList.replace(/[',[\]]/g,'');

				    // Split updatedKeywordList by " " and get list of keywords and percentages.
				    var phrases = updatedKeywordList.split(" ");
				    var keywords = [];
				    var count = [];

				    for (var i = 0; i < phrases.length; i++) {

					    // Save keyword or count to appropriate array.
					    if (i % 2 == 0) {
				    		keywords.push(phrases[i]);
				    	}
				    	else {
				    		count.push(phrases[i]);
				    	}
				    }

				    //  Determin total number of questions in session.
				    var totalQuestionsAsked = questions.length;

				    // Create new feedback object.
				    var feedbackObject = new Feedback({
				    	totalQuestionsAsked: questions.length,
				    	totalQuestionsAnswered: 0
				    });

				    feedbackObject.save(function(err, feedbackObject){
			            if (err) {
			                console.error(err);
			            }

				    	var length = keywords.length;
				    	var name;
				    	var proportion;
				    	var listOfKeywords = [];

				    	// Create new keywords objects with the name and count specified from stdout.
				    	for (var i = 0; i < length; i++) {
				    		name = keywords[i];
				    		proportion = count[i] / totalQuestionsAsked * 100;

				    		var keywordObject = new Keyword({
				    			name: name,
				    			proportion: proportion
				    		});

				    		listOfKeywords.push(keywordObject);

							// Save keywords object to database.
							keywordObject.save(function(err, keywordObject){

								// Save keyword objects to feedback object.
								feedbackObject.keywords.push(keywordObject._id);

								// Save feedback object.
								feedbackObject.save(function(err, feedbackObject){
									// Save feedback object to session.feedback.
								});

							});
				    	}

				    	// Pass in keywords array into res.render.
					    res.render('feedback', {
							title: 'Feedback',
							keywords: listOfKeywords,
							questions: questions,
							partials: {
								layout: 'layout'
							}
						});

				    });
				});

			child.stdin.write("What is convergence?");

			// Could start reading from stdout here piecemeal.
			
		})
	});
});

exports.keyword = teacherRequest(function(req,res) {
	res.render('keywords', {
		title:'Keywords',
		partials: {
			layout: 'layout'
		}
	});
});

exports.questions = teacherRequest(function(req, res) {
	var sid = req.query.sid;

	Session.findById(sid, function (err, session) {
		var questionIds = session.questions;

		Question.find({"_id": { $in: questionIds}}, function(err, questions) {

			res.render('question', {
				title: 'Questions',
				questions: questions,
				partials: {
					layout: 'layout'
				}
			});
		})
	});

});

exports.questionType = teacherRequest(function(req,res) {
	res.render('questionType', {
		title:'Question Type',
		partials: {
			layout: 'layout'
		}
	});

});

exports.createClass = teacherRequest(function(req,res) {
	res.render('createClass', {
		title: 'Create Class',
		partials: {
			layout: 'layout'
		}
	});
});

exports.createSession = function(req,res) {
	res.render('createSession', {
		title: 'Create Session',
		cid: req.query.cid,
		partials: {
			layout: 'layout'
		}
	});
}
