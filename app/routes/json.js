var express = require('express');
var fs = require('fs');
var router = express.Router();

/* JSON file generate or retrun JSON data*/
router.post('/', function (req, res, next) {
  let JSONdata = JSON.stringify(req.body.data);
  //保存先パス
  let destPath = '';

});

router.get('/', function (req, res, next) {
  const axios = require('axios');
  axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(function (d) {
      res.send(d.data);
    })

});

module.exports = router;