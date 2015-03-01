
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
	res.render('session', {title: 'Session'})
};