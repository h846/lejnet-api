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
  console.log('Whoops!');
  console.log(err);
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
router.post('/web-order', function (req, res, next) {

  let sql = `SELECT * FROM CSNET.V_TOOL_OPN_ORD_FOR_OS`;

  let oracle = new Orcl(sql);
  oracle.connect(res);

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