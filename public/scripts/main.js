$(document).ready(function() {


	$('.login').click(function() { 

	    var user = $('#user').val();
	    var pass = $('#pass').val();
	    console.log(user + pass);
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

});