//authentication.js

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');
var bcrypt = require('bcryptjs');
var isTeacher = true;

function checkpassword(password, user, done) {
	 bcrypt.compare(password, user.password, function(err, isMatch) {
          if (isMatch === true && !err) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password.' });
          }
      });
}


passport.use(new LocalStrategy(function(username, password, done) {
    db.models.Teacher.findOne({ email: username }, function(err, teacher) {
      	console.log(teacher);
      	if (err) { return done(err); }
      	if (!teacher) {
    		isTeacher = false;
      		db.models.Student.findOne({email: username }, function(err, student) {
      			console.log(student);
      			if (err) { return done(err); }
      			if(!student) {
      				return done(null, false, { message: 'Incorrect username.' });
      			}
      			else {
      				checkpassword(password, student, done);
      			}
      		});
      	}
      	else {
      		checkpassword(password, teacher, done);
      	}
    });
    }));

