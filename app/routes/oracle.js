var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
// for local enviroment
try {
  oracledb.initOracleClient({
    libDir: 'C:\\instantclient_19_11'
  });
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  process.exit(1);
}

//Oracle DB Connection
let conOracle = async (callBack) => {

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "nodeora",
      password: "nodeora",
      connectionString: "LEJPPDORA01:1521/orcl.leinternal.com"
    });
    // Database Side Process
    callBack(connection);

  } catch (err) {
    console.log(err);
    //res.send('connection error occured: \n' + err);
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

router.get('/test', function (req, res, next) {
  console.log(req.headers.host);
  res.send('it works.')
})

//Get style info
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
        //outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      let metaData = "NULL";
      metaData = result.metaData;

      let rows = result.rows;
      let obj = {};

      for (let i = 0; i < metaData.length; i++) {
        obj[String(metaData[i].name)] = String(rows[0][i]);
      }

      res.status(200).json(obj);
    } catch (err) {
      res.send("Error occured on during connecting db!! " + err);
    }
  })

});

router.post('/', function (req, res, next) {})

module.exports = router;