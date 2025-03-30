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

// router.get("/getIcons", (request,response) => {
//   dao.getIcons((err,icons) => {
//     if(err) console.log(err)
//     else response.json(icons)
//   })
// })


module.exports = router;
