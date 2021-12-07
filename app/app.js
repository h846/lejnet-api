var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Define Route Path 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accdbRouter = require('./routes/accdb');
var jsonRouter = require('./routes/json');
var oracleRouter = require('./routes/oracle');
//added by Janusz, 2021/11/30
var intTool = require('./routes/intTool');
var intOrcl = require('./routes/intOrcl');

var app = express();
// socket.io setup
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(function(req, res, next){
  res.io = io;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Route Setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accdb', accdbRouter);
app.use('/json', jsonRouter);
app.use('/oracle', oracleRouter);// for L+ app
//added by Janusz, 2021/11/30
app.use('/inttool', intTool);
app.use('/intorcl',intOrcl);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.title = 'ERROR!';
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};