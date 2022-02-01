var express = require('express');
var router = express.Router();
const ExcelJS = require('exceljs');
const axios = require('axios');

router.get('/',function(req,res,next){
  res.send("it works")
})
router.get('/wo-tracking', function (req, res, next) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("WO Tracking");
  worksheet.columns = [
  { header: 'オーダー日付', key: 'order_date', width: 15 },
  { header: '時間', key: 'time',width:15},
  { header: '受付番号', key: 'recept_time',width:15},
  { header: '状況', key: 'status',width:15},
  { header: '9止め理由', key: '9stop',width:15},
  { header: '氏名', key: 'name',width:15},
  { header: 'C#', key: 'cust_num',width:15},
  { header: 'O#', key: 'Order_num',width:15},
  { header: 'CODE', key: 'code',width:15},
  { header: '楽替', key: 'rakugae',width:15},
];
  workbook.xlsx.writeFile("excelFiles/test.xlsx")
})

module.exports = router;