+exports.create = function(req, res) {
	//Return error if req object does not specify startTime,
	// active, duration, and classID
	if (!req.active) {
		return resError(res, "Sorry, this session is not currently active.");
	}
	else if (!req.classID) {
		return resError(res, "Sorry, this session does not have a specified class.");
	}
	else if (!req.startTime) {
		return resError(res, "Sorry, this session does not have a specified start time.");
	}
	else if (!req.duration) {
		return resError(res, "Sorry, this session does not have a specified duration.");
	}

	//Create a new session object with the above parameters specified and endTime calculated
	var sessionObject = new session({
		active: req.active,
		classID: req.classID,
		startTime: req.startTime,
		duration: req.duration,
		endTime: 
	});

	//Save the session to the database
	sessionObject.save(function(err, classObject){
		if (err) return console.err(err);

		console.log('Session object saved.');
		return classObject;
	})
}