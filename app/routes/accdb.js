var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  const dbPath = req.query.db;
  const tableName = req.query.table;
  console.log("DBPATH is " + dbPath);
  if (!dbPath || !tableName) { res.send("No database path or table name was specified!!!") }
  //Access to Access DB
  const ADODB = require('node-adodb');
  const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\jpweb001\\wwwroot\\' + dbPath + ';Persist Security Info=False;');
  // 非同期関数の定義
  (async function query() {
    try {
      //console.log("it works");
      let data = await connection.query('SELECT * FROM ' + tableName);
      res.header('Content-Type', 'application/json; charset=utf-8');
      res.send(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  }())

});

router.post('/', function (req, res, next) {
  const dbPath = req.body.db;
  const sql = req.body.sql;
  console.log(dbPath);
  if (!dbPath || !sql) { res.send("No database path or invalid sql.") }

  const ADODB = require('node-adodb');
  const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\jpweb001\\wwwroot\\' + dbPath + ';Persist Security Info=False;');

  (async function execute() {
    try {
      let data = await connection.execute(req.body.sql)
      res.send("the following SQL executed. \n " + res.body.sql);
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  }())

  // res.send("post method detected.")
})

module.exports = router;