var oracledb = require("oracledb");
/*
try {
  oracledb.initOracleClient({
    libDir: 'C:\\Dev\\instantclient'
  });
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  // process.exit(1);
}
*/

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

module.exports = Orcl;