var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require("body-parser")
var morgan = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var applicationRouter = require('./routes/application');
var playRouter = require('./routes/play');
var app = express();


const session = require('express-session')
var mysqlStore = require('express-mysql-session')(session);


// Configurar morgan para que registre en la consola y en el archivo

require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? '.env' : '.env.production' 
});

const sessionStore = new mysqlStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

app.use(session({
  secret: "1234", 
  resave: false,  
  saveUninitialized: false,
  store: sessionStore
}))

app.use(morgan('dev'));  // Esto muestra los logs en la consola
app.use(bodyParser.json())


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/application', applicationRouter);
app.use('/play', playRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render("404")
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(process.env.PORT || 3000)

module.exports = app;