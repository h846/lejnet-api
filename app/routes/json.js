const {
  json
} = require('express');
var express = require('express');
var fs = require('fs');
var router = express.Router();

/* Generate JSON file*/
// /json?file=xxxx&data={"hoge":"fuga"}
router.post('/', function (req, res, next) {
  try {
    //Check for existence of josn file
    let fileName = `../src/json/${req.body.file}`;
    //res.status(200).send(req.body.file);
    if (!fs.existsSync(fileName)) {
      res.status(404).send('The requested JSON file does NOT exist');
    }

    // Load json file
    let jsonFile = JSON.parse(fs.readFileSync(fileName, 'utf8'));

    //Get Date & Time Now
    let date = new Date();
    let today = date.toLocaleString("ja");

    // add a data to json file
    jsonFile.list.unshift({
      "date": today,
      "text": req.body.data
    })
    let jsonData = JSON.stringify(jsonFile);

    fs.writeFile(fileName, jsonData, err => {
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