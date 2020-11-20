var express = require('express');
var fs = require('fs');
var router = express.Router();

/* Generate JSON file*/
router.post('/', function (req, res, next) {
  let JSONdata = JSON.stringify(req.body.data);
  let fileName = req.body.file;
  //Destination Path
  let destPath = `../../src/json/${fileName}`;
  //File Existence Check
  try {
    fs.statSync(destPath)
  } catch (error) {
    if (error.code === 'ENOENT') res.send('保存先JSONファイルが存在しません')
  }
  //Write JSON file
  fs.writeFile(destPath, JSONdata, err => {
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