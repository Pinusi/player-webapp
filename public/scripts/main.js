if (!WELLNESS) { var WELLNESS = {}; }
if (!WELLNESS.CLIENT) { WELLNESS.CLIENT = {}; }

WELLNESS.CLIENT.Main = function()
{
	this.url = 'login';
	this.addEvents(this.url);
	this.playeruser = null;
}

WELLNESS.CLIENT.Main.prototype.addEvents = function(url,data)
{
	this.url = url;
	var that = this;
	switch(url){
		case 'login':
			that.addLoginEvents();
			break;
		case 'home':
			that.addHomeEvents();
			break;
		case 'dashboard':
			that.addDashEvents(data);
			break;
		case 'playerform':
			that.addFormEvents();
			break;
		case 'editquestions':
			that.data = data;
			that.addEditEvents();
			break;
		case 'generalreport':
			that.addReportEvents();
			break;
	}
}

WELLNESS.CLIENT.Main.prototype.addLoginEvents = function()
{
	$('#login').click(function() { 

	    var user = $('#user').val();
	    var pass = $('#pass').val();
	    var remember = $('#remember-me input').is(':checked');
	    $.ajax({
	        url: '/',
	        type: 'POST',
	        data: {user:user, pass: pass, remember: remember}, // An object with the key 'submit' and value 'true;
	        success: function (result) {
	        	if( result.type === 'perfect' )
	        	{
	        		//va alla dashboard e fa sparire le faccie
	        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
	        		var host = window.location.host != '' ? window.location.host + "/" : '';
	        		window.location.href = protocol + host + result.redirect;
	        	}
	        	else
	        	{
	        		//player o utente non trovato
	        		$('#login-container').addClass('incorrect');
	        	}
	        }
	    });  

	});
}

WELLNESS.CLIENT.Main.prototype.addHomeEvents = function()
{
	//button to open login modal
	$('#traineedash').on('click',function(){
		$('#traineepop').find('.popUp').removeClass('incorrect');
		$('#traineepop').show();
	});

	//everywhere close login modal
	$('#traineepop').on('click',function(e){
	   	var $box = $('#traineepop .popUp');
	   	if(!$box.is(e.target) && $box.has(e.target).length === 0)
	      	$( this ).hide();
	});

	//login for trainee
	$('#traineelogin').click(function() { 

	    // var user = $('#traineeuser').val();
	    var pass = $('#traineepass').val();
	    $.ajax({
	        url: '/home',
	        type: 'POST',
	        data: {pass: pass}, // An object with the key 'submit' and value 'true;
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
	        		$('#traineepop').find('.popUp').addClass('incorrect');
	        	}
	        	else
	        	{
	        		//player o utente non trovato
	        		$('#traineepop').find('.popUp').addClass('incorrect');
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

WELLNESS.CLIENT.Main.prototype.addDashEvents = function(isTrainee)
{
	console.log(isTrainee);

	var that = this;

	//back button
	$('#backtohome').on('click',function(){
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "home";
	});

	if(isTrainee){

		//update who compleated the form
		setInterval(function(){
		   	$.ajax({
		        url: '/dashboard',
		        type: 'GET', 
		        data: {refresh: true},
		        success: function (player_list) {
		        	console.log(player_list);
		        	//loop through players
		        	for (var k = 0; k < player_list.length; k++) {
		        		var current_player = player_list[k];
		        		//if the variable exist and is true
		        		if(current_player.formCompleated)
		        		{
		        			//add the clas to fade out
		        			$('.playerImage.'+ current_player.surname.toLowerCase()).addClass('completedForm');
		        		}
		        	}
		        }
		    });
		}, 15000);

		//button to go and change questions
		$('#changequestions').on('click',function(){
			var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
			var host = window.location.host != '' ? window.location.host + "/" : '';
			window.location.href = protocol + host + "editquestions";
		});

		//button to go and see report
		$('#generalreport').on('click',function(){
			var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
			var host = window.location.host != '' ? window.location.host + "/" : '';
			window.location.href = protocol + host + "generalreport";
		});
	}
	else
	{
		//button to open login modal
		$('.player_login').on('click',function(){
			//cleanup
			$('#playerpop').find('#playerday').val(null);
			$('#playerpop').find('#playermonth').val(null);
			$('#playerpop').find('#playeryear').val(null);
			$('#playerpop').find('.popUp').removeClass('incorrect');
			//set variables
			var user = $( this ).attr('data-user');
			$('#playerpop').attr('data-user',user);
			$('#playerpop').find('.popUpPlayerCircle').empty().append('<div class="playerImage "' + user + '"></div>')
			$('#playerpop').find('.playerInfo').empty().append('<span class="playerNo">' + $( this ).find('.playerNo').html() + '</span>' + user);
			$('#playerpop').show();
		});

		//close modal
		$('#playerpop').on('click',function(e){
		   	var $box = $('#playerpop .popUp.dob');
		   	if(!$box.is(e.target) && $box.has(e.target).length === 0)
		      	$( this ).hide();
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
		        		//incorrect password
		        		console.log('fuck');
		        		$('#playerpop').find('.popUp').addClass('incorrect');
		        	}
		        	else
		        	{
		        		//player o utente non trovato
		        		console.log('fuck_2');
		        		$('#playerpop').find('.popUp').addClass('incorrect');
		        	}
		        }
		    });  

		});
	}
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
	$('.serverAnsw .formBtnCont').on('click',function(){
		//togli gli altri della stessa domanda
		$( this ).siblings().find('.formBtn').removeClass('selected');
		//aggiugngi la classe selected
		$( this ).find('.formBtn').addClass('selected');
		//salva in data-answer
		$( this ).parents('.serverAnsw').attr("data-answer",$( this ).find('p').html());
	});

	//click on each tap button
	$('.popupAnsw .formBtnCont').on('click',function(){
		//togli gli altri della stessa domanda
		$( this ).siblings().find('.formBtn').removeClass('selected');
		//aggiugngi la classe selected
		$( this ).find('.formBtn').addClass('selected');
		//salva in data-answer
		$( this ).parents('.popupAnsw').attr("data-answer",$( this ).find('p').html());
	});

	$('.tappop').on('click',function(){
		$('.popOverlay[popup-data-to=' + $(this).attr('popup-data-from') + ']').show();
	});

	//close modal
	$('.closePop').on('click',function(e){
	   	// var $box = $('.popUp');
	   	// var $box_close = $('.closePop');
	   	// if(!$box.is(e.target) && $box.has(e.target).length === 0 && !$box_close.is(e.target))
	    $('.popOverlay').hide();
	});

	//click on submit
	$('#enotcomplete').find('.popUpBtn').on('click',function(){
		$('#enotcomplete').hide();
	});

	$('#submitanswers').click(function() { 

		//array risposte
	    var answers = [];
	    //il form e' completo?
	    var form_completo = true;
	    
	    $('.serverAnsw').each(function()
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
		    		}
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
		    	case 'tappop':
	    			if( $(this).attr('data-answer') ){
	    				//salva popup
	    				var specific = {};
	    				$('.popOverlay[popup-data-to=' + $(this).attr('data-id') + ']').find('.popupAnsw').each(function()
	    				{
	    					specific[$(this).attr('data-header')] = $(this).attr('data-answer');
	    				});
			    		answers.push(
			    		{
			    			id: $(this).attr('data-id'),
			    			txt: {
			    					general: $(this).attr('data-answer'),
			    					specific: specific
			    				}
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
		else
		{
			$('#enotcomplete').show();
		}

	});
}

WELLNESS.CLIENT.Main.prototype.addEditEvents = function()
{
	var that = this;

	//get last id for q
	this.q_last = 0;
	for (var question_id in this.data) 
	{
		var q_num = parseInt(question_id.slice(2), 10);
		if(q_num > this.q_last)
		{
			this.q_last = q_num;
		}
	}

	//back button
	$('#backtodash').on('click',function(){
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});

	//remove question
	$('.removeFormInstruct.minus').on('click',function(){
		var id = $( this ).parents('.formQuestion').attr('data-id');
		if(that.data[id])
		{
			that.data[id].on = false;
		}
		$( this ).parents('.col-xs-12.col-sm-12.col-md-12.col-lg-12').remove();
	});

	//add new question
	$('.removeFormInstruct.plus').on('click',function(){
		$('#questiontype').show();
	});

	//remove option in MP
	$('.crossWhite').on('click',function(){
		$( this ).parents('.formBtnCont').remove();
	});

	//add option in MP
	$('.pickquestions .removeFormInstruct.addAnswer').on('click',function(){
		new_button = '	<a class="formBtnCont">';
		new_button += '		<div class="crossWhite"></div>';
		new_button += '		<input class="options_topick" name="Answer" value="Option" type="text"/>';
		new_button += '	</a>';
		$( this ).parents('.formBtnCont').before(new_button);
		$( this ).parents('.formBtnCont').prev().find('.crossWhite').on('click',function(){
			$( this ).parents('.formBtnCont').remove();
		});
		if($( this ).parents('.pickquestions').children().length == 7)
		{
			$( this ).parents('.formBtnCont').remove();
		}
	});

	//text
	$('#addTextQuestions').on('click',function(){
		$('#questiontype').hide();

		that.q_last = that.q_last + 1;
		
		var new_question = '';
		new_question += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
		new_question += '<div class="formQuestion pickquestions" data-id="q_'+ that.q_last +'" data-type="txt">';
		new_question += '	<div class="formInstruct input">';
		new_question += '		<div class="removeFormInstruct minus">';
		new_question += '			<div class="minusBlue"></div>';
		new_question += '		</div>';
		new_question += '		<input class="question_topick" name="Answer" value="Insert Question" type="text"/>';
		new_question += '	</div>';
		new_question += '	<form>';
		new_question += '		<input type="text"/>';
		new_question += '	</form>';
		new_question += '</div>';
		new_question += '</div>';

		$('#plusbutton').before(new_question);
	});

	//multiple choice
	$('#addMPQuestions').on('click',function(){
		$('#questiontype').hide();

		that.q_last = that.q_last + 1;
		
		var new_question = '';
		new_question += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
		new_question += '<div class="formQuestion pickquestions" data-id="q_'+ that.q_last +'" data-type="tap">';
		new_question += '	<div class="formInstruct">';
		new_question += '		<div class="removeFormInstruct minus">';
		new_question += '			<div class="minusBlue"></div>';
		new_question += '		</div>';
		new_question += '		<input class="question_topick" name="Answer" value="Insert Question" type="text"/>';
		new_question += '	</div>';
		new_question += '	<a class="formBtnCont">';
		new_question += '		<div class="crossWhite"></div>';
		new_question += '		<input class="options_topick" name="Answer" value="Yes" type="text"/>';
		new_question += '	</a>';
		new_question += '	<a class="formBtnCont">';
		new_question += '		<div class="crossWhite"></div>';
		new_question += '		<input class="options_topick" name="Answer" value="No" type="text"/>';
		new_question += '	</a>';
		new_question += '	<div class="formBtnCont">';
        new_question += '		<div class="formBtn addAnswer">';
        new_question += '			<div class="removeFormInstruct addAnswer">';
        new_question += '				<div class="plusBlue"></div>';
        new_question += '			</div>';
        new_question += '		</div>';
        new_question += '	</div>';
		new_question += '</div>';
		new_question += '</div>';

		$('#plusbutton').before(new_question);

		//readd events
		$('.pickquestions[data-id="q_'+that.q_last+'"]').find('.removeFormInstruct.minus').on('click',function(){
			var id = $( this ).parents('.formQuestion').attr('data-id');
			if(that.data[id])
			{
				that.data[id].on = false;
			}
			$( this ).parents('.col-xs-12.col-sm-12.col-md-12.col-lg-12').remove();
		});

		$('.pickquestions[data-id="q_'+that.q_last+'"]').find('.removeFormInstruct.addAnswer').on('click',function(){
			new_button = '	<a class="formBtnCont">';
			new_button += '		<div class="crossWhite"></div>';
			new_button += '		<input class="options_topick" name="Answer" value="Option" type="text"/>';
			new_button += '	</a>';
			$( this ).parents('.formBtnCont').before(new_button);
			if($( this ).parents('.pickquestions').children().length == 7)
			{
				$( this ).parents('.formBtnCont').remove();
			}
		});

		$('.pickquestions[data-id="q_'+that.q_last+'"]').find('.crossWhite').on('click',function(){
			$( this ).parents('.formBtnCont').remove();
		});
	});

	//save and send
	$('#savequestions').on('click',function(){
		//get the new question list
		
		$('.pickquestions').each(function(){
			// for (var i = 0; i < that.data.length; i++) {
			// 	var act_q = that.data[i];
			var q_id = $(this).attr('data-id');
			if(that.data[q_id])
			{
				switch($(this).attr('data-type'))
				{
					case 'txt':
						that.data[q_id].txt = $(this).find('.question_topick').val();
						break;
					case 'tap':
						that.data[q_id].txt = $(this).find('.question_topick').val();
						var new_answers = [];
						$( this ).find('.options_topick').each(function(){
							new_answers.push($(this).val());
						});
						that.data[q_id].answers = new_answers;
						break;
					//case tappop TBD
				}
			}
			else
			{
				//ADD NEW QUESTION
				switch($(this).attr('data-type'))
				{
					case 'txt':
						that.data[q_id] = {
							txt: $(this).find('.question_topick').val(),
					        type: "txt",
					        on: "true"
						};
						break;
					case 'tap':
						var brand_new_answers = [];
						$( this ).find('.options_topick').each(function(){
							brand_new_answers.push($(this).val());
						});
						that.data[q_id] = {
							txt: $(this).find('.question_topick').val(),
					        type: "tap",
					        answers: brand_new_answers,
					        on: "true"
						};
						break;
				}
			}
			// };
		});
		

		//send
		$.ajax({
	        url: '/editquestions',
	        type: 'POST',
	        dataType: "json",
	        data: { questions: that.data },
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
	});
}

WELLNESS.CLIENT.Main.prototype.addReportEvents = function()
{
	$('#backtodash').on('click',function(){
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});

	//button to send immediate report
	$('#sendreport').on('click',function(e){
	   	$.ajax({
	        url: '/excel',
	        type: 'POST', // An object with the key 'submit' and value 'true;
	        success: function (result) {
	        	
	        }
	    });
	});

	//update the table
	setInterval(function(){
	   	$.ajax({
	        url: '/generalreport',
	        type: 'GET', 
	        data: {refresh: true},
	        success: function (answers_by_date) {
	        	//update the table
	        	var table = '<thead>';
	        	table += 		'<tr>';
	        	table += 			'<th>'
	        	table += 			'</th>';
	        	for( var c = 0; c < answers_by_date.questions.length; c++ )
	        	{
	        		table += 		'<th>' + answers_by_date.questions[c];
	        		table += 		'</th>';
	        	}
	        	table += 		'</tr>';
	        	table += 	'</thead>';
	        	table += 	'<tbody>';
	        	for( var key in answers_by_date )
	        	{
	        		var answer = answers_by_date[key];
	        		if(key != 'questions')
	        		{
	        			table += '<tr>';
	        			table += 	'<td>' + key;
	        			table += 	'</td>';
	        			for( var d = 0; d < answer.length; d++ )
	        			{
	        				table += '<td>' + answer[d];
	        				table += '</td>';
	        			}
	        			table += '</tr>';
	        		}
	        	}
	        	table += 	'</tbody>';
	        	$('table').empty().append(table);
	        }
	    });
	}, 15000);
}