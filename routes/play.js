const express = require('express');
const router = express.Router();
const db = require("../config/db");

router.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Middlewares de autenticación
const isLoggedIn = (req, res, next) => res.locals.user ? next() : res.redirect('/users/login');
const isNotLoggedIn = (req, res, next) => !res.locals.user ? next() : res.redirect('/users/login');
const alreadyLoggedIn = (req, res, next) => !res.locals.user ? next() : res.redirect('/');

router.get("/", isLoggedIn, (req, res) => res.render('home'));

router.get("/selectGame", isLoggedIn, (req, res) => res.render("selectGame"));

router.get("/atrapado/trial", isNotLoggedIn, (req, res) => res.render("gameScreen", { mode: "TRIAL" }));
router.get("/atrapado/easy", isLoggedIn, (req, res) => res.render("gameScreen", { mode: "EASY" }));
router.get("/atrapado/normal", isLoggedIn, (req, res) => res.render("gameScreen", { mode: "NORMAL" }));
router.get("/atrapado/hard", isLoggedIn, (req, res) => res.render("gameScreen", { mode: "HARD" }));

router.get('/getExperienceRequired/:level', isLoggedIn, async (req, res) => {
  try {
    const level = req.params.level;
    const result = await db.getExperienceByLevel(level);
    res.json(result);
  } catch (error) {
    errorHandler(error, res);
  }
});

router.get('/getUserLevel/:userId', isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await db.getUserLevel(userId);
    res.json(result[0]);
  } catch (error) {
    errorHandler(error, res);
  }
});

router.put('/addExperience', isLoggedIn, async (req, res) => {
  try {
    const { userId, level, experience, experienceToNext } = req.body;
    await db.updateUserLevel(userId, level, experience, experienceToNext);

    res.locals.user = {
      ...res.locals.user,
      level,
      experience,
      experienceToNext,
    };

    res.json(true);
  } catch (error) {
    errorHandler(error, res);
  }
});

router.post('/updatePreferences', (req, res) => {
  try {
    res.locals.preferences = req.body.showModal;
    res.json(true);
  } catch (error) {
    errorHandler(error, res);
  }
});

// Manejo de errores
function errorHandler(err, res) {
  console.error(`
    \x1b[41m-----------------------------------------------------------\x1b[0m
    \x1b[41mCÓDIGO DE ERROR: ${err.code || "Desconocido"}\x1b[0m
    \x1b[41mMENSAJE SQL: ${err.sqlMessage || "No disponible"}\x1b[0m
    \x1b[41mSQL: ${err.sql || "No disponible"}\x1b[0m
    \x1b[41m-----------------------------------------------------------\x1b[0m
  `);
  res.status(500).json({ message: "Error en la operación" });
}

module.exports = router;
