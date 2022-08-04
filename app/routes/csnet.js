var express = require("express");
var router = express.Router();
var Orcl = require('../modules/orcl')

/* SS BIBLE DATA */
router.post("/ss-bible", function (req, res, next) {
	// sql param exist -> UPDATE, DELTE, etc..
	// sql param NOT exist -> SELECT
	let sql = req.body.sql;
	if (!sql) {
		sql = "SELECT * FROM CSNET.SS_BIBLE";
	}

	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/* Customer Info Change data*/
router.post("/jp_ecoa", function (req, res, next) {
	// sql param exist -> UPDATE, DELTE, etc..
	// sql param NOT exist -> SELECT
	let sql = req.body.sql;
	if (!sql) {
		sql = "SELECT * FROM CSNET.CS_JP_ECOA WHERE END_F = 0";
	}

	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/* Sample Item Info*/
router.post("/sample_item", function (req, res, next) {
	let sql = req.body.sql;
	
	if (!sql) {
		sql = 'SELECT * FROM CSNET.V_CS_SAMPLE_MST';
	}

	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/* Rakugae Tracking */
router.post("/rakugae_tracking", function (req, res, next) {
	let cust_num = req.body.cust_num;
	let sql = `SELECT * FROM CSNET.CS_RAKUGAE_TRACKING_NUMBER WHERE CUST_NUM = '${cust_num}'`;

	if (!cust_num) {
		res.status(400).send("パラメータcust_numで顧客番号を指定してください");
	}

	let oracle = new Orcl(sql);
	oracle.connect(res);
});

/* WEB Order Tracking*/
router.post("/web-order", function (req, res, next) {
	let sql = `SELECT * FROM CSNET.V_TOOL_OPN_ORD_FOR_OS`;

	let oracle = new Orcl(sql);
	oracle.connect(res);
});

router.get("/", function (req, res, next) {
	res.send("CSNET API");
});

module.exports = router;