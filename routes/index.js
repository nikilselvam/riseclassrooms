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
var Keyword = db.models.Keyword;
var Feedback = db.models.Feedback;

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
		// console.log(classes);

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
	for (var i = 0; i < sessions.length; i++) {
		var session = sessions[i];
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

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function findDayOfWeek(day) {
	var dayOfWeek;

	switch (day) {
		case 0:
			dayOfWeek = "Sunday";
			break;
		case 1:
			dayOfWeek = "Monday";
			break;
		case 2:
			dayOfWeek = "Tuesday";
			break;
		case 3:
			dayOfWeek = "Wednesday";
			break;
		case 4:
			dayOfWeek = "Thursday";
			break;
		case 5:
			dayOfWeek = "Friday";
			break;
		case 6:
			dayOfWeek = "Saturday";
			break;
	}

	return dayOfWeek;

}

function findMonth(monthInt) {
	var month;

	switch (monthInt) {
		case 0:
			month = "January";
			break;
		case 1:
			month = "February";
			break;
		case 2:
			month = "March";
			break;
		case 3:
			month = "April";
			break;
		case 4:
			month = "May";
			break;
		case 5:
			month = "June";
			break;
		case 6:
			month = "July";
			break;
		case 7:
			month = "August";
			break;
		case 8:
			month = "September";
			break;
		case 9:
			month = "October";
			break;
		case 10:
			month = "November";
			break;
		case 11:
			month = "December";
			break;
	}

	return month;
}


function formatDate(date) {
	var month = findMonth(date.getMonth());
	var day = findDayOfWeek(date.getDay());
	var date = date.getDate();
	var strMonth = day + ", " + month + " " + date;
	return strMonth;
}

exports.session = teacherRequest(function(req, res) {
	var cid = req.query.cid;
	// console.log(req.query);

	Class.findById(cid, function (err, classroom) {
		var sessionIds = classroom.sessions;

		Session.find({"_id": { $in: sessionIds}}, function(err, sessions) {
			checkIfSessionIsActive(sessions);

			// Sort sessions by start time with the more recent sessions
			// displayed first. 
			sessions.sort(function(a, b) {
			    a = new Date(a.startTime);
			    b = new Date(b.startTime);
			    return a>b ? -1 : a<b ? 1 : 0;
			});


			// Add date, start time, and end time strings to make it easier for the user to read
			// for each session.
			for (var i = 0; i < sessions.length; i++) {
				var startTime = new Date(sessions[i].startTime);
				var endTime = new Date(sessions[i].endTime);

				// Subtract 7 hours.
				startTime.setHours(startTime.getHours() - 7);
				endTime.setHours(endTime.getHours() - 7);

				var dateString = formatDate(startTime);
				var startTimeString = formatAMPM(startTime);
				var endTimeString = formatAMPM(endTime);

				sessions[i].dateString = dateString;
				sessions[i].startTimeString = startTimeString;
				sessions[i].endTimeString = endTimeString;
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

exports.keyword = teacherRequest(function(req,res) {
	res.render('keywords', {
		title:'Keywords',
		partials: {
			layout: 'layout'
		}
	});
});

exports.feedback = teacherRequest(function(req, res) {
	// console.log("In routes.index feedback function");
	// console.log(req.query);

	// console.log(req.query.sid);

	var sid = req.query.sid;
	var classroomName = req.query.classroomName;

	Session.findById(sid, function (err, session) {
		var feedbackId = session.feedback;

		// console.log("In exports.feedback, session is " + session);
		// console.log("feedbackId is " + feedbackId);

		if (feedbackId === undefined) {
			console.log("feedbackId is undefined. Redirecting to home");
			res.redirect('/');

		}
		else {
			Feedback.findById(feedbackId, function(err, feedbackObject){
				if (err) {
					console.log("No feedback object found");
					res.redirect('/');
				}
				else {
					// console.log("Feedback object found in exports.feedback");
					console.log(feedbackObject);

					var totalQuestionsAsked = feedbackObject.totalQuestionsAsked;
					var totalQuestionsAnswered = feedbackObject.totalQuestionsAnswered;
					var numberOfKeywords = feedbackObject.keywords.length;

					var keywordIds = feedbackObject.keywords;

					Keyword.find({"_id": { $in: keywordIds}}, function(err, keywords) {
						var questionIds = session.questions;

						Question.find({"_id": { $in: questionIds}}, function(err, questions) {
							// Sort questions by time asked with the most recently asked questions 
							// displayed first.
							questions.sort(function(a, b) {
							    a = new Date(a.timeAsked);
							    b = new Date(b.timeAsked);
							    return a>b ? -1 : a<b ? 1 : 0;
							});


							// Add date and time asked strings to make strings easier to read for user.
							for (var i = 0; i < questions.length; i++) {
								var startTime = new Date(questions[i].timeAsked);
							
								var dateString = formatDate(startTime);
								var timeAskedString = formatAMPM(startTime);

								questions[i].dateString = dateString;
								questions[i].timeAskedString = timeAskedString;
							}

							res.render('feedback', {
								title: 'Feedback',
								classroomName: classroomName,
								totalQuestionsAnswered: totalQuestionsAnswered,
								totalQuestionsAsked: totalQuestionsAsked,
								numberOfKeywords: numberOfKeywords,
								keywords: keywords,
								questions: questions,
								partials: {
									layout: 'layout'
								}
							});
						});
					});
				}
			});
		}
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
