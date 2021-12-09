var express = require('express');
var fs = require('fs');
var router = express.Router();

/* MONITORING JSON FILE */
router.get("/", async (req,res,next) => {
  // Param, File name of the JSON
  let file = req.body.file;
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
    let filePath = `../src/json/${file}`;

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
        console.log('更新成功')
      }
    });

    res.status(200).send('The JSON file was created successfully.')
  } catch (e) {
    res.status(400).send(e)
  }
});

module.exports = router;