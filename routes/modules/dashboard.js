//db manager
var db = require('./db');
var moment = require('moment');

/*
	GET THE QUESTIONS + players [OPERATOR DS]

	@CALLBACK
	@PLAYER_LIST:  
	[
       {
           "name": "",
           "surname": "",
           "id": "p_1",
           "player_number": 10,
           "role": "o_f",
           "answers": {
               "q_1": {
                   "2014-10-14": "89"
               },
               "q_2": {
                   "2014-10-14": "Fresh"
               },
               "q_5": {
                   "2014-10-14": {
                       "general": "Very Sore",
                       "specific": {
                           "General": ["Back", "Upper Body", ...],
                           "Hamstring": ["Back", "Upper Body", ...]
                       }
                   }
               }, ...
           },
           "formCompleated": true
       }, ...
    ]
 */
exports.getWhoAnswered = function(callback) //callback to execute
{
	var date = moment().utc().format('YYYY-MM-DD');
	var whoAnswered = {};

	db.getPLayerDocument(function(player_list){
		for(var i=0; i<player_list.length; i++)
		{
			var player = player_list[i];
			for(answer in player.answers)
			{
				for(date_1 in player.answers[answer])
				{
					if(date_1 == date)
					{
						player_list[i].formCompleated = true;
					}
				}
			}
		}
		callback(player_list);
	});
}

/*
	GET THE PLAYERS [PLAYER DS]

	@CALLBACK
	@PLAYER_LIST:  
	[
       {
           "name": "",
           "surname": "",
           "id": "p_1",
           "player_number": 10,
           "role": "o_f",
           "answers": {
               "q_1": {
                   "2014-10-14": "89"
               },
               "q_2": {
                   "2014-10-14": "Fresh"
               },
               "q_5": {
                   "2014-10-14": {
                       "general": "Very Sore",
                       "specific": {
                           "General": ["Back", "Upper Body", ...]
                           "Hamstring": ["Back", "Upper Body", ...]
                       }
                   }
               }, ...
           }
       }, ...
    ]
 */
exports.getPLayers = function(callback) //callback to execute
{
	db.getPLayerDocument(function(player_list){
		callback(player_list);
	});
}