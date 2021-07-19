var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

//Oracle DB Connection
let conOracle = async (callBack) => {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "nodeora",
      password: "nodeora",
      connectionString: "LEJPPDORA01:1521/orcl.leinternal.com"
    });

    callBack(connection);

  } catch (err) {
    res.send('connection error occured: \n' + err);
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

//Get style number
router.get('/styles/:style_number', function (req, res, next) {

  conOracle(async function (con) {
    let sty_num = req.params.style_number;
    let sql, result;

    try {
      if (sty_num == 'all') {
        sql = 'SELECT * FROM INT_STY_MST';
      } else {
        sql = `SELECT * FROM INT_STY_MST WHERE STY_NBR = 'JP${sty_num}F'`;
      }
      result = await con.execute(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJEC,
      });
      res.status(200).send(result);
    } catch (err) {
      res.send("Error!!" + err);
    }
  })

});

router.post('/', function (req, res, next) {})

module.exports = router;