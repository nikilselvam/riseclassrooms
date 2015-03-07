var db = require('./../db.js');
var resError = require('./messaging').resError;
var Session = db.models.Session;

exports.create = function(req, res) {
	//Return error if req object does not specify startTime,
	// active, duration, and classID
	if (!req.classId) {
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
		classId: req.classId,
		startTime: start,
		duration: req.duration,
		endTime: end
	});

	//Save the session to the database
	sessionObject.save(function(err, sessionObject){
		if (err) return console.err(err);

		console.log(sessionObject);
		Class.findOne( {_id: req.classId}), function (err, classObject) {
			if (err || !classId) {
				return console.err(err);
			}
			classObject.sessions.push(sessionObject._id);
		}
	});
}

/**
Creates new session for specified class.
*/
function createSession(req, onSuccess, onFailure){
	var classSessionId = req.classId;
	onSuccess = onSuccess || function (){};
	onFailure = onFailure || function(){};

	//Check if parameters are met
	if (typeof classSessionID === "undefined") {
		return onFailure("Missing classId parameter.");
	}
}