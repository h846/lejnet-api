var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

router.get('/products/:product_number', function (req, res, next) {

  async function conOracleDB() {
    let connection;

    try {
      connection = await oracledb.getConnection({
        user: "nodeora",
        password: "nodeora",
        connectionString: "LEJPPDORA01:1521/orcl.leinternal.com"
      });
      //console.log('It Works');
      let prd_num = req.params.product_number;
      let sql;
      if (prd_num = 'all') {
        sql = 'SELECT * FROM INT_PRD_MST';
      } else {
        sql = `SELECT * FROM INT_PRD_MST WHERE PRD_NBR = JP${prd_num}F`;
      }
      let result = await connection.execute(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJEC,
        maxRows: 1
      });
      await connection.close();

      res.status(200).send(prd_num); //result.rows
    } catch (err) {
      res.send('error occured: ' + err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.send(err);
        }
      }
    }
  }

  conOracleDB();

});

router.post('/', function (req, res, next) {
  /*
  const dbPath = req.body.db;
  const sql = req.body.sql;
  console.log(dbPath);
  if (!dbPath || !sql) {
    res.send("No database path or invalid sql.")
  }

  const ADODB = require('node-adodb');
  const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\jpweb001\\wwwroot\\' + dbPath + ';Persist Security Info=False;');

  async function execute() {
    try {
      let data = await connection.execute(req.body.sql)
      res.send("the following SQL executed. \n " + res.body.sql);
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  }

  execute();

  // res.send("post method detected.")
  */
})

module.exports = router;