
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.teacherHome = function(req, res) {
	res.render('teacherHome', {title: 'Classes'});
};

exports.session = function(req, res) {
	res.render('session', {title: 'Session'});
};

exports.keyword = function(req,res) {
	res.render('keywords', {title:'Keywords'});
};
exports.questionType = function(req,res) {
	res.render('questionType', {title:'Question Type'});
};