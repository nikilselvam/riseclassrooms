var db = require('./../db.js');
var resError = require('./messaging').resError;
var Session = db.models.Session;
var express = require('express'), app = express();

exports.create = function(req, res) {
	//Return error if req object does not specify startTime,
	// active, duration, and classID
	console.log(req.classId);
	/*
	if (!req.classId) {
		return resError(res, "Sorry, this session does not have a specified class.");
	}*/

	var start = Date.now();
	console.log(start);
	var duration = durationToMs(req.body.duration);
	console.log(duration);
	var end = start + duration;
	console.log(end);

	//Create a new session object with the above parameters specified and endTime calculated
	var sessionObject = new Session({
		active: true,
		//classId: req.classId,
		startTime: start,
		duration: duration,
		endTime: end
	});

	//Save the session to the database
	sessionObject.save(function(err, sessionObject){
		if (err) return console.error(err);

		console.log(sessionObject);
		Class.findOne( {_id: req.classId}), function (err, classObject) {
			if (err || !classId) {
				return console.error(err);
			}
			classObject.sessions.push(sessionObject._id);
		}
	});
}

function durationToMs(duration) {
	parseDuration = parseInt(duration);
	durationMS = parseDuration * 60000
	return durationMS;
}

/**
//Creates new session for specified class.

function createSession(req, onSuccess, onFailure){
	var classSessionId = req.classId;
	onSuccess = onSuccess || function (){};
	onFailure = onFailure || function(){};

	//Check if parameters are met
	if (typeof classSessionID === "undefined") {
		return onFailure("Missing classId parameter.");
	}
}*/