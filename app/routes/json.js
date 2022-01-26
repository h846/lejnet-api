var express = require('express');
var fs = require('fs');
const Encording = require('encoding-japanese');
var router = express.Router();


/* MONITORING JSON FILE */
router.get("/", async (req,res,next) => {
  res.status(200);
  // Param, File name of the JSON
  let file = req.body.file;
  if(!file){res.status(404).send('file not found.')}
  try {
    // Checking the existence of a file
    let filePath = `../src/json/${file}`;
    if (!fs.existsSync(filePath)) {
      res.status(404).send('file not found.');
    }
    // Wait for the data to be updated.
    await checkData(filePath)
    // Once the data is updated, Send the data to the client
    // Load json file
    let jsonFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.status(200).json(jsonFile.list)
  } catch (e) {
    res.status(400).send(e)
  }
})
// Monitor the update status of JSON files.
let checkData = (path) => {
  return new Promise((resolve, reject)=>{
    let date = new Date();
    let mTime;// file modified time
    let timer = setInterval(()=>{
      mTime = fs.statSync(path).mtime;
      if(date.getTime() < mTime.getTime()){
        clearInterval(timer);
        resolve();
      }
    },500)
  })
}

/* UPDATE JSON file*/
// /json?file=xxxx&data={"hoge":"fuga"}
router.put('/', function (req, res, next) {
  // params
  let file = req.body.file;
  let data = req.body.data;
  try {
    //Check for existence of josn file
    //let filePath = `../src/json/${file}`;
    let filePath = `//jpweb001/wwwroot/API/src/json/${file}`;

    if (!fs.existsSync(filePath)) {
      res.status(404).send('file not found.');
    }

    // Load json file
    let jsonFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    //Get Date & Time Now
    let date = new Date();
    let today = date.toLocaleString("ja");

    // add a data to json file
    jsonFile.list.unshift({
      "date": today,
      "data": data
    })
    let jsonData = JSON.stringify(jsonFile);

    fs.writeFile(filePath, jsonData, err => {
      if (err) {
        console.log(err)
      } else {
        console.log('JSON更新成功')
      }
    });

    //以下CSNET datファイル書き込み用。
    //新CSNET移行後削除。
    let datPath = "//leinternal.com/files/JP/OrgStorage/JPTransfer/CS-Net/POPUP/pop_dept/";
    let datFile = datPath+"all.dat";
    let announceData
    //pタグを改行コードへ
    announceData = data.replace(/<\/p><p>/ig, '\n');
    //Remove HTML Tag
    announceData = announceData.replace(/(<([^>]+)>)/gi, '');
    // 謎の数字を追加
    announceData = "2\n"+announceData
    //Shift-JISに文字コード変更
    const sjisBytes = Encording.convert(announceData,{
      from:'UNICODE',
      to: 'SJIS',
      type:'arraybuffer'
    })
    fs.writeFile(datFile,Buffer.from(sjisBytes),(err) => {
      if (err) throw err;
      console.log('DAT更新成功');
    })

    res.status(200).send('The file was create successfully.')
  } catch (e) {
    res.status(400).send(e)
  }
});

module.exports = router;