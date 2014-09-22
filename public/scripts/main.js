if (!WELLNESS) { var WELLNESS = {}; }
if (!WELLNESS.CLIENT) { WELLNESS.CLIENT = {}; }

WELLNESS.CLIENT.Main = function()
{
	this.url = 'login';
	this.addEvents(this.url);
	this.playeruser = null;
}

WELLNESS.CLIENT.Main.prototype.addEvents = function(url)
{
	this.url = url;
	var that = this;
	switch(url){
		case 'home':
			that.addHomeEvents();
			break;
		case 'dashboard':
			that.addDashEvents();
			break;
		case 'playerform':
			that.addFormEvents();
			break;
	}
}

WELLNESS.CLIENT.Main.prototype.addHomeEvents = function()
{
	//button to open login modal
	$('#traineedash').on('click',function(){
		$('#traineepop').show();
	});

	//button to close login modal
	$('#traineeclose').on('click',function(){
		$('#traineepop').hide();
	});

	//everywhere close login modal
	$('#traineepop').on('click',function(e){
	   	var $box = $('#traineepop .dobPopUp');
	   	if(!$box.is(e.target) && $box.has(e.target).length === 0)
	      	$( this ).hide();
	});

	//login for trainee
	$('#traineelogin').click(function() { 

	    var user = $('#traineeuser').val();
	    var pass = $('#traineepass').val();
	    $.ajax({
	        url: '/home',
	        type: 'POST',
	        data: {user: user, pass: pass}, // An object with the key 'submit' and value 'true;
	        success: function (result) {
	        	if( result.type === 'trainee' )
	        	{
	        		//va alla dashboard e fa sparire le faccie
	        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
	        		var host = window.location.host != '' ? window.location.host + "/" : '';
	        		window.location.href = protocol + host + result.redirect;
	        	}
	        	else if( result.type === 'invalid-password')
	        	{
	        		//password sbagliata
	        	}
	        	else
	        	{
	        		//player o utente non trovato
	        	}
	        }
	    });  

	});

	//i player vanno alla dashboard
	$('#playerdash').click(function() {
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});
}

WELLNESS.CLIENT.Main.prototype.addDashEvents = function()
{
	var that = this;

	//button to open login modal
	$('.player_login').on('click',function(){
		//cleanup
		$('#playerpop').find('#playerday').val(null);
		$('#playerpop').find('#playermonth').val(null);
		$('#playerpop').find('#playeryear').val(null);
		//set variables
		var user = $( this ).attr('data-user');
		$('#playerpop').attr('data-user',user);
		$('#playerpop').find('.playerCircle').empty().append('<div class="playerImage "' + user + '"></div>')
		$('#playerpop').find('.playerInfo').html($( this ).find('.playerNo').html());
		$('#playerpop').show();
	});

	//close modal
	$('#playerclose').on('click',function(){
		$('#playerpop').hide();
	});

	//close modal
	$('#playerpop').on('click',function(e){
	   	var $box = $('#playerpop .dobPopUp');
	   	if(!$box.is(e.target) && $box.has(e.target).length === 0)
	      	$( this ).hide();
	});

	//back button
	$('#backtohome').on('click',function(){
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "home";
	});

	//player login
	$('#playerlogin').click(function() { 

	    var user = $('#playerpop').attr('data-user');
	    var pass = $('#playerday').val() + '-' + $('#playermonth').val() + '-' + $('#playeryear').val();
	    $.ajax({
	        url: '/dashboard',
	        type: 'POST',
	        data: {user: user, pass: pass}, // An object with the key 'submit' and value 'true;
	        success: function (result) {
	        	if( result.type === 'player' )
	        	{
	        		//va al playerform
	        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
	        		var host = window.location.host != '' ? window.location.host + "/" : '';
	        		window.location.href = protocol + host + result.redirect;
	        	}
	        	else if( result.type === 'invalid-password')
	        	{
	        		//password sbagliata
	        	}
	        	else
	        	{
	        		//player o utente non trovato
	        	}
	        }
	    });  

	});
}

WELLNESS.CLIENT.Main.prototype.addFormEvents = function()
{
	//back button
	$('#backtodash').on('click',function(){
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});

	//click on each tap button
	$('.formBtnCont').on('click',function(){
		//togli gli altri della stessa domanda
		$( this ).siblings().find('.formBtn').removeClass('selected');
		//aggiugngi la classe selected
		$( this ).find('.formBtn').addClass('selected');
		//salva in data-answer
		$( this ).parent().attr("data-answer",$( this ).find('p').html());
	});

	//click on submit
	$('#submitanswers').click(function() { 

		//array risposte
	    var answers = [];
	    //il form e' completo?
	    var form_completo = true;
	    
	    $('.formQuestion').each(function()
	    {
	    	switch($(this).attr('data-type'))
	    	{
	    		//se e' testo semplice salva il valore e l'id
	    		case 'txt':
	    			if( $(this).find('input').val() ){
			    		answers.push(
			    		{
			    			id: $(this).attr('data-id'),
			    			txt: $(this).find('input').val()
			    		});
			    	}
		    		else
		    		{
		    			form_completo = false;
		    			//errore
		    		};
		    		break;
		    	//se e' tap salva il data-answer e l'id
	    		case 'tap':
	    			if( $(this).attr('data-answer') ){
			    		answers.push(
			    		{
			    			id: $(this).attr('data-id'),
			    			txt: $(this).attr('data-answer')
			    		});
			    	}
		    		else
		    		{
		    			form_completo = false;
		    			//errore
		    		}
		    		break;
		    }

    	});

	    //se non manca nulla chiama
	    if(form_completo)
	    {
		    $.ajax({
		        url: '/playerform',
		        type: 'POST',
		        data: {answers: answers},
		        success: function (response) {
		        	if(response.result == 'ok'){
			        	//va alla dashboard
		        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		        		var host = window.location.host != '' ? window.location.host + "/" : '';
		        		window.location.href = protocol + host + response.redirect;
		        	}
		        	else
		        	{
		        		console.log('error');
		        	}
		        }
		    }); 
		} 

	});
}