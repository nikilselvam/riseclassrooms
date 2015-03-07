var db = require('./../db.js');
var resError = require('./messaging').resError;
var Session = db.models.Session;
var session = require('client-sessions');

exports.create = function(req, res) {
	//Return error if req object does not specify startTime,
	// active, duration, and classID
	if (!req.classID) {
		return resError(res, "Sorry, this session does not have a specified class.");
	}
	else if (!req.duration) {
		return resError(res, "Sorry, this session does not have a specified duration.");
	}

	var start = Date.now();
	//durationMS converts duration time in minutes into milliseconds for compatability w/ Date.now()
	var durationMS = req.duration * 60000;
	var end = start + durationMS;

	//Create a new session object with the above parameters specified and endTime calculated
	var sessionObject = new Session({
		active: true,
		classID: req.classID,
		startTime: start,
		duration: req.duration,
		endTime: end
	});

	//Save the session to the database
	sessionObject.save(function(err, sessionObject){
		if (err) return console.err(err);

		return sessionObject;
		console.log(sessionObject);
	});
}