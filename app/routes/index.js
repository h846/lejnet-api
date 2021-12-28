var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CS-NET MY PAGE', message: 'Welcome to LEJ-NET API' });
});

module.exports = router;