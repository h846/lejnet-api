var express = require('express');
const { append } = require('express/lib/response');
const { process_params } = require('express/lib/router');
const { Server } = require('socket.io');
var router = express.Router();
const os = require('os');

/* GET home page. */
let msg = "";
process.argv.forEach(function(val, index, array) {
	msg += (index + ': ' + val + '\n');
});
router.get('/', function(req, res, next) {
  const host = req.headers.host;
  let msg = ""; 
  if(host.includes("lejnet:3001")){msg=" API TEST";}
  else if (host.includes("lejnet")){msg=" API";}
  else{msg=" LOCAL HOST";}
  res.render('index', { title: 'LEJ-NET' + msg,
  message: 'Welcome to LEJ-NET' + msg
  });
});

module.exports = router;