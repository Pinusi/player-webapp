var express = require('express');

// var routes = require('./modules/index');
// var users = require('./modules/users');
var AL = require('./modules/login');
// var AM = require('./modules/account-manager');

module.exports = function(app) {
	//var router = app.Router();
	// app.use('/', routes);
	// app.use('/users', users);
	// app.use('/helloworld', helloworld);

	app.get('/', function(req, res){
	//check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	
		else
		{
	// attempt automatic login //
			AL.login(req.cookies.user, req.cookies.pass, function(check){
				if ( check === 'perfect' ){
				    req.session.user = req.cookies.user;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}

		//res.render('login', { title: 'Hello - Please Login To Your Account' }).end();
	});

	app.post('/', function(req, res){
		AL.login(req.body.user, req.body.pass, function(check){
			if ( check === 'perfect' )
			{
				console.log('login effettuato');
				console.log(req.body);
				//res.send(200).end();
				req.session.user = req.body.user;
				//res.render('home', { title: 'Hello - Please Login To Your Account' });
				if (req.body.remember == 'on'){
					console.log('cookie salvato');
					res.cookie('user', req.body.user, { maxAge: 365 * 24 * 60 * 60 * 1000 });
					res.cookie('pass', req.body.pass, { maxAge: 365 * 24 * 60 * 60 * 1000 });
				}
				res.redirect('/home');	
			}
			else if ( check === 'invalid-password' )
			{
				console.log('password errata');
				res.render('login', { error:'incorrect password' });
			}
			else if ( check === 'user-not-found' )
			{
				console.log('utente non trovato');
				res.render('login', { error:'user not found' });
			}
			else
			{
				console.log('errore di connessione');
				res.send(400);
			}
		});
	});
	
	app.get('/home', function(req, res) {
	    if (req.session.user == null){
			// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   
	    else
	    {
			res.render('home', { title: 'Benvenuto! Adesso loggati o come player o come allenatore' });
			//for AJAX
			// app.render('home', { layout: false,title: 'Hello - Please Login To Your Account' }, function(err, html){
			//   var response = {
			//     some_data: 'blablabla',
			//     some_more_data: [5, 8, 10, 67],
			//     my_html: html
			//   };
			//   res.send(response).end();
			// });
			//res.send(200).end();
	    }
	});

	app.post('/home', function(req, res) {

	});
}
// var router = app.Router();

// var CT = require('./modules/country-list');
// var AM = require('./modules/account-manager');
// var EM = require('./modules/email-dispatcher');
// var routes = require('./modules/index');
// var users = require('./modules/users');
// var helloworld = require('./modules/helloworld');

// // app.use('/', routes);
// app.use('/users', users);
// app.use('/helloworld', helloworld);

// module.exports = function(app) {

// // main login page //

// 	app.get('/', function(req, res){
// 	// check if the user's credentials are saved in a cookie //
// 		if (req.cookies.user == undefined || req.cookies.pass == undefined){
// 			res.render('login', { title: 'Hello - Please Login To Your Account' });
// 		}	else{
// 	// attempt automatic login //
// 			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
// 				if (o != null){
// 				    req.session.user = o;
// 					res.redirect('/home');
// 				}	else{
// 					res.render('login', { title: 'Hello - Please Login To Your Account' });
// 				}
// 			});
// 		}
// 	});
	
// 	app.post('/', function(req, res){
// 		AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
// 			if (!o){
// 				res.send(e, 400);
// 			}	else{
// 			    req.session.user = o;
// 				if (req.param('remember-me') == 'true'){
// 					res.cookie('user', o.user, { maxAge: 900000 });
// 					res.cookie('pass', o.pass, { maxAge: 900000 });
// 				}
// 				res.send(o, 200);
// 			}
// 		});
// 	});
	
// // logged-in user homepage //
	
// 	app.get('/home', function(req, res) {
// 	    if (req.session.user == null){
// 	// if user is not logged-in redirect back to login page //
// 	        res.redirect('/');
// 	    }   else{
// 			res.render('home', {
// 				title : 'Control Panel',
// 				countries : CT,
// 				udata : req.session.user
// 			});
// 	    }
// 	});
	
// 	app.post('/home', function(req, res){
// 		if (req.param('user') != undefined) {
// 			AM.updateAccount({
// 				user 		: req.param('user'),
// 				name 		: req.param('name'),
// 				email 		: req.param('email'),
// 				country 	: req.param('country'),
// 				pass		: req.param('pass')
// 			}, function(e, o){
// 				if (e){
// 					res.send('error-updating-account', 400);
// 				}	else{
// 					req.session.user = o;
// 			// update the user's login cookies if they exists //
// 					if (req.cookies.user != undefined && req.cookies.pass != undefined){
// 						res.cookie('user', o.user, { maxAge: 900000 });
// 						res.cookie('pass', o.pass, { maxAge: 900000 });	
// 					}
// 					res.send('ok', 200);
// 				}
// 			});
// 		}	else if (req.param('logout') == 'true'){
// 			res.clearCookie('user');
// 			res.clearCookie('pass');
// 			req.session.destroy(function(e){ res.send('ok', 200); });
// 		}
// 	});
	
// // creating new accounts //
	
// 	app.get('/signup', function(req, res) {
// 		res.render('signup', {  title: 'Signup', countries : CT });
// 	});
	
// 	app.post('/signup', function(req, res){
// 		AM.addNewAccount({
// 			name 	: req.param('name'),
// 			email 	: req.param('email'),
// 			user 	: req.param('user'),
// 			pass	: req.param('pass'),
// 			country : req.param('country')
// 		}, function(e){
// 			if (e){
// 				res.send(e, 400);
// 			}	else{
// 				res.send('ok', 200);
// 			}
// 		});
// 	});

// // password reset //

// 	app.post('/lost-password', function(req, res){
// 	// look up the user's account via their email //
// 		AM.getAccountByEmail(req.param('email'), function(o){
// 			if (o){
// 				res.send('ok', 200);
// 				EM.dispatchResetPasswordLink(o, function(e, m){
// 				// this callback takes a moment to return //
// 				// should add an ajax loader to give user feedback //
// 					if (!e) {
// 					//	res.send('ok', 200);
// 					}	else{
// 						res.send('email-server-error', 400);
// 						for (k in e) console.log('error : ', k, e[k]);
// 					}
// 				});
// 			}	else{
// 				res.send('email-not-found', 400);
// 			}
// 		});
// 	});

// 	app.get('/reset-password', function(req, res) {
// 		var email = req.query["e"];
// 		var passH = req.query["p"];
// 		AM.validateResetLink(email, passH, function(e){
// 			if (e != 'ok'){
// 				res.redirect('/');
// 			} else{
// 	// save the user's email in a session instead of sending to the client //
// 				req.session.reset = { email:email, passHash:passH };
// 				res.render('reset', { title : 'Reset Password' });
// 			}
// 		})
// 	});
	
// 	app.post('/reset-password', function(req, res) {
// 		var nPass = req.param('pass');
// 	// retrieve the user's email from the session to lookup their account and reset password //
// 		var email = req.session.reset.email;
// 	// destory the session immediately after retrieving the stored email //
// 		req.session.destroy();
// 		AM.updatePassword(email, nPass, function(e, o){
// 			if (o){
// 				res.send('ok', 200);
// 			}	else{
// 				res.send('unable to update password', 400);
// 			}
// 		})
// 	});
	
// // view & delete accounts //
	
// 	app.get('/print', function(req, res) {
// 		AM.getAllRecords( function(e, accounts){
// 			res.render('print', { title : 'Account List', accts : accounts });
// 		})
// 	});
	
// 	app.post('/delete', function(req, res){
// 		AM.deleteAccount(req.body.id, function(e, obj){
// 			if (!e){
// 				res.clearCookie('user');
// 				res.clearCookie('pass');
// 	            req.session.destroy(function(e){ res.send('ok', 200); });
// 			}	else{
// 				res.send('record not found', 400);
// 			}
// 	    });
// 	});
	
// 	app.get('/reset', function(req, res) {
// 		AM.delAllRecords(function(){
// 			res.redirect('/print');	
// 		});
// 	});
	
// 	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

// };