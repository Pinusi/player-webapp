var express = require('express');
var UL = require('./modules/users');
var AL = require('./modules/login');
var PL = require('./modules/player');
var DS = require('./modules/dashboard');

//SESSION
//session.type
//session.name
//session.userid
//session.user (app user)

module.exports = function(app) {

	// INDEX //
	app.get('/', function(req, res){
		//clear session
		req.session.user = null;
		req.session.type = null;
		req.session.name = null;
		req.session.userid = null;

		//check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	
		else
		{
			// attempt automatic login //
			AL.login(req.cookies.user, req.cookies.pass, function(check){
				if ( check === 'perfect' )
				{
				    req.session.user = req.cookies.user;
					res.redirect('/home');
				}	
				else
				{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});

	app.post('/', function(req, res){
		AL.login(req.body.user, req.body.pass, function(check){
			if ( check === 'perfect' )
			{
				console.log('login della app effettuato');
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
		//clear session
		req.session.type = null;
		req.session.name = null;
		req.session.userid = null;

		DS.getPlayerExcel(function(result){
			console.log('FINITO');
		});

	    if (req.session.user == null){
			// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   
	    else
	    {
			res.render('home');
	    }
	});

	app.post('/home', function(req, res) {
		//in this case is only for trainee
		UL.login(req.body.user, req.body.pass, function(check, id){
			if( check === 'trainee' )
			{
				console.log('login effettuato allenatore');
				req.session.name = req.body.user;
				req.session.type = check;
				req.session.userid = id;
				var response = {
					type: check,
					redirect: 'dashboard'
			  	};
				res.send(response).end();
			}
			else if ( check === 'invalid-password' )
			{
				console.log('password errata');
				var response = {
					type: check
			  	};
				res.send(response).end();
			}
			else if ( check === 'user-not-found' || check === 'player' )
			{
				console.log('utente non trovato');
				var response = {
					type: check
			  	};
				res.send(response).end();
			}
			else
			{
				console.log('errore di connessione');
				res.send(400);
			}
		});
	});
	
	app.get('/dashboard', function(req, res) {

		if (req.session.user == null)
		{
			// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }
	    else if(req.session.name != null && req.session.type == 'trainee' && req.session.userid != null)
	    {
	    	//do stuff for trainee dashboard
	    	DS.getWhoAnswered(function(player_list){
	    		console.log(player_list);
	    		res.render('dashboard',{players:player_list,isTrainee:true});
	    	});
	    	
	    }   
	    else
	    {
	    	//cleaning
	    	req.session.name = null;
	    	req.session.userid = null;
	    	//it's a player
	    	req.session.type = 'player';
	    	DS.getPLayers(function(player_list){
	    		res.render('dashboard',{players:player_list});
	    	});
	    }
	});

	app.post('/dashboard', function(req, res) {
		UL.login(req.body.user, req.body.pass, function(check, id){
			if ( check === 'player' )
			{
				console.log('login effettuato player');
				req.session.name = req.body.user;
				req.session.userid = id;
				app.render('player_form', { layout: false }, function(err, html){
				  	var response = {
				  		type: check,
						redirect: 'playerform'
				  	};
				  	res.send(response).end();
				});
			}
			else if ( check === 'invalid-password' )
			{
				console.log('password errata');
				//ajax
			}
			else if ( check === 'user-not-found' || check === 'trainee' )
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
    		if(req.session.name != null && req.session.type == 'player' && req.session.userid != null)
    		{
    			// if user is a player //
    			PL.getQuestionsTxt(function(questions){
    				console.log(questions);
    				res.render('player_form', { questions: questions, user: req.session.name});
    			});
    		}
    		else
    		{
    			// if user is something strange //
    			res.redirect('/dashboard');
    		}
	    }
	});

	app.post('/playerform', function(req, res) {
		//get all the answers
		var answers = req.body.answers;

		//save them
		PL.saveAnswers(answers, req.session.userid,function(result){
			var response = {
		  		result: result,
				redirect: 'dashboard'
		  	};
		  	res.send(response).end();
		});
	});

	app.post('/excel', function(req, res) {

		//save them
		DS.getPlayerExcel(function(result){
			console.log('FINITO');
		});
	});
}