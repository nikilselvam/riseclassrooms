
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var student = require('./routes/student');
var teacher = require('./routes/teacher');
var user = require('./routes/user');
var session = require('./routes/session');
var classes = require('./routes/class');
var questions = require('./routes/question');
var keyword = require('./routes/keyword');
var questionType = require('./routes/questionType');

var http = require('http');
var path = require('path');

var db = require('./db');

var app = express();
app.disable('etag');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.signin);
app.get('/teacher', routes.teacherHome);
app.get('/student', routes.studentHome);
app.get('/users', user.list);
app.get('/session', routes.session);
app.get('/keyword', routes.keyword);
app.get('/questionType', routes.questionType);


/*app.post('/local-reg', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signin'
	})
);

app.post('/login', passport.authenticate('local-signin', {
	sucessRedirect: '/',
	failureRedirect: '/signin'
	})
);

app.get('/logout', function(req,res){
	var name = req.user.username;
	console.log("LOG OUT" + req.user.username)
	req.logout();
	res.redirect('/');
	req.session.notice = "You have successfully been logged out " + name + "!";
});
*/

app.post('/student/create', student.create);
app.post('/teacher/create', teacher.create);


app.post('/class/create', classes.create);
app.post('/session/create', session.create);
app.post('/question/create', questions.create);
app.post('/keyword/create', keyword.create);
app.post('/questionType/create', questionType.create);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

