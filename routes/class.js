var db = require('./../db.js');
var resError = require('./messaging').resError;
var Class = db.models.Class;

exports.create = function(req, res){
	// If the req object does not specify a name for the class or the teacher, return
	// an error.
	if(!req.name) {
		return resError(res, "Sorry, this class doesn't have a name.");
	}
	else if (!req.teacherId) {
		return resError(res, "Sorry, this class doesn't have a specified teacher.");
	}

	// Create a new class object with the class name and teacher specified.
	var classObject = new Class({
		name: req.name,
		teacherId: req.teacherId
	});;

	// Save the class to the database.
	classObject.save(function(err, classObject){
		if (err) return console.error(err);

		console.log(classObject);
	});
};

exports.subscribe = function(req, res){
    //TODO assert: all required objects exist in req
    
    //TODO assert: studentId is not yet in Class.studentIds[]
    //TODO assert: ObjectId is not yet in Student.classes[]
    
    // Add Student._id to Class.studentIds
    Class.findOne({ _id:res.classId }, function (err, class) {
        class.studentIds.push(res.studentId);
        class.save();
    });
    
    // Add the Class._id to Student.classes
    Student.findOne({ _id:res.studentId }, function (err, student) {
        student.classes.push(res.classId);
        student.save();
    });
};