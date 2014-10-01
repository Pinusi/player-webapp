//db manager
var db = require('./db');

exports.getAllQuestions = function(callback) //callback to execute
{
	db.getQuestionsList(function(question_list){
		//array of questions
		var questions_array = [];
		// for (var questionid in question_list.questions) 
		// {
		  	// if(question_list.questions[questionid].on){
			  	// questions_array.push(
				  // 	{	
				  // 		txt: question_list.questions[questionid].txt,
				  // 		id: questionid,
				  // 		type: question_list.questions[questionid].type,
				  // 		answers: question_list.questions[questionid].answers,
				  // 		popup: question_list.questions[questionid].popup
				  // 	});
			// }
		// }
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