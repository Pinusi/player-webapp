//db manager
var db = require('./db');
var moment = require('moment');

//get the question list and store it
var question_list = undefined;
db.getQuestionsList(function(question_list_data){
	question_list = question_list_data;
});

/*
	GET THE QUESTIONS FORT THE playerform
 */
exports.getQuestionsTxt = function(callback) //callback to execute
{
	//array of questions
	var questions_array = [];
	for (var questionid in question_list.questions) 
	{
	  	if(question_list.questions[questionid].on){
		  	questions_array.push(
			  	{	
			  		txt: question_list.questions[questionid].txt,
			  		id: questionid,
			  		type: question_list.questions[questionid].type,
			  		answers: question_list.questions[questionid].answers
			  	});
		}
	}
	callback(questions_array);
}

/*
	SAVE THE ANSWERS AFTER SUBMITTING
 */
exports.saveAnswers = function(answers, id, callback) //answers to store, playerid
{
	//save playerid
	var playerID = id;
	//today
	var date = moment().format('YYYY-MM-DD');

	//same code but getting all the player list
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
	
	//just get the right player
	db.getOnePLayer(playerID,function(player){

		//loop trough the answers
		for (var i = 0; i < answers.length; i++) 
		{
   			//store the answer and the id
   			var answer_to_save = answers[i].txt;
   			var questionID = answers[i].id;

   			//get the one from the db
   			var answer = player.answers[questionID];

   			//if exist
   			if( answer )
   			{
   				//override it
   				answer[date] = answer_to_save;
   			}
   			else
   			{
   				//create it
   				player.answers[questionID] = {};
   				answer = player.answers[questionID];
   				answer[date] = answer_to_save;
   			}
   		}

   		//save everything to the db
   		db.saveOnePlayer(player,playerID,function(response){
   			callback('ok');
   		});
	});
}