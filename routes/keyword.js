var db = require('./../db.js');
var resError = require('./messaging').resError;
var Keyword = db.models.Keyword;

exports.create = function(req, res) {
	// Check that the req object contains a name attribute. If not, return an error.
	if (!req.name) {
		return resError(res, 'Sorry, this keyword does not have a name.');
	}

	// Create new keyword.
	var keyword = new Keyword({
		name: req.name,
		count: 0
	});

	// Save keyword to database.
	keyword.save(function(err, keyword){
		if (err) console.error(err);

		console.log(keyword);
	});
};