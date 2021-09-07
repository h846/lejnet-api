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

//Get Employee Info
router.post('/empl/', function (req, res, next) {
  conOracle(async function (con) {
    let sql =
      "SELECT \
    e.HE_WIN_ID WIN_ID, \
    e.HE_NBR EMP_NUMBER, \
    e.HE_LSTN_EN LAST_NAME_EN, \
    e.HE_FRSN_EN FIRST_NAME_EN, \
    e.HE_LSTN_JP LAST_NAME_JP, \
    e.HE_FRSN_JP FIRST_NAME_JP, \
    e.HE_LSTN_KN LAST_NAME_KANA, \
    e.HE_FRSN_KN FIRST_NAME_KANA, \
    d.ID_DPT_NAM DEPT, \
    d.ID_DPT_NAM_JP DEPT_JP, \
    e.HE_POSITION POSITION, \
    e.HE_EMAIL EMAIL, \
    e.HE_IMG IMAGE_FILE \
    FROM HR_EMPL e \
    LEFT JOIN ISSUP_DPT d ON e.HE_DEP_ID = d.ID_DPT_NUM \
    WHERE e.HE_STATUS = 1";

    let data = await con.execute(sql, [], {});
    let cols = data.metaData;
    let rows = data.rows;
    let obj = {},
      result = [];

    for (let k = 0; k < rows.length; k++) {
      for (let i = 0; i < cols.length; i++) {
        obj[String(cols[i].name)] = String(rows[k][i]);
      }
      result.push({
        ...obj
      });
    }
    res.send(result);
  });
})

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

//Get Product Image and color
router.post('/img_clr/', function (req, res, next) {
  let prd_num = req.body.product_number;
  conOracle(async function (con) {
    let sql =
      `SELECT * FROM INT_IMG_MST IMG \
      LEFT JOIN CLR_MST CLR ON IMG.CLR_CODE = CLR.CLR_CODE \
      WHERE IMG.PRD_NBR = 'JP${prd_num}F' \
      AND (IMG.VIEW_TP = 'swatch' or IMG.VIEW_TP = 'viewtype_1') \
      ORDER BY IMG.CLR_CODE DESC`;

    let result = [];
    try {
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
    } catch (err) {
      if (err.message == "Cannot read property '0' of undefined") {
        res.status(404).send('Product Number NOT Found');
      } else {
        res.send(err)
      }
    }
  })
})

// Get SKU, Price, Inventory count from Style number.
router.post('/prc_inv/', function (req, res, next) {
  let style_num = req.body.style_number;
  conOracle(async function (con) {
    let sql = `SELECT * FROM AFL_PRC_INV WHERE STY = ${style_num}`;
    let result = [];
    try {
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
    } catch (err) {
      if (err.message == "Cannot read property '0' of undefined") {
        res.status(404).send('Style Number NOT Found');
      } else {
        res.send(err)
      }
    }

  })
})

router.get('/', function (req, res, next) {
  res.status(200).send('Oracle API')
})

module.exports = router;