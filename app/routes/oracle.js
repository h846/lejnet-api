var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
/* -- TEMPLATE --
router.post('', function (req, res, next) {
  let sql = ``;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
*/
/*
  Lead Time
*/
router.post('/lead_time', function (req, res, next) {
  let zip_code = req.body.zip_code;
  let sql = `SELECT * FROM CS_SAGAWA_LT WHERE ZIP = ${zip_code}`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/*
  Taiwa-Shiki
*/
router.post('/taiwa_shiki', function (req, res, next) {
  let sty = req.body.style_number;
  let sql = `SELECT \
  SKU.STY, \
  REC.MI_SEQ_NUM, \
  REC.MI_LINE_IDX, \
  REC.MI_LINES \
  FROM \
  SKU_MST SKU, \
  MISC_INFO_REC REC \
  WHERE SKU.STY = '${sty}' AND \
  SKU.P_INT_NUM = REC.MI_INTERNAL_NUM \
  ORDER BY REC.MI_SEQ_NUM, REC.MI_LINE_IDX`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/*
  Mono color
*/
router.post('/mono_clr', function (req, res, next) {
  let sql = "SELECT * FROM INT_MONO_THREAD_COLOR WHERE STATUS <> 9";
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/*
  Mono location
*/
router.post('/mono_loc', function (req, res, next) {
  let atcid = req.body.atc_id;
  let monogrp = req.body.mono_grp;

  // Single or Multi?
  if (atcid.indexOf(',') == -1) { // Single
    str = `= ${atcid}`;
  } else { // Multi
    str = `IN (${atcid})`;
  }

  let sql = `SELECT MLOC.LOCATION_ID, \
  MLOC.ATTACHMENT_ID, \
  LOCA.DESC_JP, \
  LOCA.IMG_PATH \
  FROM (INT_MONO_LOC_GRP MLOC INNER JOIN INT_MONO_LOCATION LOCA ON (MLOC.LOCATION_ID = LOCA.LOCATION_ID)) \
  WHERE MLOC.ATTACHMENT_ID ${atcid} AND MLOC.GROUP_ID = ${monogrp}`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/*
  Mono type
*/
router.post('/mono_type', function (req, res, next) {
  let atcid = req.body.atc_id;
  let str = '';
  // Single or Multi?
  if (atcid.indexOf(',') == -1) { // Single
    str = `= ${atcid}`;
  } else { // Multi
    str = `IN (${atcid})`;
  }
  let sql = `SELECT \
  MTYPE.ATTACHMENT_ID, \
  MTYPE.TYPE_ID, \
  MTYPE.DESC_JP, \
  MTYPE.IMG_PATH, \
  MTYPE.MIN_LENGTH, \
  MTYPE.MAX_LENGTH, \
  MTYPE.PRICE, \
  MATT.THREAD_CLR_FLG, \
  MATT.ENTRY_BOX_FLG \
  FROM (INT_MONO_ATTACHMENT MATT \
  INNER JOIN INT_MONO_TYPE MTYPE ON MATT.ATTACHMENT_ID = MTYPE.ATTACHMENT_ID) \
  WHERE MATT.ATTACHMENT_ID ${str} AND MTYPE.STATUS <> 9 \
  ORDER BY MTYPE.TYPE_ID ASC`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/*
  MONO GROUP and ATTACHMENT ID
*/
router.post('/monog_atcid', function (req, res, next) {
  let sty_num = req.body.style_number;
  let sql = `SELECT \
  SKU.STY_NBR, \
  SKU.MONO_GRP_CODE, \
  MATT.NAME_JP, \
  MATT.DESC_JP, \
  MATT.IMG_PATH, \
  MLOC.ATTACHMENT_ID \
  FROM INT_MONO_ATTACHMENT MATT \
  INNER JOIN (INT_SKU_MST SKU \
  INNER JOIN INT_MONO_LOC_GRP MLOC ON SKU.MONO_GRP_CODE = MLOC.GROUP_ID) \
  ON MLOC.ATTACHMENT_ID = MATT.ATTACHMENT_ID \
  WHERE SKU.STY_NBR=${sty_num} \
  GROUP BY \
  SKU.STY_NBR, \
  SKU.MONO_GRP_CODE, \
  MATT.NAME_JP, \
  MATT.DESC_JP, \
  MATT.IMG_PATH, \
  MLOC.ATTACHMENT_ID \
  ORDER BY ATTACHMENT_ID ASC`;

  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/*
  Get Customer Info
*/
router.post('/customer', function (req, res, next) {
  let cust_id = req.body.cust_id;
  let sql = `SELECT * FROM CUSTOMER_MASTER WHERE CM_CUSTOMER_ID = ${cust_id}`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/*
  Get Employee Info
*/
router.post('/empl/', function (req, res, next) {
  let win_id = req.body.win_id;

  let sql =
    `SELECT \
    e.HE_WIN_ID WIN_ID, \
    e.HE_NBR EMP_NUMBER, \
    e.HE_LSTN_EN LAST_NAME_EN, \
    e.HE_FRSN_EN FIRST_NAME_EN, \
    e.HE_LSTN_JP LAST_NAME_JP, \
    e.HE_FRSN_JP FIRST_NAME_JP, \
    e.HE_LSTN_KN LAST_NAME_KANA, \
    e.HE_FRSN_KN FIRST_NAME_KANA, \
    e.HE_DEP_ID DEPT_ID, \
    d.ID_DPT_NAM DEPT_NAME, \
    d.ID_DPT_NAM_JP DEPT_NAME_JP, \
    e.HE_POSITION POSITION, \
    e.HE_EMAIL EMAIL, \
    e.HE_IMG IMAGE_FILE \
    FROM HR_EMPL e INNER JOIN ISSUP_DPT d ON e.HE_DEP_ID = d.ID_DPT_NUM \
    WHERE e.HE_STATUS = 1 AND e.HE_WIN_ID = '${win_id}'`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/*
  Get AR INVOICE
*/
router.post('/ar_invoice_rec/', function (req, res, next) {
  let cust_id = req.body.cust_id;
  let isBalanceOnly = req.body.blnc_only;
  if (cust_id == undefined) {
    res.status(404).send('顧客番号をパラメータに設定してください。')
    return;
  }
  let sql = `SELECT * FROM AR_INVOICE_REC WHERE ARI_CUSTOMER_ID = ${cust_id}`;
  if (isBalanceOnly) {
    sql = sql + ` and ARI_C_BALANCE <> 0`;
  }
  sql = sql + ` ORDER BY ARI_TRANS_DATE DESC`;

  let oracle = new Orcl(sql);
  oracle.connect(res);
});

/*
  Get Style Information
*/
router.post('/styles/', function (req, res, next) {

  let sty_num = req.body.style_number;
  let sql = 'SELECT * FROM INT_STY_MST';
  sql = sty_num === 'all' ? sql : sql + ` WHERE STY_NBR = 'JP${sty_num}F'`;

  let oracle = new Orcl(sql);
  oracle.connect(res);

});

/*
  Get Product Image and color
*/
router.post('/img_clr/', function (req, res, next) {

  let prd_num = req.body.product_number;
  let sql =
    `SELECT * FROM INT_IMG_MST IMG \
      LEFT JOIN CLR_MST CLR ON IMG.CLR_CODE = CLR.CLR_CODE \
      WHERE IMG.PRD_NBR = 'JP${prd_num}F' \
      AND (IMG.VIEW_TP = 'swatch' or IMG.VIEW_TP = 'viewtype_1') \
      ORDER BY IMG.CLR_CODE DESC`;

  let oracle = new Orcl(sql);
  oracle.connect(res);

})
/*
  Get SKU, Price, Inventory count from Style number.
*/
router.post('/prc_inv', function (req, res, next) {

  let style_num = req.body.style_number;
  let sql = `SELECT * FROM AFL_PRC_INV WHERE STY = ${style_num}`;

  let oracle = new Orcl(sql);
  oracle.connect(res);

})
/*
  API Response Test (Get Method).
*/
router.get('/', function (req, res, next) {
  res.status(200).send('It works')
})

/*
  Oracle Connection Class
*/
class Orcl {

  constructor(sql) {
    this._sql = sql;
  }

  async connect(res) {
    let con;
    try {
      con = await oracledb.getConnection({
        user: "nodeora",
        password: "nodeora",
        connectionString: "LEJPPDORA01:1521/orcl.leinternal.com"
      });
      // Database Side Process
      let result = [];
      try {
        let data = await con.execute(this._sql, [], {});
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
          res.status(404).send('The specified parameter does not exist.');
        } else {
          res.send(err)
        }
      }
    } catch (err) {
      console.log(err);
      res.send('connection error occured: \n' + err);
    } finally {
      if (con) {
        try {
          console.log("it works")
          await con.close();
        } catch (err) {
          res.send(err);
        }
      }
    }
  }
}

module.exports = router;