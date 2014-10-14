var db = require('./db');
var moment = require('moment');
var nodemailer = require('nodemailer');
var nodeExcel = require('excel-export');

exports.getAnswersByDate = function(callback, given_date) //callback to execute
{
	var date = given_date ? given_date : moment().format('YYYY-MM-DD');

	db.getPLayerDocument(function(player_list){
		db.getQuestionsList(function(questions_list){
			var excel_data = 
			{
				questions:[]
			};

			for (question in questions_list.questions) 
			{
				if(questions_list.questions[question].on === "true")
				{
					excel_data.questions.push(questions_list.questions[question].txt);
					var type = questions_list.questions[question].type;
					var qd_answers = questions_list.questions[question].answers;
					var qd_scale = questions_list.questions[question].scale;
					for (var i = 0; i < player_list.length; i++) 
					{
						var player = player_list[i];
						if(!excel_data[player.player_number + " - " + player.surname + " - " + player.role])
						{
							excel_data[player.player_number + " - " + player.surname + " - " + player.role] = [];
						}

						var all_answers = player.answers[question];
						if(all_answers)
						{
							var today_answer = all_answers[date];
							if(today_answer)
								if(type === "tappop")
								{
									//get the general
									var general = today_answer.general;
									//get the scale of it
									var position_inarray = qd_answers.indexOf(general);
									var scale = qd_scale[position_inarray];
									//specific from popup
									var specific = "(";
									for(spec in today_answer.specific)
									{
										specific += spec + ": "+ today_answer.specific[spec] + ", ";
									}
									specific += ")";
									excel_data[player.player_number + " - " + player.surname + " - " + player.role].push(general + scale + specific);
								}
								else if(type === "tap")
								{
									//get the general
									var general = today_answer.general;
									//get the scale of it
									var position_inarray = qd_answers.indexOf(general);
									var scale = qd_scale[position_inarray];
									excel_data[player.player_number + " - " + player.surname + " - " + player.role].push(general + scale);
								}
								else
									excel_data[player.player_number + " - " + player.surname + " - " + player.role].push(today_answer);
							else
								excel_data[player.player_number + " - " + player.surname + " - " + player.role].push("");
						}
						else
						{
							excel_data[player.player_number + " - " + player.surname + " - " + player.role].push("");
						}
					}
				}
			};
			console.log(excel_data);
			callback(excel_data);
		});
	});
}

exports.getPlayerExcel = function(data) //callback to execute
{

	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: 'tottenham.playerwellness@gmail.com',
	        pass: 'tottenham2014'
	    }
	});
	
	var conf ={};
    // conf.stylesXmlFile = style;
    conf.cols = [];
	for (var i = 0; i <= data.questions.length; i++) {
		if(i === 0)
		{
			conf.cols.push({
				caption:"",
				type:'string'
			});
		}
		else
		{
			conf.cols.push({
				caption:data.questions[i-1],
				type:'string'
			});
		}
	};

	conf.rows = [];
	for (row in data) {
		if(row !== 'questions')
		{
			var row_with_header = data[row];
			row_with_header.unshift(row);
			conf.rows.push(row_with_header);
		}
	};

	var result = new Buffer(nodeExcel.execute(conf), 'binary');

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'Player Wellness <tottenham.playerwellness@gmail.com>', // sender address
	    to: 'deconto.cecilia@gmail.com', // list of receivers
	    subject: 'Daily Report', // Subject line
	    text: 'Daily report is attached, please use Microsof Excel to open it.', // plaintext body
	    html: 'Daily report is attached, please use Microsof Excel to open it.', // html body
	    attachments: [
	        {   // utf-8 string as an attachment
	            filename: 'report.xlsx',
	            content: result
	        }
	    ]
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	        // callback();
	    }
	});

	// callback(result);
}