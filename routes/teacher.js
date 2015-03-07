teacher.js

exports.create = function(req, res){
	if (!req.username) {
		return resError(res, "Sorry, this username does not exist");
	}
	else if (!req.password) {
		return resError(res, "Password is incorrect.");
	}

	var teacher1 = new Teacher({
		username: req.username,
		password: req.password
	});;


	teacher1.save(function(err, teacher1) {
		if (err) return console.errr(err);
		
		return teacher1;
	});
};
