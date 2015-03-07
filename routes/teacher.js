teacher.js

exports.create = function(req, res){
	if(!req.username) {
		return resError(res, "Please include a username");
	}
	else if (!req.password) {
		return resError(res, "Please include a password");
	}
	else if (!req.firstName) {
		return resError(res, "Please include your first name");
	}
	else if (!req.lastName) {
		return resError(res, "Please include your last name");
	}


	var teacher1 = new Teacher({
		username: req.username,
		password: req.password,
		firstName: req.firstName,
		lastName: req.lastName
	});;


	teacher1.save(function(err, teacher1) {
		if (err) return console.err(err);
		
		return teacher1;
	});
};
