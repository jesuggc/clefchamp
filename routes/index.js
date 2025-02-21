const express = require('express');
const router = express.Router();
const db = require("../config/db");

router.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/loading', (req, res) => {
  try {
    const redirectUrl = req.query.redirect || '/';
    res.render('loadingScreen', { redirectUrl });
  } catch (error) {
    console.error("Error en /loading:", error);
    res.status(500).json({ message: "Error al cargar la pantalla de carga" });
  }
});

router.get("/informacion", (req, res) => {
  try {
    const pag = req.query.data;
    res.render("informacion", { pag });
  } catch (error) {
    console.error("Error en /informacion:", error);
    res.status(500).json({ message: "Error al cargar la información" });
  }
});

router.get("/moreInformation", (req, res) => {
  try {
    res.render("moreInformation");
  } catch (error) {
    console.error("Error en /moreInformation:", error);
    res.status(500).json({ message: "Error al cargar moreInformation" });
  }
});

module.exports = router;