//db manager
var db = require('./db');

/*
	APP LOGIN
 */
exports.login = function(user, pass, callback)
{
	db.getAppLogin(function(app_login){
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
	});
}