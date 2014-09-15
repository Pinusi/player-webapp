//db manager
var db = require('./db');
var moment = require('moment');

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

exports.saveAnswers = function(answers, id)
{
	var playerID = id;
	var date = moment().format('YYYY-MM-DD');

	// db.getPLayerDocument(function(players){
	// 	for(var i = 0; i < players.length; i++) {
	//    		var player = players[i];
	//    		if( player.id === playerID ) {
	//    			for (var i = 0; i < answers.length; i++) 
	// 			{
	// 	   			var answer_to_save = answers[i].txt;
	// 	   			var questionID = answers[i].id;

	// 	   			var answer = player.answers[questionID];
	// 	   			if( answer )
	// 	   			{
	// 	   				answer[date] = answer_to_save;
	// 	   			}
	// 	   			else
	// 	   			{
	// 	   				player.answers[questionID] = {};
	// 	   				answer = player.answers[questionID];
	// 	   				answer[date] = answer_to_save;
	// 	   			}
	// 	   		}
	//    		}
	//    	}
	//    	console.log(players[0].answers);
	//    	db.savePlayerDocument(players);
	// });
	db.getOnePLayer(playerID,function(player){
		for (var i = 0; i < answers.length; i++) 
		{
   			var answer_to_save = answers[i].txt;
   			var questionID = answers[i].id;

   			var answer = player.answers[questionID];
   			if( answer )
   			{
   				answer[date] = answer_to_save;
   			}
   			else
   			{
   				player.answers[questionID] = {};
   				answer = player.answers[questionID];
   				answer[date] = answer_to_save;
   			}
   		}
   		db.saveOnePlayer(player,playerID);
	});
}