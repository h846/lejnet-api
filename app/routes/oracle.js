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
  //process.exit(1);
}
*/
/* -- TEMPLATE --
router.post('', function (req, res, next) {
  let sql = ``;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
*/

/* Campaign Data API (for campaign tool)*/
router.post('/camp_data', function (req, res, next) {
  let sql;
  if(!req.body.sql){
    sql = `SELECT * FROM CSNET.CAMPAIGN_DATA`;
  }else{
    sql = req.body.sql;
  }
  let oracle = new Orcl(sql);
  oracle.connect(res);
})

/*Color expression data */
router.post('/color_exp', function (req, res, next) {
  let color_code = req.body.color_code;
  let sql = `SELECT * FROM CSNET.V_CS_COLOR_INFO WHERE COLOR_CODE = '${color_code}'`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})

/* Search similar sample item from color code*/
router.post('/smlr_item', function (req, res, next) {
   let color_code = req.body.color_code;
  let sql = `SELECT * FROM CSNET.V_CS_SAMPLE WHERE CLR_CODE = '${color_code}'`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/* Search similar swatch from color code */
router.post('/smlr_swth', function (req, res, next) {
   let color_code = req.body.color_code;
  let sql = `SELECT * FROM CSNET.V_CS_SWATCH WHERE CLR_CODE = '${color_code}'`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})

/* Pants Embroidery Data */
router.post('/pants_emb', function (req, res, next) {
  let sty_num = req.body.style_number;
  let sql = `SELECT * FROM csnet.v_cs_pants_embroidery WHERE sty_nbr = ${sty_num}`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})

/* Catalog Name */
router.post('/cat_name', function (req, res, next) {
  let sql = `SELECT DISTINCT ind.cat_id, ind.cat_name, ind.index_num \
  FROM csnet.cs_cat_ind ind, csnet.cs_cat_page page \
  WHERE ind.cat_id = page.cat_code AND page.online_cat = 1 ORDER BY ind.index_num DESC`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/* Premium Plus*/
router.post('/prm_pls', function (req, res, next) {
  let cust_id = req.body.cust_id;
  let sql = `SELECT * FROM CSNET.CS_CUST_PURCHASE_AMOUNT WHERE CUSTOMER_NUM = ${cust_id}`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})

/* Style Alert */
router.post('/sty_alert', function (req, res, next) {
  let sty_num = req.body.style_number;
  let sql = `SELECT * FROM CSNET.CS_STY_ALERT \
  WHERE STYLE_NUM = ${sty_num} AND\
  START_DATE <= SYSDATE  AND \
  EXPIRE_DATE >= SYSDATE`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})

/* Delivery Alert*/
router.post('/deli_alert', function (req, res, next) {
  let pref = req.body.prefecture;
  let sql = `SELECT * FROM CSNET.CS_DELIVERY_ALERT WHERE `;
  if(!pref){
    sql += "prefectures = 'all'";
  }else{
    sql += `(prefectures = 'all' OR PREFECTURES = '${pref}')`;
  }
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
/* Order History for Rakugae */
router.post('/rg_history', function (req, res, next) {
  let cust_id = req.body.cust_id;
  let sql = `SELECT * FROM \
  LEJ.V_CS_HISTORY_DATA, \
  LEJ.ORDER_ADDRESSES, \
  CSNET.ORDER_MULTI_SHIP \
  WHERE CUS_NUM = '${cust_id}' AND \
  PROD_STAT <> 'B' AND \
  PROD_STAT <> 'C' AND \
  ORD_NUM = OR_ORDER_NUMBER AND \
  ORD_NUM = MS_ORDER_NUMBER(+) AND \
  ENT_DT >= (SYSDATE - 60) ORDER BY ENT_DT DESC`;

  let oracle = new Orcl(sql);
  oracle.connect(res);
})

/* Get Catalog Page*/
router.post('/cat_page', function (req, res, next) {
  let sty_num = req.body.style_number;
  let sql = `SELECT DISTINCT \
    ID, \
    STYLE_NO, \
    PAGE, \
    CAT_CODE, \
    SEX, \
    ONLINE_CAT \
  FROM \
    CSNET.CS_CAT_PAGE \
  WHERE STYLE_NO = ${sty_num} \
    AND ONLINE_CAT = 1 \
    ORDER BY ID DESC`;
  
  let oracle = new Orcl(sql);
  oracle.connect(res);
})

/* Get Sample Page */
router.post('/sample_page', function (req, res, next) {
  let sty_num = req.body.style_number;
  let sql = `SELECT * FROM CSNET.CS_SAMPLE WHERE STYLE_NUM = ${sty_num}`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})

/*
  Mono API
*/
router.post('/mono', function (req, res, next) {
  let sty_nbr = req.body.style_number;
  let sql = `SELECT * FROM CSNET.V_CS_MONO_INFO WHERE STY_NBR = ${sty_nbr}`;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
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
  Mono traking
*/
router.post('/mono_track', function (req, res, next) {
  let type_id = req.body.type_id;
  let user_id = req.body.user_id;
  let sql = `INSERT INTO CSNET.CS_TRAKING_MONO (TYPE_ID,AGENT_NAME,USED_DATE) \
  VALUES('${type_id}' , '${user_id}',SYSDATE) `;
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

  let sql = `SELECT * FROM LEJ.INT_STY_MST WHERE STY_NBR='${sty_num}'`;

  let oracle = new Orcl(sql);
  oracle.connect(res);

});

/*
Get C+_Style Information
*/
router.post('/cplus_styles/', function (req, res, next) {

  let sty_num = req.body.style_number;

  let sql = `SELECT DISTINCT * FROM LEJ.STY_MST WHERE STY =${sty_num}`

  let oracle = new Orcl(sql);
  oracle.connect(res);

});



router.post('/set_style/', function (req, res, next) {

  let sty_num = req.body.style_number;


  let sql = `SELECT * \ 
  FROM \
  CSNET.CSNET_V_CS_COMBINED_SALE_ITEMS_INV \
  WHERE SET_STYLE_NUM = ${sty_num} \
  ORDER BY SET_CLR ASC`;

  let oracle = new Orcl(sql);
  oracle.connect(res);

});

/*
  Get Product Image and color
*/
router.post('/img_clr/', function (req, res, next) {

  let sty_num = req.body.style_number;

  // New
  let sql = `SELECT * FROM \
  LEJ.INT_PRD_STY PRD, \
  LEJ.INT_IMG_MST IMG, \
  LEJ.INT_CLR_MST CLR \
  WHERE PRD.PRD_NBR = IMG.PRD_NBR AND \
  IMG.CLR_CODE = CLR.CLR_CODE AND \
  (IMG.VIEW_TP = 'swatch' or IMG.VIEW_TP = 'viewtype_1') AND \
  PRD.STY_NBR = ${sty_num} ORDER BY IMG.CLR_CODE DESC`;


  //OLD
  /*
  let sql = `SELECT * FROM \
  INT_PRD_STY PRD, \
  INT_IMG_MST IMG, \
  CLR_MST CLR \
  WHERE PRD.PRD_NBR = IMG.PRD_NBR AND \
  IMG.CLR_CODE = CLR.CLR_CODE AND \
  (IMG.VIEW_TP = 'swatch' or IMG.VIEW_TP = 'viewtype_1') AND \
  PRD.STY_NBR = ${sty_num} ORDER BY IMG.CLR_CODE DESC`;
  */
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
      try {
        //SQL文がSELECTから始まっていたら
        if(/^(SELECT)/i.test(this._sql)){
          let data = await con.execute(this._sql, [], {});
          let cols = data.metaData;
          let rows = data.rows;
          let obj = {}
          let result = [];
          for (let k = 0; k < rows.length; k++) {
            for (let i = 0; i < cols.length; i++) {
              obj[String(cols[i].name)] = String(rows[k][i]);
            }
            result.push({
              ...obj
            });
          }
          res.send(result);
        // INSERTまたはUPDATE, DELETEからはじまっていたら
        }else{
          let result = await con.execute(this._sql,[],{autoCommit:true})
          console.log(result.rowsAffected)
          res.sendStatus(200);
        }
      
      } catch (err) {
        if (err.message == "Cannot read property '0' of undefined") {
          res.status(404).send('このパラメータ値に該当するデータはありませんでした');
        } else {
          res.send(err)
        }
      }
    } catch (err) {
      console.log(err);
      res.send('接続エラー: \n' + err);
    } finally {
      if (con) {
        try {
          //console.log("it works")
          await con.close();
        } catch (err) {
          res.send(err);
        }
      }
    }
  }

}

module.exports = router;