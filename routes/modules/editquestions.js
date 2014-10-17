//db manager
var db = require('./db');

exports.getAllQuestions = function(callback) //callback to execute
{
	db.getQuestionsList(function(question_list){
		callback(question_list.questions);
	});
}

exports.saveQuestionsUpdate = function(questions, callback) //callback to execute
{
	//just perform the callback
	db.saveQuestionsList(questions, function(isok){
		callback(isok);
	});
}