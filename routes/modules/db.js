//db manager that handles calls to db
var nano = require('nano')('http://localhost:5984');
var playerdb = nano.db.use('player-wellness');

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
		  	console.log(questions_list);
		  	callback(questions_list);
		  }
		  else
		  {
		  	console.log(err);
		  }
	});
}