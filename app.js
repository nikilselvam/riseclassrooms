
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');

var classes = require('./routes/class');
var questions = require('./routes/question');
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

app.get('/', routes.teacherHome);
app.get('/users', user.list);
app.get('/session', routes.session);
app.get('/keyword', routes.keyword);
app.get('/questionType', routes.questionType);

app.post('/class/create', classes.create);
app.post('/question/record', questions.record);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
