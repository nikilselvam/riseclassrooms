//password.js

var db = require('./../db.js');
var resErrorS = require('./student').resError;
var resErrorT = require('./teacher').resError;
var validator = require('validator');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);
var student = db.models.student;

exports.forgotPassword = function (req, res){
	res.render('forgotPassword', {
		title: 'Forgot password'
	});
}
/**
 * Handles post requests from the forgot password page.  If valid, this handler
 * will generate a token and send the password reset email to the user's email.
 */
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
				student: student,
				emailSubject: 'Rise Classrooms: Password reset',
				emailHTML: generateForgotPasswordEmail(student.firstName, req.headers.host, token),
				onSuccess: function (){ res.send({success: true}); },
				onFailure: function (){ resError(res, "DB_ERROR"); }
			}
			saveAndNotifyUser(notifyOptions);
		});
	});
}

/**
 * Renders the page where the user can change/reset his or her password.  Users
 * can access this reset page by either providing a reset token or simply being
 * logged into their account.
 */
exports.resetPasswordGet = function (req, res){
	var token = req.params.token;
	if (req.student && req.student._id){
		// If the user is logged in, provide the reset password page.
		res.render('resetPassword', {username: req.student.username});

	} else if (token && token.length > 0){
		// If the user has a token, check the token.
		var query = {resetPassToken: token, resetPassExpiration: {$gt: Date.now()}};
		User.findOne(query, function (err, student){
			if (err || !student) return res.redirect('/forgot');

			res.render('resetPassword', {username: student.username, resetToken: token});
		});

	} else{
		return resError(res, "Access denied.", "/error");
	}
}

/**
 * Attempts to reset the user's password using the provided information.
 */
exports.resetPasswordPost = function (req, res){
	var now = Date.now();
	var token = req.body.resetToken;
	var username = req.body.username;
	var newPass = req.body.newPassword;
	var newPassConfirm = req.body.newPasswordConfirm;

	// Check that the new passwords match and are at least 8 characters.
	if (newPass !== newPassConfirm) return resError(res, "PASS_CONFIRM_MISMATCH");
	if (newPass.length < 8) return resError(res, "SHORT_PASSWORD");

	// Set email notification options.
	var notifyOptions = {
		emailSubject: 'GC: Your password has been reset',
		onSuccess: function (){ res.send({success: true, redirect: "/home"}); },
		onFailure: function (){ resError(res, "DB_ERROR"); }
	}

	if (req.student && req.student._id && req.student.save){
		// If the user is logged in, update the user's password, then save and
		// notify via email.
		req.student.password = bcrypt.hashSync(newPass, salt);
		notifyOptions.student = req.student;
		notifyOptions.emailHTML = generatePasswordResetEmail(req.student.firstName);

		saveAndNotifyUser(notifyOptions);

	} else if (token){
		// Fetch the user based on the token.
		var query = {
			username: validator.escape(username),
			resetPassToken: token,
			resetPassExpiration: {$gt: now}
		};
		User.findOne(query, function (err, user){
			if (err) return resError(res, "DB_ERROR");
			if(!student) return resError(res, "INVALID_TOKEN");

			// Update the user's password, then save and notify via email.
			student.password = bcrypt.hashSync(newPass, salt);
			notifyOptions.student = student;
			notifyOptions.emailHTML = generatePasswordResetEmail(student.firstName);

			saveAndNotifyUser(notifyOptions);
		});

	} else{
		// Deny the request if the user is not logged in and has no reset token.
		return resError(res, "Access denied.", "/error");
	}
}

/**
 * Saves the user model and notifies the user via email.  Note that, the success
 * callback will always fire if the save was successful, regardless of whether
 * or not the email notification was successfully sent.
 *
 * @param  {Object} options 			The configuration options.
 *      @param  {UserSchema} user		The user to update.
 *      @param  {String} emailSubject	The email subject line.
 *      @param  {String} emailHTML		The email HTML to be sent.
 *      @param  {Function} onSuccess	The success callback.
 *      @param  {Function} onFailure	The failure callback.
 */
function saveAndNotifyUser (options){
	var student = options.student;
	var emailSubject = options.emailSubject || '';
	var emailHTML = options.emailHTML || '';

	// Check that the user is valid.
	if (!student || !student.save){
		return console.error("Tried to save and notify an invalid user.");
	}

	// Save the user.
	student.save(function (err){
		// Call the failture callback if there was a save error.
		if (err){
			if (typeof options.onFailure === 'function') options.onFailure();
			return;
		}

		// Send the success response once the new password is saved.
		if (typeof options.onSuccess === 'function') options.onSuccess();

		// Tell the mailman to send an email notification.
		var emailAddress = student.username;
		Mailman.sendMail({
			recipients: [emailAddress],
			subject: emailSubject,
			html: emailHTML,
			callback: function(err){
				if (err){
					console.error("Could not send email to " + emailAddress);
				} else {
					console.log('Successful email sent to ' + emailAddress);
				}
			}
		});
	});
}

/**
 * Generates email HTML for a password reset notification.
 * 
 * @param  {String} name The user's name.
 * 
 * @return {String}      The email HTML.
 */
function generatePasswordResetEmail (name){
	name = name || '';

	return 'Hello ' + name +',<br><br>' +
			'Your password was successfully reset.';
}

/**
 * Generates email HTML for a forgot password request, containing a unique url.
 * 
 * @param  {String} name  The name of the user.
 * @param  {String} host  The url's host.
 * @param  {String} token The url's token.
 * 
 * @return {String}       The email HTML.
 */
function generateForgotPasswordEmail (name, host, token){
	name = name || '';
	if (!host || !token){
		return console.error("Tried to generate a forgot password email without a host and token.");
	}

	return 'Hello ' + name +',<br><br>' +
			'Someone recently requested a password reset for your account.';
}
