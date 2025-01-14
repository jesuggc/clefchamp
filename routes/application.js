var express = require('express');
var router = express.Router();
const dao = require("../public/javascripts/DAO.js");
const { error } = require('jquery');
const midao = new dao("localhost","root","","clefchamp","3306")



router.get("/getIcons", (request,response) => {
  midao.getIcons((err,icons) => {
    if(err) console.log(err)
    else response.json(icons)
  })
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
