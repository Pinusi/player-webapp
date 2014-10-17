//db manager
var db = require('./db');

/*
	PLAYER + OPERATOR LOGIN
 */
exports.login = function(user, pass, callback)
{
	db.getUserList(function(user_list)
	{
		var notfound = true;
		for (var i = 0; i < user_list.length; i++) {
			if( user == user_list[i].username )
			{
				notfound = false;
				if( pass == user_list[i].password )
				{
					if( user_list[i].type == 'trainee' )
					{
						callback('trainee', user_list[i].id);
					}
					else
					{
						callback('player', user_list[i].id);
					}
				}
				else
				{
					callback('invalid-password');
				}
			}
		}
		if( notfound )
		{
			callback('user-not-found');
		}
	});
}
