var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
// for local enviroment
/*
try {
  oracledb.initOracleClient({
    libDir: 'C:\\instantclient_19_11'
  });
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  process.exit(1);
}
*/
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

//Get AR INVOICE
router.post('/ar_invoice_rec/', function (req, res, next) {
  let cust_id = req.body.cust_id;
  let isBalanceOnly = req.body.blnc_only;
  //res.send(cust_id)
  if (cust_id == undefined) {
    res.status(404).send('顧客番号をパラメータに設定してください。')
    return;
  }
  let result = [];
  let sql = `SELECT * FROM AR_INVOICE_REC WHERE ARI_CUSTOMER_ID = ${cust_id}`;
  if (isBalanceOnly) {
    sql = sql + ` and ARI_C_BALANCE <> 0`;
  }
  sql = sql + ` ORDER BY ARI_TRANS_DATE DESC`;

  conOracle(async function (con) {

    let data = await con.execute(sql, [], {});
    let cols = data.metaData;
    let rows = data.rows;
    let obj = {}
    for (let k = 0; k < rows.length; k++) {
      for (let i = 0; i < cols.length; i++) {
        obj[String(cols[i].name)] = String(rows[k][i]);
      }
      result.push({
        ...obj
      });
    }
    res.send(result);
  })
});

//Get style info
router.post('/styles/', function (req, res, next) {

  conOracle(async function (con) {
    let sty_num = req.body.style_number;

    let sql = 'SELECT * FROM INT_STY_MST';
    sql = sty_num === 'all' ? sql : sql + ` WHERE STY_NBR = 'JP${sty_num}F'`;
    let result;

    try {
      result = await con.execute(sql, [], {});
      let cols = result.metaData;
      let rows = result.rows;
      let obj = {};
      for (let i = 0; i < cols.length; i++) {
        obj[String(cols[i].name)] = String(rows[0][i]);
      }
      res.status(200).json(obj);
    } catch (err) {
      if (err.message == "Cannot read property '0' of undefined") {
        res.status(404).send('Style Number NOT Found');
      } else {
        res.send(err)
      }
    }
  })

});

router.post('/', function (req, res, next) {
  res.status(200).send('Oracle API')
})

router.post('/test', function (req, res, next) {
  let body = req.body.test;
  res.send("this is respons from web api... " + body)
})

module.exports = router;