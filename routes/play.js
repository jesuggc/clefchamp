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

// Middlewares de autenticación
const isLoggedIn = (req, res, next) => res.locals.user ? next() : res.redirect('/users/login');
const isNotLoggedIn = (req, res, next) => !res.locals.user ? next() : res.redirect('/users/login');
const alreadyLoggedIn = (req, res, next) => !res.locals.user ? next() : res.redirect('/');

router.get("/", isLoggedIn, (req, res) => res.render('home'));

router.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
})

router.get("/", isLoggedIn, (request,response) => {
  response.render('home')
})

router.get("/selectGame", isLoggedIn, (request,response) => {
  response.render("selectGame")
})

router.get("/atrapado/trial", isNotLoggedIn, (request,response) => {
    response.render("gameScreen", {mode: "TRIAL"})
})

router.get("/atrapado/easy", isLoggedIn, (request,response) => {
  response.render("gameScreen", {mode: "EASY"})
})

router.get("/atrapado/normal", isLoggedIn, (request,response) => {
  response.render("gameScreen", {mode: "NORMAL"})
})

router.get("/atrapado/hard", isLoggedIn, (request,response) => {
  response.render("gameScreen", {mode: "HARD"})
})

router.get('/getExperienceRequired/:level', isLoggedIn, (request,response) => {
  const level = request.params.level; 
  dao.getExperienceByLevel(level,(err,result) => {
    if(err) res.status(500).json({ message: "Error en getExperienceRequired" }); 
    else response.json(result)
  })
});

router.get('/getUserLevel/:userId', isLoggedIn, (request, response) => {
  const userId = request.params.userId;
  dao.getUserLevel(userId, (err, result) => {
    if (err) res.status(500).json({ message: "Error en getExperienceRequired" }); 
    else response.json(result[0]); 
  });
});

router.put('/addExperience', isLoggedIn, (request,response) => {
  const { userId, level, experience, experienceToNext } = request.body;
  dao.updateUserLevel(userId, level, experience, experienceToNext, (err, result) => {
    response.locals.user.level = level
    response.locals.user.experience = experience
    response.locals.user.experienceToNext = experienceToNext
    response.json(true)
  })
});

router.post('/saveRecords', (req, res) => {
  const {
      id,
      dificultad,
      perfecto,
      excelente,
      genial,
      bien,
      ok,
      aciertos,
      fallos,
      puntuacion,
      tiemposIndividuales,
      notas,
      resultados
  } = req.body;

  dao.saveRecord(id,dificultad,perfecto,excelente,genial,bien,ok,aciertos,fallos,puntuacion,tiemposIndividuales,notas,resultados, (err,result) => {
    if(err) {
      console.log("ERROR: " + err)
      res.status(500).json({ message: "Error en saveRecords" }); 
    }
    else res.json(true);
  })

});



module.exports = router;
