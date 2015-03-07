//password.js

var db = require(./../db.js);
var resErrorS = require('./student').resError;
var resErrorT = require('./teacher').resError;
var validator = require('validator');
var crypto = require('crypto');
var bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(10);
var User = db.models.user;

exports.forgotPassword = function (req, res){
	res.render('forgotPassword', {
		title: 'Forgot password'
	});
}

exports.forgotPasswordRequest = function (req, res){
	// Return if the origin was not from the forgot password page or the input
	// is invalid.
	if (req.url !== '/forgot') return res.end();
	if (!validator.isEmail(req.body.username)){
		return resError(res, "The provided value is not an email.");
	}

	// Find the user.
	var email = validator.escape(req.body.username);
	User.findOne({ username: email }, function (err, user){
		// When there is an error, we want to be as vague as possible, so no 
		// error status message is attached.  Please ensure that all error 
		// responses from here are identical whether or not a user was found.
		if (err) return resError(res);

		// In the case when the user does not exist, we still want to send a
		// success message.  This prevents attackers from firing off
		// requests using a table of emails to generate a list of valid user
		// emails.  To make these requests seem identical to when there is a
		// valid user, we can wait for a random amount of time before
		// responding.
		if (!user){
			var randomTime = Math.floor(Math.random()*3000)+1000;
			setTimeout(function (){ res.send({success: true});}, randomTime);
			return;
		}

		// If we found the user, set the password reset properties on the
		// user's account.  Start by generating a token.
		crypto.randomBytes(30, function (err, buffer){
			if (err) return resError(res);
			
			// Set the random token to expire in 1 hour.
			var token = buffer.toString('hex');
			user.resetPassToken = token;
			user.resetPassExpiration = Date.now() + 1000*60*60;

			// Save the user and generate an email notification.
			var notifyOptions = {
				user: user,
				emailSubject: 'GC: Password reset',
				emailHTML: generateForgotPasswordEmail(user.firstName, req.headers.host, token),
				onSuccess: function (){ res.send({success: true}); },
				onFailure: function (){ resError(res, "DB_ERROR"); }
			}
			saveAndNotifyUser(notifyOptions);
		});
	});
}