var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var applicationRouter = require('./routes/application');
var playRouter = require('./routes/play');
var app = express();

// const dao = require('./public/javascripts/DAO')
// const midao = new dao("localhost","root","","clefchamp","3306");

const session = require("express-session")
const sessionSQL = require("express-mysql-session")
const bodyParser = require("body-parser")
const mysqlStore = sessionSQL(session)


// require('dotenv').config({
//   path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
// });

// Configuración de la sesión
// const sessionStore = new mysqlStore({
//   host: "interchange.proxy.rlwy.net",
//   port: 57391,
//   user: "root",
//   password: "OJSOuUDafqUzdKRiRGJIWeRxcAMgBsZT",
//   database: "railway"
// });

// const sessionStore = new mysqlStore({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "clefchamp"
// })

const middlewareSession = session({
  saveUninitialized: false,
  secret: "1234", 
  resave: false,  
  // store: sessionStore
})

app.use(middlewareSession)
app.use(bodyParser.json())


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/application', applicationRouter);
app.use('/play', playRouter);


// midao.getConfiguration((err,res)=> {
//   if(err) console.log(err)
//   else app.locals.configuration = res
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render("404")
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

app.listen()

module.exports = app;
