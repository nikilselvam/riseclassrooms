var mongoose = require('mongoose');
var dbName = 'riseclassrooms';

var secret = require('./appconfig');

// Connect to database and listen to events.
// mongoose.connect('mongodb://riseclassrooms:fse301@ds049641.mongolab.com:49641/riseclassrooms');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var teacherSchema = new Schema({
	password			: String,
	username 			: String,
	firstName			: String,
	lastName			: String,
	title 				: String,
	researchInterest	: String,
	background			: String,
	picture				: String,
	classes				: [ObjectId]
}, { collection: 'teacher'});

var classSchema = new Schema({
	name 				: String,
	studentIds			: [ObjectId],
	sessions			: [ObjectId],
	teacherId			: [ObjectId]
}, { collection: 'class'});

var sessionSchema = new Schema({
	startTime 			: Date,
	endTime 			: Date,
	active				: Boolean,
	durations			: Number,
	numberOfQuestions	: Number,
	feedback            : [ObjectId],
	questions 			: [ObjectId],
	keywords			: [ObjectId],
	classId 			: ObjectId,
	numberOfKeywords	: Number,
	topFiveKeywords 	: [ObjectId]
}, { collection: 'session'});

var questionSchema = new Schema({
	author 				: [{teacher: ObjectId, student: ObjectId}],
	content				: String,
	isAnswered 			: Boolean,
	timeAsked			: Date,
	isStudentQuestion   : Boolean,
	sessionId			: [ObjectId]
}, { collection: 'question'});

var studentSchema = new Schema({
	password			: String,
	username			: String,
	firstName			: String,
	lastName 			: String,
	classes 			: [ObjectId],
	year				: String,
	major				: String,
	gradDate			: Date,
	picture				: String,
	description			: String
}, { collection: 'student'});

var feedbackSchema = new Schema({
	totalQuestionsAsked		: Number,
	totalQuestionsAnswered	: Number,
	keywords				: [ObjectId]
}, { collection: 'feedback'});

var keywordSchema = new Schema({
	count 			: Number,
	name  			: String,
	questionType 	: [ObjectId],
	proportion		: Number
}, { collection: 'trend'});

var questionTypeSchema = new Schema({
	name 		: String,
	count 		: Number,
	questions   : [ObjectId]
}, { collection: 'questionType'});

/*mongoose.connect('mongodb://'+secret.user + ':' +
		secret.pass +
		'@ds049641.mongolab.com:49641/'+dbName);
*/

var dbModels = {
	'Teacher': mongoose.model('Teacher', teacherSchema, 'teacher'),
	'Class': mongoose.model('Class', classSchema, 'class'),
	'Session': mongoose.model('Session', sessionSchema, 'session'),
	'Question': mongoose.model('Question', questionSchema, 'question'),
	'Student' :  mongoose.model('Student', studentSchema, 'student'),
	'Feedback' :  mongoose.model('Feedback', feedbackSchema, 'feedback'),
	'Keyword' :  mongoose.model('Keyword', keywordSchema, 'keyword'),
	'Question Type' :  mongoose.model('Question Type', questionTypeSchema, 'questionType'),

}

exports.models = dbModels;

// Connect to database and listen to events.
if (secret.testEnv === true) {
    mongoose.connect('mongodb://'+secret.user() + ':' +
            secret.pass() +
            '@198.199.93.104:27017/'+dbName);
} else {
    mongoose.connect('mongodb://'+secret.user() + ':' +
            secret.pass() +
            '@ds049641.mongolab.com:49641/'+dbName);
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("MongoDB connection opened to database: " + dbName);
});

// Export the db andschema to external interfaces
exports.db = db;


