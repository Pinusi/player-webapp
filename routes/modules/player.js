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
	for (var questionid in question_list.questions) 
	{
	  	if(question_list.questions[questionid].on){
		  	questions_array.push(
			  	{	
			  		txt: question_list.questions[questionid].txt,
			  		id: questionid
			  	});
		}
	}
	callback(questions_array);
}