//db manager
var db = require('./db');
var moment = require('moment');
var nodemailer = require('nodemailer');
var nodeExcel = require('excel-export');

/*
	GET THE QUESTIONS + players
 */
exports.getWhoAnswered = function(callback) //callback to execute
{
	var date = moment().format('YYYY-MM-DD');
	var whoAnswered = {};

	db.getPLayerDocument(function(player_list){
		for(var i=0; i<player_list.length; i++)
		{
			var player = player_list[i];
			for(answer in player.answers)
			{
				for(date_1 in player.answers[answer])
				{
					if(date_1 == date)
					{
						player_list[i].formCompleated = true;
					}
				}
			}
		}
		callback(player_list);
	});
}

/*
	GET THE PLAYERS
 */
exports.getPLayers = function(callback) //callback to execute
{
	db.getPLayerDocument(function(player_list){
		callback(player_list);
	});
}

exports.getPlayerExcel = function(callback) //callback to execute
{
	// var transporter = nodemailer.createTransport({
	//     service: 'Gmail',
	//     auth: {
	//         user: 'pinusipinusi@gmail.com',
	//         pass: ''
	//     }
	// });

	// // setup e-mail data with unicode symbols
	// var mailOptions = {
	//     from: 'Cecilia De Conto <pinusipinusi@gmail.com>', // sender address
	//     to: 'deconto.cecilia@gmail.com', // list of receivers
	//     subject: 'Hello', // Subject line
	//     text: 'Hello world', // plaintext body
	//     html: '<b>Hello world</b>' // html body
	// };

	// transporter.sendMail(mailOptions, function(error, info){
	//     if(error){
	//         console.log(error);
	//     }else{
	//         console.log('Message sent: ' + info.response);
	//         callback();
	//     }
	// });
	var conf ={};
    conf.stylesXmlFile = style;
      conf.cols = [{
        caption:'string',
        type:'string',
        beforeCellWrite:function(row, cellData){
             return cellData.toUpperCase();
        },
        width:28.7109375
    },{
        caption:'date',
        type:'date',
        beforeCellWrite:function(){
            var originDate = new Date(Date.UTC(1899,11,30));
            return function(row, cellData, eOpt){
                  // if (eOpt.rowNum%2){
                  //   eOpt.styleIndex = 1;
                  // }  
                  // else{
                  //   eOpt.styleIndex = 2;
                  // }
                if (cellData === null){
                  eOpt.cellType = 'string';
                  return 'N/A';
                } else
                  return (cellData - originDate) / (24 * 60 * 60 * 1000);
            } 
        }()
    },{
        caption:'bool',
        type:'bool'
    },{
        caption:'number',
         type:'number'                
      }];
      conf.rows = [
         ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
         ["e", new Date(2012, 4, 1), false, 2.7182],
        ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
        ["null date", null, true, 1.414]  
      ];
      var result = nodeExcel.execute(conf);

      callback(result);
}