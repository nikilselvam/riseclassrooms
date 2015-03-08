var db = require('./../db.js');
var resError = require('./messaging').resError;
var Class = db.models.Class;
var Teacher = db.models.Teacher;
var Student = db.models.Student;

// Add a class (by a teacher).
exports.create = function (req, res) {
    // If the req object does not specify a name for the class or the teacher, return
    // an error.
    if (!req.body.class_name) {
        return resError(res, "Sorry, this class doesn't have a name.");
    }
    else if ((!req.user) || ! (req.user instanceof db.models.Teacher)) {
        return resError(res, "Please sign in to a Teacher account.");
    }

    var teacherId = req.user.id;

    Teacher.findById(teacherId, function(err, teacher){
        if (err) {
            console.error(err);
        }

        var teacherName = teacher.firstName + " " + teacher.lastName;

        // Create a new class object with the class name and teacher specified.
        var classObject = new Class({
            name: req.body.class_name,
            teacherId: teacherId,
            teacherName: teacherName
        });;

        // Save the class to the database.
        classObject.save(function (err, classObject) {
            if (err) return console.error(err);

            teacher.classes.push(classObject._id);

            teacher.save(function (err, message) {
                if (err) {
                    console.log("Teacher object was not saved.");
                }
                else {
                    console.log("Teacher object saved!");
                    console.log(teacher);
                }

                res.redirect('/teacher');
            });
        });
    });
};

// Delete a class (by a teacher).
exports.remove = function (req, res) {
    if (!req.body.classId) {
        return resError(res, "Please choose a class.");
    } else if ((!req.user) || ! (req.user instanceof db.models.Teacher)) {
        return resError(res, "Please sign in to a Teacher account.");
    }
    classObject = Class.findOne({_id: req.body.classId}, function (err, classObject) {
        if (err) return resError(res, "We couldn't find this class.");
    });
    
    if (req.user.id != classObject.teacherId) {
        return resError(res, "You aren't allowed to delete this class. Please ask the creator of the class to delete it.");
    }
    
    // Fine the classId. Delete it from all students and the teacher, and then delete the class itself.
    Class.findAndRemove({
        _id: req.body.classId
    }, function(err) {
        if (err) {
            console.log("Class not deleted.")
            resError(res, "Sorry, we couldn't delete this class.")
        } else {
            console.log("Class object deleted!");
        }
        res.redirect('/teacher');
    });
}

// Add a class to a student's list of classes.
exports.subscribe = function (req, res) {
    if (!req.user.id) {
        return resError(res, "Sorry, unable to find this user")
    }
    else if (!req.body.classId) {
        return resError(res, "Sorry, unable to find this class")
        console.log(body.parser.className);
    }
    else if ((!req.user) || ! (req.user instanceof db.models.Student)) {
        return resError(res, "Please sign in to a Student account.");
    }

    // Add Student._id to Class.studentIds
    Class.findOne({
        _id: req.body.classId
    }, function (err, classObj) {
        if (err) return console.error(err);

        classObj.studentIds.push(req.user.id);

        console.log("Student added to class!");

        classObj.save(function (err) {
            if (err) return console.error(err);
            
            Student.findOne({
                _id: req.user.id
            }, function (err, student) {

                // Add the Class._id to Student.classes

                student.classes.push(req.body.classId);

                console.log("Class added to student");

                student.save(function (err) {
                    if (err) return console.error(err);
                });

                res.redirect('/');
            });
        });
    });


};

// Remove a class from a student's list of classes.
exports.unsubscribe = function (req, res) {
    
}