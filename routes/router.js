var express = require('express');
var UL = require('./modules/users');
var AL = require('./modules/login');
var PL = require('./modules/player');
var ED = require('./modules/editquestions');
var DS = require('./modules/dashboard');
var RP = require('./modules/report');
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
			res.render('login');
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
					console.log('error');
				}
			});
		}
	});

	app.post('/', function(req, res){
		AL.login(req.body.user, req.body.pass, function(check){
			if ( check === 'perfect' )
			{
				console.log('login della app effettuato');
				req.session.user = req.body.user;
				if (req.body.remember == "true"){
					console.log('cookie salvato');
					res.cookie('user', req.body.user, { maxAge: 365 * 24 * 60 * 60 * 1000 });
					res.cookie('pass', req.body.pass, { maxAge: 365 * 24 * 60 * 60 * 1000 });
				}
				var response = {
					type: check,
					redirect: 'home'
			  	};
				res.send(response).end();	
			}
			else if ( check === 'invalid-password' )
			{
				console.log('password errata');
				res.send({ type: "error" });
			}
			else if ( check === 'user-not-found' )
			{
				console.log('utente non trovato');
				res.send({ type: "error" });
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

		// DS.getPlayerExcel(function(result){
		// 	console.log('FINITO');
		// 	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		//     res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
		//     res.end(result, 'binary');
		// });

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
		req.body.user = 'operator'
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

		var onlyrefresh = req.query.refresh ? req.query.refresh : false;

		if (req.session.user == null)
		{
			// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }
	    else if(req.session.name != null && req.session.type == 'trainee' && req.session.userid != null)
	    {
	    	//do stuff for trainee dashboard
	    	DS.getWhoAnswered(function(player_list){
	    		if(!onlyrefresh){
	    			res.render('dashboard',{players:player_list,isTrainee:true});
	    		}
	    		else
	    		{
	    			res.send(player_list).end();
	    		}
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
	    		res.render('dashboard',{players:player_list,isTrainee:false});
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
				//app.render('player_form', { layout: false }, function(err, html){
			  	var response = {
			  		type: check,
					redirect: 'playerform'
			  	};
			  	res.send(response).end();
				//});
			}
			else if ( check === 'invalid-password' )
			{
				console.log('password errata');
				res.send({type: check}).end();
			}
			else if ( check === 'user-not-found' || check === 'trainee' )
			{
				console.log('utente non trovato');
				res.send({type: check}).end();
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
		PL.saveAnswers(answers, req.session.userid,function(result,email){
			console.log(email);

			//if everybody has answered
			if(email)
			{
				//send email with report
				RP.getAnswersByDate(function(answers_by_date){
					RP.getPlayerExcel(answers_by_date);
				});
			}

			var response = {
		  		result: result,
				redirect: 'dashboard'
		  	};
		  	res.send(response).end();
		});
	});

	//BUTTON TO GET THE EXCEL FILE IMMEDIATELY
	app.post('/excel', function(req, res) {
		if (req.session.user == null)
		{
			// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }
	    else if(req.session.name != null && req.session.type == 'trainee' && req.session.userid != null)
	    {
			//send email with report
			RP.getAnswersByDate(function(answers_by_date){
				RP.getPlayerExcel(answers_by_date);
				res.send('done').end();
			});
		}
		else
	    {
	    	//no access is a player
	    	//cleaning
	    	req.session.name = null;
	    	req.session.userid = null;
	    	//it's a player
	    	req.session.type = null;
	    	res.redirect('/home');
	    }
	});

	//MODIFY QUESTIONS
	app.get('/editquestions', function(req, res) {
		if (req.session.user == null)
		{
			// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }
	    else if(req.session.name != null && req.session.type == 'trainee' && req.session.userid != null)
	    {
	    	//do stuff for trainee edit page
	    	ED.getAllQuestions(function(questions){
				res.render('edit_questions', { questions: questions, user: req.session.name});
			});
	    }   
	    else
	    {
	    	//no access is a player
	    	//cleaning
	    	req.session.name = null;
	    	req.session.userid = null;
	    	//it's a player
	    	req.session.type = null;
	    	res.redirect('/home');
	    }
	});

	app.post('/editquestions', function(req, res) {
		//get all the questions from client
		var questions = req.body.questions;
		console.log(questions);
		ED.saveQuestionsUpdate(questions,function(result){
			var response = {
		  		result: result,
				redirect: 'dashboard'
		  	};
		  	res.send(response).end();
		});
	});

	//MODIFY QUESTIONS
	app.get('/generalreport', function(req, res) {
		var gp_onlyrefresh = req.query.refresh ? req.query.refresh : false;
		if (req.session.user == null)
		{
			// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }
	    else if(req.session.name != null && req.session.type == 'trainee' && req.session.userid != null)
	    {
			if(!gp_onlyrefresh)
			{
				RP.getAnswersByDate(function(answers_by_date){
					res.render('general_report', { answers_by_date: answers_by_date,user: req.session.name});
				});
			}
			else
			{
				RP.getAnswersByDate(function(answers_by_date){
					res.send(answers_by_date).end();
				});
			}
		}   
	    else
	    {
	    	//no access is a player
	    	//cleaning
	    	req.session.name = null;
	    	req.session.userid = null;
	    	//it's a player
	    	req.session.type = null;
	    	res.redirect('/home');
	    }
	});


}