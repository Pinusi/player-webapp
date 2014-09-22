//db manager
var db = require('./db');
var moment = require('moment');

/*
	GET THE QUESTIONS + players
 */
exports.getWhoAnswered = function(callback) //callback to execute
{
	var date = moment().format('YYYY-MM-DD');
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
	GET THE PLAYERS
 */
exports.getPLayers = function(callback) //callback to execute
{
	db.getPLayerDocument(function(player_list){
		callback(player_list);
	});
}