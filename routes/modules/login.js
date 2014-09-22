//db manager
var db = require('./db');

//get the app credentials and store them
//var app_login = undefined;
// db.getAppLogin(function(app_login_data){
// 	app_login = app_login_data;
// });

//check the login
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