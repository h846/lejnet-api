const { json } = require('express');
var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET JSON FILE */
router.get("/",function(req,res,next){
   // params
  let file = req.body.file;
  try {
    //Check for existence of josn file
    let filePath = `../src/json/${file}`;
    if (!fs.existsSync(filePath)) {
      res.status(404).send('The requested JSON file does NOT exist').end();
    }
    // Load json file
    let jsonFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let jsonData = JSON.stringify(jsonFile);
    //Send JSON file
    res.status(200).json(jsonData).end()

  } catch (e) {
    res.status(400).send(e).end()
  }
})

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
      res.status(404).send('The requested JSON file does NOT exist').end();
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