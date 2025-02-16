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


router.get("/atrapado/trial", (request,response) => {
    response.render("pruebaNivel")
})

router.get("/selectGame", (request,response) => {
  response.render("selectGame")
})

router.get("/atrapado/easy", (request,response) => {
  response.render("pruebaNivel")
})

router.get("/atrapado/normal", (request,response) => {
  response.render("pruebaNivel")
})

router.get("/atrapado/hard", (request,response) => {
  response.render("pruebaNivel")
})

router.get('/getExperienceRequired/:level', (request,response) => {
  const level = request.params.level; 
  midao.getExperienceByLevel(level,(err,result) => {
    if(err) errorHandler(err)
    else response.json(result)
  })
});

router.get('/getUserLevel/:userId', (request, response) => {
  const userId = request.params.userId;
  midao.getUserLevel(userId, (err, result) => {
    if (err) errorHandler(err, response);
    else response.json(result[0]); 
  });
});

router.put('/addExperience', (request,response) => {
  const { userId, level, experience, experienceToNext } = request.body;
  midao.updateUserLevel(userId, level, experience, experienceToNext, (err, result) => {
    console.log(result)
    response.locals.user.level = level
    response.locals.user.experience = experience
    response.locals.user.experienceToNext = experienceToNext
    response.json(true)
  })
});

// This is probably the worst way to do this...
function errorHandler(err) {
  console.log("\x1b[41m%s\x1b[0m",  "-----------------------------------------------------------")
  console.log("\x1b[41m%s\x1b[0m",  "CÓDIGO DE ERROR: ",err.code)
  console.log("\x1b[41m%s\x1b[0m",  "MENSAJE SQL: ",err.sqlMessage)
  console.log("\x1b[41m%s\x1b[0m",  "SQL: ",err.sql)
  console.log("\x1b[41m%s\x1b[0m",  "-----------------------------------------------------------")
}
module.exports = router;
