var db = require('./db');
var moment = require('moment');
var nodemailer = require('nodemailer');
var nodeExcel = require('excel-export');

/* 
	GET THE MIX OF PLAYER_DOC AND QUESTIONS_DOC FOR TABLE

	@CALLBACK
	@GIVEN_DATE: you can retrieve the same structure for a given date
	@EXCEL_DATA
	{ questions: 
		[ 	
			{ type: 'txt', question: 'Weight (kg)' },
			{ type: 'tap', question: 'Energy levels' },
			{ type: 'tap', question: 'Sleep quality' },
			{ type: 'txt', question: 'Hours of sleep' },
			{ type: 'tappop', question: 'Muscle Soreness' },
			{ type: 'tap', question: 'Illness In Houshold' } 
		],
	p_id: 
		{ 
			number: 42,
			name: 'Bentaleb',
			role: 'o_f',
			answers: [ 
				{
					general: (txt, tap, tappop)
					scale: (tap, tappop)
					specific: (tappop) {
						spec: specific[]
					}
				} 
			] 
		}
	}
*/

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
					//questions list
					excel_data.questions.push(
						{
							type: questions_list.questions[question].type, 
							question: questions_list.questions[question].txt
						}
					);

					//players answers
					var qd_type = questions_list.questions[question].type;
					var qd_answers = questions_list.questions[question].answers;
					var qd_scale = questions_list.questions[question].scale;

					//loop through players and get answers
					for (var i = 0; i < player_list.length; i++) 
					{
						var player = player_list[i];

						if(!excel_data[player.id])
						{
							excel_data[player.id] = 
								{
									number: player.player_number,
									name: player.surname,
									role: player.role,
									answers: []
								};
						}

						//all the answers to this question
						var all_answers = player.answers[question];
						if(all_answers)
						{
							var today_answer = all_answers[date];
							if(today_answer)
							{
								var pl_answer = {};

								if(qd_type === "tappop")
								{
									//get the general
									pl_answer["general"] = today_answer.general;
									//get the scale of it
									var position_inarray = qd_answers.indexOf(today_answer.general);
									pl_answer["scale"] = qd_scale[position_inarray];
									//specific from popup
									pl_answer["specific"] = today_answer.specific;
									// for(spec in today_answer.specific)
									// {
									// 	specific[spec] = today_answer.specific[spec];
									// }
									// pl_answer["specific"] = specific;
								}
								else if(qd_type === "tap")
								{
									//get the general
									pl_answer["general"] = today_answer;
									//get the scale of it
									var position_inarray = qd_answers.indexOf(today_answer.general);
									pl_answer["scale"] = qd_scale[position_inarray];
								}
								else
									pl_answer["general"] = today_answer;
								
								excel_data[player.id].answers.push(pl_answer);
							}
							else
								excel_data[player.id].answers.push({general:""}); //fill with empty to have all pl
						}
						else
							excel_data[player.id].answers.push({general:""}); //fill with empty to have all pl
					}
				}
			};
			console.log(excel_data);
			callback(excel_data);
		});
	});
}

/* 
	SEND EXCEL to the client

	@DATA
	{ questions: 
		[ 	
			{ type: 'txt', question: 'Weight (kg)' },
			{ type: 'tap', question: 'Energy levels' },
			{ type: 'tap', question: 'Sleep quality' },
			{ type: 'txt', question: 'Hours of sleep' },
			{ type: 'tappop', question: 'Muscle Soreness' },
			{ type: 'tap', question: 'Illness In Houshold' } 
		],
	p_id: 
		{ 
			number: 42,
			name: 'Bentaleb',
			role: 'o_f',
			answers: [ 
				{
					general: (txt, tap, tappop)
					scale: (tap, tappop)
					specific: (tappop) {
						spec: specific[]
					}
				} 
			] 
		}
	}
*/

exports.getPlayerExcel = function(data) //callback to execute
{

	//create the transporter
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: 'tottenham.playerwellness@gmail.com',
	        pass: 'tottenham2014'
	    }
	});
	
	//create the excel
	var conf ={};

    // conf.stylesXmlFile = style;
    
    /*  
    	COLUMNS (top row - quesitons)
    	loop through questions: and get txt
    
		STRUCTURE:
		conf.rows = ["Q_1","Q_2",...]
	 */
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
				caption:data.questions[i-1].question,
				type:'string'
			});
		}
	};

	/* 
		ROWS (every player)
    	loop through players id
    	STRUCTURE:
		conf.rows = ["p.num - p.name","A_1",...]
    */
	conf.rows = [];
	for (row in data) {
		if(row !== 'questions') // skip the question obj
		{
			var row_with_header = [];
			// loop through answers
			for (var i = 0; i < data[row].answers.length; i++) {
				if(data[row].answers[i].specific) // if it's tappop
				{
					var row_with_header_answ = data[row].answers[i].general + "(";
					var get_the_first = 0;
					for (var spec in data[row].answers[i].specific) {
						if( get_the_first == 0 )
						{
							row_with_header_answ +=	spec + ":";
						}
						else
						{
							row_with_header_answ +=	" - " + spec + ":";
						}
						var this_spec = data[row].answers[i].specific[spec];
						for(var l = 0; l < this_spec.length; l++)
						{
							if(l != this_spec.length-1)
							{
								row_with_header_answ +=	" " + this_spec[l] + ",";
							}
							else
							{
								row_with_header_answ +=	" " + this_spec[l];
							}
						}
					};
					row_with_header_answ += + ")";
				}
				else // if it's tap or txt
				{
					// get the text
					var row_with_header_answ = data[row].answers[i].general;
				}
				// save
				row_with_header.push(row_with_header_answ);
			};
			//name and no of player
			row_with_header.unshift(data[row].number + " - " + data[row].name);

			conf.rows.push(row_with_header);
		}
	};

	//create binary
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

	//send
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