 // https://expressjs.com/en/guide/writing-middleware.html

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middleware 
var LogerMid = (req, res, next) => {
  console.log('Loggered')
  next()
}
var requestTime = (req, res, next) => {
  req.requestTime = Date.now()
  next()
}
app.use(logger('dev'));
app.use(express.json()); //from express 4.16.x
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// a middleware function with no mount path. This code is executed for every request to the router
app.use(LogerMid)
app.use(requestTime)
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
