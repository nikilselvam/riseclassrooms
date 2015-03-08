var db = require('./../db.js');
var resError = require('./messaging').resError;
var Class = db.models.Class;
var Teacher = db.models.Teacher;

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

    // Create a new class object with the class name and teacher specified.
    var classObject = new Class({
        name: req.body.class_name,
        teacherId: teacherId
    });;

    // Save the class to the database.
    classObject.save(function (err, classObject) {
        if (err) return console.error(err);

        console.log(classObject);
        Teacher.findById(teacherId, function (err, teacher) {
            if (err) {
                console.error(err);
            }

            teacher.classes.push(classObject._id);

            teacher.save(function (err, message) {
                if (err) {
                    console.log("Teacher object was not saved.");
                }
                else {
                    console.log("Teacher object saved!");
                }

                res.redirect('/teacher');

                // var classIds = req.user.classes;

                // Class.find({
                //     '_id' : { $in: classIds } 
                // }, function (err, classes) {
                //     res.render('teacherHome', {
                //         title: 'Classes',
                //         classes: classes,
                //         partials: {
                //         layout: 'layout'
                //         }
                //     });
                // });
            });
        });
    });
};

exports.subscribe = function (req, res) {
    if (!req.studentId) {
        return resError(res, "Sorry, unable to find this user")
    }
    else if (!req.classId) {
        return resError(res, "Sorry, unable to find this class")
        console.log(body.parser.className);
    }
    else if ((!req.user) || ! (req.user instanceof db.models.Student)) {
        return resError(res, "Please sign in to a Student account.");
    }


     
    // Add Student._id to Class.studentIds
    Class.findOne({
        _id: req.classId
    }, function (err, classObj) {
        if (err) return console.error(err);

        classObj.studentIds.push(req.studentId);
        classObj.save(function (err) {
            if (err) return console.error(err);
            Student.findOne({
                _id: req.studentId
            }, function (err, student) {
                student.classes.push(req.classId);
                student.save(function (err) {
                    if (err) return console.error(err);
                });
            });
        });
    });

    // Add the Class._id to Student.classes
    

};
