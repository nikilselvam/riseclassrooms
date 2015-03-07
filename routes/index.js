/*
 * GET home page.
 */

exports.loginPage = function (req, res) {
	res.render('login', {
		title: 'Sign In',
		partials: {
			layout: 'layout'
		}
	});
};

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

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

