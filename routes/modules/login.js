var nano = require('nano')('http://localhost:5984');
var playerdb = nano.db.use('player-wellness');
var app_login = null;

playerdb.get('app_login', { revs_info: true }, function(err, body) {
	if (!err){
	  	app_login = body;
	  }
	  else
	  {
	  	console.log(err);
	  }
});

exports.login = function(user, pass, callback)
{
	if( user == app_login.username )
	{
		if( pass == app_login.password )
		{
			callback('perfect');
		}
		else
		{
			callback('invalid-password');
		}
	}
	else
	{
		callback('user-not-found');
	}
}