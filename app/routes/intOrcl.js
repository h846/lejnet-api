const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

/* -- TEMPLATE --
router.post('', function (req, res, next) {
  let sql = ``;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
*/

/* get hemming type data */
router.get('/readhemtp', function (req, res, next) {
    let sql;
    console.log("/readhemtp")
    if(!req.body.sql){
      sql = `SELECT type_id,cuff_flg,desc_en,desc_jp,price,status from lej.int_hem_type`;
    }else{
      sql = req.body.sql;
    }
    let oracle = new Orcl(sql);
    oracle.connect(res);
  })
  

// intdb
//router.route('/prod').post(getProductInfo);


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
        //connectionString: "LEJPPDORA01:1521/orcl.leinternal.com"
        connectionString: "LEJPPDORA01:1521/orcl.leinternal.com"
      });
      // Database Side Process
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
          res.status(404).send('The specified parameter does not exist.');
        } else {
          res.send(err)
        }
      }
    } catch (err) {
      console.log(err);
      res.send('Connection error occured: \n' + err);
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