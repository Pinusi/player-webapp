var express = require('express');
var UL = require('./modules/users');
var AL = require('./modules/login');
var PL = require('./modules/player');

module.exports = function(app) {

	// INDEX //
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
	
	// HOME //
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
		UL.login(req.body.user, req.body.pass, function(check){
			if ( check === 'player' )
			{
				console.log('login effettuato player');
				req.session.name = req.body.user;
				req.session.type = check;
				app.render('player_form', { layout: false }, function(err, html){
				  	var response = {
				  		type: check,
						redirect: 'playerform'
				  	};
				  	res.send(response).end();
				});
			}
			else if( check === 'trainee' )
			{
				console.log('login effettuato allenatore');
				req.session.name = req.body.user;
				req.session.type = check;
				var response = {
					type: check
			  	};
				res.send(response).end();
			}
			else if ( check === 'invalid-password' )
			{
				console.log('password errata');
				//ajax
			}
			else if ( check === 'user-not-found' )
			{
				console.log('utente non trovato');
				//ajax
			}
			else
			{
				console.log('errore di connessione');
				res.send(400);
			}
		});
	});

	// PLAYER PAGE //
	app.get('/playerform', function(req, res) {
		if (req.session.user == null){
			// if user is not logged-in the app redirect back to login page //
	        res.redirect('/');
	    }
	    else
	    {
	    	if(req.session.name == null)
	    	{
	    		// if user is not logged-in //
	    		res.redirect('/home');
	    	}
	    	else
	    	{
	    		if(req.session.type == 'player')
	    		{
	    			// if user is a player //
	    			PL.getQuestionsTxt(function(questions){
	    				res.render('player_form', { questions: questions, user: req.session.name});
	    			});
	    		}
	    		else
	    		{
	    			// if user is something strange //
	    			res.redirect('/home');
	    		}
	    	}
	    }
	});

	app.post('/playerform', function(req, res) {
		console.log(req.body);
	});
}