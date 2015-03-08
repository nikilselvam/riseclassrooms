/*
 * GET home page.
 */

var db = require('./../db.js');
var resError = require('./messaging').resError;
var Session = db.models.Session;
var Class = db.models.Class;
var Student = db.models.Student;
var Teacher = db.models.Teacher;

function userType(user) {
	if (user instanceof Student)
		return "student";
	if (user instanceof Teacher)
		return "teacher";
	return null;
}

function authRequest(fn) {
	return function (req, res) {
		if (req.user) {
			res.redirect("/" + userType(user));
		}
		else {
			fn(req, res);
		}
	};
}

exports.signin = authRequest(function(req, res) {
	res.render('signin', {
		title: "Sign In",
		partials: {
			layout: 'layout'
		}
	});
});

exports.signup = authRequest(function(req, res) {
	res.render('signup', {
		title: "Sign Up",
		partials: {
			layout: 'layout'
		}
	});
});

function studentRequest(fn) {
	return function (req, res) {
		if (req.user && userType() == "student") {
			fn(req, res);
		}
		else {
			res.redirect('/');
		}
	};
}

exports.studentAddClass = studentRequest(function(req,res) {
	res.render('studentAddClass', {
		title: 'Add A Class',
		partials: {
			layout: 'layout'
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
		var tmpl = {
			title: 'Student Classes',
			session: session,
			classroom: null,
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
	}

	findActiveSession(req.user, renderStudentHome);
});

function teacherRequest(fn) {
	return function (req, res) {
		if (req.user && userType() == "teacher") {
			fn(req, res);
		}
		else {
			res.redirect('/');
		}
	}
}

exports.teacherHome = teacherRequest(function(req, res) {
	res.render('teacherHome', {
		title: 'Classes',
		partials: {
			layout: 'layout'
		}
	});
});

exports.session = teacherRequest(function(req, res) {
	res.render('session', {
		title: 'Session',
		partials: {
			layout: 'layout'
		}
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
		partials: {
			layout: 'layout'
		}
	});
}
