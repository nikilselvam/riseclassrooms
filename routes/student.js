student.js

exports.create = function(req, res){
	if(!req.username) {
		return resError(res, "Username does not exist");
	}
	else if (!req.password) {
		return resError(res, "Password does not match");
	}


	var student1 = new Student({
		name: req.username,
		password: req.password
	});;

	student1.save(function(err, student1) {
		if (err) return console.errr(err);
		return student1;
	});
};