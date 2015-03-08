
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');


var student = require('./routes/student');
var teacher = require('./routes/teacher');
var user = require('./routes/user');
var classes = require('./routes/class');
var questions = require('./routes/question');
var password = require('./routes/password');
var passport = require('passport');
var keyword = require('./routes/keyword');
var questionType = require('./routes/questionType');
var session = require('./routes/session');

var http = require('http');
var path = require('path');

var db = require('./db');

var app = express();
app.disable('etag');

// Passport
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'session secret key' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.models.Teacher.findById(id, function(err, user) {
    if(user)
		done(err, user);
	else {
		db.models.Student.findById(id, function(err, user) {
			done(err, user); 
		});
	}
  });
});
var login = require('./authentication');

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
app.get('/signin', routes.signin);
app.get('/signup', routes.signup);
app.get('/teacher', routes.teacherHome);
app.get('/student', routes.studentHome);
app.get('/users', user.list);
app.get('/session', routes.session);
app.get('/keyword', routes.keyword);
app.get('/questionType', routes.questionType);
app.post('/signin', passport.authenticate('local'), 
	function (req, res){
		console.log("Direct page to '/'");
      	res.redirect('/');
	},
	function (req, res){
      	res.redirect('/signin');
	});
app.get('/student/addClass', routes.studentAddClass);
app.get('/teacher/createClass', routes.createClass);
app.get('/teacher/createSession', routes.createSession);

/*app.post('/local-reg', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signin'
	})
); */

/*
app.post('/login', passport.authenticate('local-signin', {
	sucessRedirect: '/',
	failureRedirect: '/signin'
	})
);
*/

app.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
	req.session.notice = "You have successfully been logged out!";
});

app.post('/student/create', student.create);
app.post('/teacher/create', teacher.create);


app.post('/class/create', classes.create);
app.post('/class/subscribe', classes.subscribe);
app.post('/session/create', session.create);

app.post('/question/create', questions.create);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

