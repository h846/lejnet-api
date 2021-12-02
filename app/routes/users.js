var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.io.emit("socketToMe", "users");
  res.send('respond with a resource.');
});
/* GET users listing. */
router.post('/', function (req, res, next) {
  const axios = require('axios');
  axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(function (d) {
      res.send(d.data);
    })

});

module.exports = router;