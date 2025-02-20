var express = require('express');
var router = express.Router();
const db = require("../config/db");

const passLocals = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};
// router.use(passLocals)

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/loading', (req, res) => {
  const redirectUrl = req.query.redirect || '/';
  res.render('loadingScreen', { redirectUrl });
});

router.get("/informacion", function (request, response) {
  response.status(200)
  let pag = request.query.data
  response.render("informacion", {pag})
});

router.get("/moreInformation", function (req, res) {
  res.status(200)
  res.render("moreInformation")
});

module.exports = router;
