/*
 * Messaging functions.
 */

// Send a response with an error message and logs it in the console.
function resError(res, message, redirect){
	// Return if the res property has no send method.
	if (!res.send) return;

	console.error(message);
	if (redirect){
		res.send({status: message, success: false, redirect: redirect});
	} else {
		res.send({status: message, success: false});
	}
}

exports.resError = resError;