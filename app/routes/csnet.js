var express = require("express");
var router = express.Router();
var oracledb = require("oracledb");
/*
try {
  oracledb.initOracleClient({
    libDir: 'C:\\Dev\\instantclient'
  });
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  //process.exit(1);
}
*/
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
