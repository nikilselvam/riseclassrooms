// function(undefinedParam){
// 	undefined = undefinedParam;
// })();

// Testing environment uses the DigitalOcean server for mongodb. Production would use mongolab.
var testEnv = function() {
    return true;
}

// Secrets.
if (typeof process.env.DB_USER === 'undefined' || typeof process.env.DB_PASS === 'undefined'){
	var secret = require('./secret');
    if (testEnv() === true) {
	   process.env.DB_USER = secret.testingUser;
    }
    else {
        process.env.DB_USER = secret.user;
    }
	process.env.DB_PASS = secret.pass;
}

var access = {
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
};

// Generate a one-time use values.
var oneTime = function(value){
	var used = false;

	return function(){
		if (used === false){
			used = true;
			return value;
		}
	}
}

/*
 * Expose username and password as one-time use functions.
 * e.g.
 *     var config = require('appconfig');
 *     var first = config.user();		// should be the real value
 *     var second = config.user();		// should be undefined
 */
exports.user = oneTime(access.user);
exports.pass = oneTime(access.pass);
exports.testEnv = testEnv();