var express = require('express');
var router = express.Router();
const dao = require("../public/javascripts/DAO.js");
const { error } = require('jquery');
const midao = new dao("localhost","root","","clefchamp","3306")

const passLocals = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};

const isLoggedIn = (req, res, next) => {
  if (res.locals.user) return next();
  res.redirect('/users/login');
};

const alreadyLoggedIn = (req, res, next) => {
  if (!res.locals.user) return next();
  res.redirect('/');
};

router.use(passLocals)

router.get("/", isLoggedIn, (request,response) => {
  response.render('home')
})


router.get("/pruebaNivel", (request,response) => {
    response.render("pruebaNivel")
})

// This is probably the worst way to do this...
function errorHandler(err) {
  console.log("\x1b[41m%s\x1b[0m",  "-----------------------------------------------------------")
  console.log("\x1b[41m%s\x1b[0m",  "CÓDIGO DE ERROR: ",err.code)
  console.log("\x1b[41m%s\x1b[0m",  "MENSAJE SQL: ",err.sqlMessage)
  console.log("\x1b[41m%s\x1b[0m",  "SQL: ",err.sql)
  console.log("\x1b[41m%s\x1b[0m",  "-----------------------------------------------------------")
}
module.exports = router;
