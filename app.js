
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
  db.models.User.findById(id, function(err, user) {
    done(err, user);
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

app.get('/', routes.teacherHome);
app.get('/signin', routes.signin);
app.get('/session', routes.session);
app.get('/keyword', routes.keyword);
app.get('/questionType', routes.questionType);
app.post('/signin', passport.authenticate('local'), 
	function (req, res){
      res.send({
          success: true
      });
	},
	function (req, res){
      res.send({
          success: false,
      });
	}
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.post('/student/create', student.create);
app.post('/teacher/create', teacher.create);


app.post('/class/create', classes.create);
app.post('/question/create', questions.create);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

