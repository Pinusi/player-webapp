//db manager
var db = require('./db');

//get the users list and store it
var user_list = undefined;
db.getUserList(function(user_list_data){
	user_list = user_list_data;
});

//check the login
exports.login = function(user, pass, callback)
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
					callback('trainee');
				}
				else
				{
					callback('player');
				}
			}
			else
			{
				callback('invalid-password');
			}
		}
	};
	if( notfound )
	{
		callback('user-not-found');
	}
}
