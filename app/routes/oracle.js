var express = require("express");
var router = express.Router();
var oracledb = require("oracledb");

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
router.post("/camp_data", function (req, res, next) {
	let sql;
	if (!req.body.sql) {
		sql = `SELECT * FROM CSNET.CAMPAIGN_DATA`;
	} else {
		sql = req.body.sql;
	}
	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/*Color expression data */
router.post("/color_exp", function (req, res, next) {
	let color_code = req.body.color_code;
	let sql = `SELECT * FROM CSNET.V_CS_COLOR_INFO WHERE COLOR_CODE = '${color_code}'`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/* Search similar sample item from color code*/
router.post("/smlr_item", function (req, res, next) {
	let color_code = req.body.color_code;
	let sql = `SELECT * FROM CSNET.V_CS_SAMPLE WHERE CLR_CODE = '${color_code}'`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/* Search similar swatch from color code */
router.post("/smlr_swth", function (req, res, next) {
	let color_code = req.body.color_code;
	let sql = `SELECT * FROM CSNET.V_CS_SWATCH WHERE CLR_CODE = '${color_code}'`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});

<<<<<<< HEAD
=======
/*@@@@OLD@@@@ Pants Embroidery Data */
router.post("/pants_emb", function (req, res, next) {
	let sty_num = req.body.style_number;
	let sql = `SELECT * FROM csnet.v_cs_pants_embroidery WHERE sty_nbr = ${sty_num}`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});

>>>>>>> dd061bb75826968500faa5bea0b265f3add1c346
/* New Pants Embroidery Data(for judgement) */
router.post("/pants_emb_sty", function (req, res, next) {
	let sty_num = req.body.style_number;
	let sql = `SELECT * FROM CSNET.V_PANT_EMBROIDERY_STYLE WHERE STY_NBR = ${sty_num}`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/* Catalog Name */
router.post("/cat_name", function (req, res, next) {
	let sql = `SELECT DISTINCT ind.cat_id, ind.cat_name, ind.index_num \
  FROM csnet.cs_cat_ind ind, csnet.cs_cat_page page \
  WHERE ind.cat_id = page.cat_code AND page.online_cat = 1 ORDER BY ind.index_num DESC`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/* Premium Plus*/
router.post("/prm_pls", function (req, res, next) {
	let cust_id = req.body.cust_id;
	let sql = `SELECT * FROM CSNET.CS_CUST_PURCHASE_AMOUNT WHERE CUSTOMER_NUM = ${cust_id}`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/* Style Alert */
router.post("/sty_alert", function (req, res, next) {
	let sty_num = req.body.style_number;
	let sql = `SELECT * FROM CSNET.CS_STY_ALERT \
  WHERE STYLE_NUM = ${sty_num} AND\
  START_DATE <= SYSDATE  AND \
  EXPIRE_DATE >= SYSDATE`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/* Delivery Alert*/
router.post("/deli_alert", function (req, res, next) {
	let pref = req.body.prefecture;
	let sql = `SELECT * FROM CSNET.CS_DELIVERY_ALERT WHERE `;
	if (!pref) {
		sql += "prefectures = 'all'";
	} else {
		sql += `(prefectures = 'all' OR PREFECTURES = '${pref}')`;
	}
	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/* Order History for Rakugae */
router.post("/rg_history", function (req, res, next) {
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
});

/* Get Catalog Page*/
router.post("/cat_page", function (req, res, next) {
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
});

/* Get Sample Page */
router.post("/sample_page", function (req, res, next) {
	let sty_num = req.body.style_number;
	let sql = `SELECT * FROM CSNET.CS_SAMPLE WHERE STYLE_NUM = ${sty_num}`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/*
  Mono API
*/
router.post("/mono", function (req, res, next) {
	let sty_nbr = req.body.style_number;
	let sql = `SELECT * FROM CSNET.V_CS_MONO_INFO WHERE STY_NBR = ${sty_nbr}`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/*
  Lead Time
*/
router.post("/lead_time", function (req, res, next) {
	let zip_code = req.body.zip_code;
	let sql = `SELECT * FROM CS_SAGAWA_LT WHERE ZIP = ${zip_code}`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/*
  Taiwa-Shiki
*/
router.post("/taiwa_shiki", function (req, res, next) {
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
});

/*
  Mono color
*/
router.post("/mono_clr", function (req, res, next) {
	let sql = "SELECT * FROM INT_MONO_THREAD_COLOR WHERE STATUS <> 9";
	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/*
  Mono traking
*/
router.post("/mono_track", function (req, res, next) {
	let type_id = req.body.type_id;
	let user_id = req.body.user_id;
	let sql = `INSERT INTO CSNET.CS_TRAKING_MONO (TYPE_ID,AGENT_NAME,USED_DATE) \
  VALUES('${type_id}' , '${user_id}',SYSDATE) `;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/*
  Get Customer Info
*/
router.post("/customer", function (req, res, next) {
	let cust_id = req.body.cust_id;
	let sql = `SELECT \
	CMM.CM_ZIP_KEY , \
	CMM.CM_NAME_KEY , \
	CMM.CM_CUSTOMER_ID , \
	CMM.CM_NAME_A , \
	CMM.CM_NAME_B , \
	CMM.CM_BILL_LAST , \
	CMM.CM_BILL_FIRST , \
	CMM.CM_BILL_TITLE_CD , \
	CMM.CM_BILL_ADDRESS1 , \
	CMM.CM_BILL_ADDRESS2 , \
	CMM.CM_BILL_ADDRESS3 , \
	CMM.CM_BILL_ADDRESS4 , \
	CMM.CM_BILL_CITY , \
	CMM.CM_BILL_STATE , \
	CMM.CM_COUNTRY_CODE , \
	CMM.CM_ZIP , \
	CMM.CM_CHARGE_TYPE , \
	CMM.CM_ORDER_METHOD , \
	CMM.CM_TAX_CODE , \
	CMM.CM_PRICE_CODE , \
	CMM.CM_MARKUP , \
	CMM.CM_TERRITORY , \
	CMM.CM_BAD_DEBT , \
	CMM.CM_PRBLM_CUSTOMER , \
	CMM.CM_UPS_TYPE , \
	CMM.CM_DATE_ENTERED , \
	CMM.CM_LAST_ORD_SRCE , \
	CMM.CM_ORIG_ACQ_SOURCE , \
	CMM.CM_TRACKED_IND , \
	CMM.CM_ORIGIN , \
	CMM.CM_OPT_ON_ACCT , \
	CMM.CM_DT_ADDR_CHANGE , \
	CMM.CM_SALESMAN_ID , \
	CMM.CM_PHONE_NUMBER , \
	CMM.CM_PHONE_NUMBER2 , \
	CMM.CM_DT_LAST_MAILED , \
	CMM.CM_LST_MAILED_TYPE , \
	CMM.CM_MAILED_COUNT , \
	CMM.CM_ENTERED_OP_ID , \
	CMM.CM_BIRTHDAY , \
	CMM.CM_RM_LIST , \
	CMM.CM_RM_RENTED_LIST , \
	CMM.CM_DIVISION , \
	CMM.CM_CODE_1 , \
	CMM.CM_CODE_2 , \
	CMM.CM_CODE_3 , \
	CMM.CM_CODE_4 , \
	CMM.CM_CODE_5 , \
	CMM.CM_CODE_6 , \
	CMM.CM_CODE_7 , \
	CMM.CM_CODE_8 , \
	CMM.CM_DATE_LST_MOD , \
	CMM.CM_TIME_LST_MOD , \
	CMM.CM_USR_LST_MOD , \
	CMM.CM_EMAIL_ADD , \
	CMM.CM_INDUSTRY_CD , \
	CMM.CM_REFER_CUST_ID , \
	XOFF.CUSTOMER_ID XOFF_CUST_ID , \
	XOFF.ENTRY_DATE XOFF_ENT_DATE , \
	XON.XING_OPT XON_XING_OPT \
	FROM LEJ.CUSTOMER_MASTER CMM , \
	MKTG.XGATE_OFFLINE XOFF , \
	LEJ.NL_MASTER XON  \
	WHERE CMM.CM_CUSTOMER_ID = XOFF.CUSTOMER_ID(+) AND  \
	CMM.CM_CUSTOMER_ID = XON.CUSTOMER_ID(+) AND  \
	CMM.CM_CUSTOMER_ID = ${cust_id}`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});
<<<<<<< HEAD
=======

>>>>>>> dd061bb75826968500faa5bea0b265f3add1c346
/*
  Get Employee Info
*/
router.post("/empl/", function (req, res, next) {
	let win_id = req.body.win_id;

	let sql = `SELECT \
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
    e.HE_IMG IMAGE_FILE, \
    e.HE_CSNET_ROLE, \
    CCR.ROLE_NAME \
    FROM HR_EMPL e, \
    ISSUP_DPT d, \
    CSNET.CS_ROLE CCR \
    WHERE e.HE_DEP_ID = d.ID_DPT_NUM AND \
    CCR.ROLE_ID = e.HE_CSNET_ROLE  AND \
    e.HE_WIN_ID = '${win_id}'`;
	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/*
  Get AR INVOICE
*/
router.post("/ar_invoice_rec/", function (req, res, next) {
	let cust_id = req.body.cust_id;
	let isBalanceOnly = req.body.blnc_only;
	if (cust_id == undefined) {
		res.status(404).send("顧客番号をパラメータに設定してください。");
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
router.post("/styles/", function (req, res, next) {
	let sty_num = req.body.style_number;

	let sql = `SELECT * FROM LEJ.INT_STY_MST WHERE STY_NBR='${sty_num}'`;

	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/*
Get C+_Style Information
*/
router.post("/cplus_styles/", function (req, res, next) {
	let sty_num = req.body.style_number;

	let sql = `SELECT DISTINCT * FROM LEJ.STY_MST WHERE STY =${sty_num}`;

	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/*
Get Set style Information
*/
router.post("/set_style/", function (req, res, next) {
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
  Get campaign Information
*/
router.post("/camp_alert/", function (req, res, next) {
	let sty_num = req.body.style_number;

	// New
	let sql = `SELECT * FROM \
  CSNET.CS_CAMP_BTN CCB \
  WHERE CCB.STY = ${sty_num}`;

	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/*
  Get Next Catalog Information
*/
router.post("/next_cat/", function (req, res, next) {
	let sql = `SELECT * FROM \
  CSNET.CS_CAT_NEXT CCN \
  WHERE CCN.START_DATE IS NOT NULL \
  ORDER BY CCN.START_DATE DESC FETCH FIRST 1 ROWS ONLY`;

	let oracle = new Orcl(sql);
	oracle.connect(res);
});
// Out of stock items
router.post("/outofstock_cat/", function (req, res, next) {
	let sql = `SELECT * FROM CSNET.CS_CAT_EMPTY`;

	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/*
  Next catalog request
*/
router.post("/sendreq_nexcat", function (req, res, next) {
	let cust_id = req.body.cust_id;
	let user_id = req.body.csr_id;
	let cat_id = req.body.cat_id;
	let ex_code = req.body.ex_code;
	let sql;

	if (ex_code == 1) {
		//1
		sql = `SELECT * FROM CSNET.DM_NEXT_CAT_REQ WHERE CUST_NUM='${cust_id}' AND CAT_COD='${cat_id}' AND SEND_DATE IS NULL`;
	} else if (ex_code == 2) {
		sql = `INSERT INTO CSNET.DM_NEXT_CAT_REQ (CUST_NUM,REQUEST_DATE,CSR_ID,CAT_COD) \
    VALUES('${cust_id}' ,SYSDATE, '${user_id}', '${cat_id}') `;
	}

	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/*
  Get Product Image and color
*/
router.post("/img_clr/", function (req, res, next) {
	let sty_num = req.body.style_number;

	let sql = `SELECT * FROM \
  LEJ.INT_PRD_STY PRD, \
  LEJ.INT_IMG_MST IMG, \
  LEJ.INT_CLR_MST CLR \
  WHERE PRD.PRD_NBR = IMG.PRD_NBR AND \
  IMG.CLR_CODE = CLR.CLR_CODE AND \
  (IMG.VIEW_TP = 'swatch' or IMG.VIEW_TP = 'viewtype_1') AND \
  PRD.STY_NBR = ${sty_num} ORDER BY IMG.CLR_CODE DESC`;

	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/*
  Get SKU, Price, Inventory count from Style number.
*/
router.post("/prc_inv", function (req, res, next) {
	let style_num = req.body.style_number;
	let sql = `SELECT * FROM \
  AFL_PRC_INV INV,
  LEJ.INT_SIZ_MST MSIZ
  WHERE  INV.SIZ = MSIZ.SZM_NAME_J(+) AND \
  STY = ${style_num} ORDER BY MSIZ.SZM_DSP_ORD ASC`;

	let oracle = new Orcl(sql);
	oracle.connect(res);
});
/*
  API Response Test (Get Method).
*/
router.get("/", function (req, res, next) {
	res.status(200).send("It works");
});

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
				connectionString: "LEJPPDORA01:1521/orcl.leinternal.com",
			});
			try {
				//SQL文がSELECTから始まっていたら
				if (/^(SELECT)/i.test(this._sql)) {
					let data = await con.execute(this._sql, [], {});
					let cols = data.metaData;
					let rows = data.rows;
					let obj = {};
					let result = [];
					for (let k = 0; k < rows.length; k++) {
						for (let i = 0; i < cols.length; i++) {
							obj[String(cols[i].name)] = String(rows[k][i]);
						}
						result.push({
							...obj,
						});
					}
					res.send(result);
					// INSERTまたはUPDATE, DELETEからはじまっていたら
				} else {
					let result = await con.execute(this._sql, [], { autoCommit: true });
					console.log(result.rowsAffected);
					res.sendStatus(200);
				}
			} catch (err) {
				if (err.message == "Cannot read property '0' of undefined") {
					res
						.status(404)
						.send("このパラメータ値に該当するデータはありませんでした");
				} else {
					res.send(err);
				}
			}
		} catch (err) {
			console.log(err);
			res.send("接続エラー: \n" + err);
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
