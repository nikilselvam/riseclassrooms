/*
 * GET home page.
 */

var db = require('./../db.js');
var resError = require('./messaging').resError;
var Session = db.models.Session;
var Class = db.models.Class;

function findActiveSession(user, callback) {
    var query = Session.findOne();
    query = query.where("startTime").lt(new Date());
    query = query.where("endTime").gt(new Date());
    query = query.where("classId").in(user.classes);
    query.exec(callback);
}

exports.studentHome = function (req, res) {
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

	if (req.user)
		findActiveSession(req.user, renderStudentHome);
	else
		res.redirect('/')
};

exports.teacherHome = function(req, res) {
	res.render('teacherHome', {
		title: 'Classes',
		partials: {
			layout: 'layout'
		}
	});
};

exports.signin = function(req, res) {
	res.render('signin', {
		title: "Sign In",
		partials: {
			layout: 'layout'
		}
	});
};

exports.signup = function(req, res) {
	res.render('signup', {
		title: "Sign Up",
		partials: {
			layout: 'layout'
		}
	});
};

exports.studentAddClass = function(req,res) {
res.render('studentAddClass', {
title: 'Add A Class',
partials: {
layout: 'layout'
}
});
}

exports.session = function(req, res) {
	res.render('session', {
		title: 'Session',
		partials: {
			layout: 'layout'
		}
	});
};

exports.keyword = function(req,res) {
	res.render('keywords', {
		title:'Keywords',
		partials: {
			layout: 'layout'
		}
	});
};
exports.questionType = function(req,res) {
	res.render('questionType', {
		title:'Question Type',
		partials: {
			layout: 'layout'
		}
	});

};

exports.createClass = function(req,res) {
	res.render('createClass', {
		title: 'Create Class',
		partials: {
			layout: 'layout'
		}
	});
}

exports.createSession = function(req,res) {
	res.render('createSession', {
		title: 'Create Session',
		partials: {
			layout: 'layout'
		}
	});
}
