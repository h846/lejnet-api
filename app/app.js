var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//Define Route Path
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var accdbRouter = require("./routes/accdb");
var jsonRouter = require("./routes/json");
var oracleRouter = require("./routes/oracle");
var csnetRouter = require("./routes/csnet");
var excelRouter = require("./routes/excel");
var pdfRouter = require("./routes/pdf");

//added by Janusz, 2021/11/30
const { INTTOOLS_PATH } = require("./public/paths");
//var intTool = require('./routes/intTool');
var intOrcl = require("./routes/intOrcl");

var app = express();
// socket.io setup
var server = require("http").Server(app);
/*var io = require('socket.io')(server);
app.use(function(req, res, next){
  res.io = io;
  next();
});

io.on('connection', function(socket){
  console.log('connected!!!');
});
*/

// view engine setup
// Added additional views path. Janusz, 2021/12/14
app.set("views", [
	path.join(__dirname, "views"),
	path.join(INTTOOLS_PATH, "intviews"),
]);
//app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Route Setup
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/accdb", accdbRouter);
app.use("/json", jsonRouter);
app.use("/oracle", oracleRouter); // for L+ app
app.use("/csnet", csnetRouter);
app.use("/excel", excelRouter);
app.use("/pdf", pdfRouter);
//added by Janusz, 2021/11/30
//app.use('/inttool', intTool);
app.use("/intorcl", intOrcl);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.title = "ERROR!";
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = { app: app, server: server };
