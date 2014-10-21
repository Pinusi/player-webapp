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
	var date = given_date ? given_date : moment().utc().format('YYYY-MM-DD');

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
							question: questions_list.questions[question].txt,
							id: question
						}
					);

					//players answers
					var qd_type = questions_list.questions[question].type;
					var qd_answers = questions_list.questions[question].answers;
					var qd_scale = questions_list.questions[question].scale;
					var qd_points = questions_list.questions[question].points;

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
									pl_answer["points"] = qd_points[position_inarray];
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
									var position_inarray = qd_answers.indexOf(today_answer);
									pl_answer["points"] = qd_points[position_inarray];
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
			callback(excel_data);
		});
	});
}

/* 
	SEND EXCEL to the client

	@DATA
	{ questions: 
		[ 	
			{ type: 'txt', question: 'Weight (kg)', id: id },
			{ type: 'tap', question: 'Energy levels', id: id  },
			{ type: 'tap', question: 'Sleep quality', id: id  },
			{ type: 'txt', question: 'Hours of sleep', id: id  },
			{ type: 'tappop', question: 'Muscle Soreness', id: id  },
			{ type: 'tap', question: 'Illness In Houshold', id: id  } 
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

// exports.getPlayerExcel = function(data) //callback to execute
// {

// 	//create the transporter
// 	var transporter = nodemailer.createTransport({
// 	    service: 'Gmail',
// 	    auth: {
// 	        user: 'tottenham.playerwellness@gmail.com',
// 	        pass: 'tottenham2014'
// 	    }
// 	});
	
// 	//create the excel
// 	var conf ={};

//     // conf.stylesXmlFile = style;
    
//     /*  
//     	COLUMNS (top row - quesitons)
//     	loop through questions: and get txt
    
// 		STRUCTURE:
// 		conf.rows = ["Q_1","Q_2",...]
// 	 */
//     conf.cols = [];
// 	for (var i = 0; i <= data.questions.length; i++) {
// 		if(i === 0)
// 		{
// 			conf.cols.push({
// 				caption:"",
// 				type:'string'
// 			});
// 		}
// 		else
// 		{
// 			conf.cols.push({
// 				caption:data.questions[i-1].question,
// 				type:'string'
// 			});
// 		}
// 	};

// 	/* 
// 		ROWS (every player)
//     	loop through players id
//     	STRUCTURE:
// 		conf.rows = ["p.num - p.name","A_1",...]
//     */
// 	conf.rows = [];
// 	for (row in data) {
// 		if(row !== 'questions') // skip the question obj
// 		{
// 			var row_with_header = [];
// 			// loop through answers
// 			for (var i = 0; i < data[row].answers.length; i++) {
// 				if(data[row].answers[i].specific) // if it's tappop
// 				{
// 					var row_with_header_answ = data[row].answers[i].general + "(";
// 					var get_the_first = 0;
// 					for (var spec in data[row].answers[i].specific) {
// 						if( get_the_first == 0 )
// 						{
// 							row_with_header_answ +=	spec + ":";
// 						}
// 						else
// 						{
// 							row_with_header_answ +=	" - " + spec + ":";
// 						}
// 						var this_spec = data[row].answers[i].specific[spec];
// 						for(var l = 0; l < this_spec.length; l++)
// 						{
// 							if(l != this_spec.length-1)
// 							{
// 								row_with_header_answ +=	" " + this_spec[l] + ",";
// 							}
// 							else
// 							{
// 								row_with_header_answ +=	" " + this_spec[l];
// 							}
// 						}
// 					};
// 					row_with_header_answ += + ")";
// 				}
// 				else // if it's tap or txt
// 				{
// 					// get the text
// 					var row_with_header_answ = data[row].answers[i].general;
// 				}
// 				// save
// 				row_with_header.push(row_with_header_answ);
// 			};
// 			//name and no of player
// 			row_with_header.unshift(data[row].number + " - " + data[row].name);

// 			conf.rows.push(row_with_header);
// 		}
// 	};

// 	//create binary
// 	var result = new Buffer(nodeExcel.execute(conf), 'binary');

// 	// setup e-mail data with unicode symbols
// 	var mailOptions = {
// 	    from: 'Player Wellness <tottenham.playerwellness@gmail.com>', // sender address
// 	    to: 'deconto.cecilia@gmail.com', // list of receivers
// 	    subject: 'Daily Report', // Subject line
// 	    text: 'Daily report is attached, please use Microsof Excel to open it.', // plaintext body
// 	    html: 'Daily report is attached, please use Microsof Excel to open it.', // html body
// 	    attachments: [
// 	        {   // utf-8 string as an attachment
// 	            filename: 'report.xlsx',
// 	            content: result
// 	        }
// 	    ]
// 	};

// 	//send
// 	transporter.sendMail(mailOptions, function(error, info){
// 	    if(error){
// 	        console.log(error);
// 	    }else{
// 	        console.log('Message sent: ' + info.response);
// 	    }
// 	});

// 	// callback(result);
// }

/*
	GET PLAYER EXCEL TO IMPORT
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
					scale: (tap, tappop),
					points: (tap,tappop)
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

	var headers = [
			"Player",
			"Shirt",
			"Wellness Total",
			"Energy Levels",
			"Muscle Soreness",
			"origin of soreness",
			"Hours Sleep",
			"Sleep Quality",
			"Stress levels",
			"Mood"];

	var order_ids = [
		"q_2",
		"q_5",
		"q_4",
		"q_3",
		"q_6",
		"q_7"
	];
	
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
	for (var i = 0; i < headers.length; i++) {
		conf.cols.push({
			caption:headers[i],
			type:'string'
		});
	};

	// console.log("");

	/* 
		ROWS (every player)
    	loop through players id
    	STRUCTURE:
		conf.rows = ["p.num - p.name","A_1",...]
    */
	conf.rows = [];
	var total = [];
	var general_total = 0;
	var avg_on = 0;
	for (row in data) {
		if(row == 'questions')
		{
			var answ_pos = [];
			var question_row = data[row];
			for (var h = 0; h < order_ids.length; h++) {
				var order_id = order_ids[h];
				//initialise total
				total.push(0);
				for (var k = 0; k < question_row.length; k++) {
					if(question_row[k].id == order_id)
					{
						answ_pos.push(k);
					}
				};
			}
		}
		else// skip the question obj
		{
			
			var row_with_header = [];

			if(data[row].answers[0].general)
			{
				var pl_total = 0;
				avg_on++;
			}
			else
			{
				var pl_total = "";
			}
			

			// loop through answers
			for (var i = 0; i < answ_pos.length; i++) {
				var index = answ_pos[i];
				var q_type = data.questions[index].type;
				if(data[row].answers[index].general.length > 0)
				{
					if(q_type == "tappop") // if it's tappop
					{
						var row_with_header_answ = data[row].answers[index].points;
						pl_total += parseInt(row_with_header_answ);
						if(data[row].answers[index].specific)
						{
							var get_the_first = 0;
							var row_with_header_additional = "(";
							for (var spec in data[row].answers[index].specific) {
								if( get_the_first == 0 )
								{
									row_with_header_additional +=	spec + ":";
								}
								else
								{
									row_with_header_additional +=	" - " + spec + ":";
								}
								var this_spec = data[row].answers[index].specific[spec];
								for(var l = 0; l < this_spec.length; l++)
								{
									if(l != this_spec.length-1)
									{
										row_with_header_additional +=	" " + this_spec[l] + ",";
									}
									else
									{
										row_with_header_additional +=	" " + this_spec[l];
									}
								}
							};
							row_with_header_additional += + ")";
						}
						else
						{
							row_with_header_additional = "no";
						}
						// save
						row_with_header.push(row_with_header_answ);
						row_with_header.push(row_with_header_additional);
						total[i] += parseInt(row_with_header_answ);
					}
					else if(q_type == "tap")// tap
					{
						var row_with_header_answ = data[row].answers[index].points;
						pl_total += parseInt(row_with_header_answ);
						// save
						row_with_header.push(row_with_header_answ);
						total[i] += parseInt(row_with_header_answ);
					}
					else // if it's txt
					{
						// get the text
						var row_with_header_answ = data[row].answers[index].general;
						pl_total += parseInt(row_with_header_answ);
						// save
						row_with_header.push(row_with_header_answ);
						total[i] += parseInt(row_with_header_answ);
					}
				}
				else
				{
					if(q_type == "tappop") // if it's tappop
					{
						row_with_header.push("");
						row_with_header.push("");
					}
					else
					{
						row_with_header.push("");
					}
				}
			};
			row_with_header.unshift( pl_total );
			general_total += pl_total;
			row_with_header.unshift( "");
			//name and no of player
			row_with_header.unshift( data[row].name);

			conf.rows.push(row_with_header);
		}
	};

	var avg = [];

	for (var t = 0; t < total.length; t++) {
		avg[t] = total[t]/avg_on;
	};

	//fix on positions
	total.unshift(general_total);
	total.unshift("");
	total.unshift("Total:");
	total.splice(5, 0, "");
	avg.unshift(general_total/avg_on);
	avg.unshift("");
	avg.unshift("Average:");
	avg.splice(5, 0, "");

	conf.rows.push(total);
	conf.rows.push(avg);

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
	            filename: 'report.xls',
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
	    }
	});

	// callback(result);
}