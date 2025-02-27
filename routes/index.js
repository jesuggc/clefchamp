const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const mysqlConfig = require("../config/db");
const DAO = require("../config/dao");

const pool = mysql.createPool(mysqlConfig);
const dao = new DAO(pool);

router.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/loading', (req, res) => {
  const redirectUrl = req.query.redirect || '/'; // URL de redirección, por defecto al inicio
  res.render('loadingScreen', { redirectUrl }); // Pasamos la URL como variable a la vista
});


router.get("/informacion", function (request, response) {
  response.status(200)
  let pag = request.query.data
  response.render("informacion", {pag})
});

router.get("/moreInformation", function (request, response) {
  response.status(200)
  response.render("moreInformation")
});

module.exports = router;