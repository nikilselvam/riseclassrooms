var mongoose = require('mongoose');
var dbName = 'riseclassrooms';

var secret = require('./appconfig');

// Connect to database and listen to events.
// mongoose.connect('mongodb://riseclassrooms:fse301@ds049641.mongolab.com:49641/riseclassrooms');

mongoose.connect('mongodb://'+secret.user() + ':' +
		secret.pass() +
		'@ds049641.mongolab.com:49641/'+dbName);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("MongoDB connection opened to database: " + dbName);
});

// Export the db andschema to external interfaces
exports.db = db;