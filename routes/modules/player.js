//db manager
var db = require('./db');
var moment = require('moment');

/*
	GET THE QUESTIONS FORT THE playerform
	@QUESTIONS:
	{
       "q_1": {
           "txt": "",
           "type": "txt",
           "on": "true"
       },
       "q_2": {
           "txt": "",
           "type": "tap",
           "answers": [
               "Very Fresh",
               "Fresh", ...
           ],
           "on": "true",
           "scale": [
               0,
               0, ...
           ]
       },
       "q_5": {
           "txt": "",
           "type": "tappop",
           "answers": [
               "Feeling Great", ...
           ],
           "scale": [
               0, ...
           ],
           "popup": {
               "title": "WHERE ARE YOU SORE?",
               "whofires": [
                   3,
                   4
               ],
               "questions": {
                   "General": [
                       "Legs", ...
                   ], ...
               }
           },
           "on": "true"
       }, ...
    }

 */
exports.getQuestionsTxt = function(callback) //callback to execute
{
	db.getQuestionsList(function(question_list){
		callback(question_list.questions);
	});
}

/*
	SAVE THE ANSWERS AFTER SUBMITTING
 */
exports.saveAnswers = function(questions, id, callback) //answers to store, playerid
{
	//save playerid
	var playerID = id;
	//today
	var date = moment().utc().format('YYYY-MM-DD');
	//everybody done
	var isEverybodyDone = true;

	//same code but getting all the player list
	db.getPLayerDocument(function(players){
		for(var j = 0; j < players.length; j++) {
	   		var player = players[j];
	   		if( player.id === playerID ) {
		  		for(var question_id in questions)
		  		{
		  			var answer = player.answers[question_id];
		   			if( answer )
		   			{
		   				answer[date] = questions[question_id];
		   			}
		   			else
		   			{
		   				player.answers[question_id] = {};
		   				answer = player.answers[question_id];
		   				answer[date] = questions[question_id];
		   			}
		  		}
	   		}

	   		//check if everybody is done
	   		var isHeDone = false;
	   		for(check_answ in player.answers)
			{
				var answ_obj = player.answers[check_answ];
				if(answ_obj[date])
				{
					isHeDone = true;
				}
			}
			isEverybodyDone = isHeDone;
	   	}

	   	db.savePlayerDocument(players);
	   	
	   	if(isEverybodyDone)
	   	{
	   		callback('ok', true);
	   	}
	   	else
	   	{
	   		callback('ok', false);
	   	}
	});
	
	//just get the right player
	// db.getOnePLayer(playerID,function(player){

	// 	//loop trough the answers
	// 	for (var i = 0; i < answers.length; i++) 
	// 	{
 //   			//store the answer and the id
 //   			var answer_to_save = answers[i].txt;
 //   			var questionID = answers[i].id;

 //   			//get the one from the db
 //   			var answer = player.answers[questionID];

 //   			//if exist
 //   			if( answer )
 //   			{
 //   				//override it
 //   				answer[date] = answer_to_save;
 //   			}
 //   			else
 //   			{
 //   				//create it
 //   				player.answers[questionID] = {};
 //   				answer = player.answers[questionID];
 //   				answer[date] = answer_to_save;
 //   			}
 //   		}

 //   		//save everything to the db
 //   		db.saveOnePlayer(player,playerID,function(response){
 //   			callback('ok');
 //   		});
	// });
}