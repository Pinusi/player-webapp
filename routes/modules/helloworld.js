// var express = require('express');
// var router = express.Router();
var nano = require('nano')('http://localhost:5984');
var playerdb = nano.db.use('player-wellness');

/* GET Hello World page. */
// router.get('/', function(req, res) {
//     //res.json({foo:"res"});
//     playerdb.get('player_list', { revs_info: true }, function(err, body) {
// 	  if (!err){
// 	  	console.log(body);
// 	  	res.json(body);
// 	  }
// 	  else
// 	  {
// 	  	console.log(err);
// 	  }
// 	});
// });

// module.exports = router;

exports.ciao = function(callback)
{
	playerdb.get('player_list', { revs_info: true }, function(err, body) {
	  if (!err){
	  	console.log(body);
	  	callback(body)
	  	// res.json(body);
	  }
	  else
	  {
	  	console.log(err);
	  }
	});
}