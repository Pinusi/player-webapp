//db manager
var db = require('./db');

//get the question list and store it
var question_list = undefined;
db.getQuestionsList(function(question_list_data){
	question_list = question_list_data;
});

exports.getQuestionsTxt = function(callback)
{
	var questions_array = [];
	for (var question in question_list.questions) 
	{
	  questions_array.push(question_list.questions[question].txt);
	}
	callback(questions_array);
}