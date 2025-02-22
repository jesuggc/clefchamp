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

const isLoggedIn = (req, res, next) => {
  if (res.locals.user) return next();
  res.redirect("/users/login");
};

const alreadyLoggedIn = (req, res, next) => {
  if (!res.locals.user) return next();
  res.redirect("/");
};

router.get("/", isLoggedIn, (req, res) => {
  res.render("home");
});

router.get("/api/getLocals", isLoggedIn, (req, res) => {
  res.json({ locals: res.locals.user });
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Error al cerrar sesión" });
    res.clearCookie("connect.sid"); // Elimina la cookie de sesión
    res.redirect("/");
  });
});

router.get("/login", alreadyLoggedIn, (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  dao.checkUser(email, password, (err, user) => {
    if (err) {
      console.error("Error en login:", err);
      return res.status(500).json({ message: "Error en el inicio de sesión" });
    }

    if (!user) return res.json({ existe: false });

    dao.getUserLevel(user.id, (err, userLevel) => {
      if (err) {
        console.error("Error obteniendo nivel del usuario:", err);
        return res.status(500).json({ message: "Error en login" });
      }

      const sessionUser = {
        ...user,
        ...userLevel[0],
      };

      req.session.user = sessionUser;
      res.locals.user = sessionUser;

      res.json({ existe: true, nombre: user.nombre, correo: user.correo });
    });
  });
});

router.get("/register", alreadyLoggedIn, (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const user = { ...req.body, icon: "default.png" };

  dao.createUser(user, (err, userId) => {
    if (err) return res.status(500).json({ message: "Error al registrar usuario" });
    dao.unlockIcon(userId,1, (err) => {
      if (err) return res.status(500).json({ message: "Error en registro" });
    })
    dao.unlockIcon(userId,2, (err) => {
      if (err) return res.status(500).json({ message: "Error en registro" });
    })
    dao.unlockIcon(userId,3, (err) => {
      if (err) return res.status(500).json({ message: "Error en registro" });
    })
    dao.unlockIcon(userId,4, (err) => {
      if (err) return res.status(500).json({ message: "Error en registro" });
    })
    res.json(true)
  });
});

router.get("/checkTagname", (req, res) => {
  let tagname = req.query.tagname;
  dao.checkTagname(tagname, (err, isValid) => {
    if (err) {
      console.error("Error en checkTagname:", err);
      return res.status(500).json({ message: "Error en checkTagname" });
    }
    res.json({ valido: isValid });
  });
});

router.get("/checkEmail", (req, res) => {
  let email = req.query.email;
  dao.checkEmail(email, (err, isValid) => {
    if (err) {
      console.error("Error en checkEmail:", err);
      return res.status(500).json({ message: "Error en checkEmail" });
    }
    res.json({ valido: isValid });
  });
});

router.get("/checkEmailOrTagname", (req, res) => {
  let emailOrTagname = req.query.email;
  dao.checkEmailOrTagname(emailOrTagname, (err, exists) => {
    if (err) {
      console.error("Error en checkEmailOrTagname:", err);
      return res.status(500).json({ message: "Error en checkEmailOrTagname" });
    }
    res.json({ existe: exists });
  });
});

function errorHandler(err) {
  if (err.code === "ECONNREFUSED") {
    console.log("\n\nArranca XAMPP máquina\n\n");
  } else {
    console.error(`
      \x1b[41m-----------------------------------------------------------\x1b[0m
      \x1b[41mCÓDIGO DE ERROR: ${err.code}\x1b[0m
      \x1b[41mMENSAJE SQL: ${err.sqlMessage || "No disponible"}\x1b[0m
      \x1b[41mSQL: ${err.sql || "No disponible"}\x1b[0m
      \x1b[41m-----------------------------------------------------------\x1b[0m
    `);
  }
}

module.exports = router;
