var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
//const session = require('express-session');
//const FileStore = require('session-file-store')(session);
const passport = require('passport');
const config = require('./config');
//const authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');

const mongoose = require('mongoose');

//const url = 'mongodb://127.0.0.1:27017/nucampsite';
const url = config.mongoUrl;
const connect = mongoose.connect(url, {});

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

var app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
    res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));

/* app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
})); */

app.use(passport.initialize());
//app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
    const err = new Error('You are not authenticated!');
    err.status = 401;
    return next(err);
  } else {
    return next();
  }
  //console.log(req.session);

  /* (!req.signedCookies.user) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    } */

/* if (!req.session.user) {
  const err = new Error('You are not authenticated!');
  err.status = 401;
  return next(err);
} else {
  //if (req.signedCookies.user === 'admin') {
  if (req.session.user === 'authenticated') {
    return next();
  } else {
    const err = new Error('You are not authenticated!');
    err.status = 401;
    return next(err);
  }
} */


//app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
