var db = require('./../db.js');
var resError = require('./messaging').resError;
var Session = db.models.Session;
var Class = db.models.Class;

exports.create = function(req, res) {
	//Return error if req object does not specify startTime,
	// active, duration, and classID
	console.log(req);
	//console.log(req.user.classes);
	/*if (!req.classes || ! (req.classes instanceof db.models.Class)) {
		return resError(res, "Sorry, this session does not have a specified class.");
	}
	else */ if (!req.body.duration) {
		return resError(res, "Sorry, this session does not have a specified duration.");
	}
    else if ((!req.user) || ! (req.user instanceof db.models.Teacher)) {
        return resError(res, "Please sign in to a Teacher account.");
    }

	var start = Date.now();
	var duration = durationToMs(req.body.duration);
	var end = start + duration;
	var teacherId = req.user.id;
	var classId = req.user.classes;


	//Create a new session object with the above parameters specified and endTime calculated
	var sessionObject = new Session({
		active: true,
		classId: classId,
		teacherId: teacherId,
		startTime: start,
		duration: duration,
		endTime: end
	});

	//Save the session to the database
	sessionObject.save(function(err, sessionObject){
		if (err) return console.error(err);

		console.log(sessionObject);
        Class.findById(classId, function (err, classObject) {
            if (err) {
                console.error(err);
            }
            classObject.sessions.push(sessionObject._id);

            classObject.save(function (err, message) {
                if (err) {
                    console.log("Class object was not saved.");
                }
                else {
                    console.log("Class object saved!");
                }

                res.redirect('/teacher');
            });
        });
    });
};


		/*Class.findOne( {_id: req.classId}), function (err, classObject) {
			if (err || !classId) {
				return console.error(err);
			}
			classObject.sessions.push(sessionObject._id);
		}
	});*/


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
