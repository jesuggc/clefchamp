const express = require('express');
const router = express.Router();
const db = require("../config/db");

router.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

const isLoggedIn = (req, res, next) => {
  if (res.locals.user) return next();
  res.redirect('/users/login');
};

const alreadyLoggedIn = (req, res, next) => {
  if (!res.locals.user) return next();
  res.redirect('/');
};

router.get("/", isLoggedIn, (req, res) => {
  res.render('home');
});

router.get('/api/getLocals', isLoggedIn, (req, res) => {
  res.json({ locals: res.locals.user });
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render('profile');
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Error al cerrar sesión" });
    res.clearCookie("connect.sid"); // Elimina la cookie de sesión
    res.redirect('/');
  });
});

router.get("/login", alreadyLoggedIn, (req, res) => {
  res.render('login');
});

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await db.checkUser(email, password,null);
//     if(!user) console.log("no user")
//     if (!user) return res.json({ existe: false });

//     const userLevel = await db.getUserLevel(user.id);

//     const sessionUser = {
//       ...user,
//       ...userLevel[0],
//     };

//     req.session.user = sessionUser;
//     res.locals.user = sessionUser;

//     res.json({ existe: true, nombre: user.nombre, correo: user.correo });

//   } catch (error) {
//     console.error("Error en login:", error);
//     res.status(500).json({ message: "Error en el inicio de sesión" });
//   }
// });
// En tu archivo de rutas para login
router.post('/login', async (req, res) => {
  console.log("Intentando login con datos:", req.body);  // Log de entrada

  const { email, password } = req.body;
  
  console.log("Verificando usuario en la base de datos...");
  try {
      const user = await db.checkUser(email, password);  // Aquí pones la función para verificar al usuario
      console.log("Usuario encontrado:", user);  // Ver qué devuelve la función

      if (user) {
          // Si el usuario existe, proceder con la sesión
          req.session.user = user;
          res.redirect('/');
      } else {
          console.log("Credenciales incorrectas.");
          res.status(400).send('Credenciales incorrectas');
      }
  } catch (err) {
      console.error("Error al verificar el usuario:", err);
      res.status(500).send("Error interno del servidor");
  }
});


router.get("/register", alreadyLoggedIn, (req, res) => {
  res.render('register');
});

router.post("/register", async (req, res) => {
  try {
    const user = { ...req.body, icon: "default.png" };
    await db.createUser(user);
    res.json(true);
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

router.get("/checkTagname", async (req, res) => {
  try {
    const tagname = req.query.tagname;
    const valido = await db.checkTagname(tagname);
    res.json({ valido });
  } catch (error) {
    errorHandler(error);
    res.status(500).json({ message: "Error en checkTagname" });
  }
});

router.get("/checkEmail", async (req, res) => {
  try {
    const valido = await db.checkEmail(req.query);
    res.json({ valido });
  } catch (error) {
    errorHandler(error);
    res.status(500).json({ message: "Error en checkEmail" });
  }
});

router.get("/checkEmailOrTagname", async (req, res) => {
  try {
    const existe = await db.checkEmailOrTagname(req.query.email);
    res.json({ existe });
  } catch (error) {
    errorHandler(error);
    res.status(500).json({ message: "Error en checkEmailOrTagname" });
  }
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
