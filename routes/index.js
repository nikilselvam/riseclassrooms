/*
 * GET home page.
 */

exports.studentHome = function (req, res) {
	res.render('studentHome', {
		title: 'Student Classes',
		partials: {
			layout: 'layout'
		}
	});
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


<<<<<<< HEAD
exports.studentAddClass = function(req,res) {
res.render('studentAddClass', {
title: 'Add A Class',
partials: {
layout: 'layout'
}
});
}
=======
>>>>>>> df6e1d60404a9c59088b5b233cc4db665ad25cd5
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

exports.studentAddClass = function(req, res) {
	res.render('studentAddClass');
};

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
