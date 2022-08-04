const express = require('express');
const router = express.Router();
var Orcl = require('../modules/orcl')

/* -- TEMPLATE --
router.post('', function (req, res, next) {
  let sql = ``;
  let oracle = new Orcl(sql);
  oracle.connect(res);
})
*/

/* get hemming type data */
router.post('/readhemtp', function (req, res, next) {
    let sql;
    if(!req.body.sql){
      sql = `select type_id,cuff_flg,desc_en,desc_jp,price,status from lej.int_hem_type`;
    }else{
      sql = req.body.sql;
    }
    let oracle = new Orcl(sql);
    oracle.connect(res);
  })
  

// intdb
// router.route('/prod').post(getProductInfo);

module.exports = router;