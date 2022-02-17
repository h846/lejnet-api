var express = require("express");
var router = express.Router();

//read my module
const test = require("../assets/js/test");

router.get("/", async function (req, res, next) {
	await test.main();
	res.status(200).send("done");
});

module.exports = router;
