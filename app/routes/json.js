var express = require('express');
var fs = require('fs');
var router = express.Router();

/* Generate JSON file*/
router.post('/', function (req, res, next) {
  //let JSONdata = JSON.stringify(req.body.data);
  //let fileName = req.body.file;
  let data = String(req.body.data);
  let fileName = 'test.txt';
  //Destination Path
  //let destPath = `D:\\inetpub\\wwwroot\\API\\src\\json\\${fileName}`;

  //Write JSON file
  fs.writeFile(fileName, data, err => {
    if (err) {
      res.send(err)
    } else {
      res.send('JSON更新成功\n' + JSONdata)
    }
  });

});

router.get('/', function (req, res, next) {
  const axios = require('axios');
  axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(function (d) {
      res.send(d.data);
    })

});

module.exports = router;