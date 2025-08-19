var morgan = require('morgan');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser")
const mysqlConfig = require('./config/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var applicationRouter = require('./routes/application');
var playRouter = require('./routes/play');

const session = require('express-session')
var mysqlStore = require('express-mysql-session')(session);

require("dotenv").config({ path: process.env.NODE_ENV === "development" ? '.env' : '.env.production' });
var app = express();

const sessionStore = new mysqlStore(mysqlConfig)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: "1234",
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}))


app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(morgan('dev'));
app.use((req,res,next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const date = new Date();
  date.setHours(date.getHours() + 2); 
  const formattedDate = date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',', ' -');
  console.log(`IP: ${ip} -> ${formattedDate}`)
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/application', applicationRouter);
app.use('/play', playRouter);


app.use(function(req, res, next) {
  res.status(404);
  res.render("404")
});

app.use(function(err, req, res, next) {
  console.log(err.message)
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;