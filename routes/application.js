const express = require('express');
const router = express.Router();
const db = require("../config/db");

router.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

router.get("/getIcons", async (req, res) => {
  try {
    const icons = await db.getIcons();
    res.json(icons);
  } catch (error) {
    errorHandler(error);
    res.status(500).json({ message: "Error al obtener los íconos" });
  }
});

// Manejo de errores
function errorHandler(err) {
  console.error(`
    \x1b[41m-----------------------------------------------------------\x1b[0m
    \x1b[41mCÓDIGO DE ERROR: ${err.code}\x1b[0m
    \x1b[41mMENSAJE SQL: ${err.sqlMessage || "No disponible"}\x1b[0m
    \x1b[41mSQL: ${err.sql || "No disponible"}\x1b[0m
    \x1b[41m-----------------------------------------------------------\x1b[0m
  `);
}

module.exports = router;
