$(document).ready(function() {

	$('#playerdash').click(function() {
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});

	$('.login').click(function() { 

	    var user = $('#user').val();
	    var pass = $('#pass').val();
	    $.ajax({
	        url: '/home',
	        type: 'POST',
	        data: {user: user, pass: pass}, // An object with the key 'submit' and value 'true;
	        success: function (result) {
	        	if( result.type === 'trainee' )
	        	{
	        		//torna dei dati per far sparire le faccie
	        		console.log(result);
	        	}
	        	else if( result.type === 'player' )
	        	{
	        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
	        		var host = window.location.host != '' ? window.location.host + "/" : '';
	        		window.location.href = protocol + host + result.redirect;
	        	}
	        }
	    });  

	});

	$('.sendanswers').click(function() { 

	    var answers = [];
	    var form_completo = true;
	    
	    $('.answers').each(function(){
	    	if( $(this).val() )
    		answers.push(
    		{
    			id: $(this).attr('id'),
    			txt: $(this).val()
    		});
    		else
    		{
    			form_completo = false;
    		}
    	});

	    if(form_completo)
	    {
		    $.ajax({
		        url: '/playerform',
		        type: 'POST',
		        data: {answers: answers}, // An object with the key 'submit' and value 'true;
		        success: function (result) {
		        	if( result.type === 'trainee' )
		        	{
		        		//perfetto
		        	}
		        	else
		        	{
		        		//error
		        	}
		        }
		    }); 
		} 

	});

});