//db manager that handles calls to db
var nano = require('nano')('http://localhost:5984');
var playerdb = nano.db.use('player-wellness');
// var players_list_doc = undefined;
// var players_list_rev = 

exports.getUserList = function(callback)
{
	playerdb.get('user_list', { revs_info: true }, function(err, body) {
		if (!err){
		  	var user_list = body.users;
		  	callback(user_list);
		  }
		  else
		  {
		  	console.log(err);
		  }
	});
}

exports.getAppLogin = function(callback)
{

	playerdb.get('app_login', { revs_info: true }, function(err, body) {
		if (!err){
		  	var app_login = body;
		  	callback(app_login);
		  }
		  else
		  {
		  	console.log(err);
		  }
	});
}

exports.getQuestionsList = function(callback)
{

	playerdb.get('questions_list', { revs_info: true }, function(err, body) {
		if (!err){
		  	var questions_list = body;
		  	callback(questions_list);
		  }
		  else
		  {
		  	console.log(err);
		  }
	});
}

exports.getPLayerDocument = function(callback)
{
	// playerdb.view("players_list_updates", "get-players", [], function(players) {
	// 	var players_list = players;
	// 	console.log(players)
	// });
	playerdb.get('players_list', { revs_info: true }, function(err, body) {
		if (!err){
		  	// players_list_doc = body;
		  	var players_list = body.players;
		  	callback(players_list);
		  }
		  else
		  {
		  	console.log(err);
		  }
	});
}

exports.getOnePLayer = function(player_id, callback)
{
	console.log(player_id);
	playerdb.view("players_list_updates", "get-playerbyid", { key: [player_id]}, function(err,body) {
		if (!err) {
			var player = body.rows[0].value;
			callback(player);
		}
		else
		{
			console.log('error in getOnePLayer');
		}
	});
}

exports.savePlayerDocument = function(players_update, callback)
{
	// console.log(players_update);
	// players_list_doc.players = players_update;
	// playerdb.insert(players_list_doc, 'players_list', function(err, body) {
	//   if (!err)
	//     console.log(body);
	// });
	playerdb.atomic(
		"players_list_updates", 
		"update-players", 
		"players_list", 
  		{players: players_update}, 
  		function(err,body) {
  			if (!err) {
  				console.log(body);
  			}
  			else
  			{
  				console.log('error in savePlayerDocument');
  			}
  		}
  	);
}

exports.saveOnePlayer = function(player_update, player_id, callback)
{
	playerdb.atomic(
		"players_list_updates", 
		"update-player", 
		"players_list", 
  		{player: player_update, id: player_id}, 
  		function(err,body) {
  			if (!err) {
				callback('ok'); 
			}
			else
			{
				console.log('error in saveOnePlayer');
			}
  		}
  	);
}