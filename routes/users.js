const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const mysqlConfig = require("../config/db");
const DAO = require("../config/dao");

const pool = mysql.createPool(mysqlConfig);
const dao = new DAO(pool);

const bcrypt = require('bcrypt');
const saltRounds = 10;
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
  dao.getRecordsFromId(res.locals.user.id, (err, records) => {
    if (err) res.status(500).json({ message: "Error al obtener los registros" });
    else {
      dao.getTopRecordsFromId(res.locals.user.id, (err, topRecords) => {
        if (err) res.status(500).json({ message: "Error al obtener los registros" });
        else {
          dao.getIconsFromId(res.locals.user.id,(err,icons) => {
            if(err) console.log(err)
            else res.render("profile", {records, topRecords,icons});
          })
        }
      });
    }
  });
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
  dao.checkUser(email, (err, user) => {
    if (err) {
      console.error("Error en login:", err);
      return res.status(500).json({ message: "Error en el inicio de sesión" });
    }
    
    if (!user) return res.json({ existe: false });
    
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparando contraseña:", err);
        return res.status(500).json({ message: "Error en el inicio de sesión" });
      }

      if (!isMatch) return res.json({ existe: false });

      dao.getUserLevel(user.id, (err, userLevel) => {
        if (err) {
          console.error("Error obteniendo nivel del usuario:", err);
          return res.status(500).json({ message: "Error en login" });
        }
        
        dao.getPreferences(user.id, (err, preferences) => {
          if(err) {
            console.log(err)
            return res.status(500).json({ message: "Error en el inicio de sesión" }); 
          }
          dao.getProfileIconFromId(user.id,(err, profile) => {
            if(preferences === null) {
              preferences = {
                showTutorial: true
              }
            }
            user.path = profile[0].path
            user.bgColor = profile[0].bgColor
            const sessionUser = {
              ...user,
              ...userLevel[0],
              preferences
            };
            
            req.session.user = sessionUser;
            res.locals.user = sessionUser;
            
            res.json({ existe: true, nombre: user.nombre, correo: user.correo });
          });
        });
      });
    });
  });
});

router.get("/register", alreadyLoggedIn, (req, res) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  const user = { ...req.body};
  const password = user.password
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) return next(new Error("Error al cifrar la contraseña"));
    user.password = hash; 
    dao.createUser(user, (err, userId) => {
      if (err) return next(new Error("Error al registrar usuario"));
      dao.unlockInitialIcons(userId, (err) => {
        if (err) return next(new Error("Error en registro 1"));              
            dao.initializeExperience(userId, (err) => {
              if (err) return next(new Error("Error en registro 5"));
              
              res.json(true);
            });
        });
    });
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


router.post('/hideTutorial', isLoggedIn, (req, res) => {
  dao.hideTutorial(res.locals.user.id, (err, resultado) => {
    if(err) res.status(500).json({ message: "Error en hideTutorial" }); 
    res.locals.user.preferences.showTutorial = false
    res.json(true)
  })
});

router.get("/globalRanking", (req, res) => {
  dao.getTopRecordsByDifficulty("EASY", (err, easyRes) => {
    if (err) {
      console.error("Error en checkEmail:", err);
      return res.status(500).json({ message: "Error en checkEmail" });
    }
    dao.getTopRecordsByDifficulty("NORMAL", (err, normalRes) => {
      if (err) {
        console.error("Error en checkEmail:", err);
        return res.status(500).json({ message: "Error en checkEmail" });
      }
      dao.getTopRecordsByDifficulty("HARD", (err, hardRes) => {
        if (err) {
          console.error("Error en checkEmail:", err);
          return res.status(500).json({ message: "Error en checkEmail" });
        }
        res.render("globalRanking",{easyRes, normalRes, hardRes});
      });
    });
  });
});
router.post("/setProfileIcon", (req,res) => {
  const { color, dataId, path } = req.body;
  dao.setEmptySelectedIcon(res.locals.user.id,(err, result) => {
    if (err) {
      console.error("Error en checkEmail:", err);
      return res.status(500).json({ message: "Error en prueba" });
    } else {
      dao.setSelectedIcon(res.locals.user.id,dataId,color,(err, result) => {
        if (err) {
          console.error("Error en checkEmail:", err);
          return res.status(500).json({ message: "Error en prueba" });
        } else {
          res.locals.user.bgColor=color
          res.locals.user.path=path
          res.json(true)
        }
      })
    }
  })
  
  
})
router.get("/stats",isLoggedIn, (req, res) => {
  res.render("stats")
});

router.get("/settings",isLoggedIn, (req, res) => {
  res.render("settings")
});
// router.get("/friends",isLoggedIn, (req, res) => {
//   dao.getSentRequests(res.locals.user.id, (err1, sentList) => {
//     if (err1) return res.status(500).json({ error: 'Error al obtener los datos 1' });
//     dao.getReceivedRequests(res.locals.user.id, (err2, receivedList) => {
//       if (err2) return res.status(500).json({ error: 'Error al obtener los datos 2' });
//       dao.getFriends(res.locals.user.id, (err3, friendList) => {
//         if (err3) return res.status(500).json({ error: 'Error al obtener los datos 3' });
//         res.render("friends",{sentList, receivedList, friendList});
//       });
//     });
//   });
// })

router.get("/statsForUser",isLoggedIn, (req, res) => {
  dao.getStatsByIdAndDifficulty(res.locals.user.id,"EASY", (err, easyStats) => {
    if (err) {
      console.error("Error en checkEmail:", err);
      return res.status(500).json({ message: "Error en stats easy" });
    } else {
      dao.getStatsByIdAndDifficulty(res.locals.user.id,"NORMAL", (err1, normalStats) => {
        if (err1) {
          console.error("Error en checkEmail:", err1);
          return res.status(500).json({ message: "Error en stats normal" });
        } else {
          dao.getStatsByIdAndDifficulty(res.locals.user.id,"HARD", (err2, hardStats) => {
            if (err2) {
              console.error("Error en checkEmail:", err2);
              return res.status(500).json({ message: "Error en stats hard" });
            } else {
              res.json({easyStats,normalStats,hardStats})
            }
          })
        }
      })
    }
  })
});
router.get('/getUserByFriendcode/:friendCode', (req, res) => {
  const { friendCode } = req.params;
  const fullFriendCode = "#" + friendCode
  dao.getUserByFriendcode(fullFriendCode,res.locals.user.id, (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los datos' });
    res.json(resultado);
  });
});

// router.post('/sendRequest', (req, res) => {
//   const { friendId } = req.body;
//   dao.sendRequest(res.locals.user.id,friendId, (err, resultado) => {
//     if (err) return res.status(500).json({ error: 'Error al obtener los datos' });
//     res.json(resultado);
//   });
// });

// router.post('/acceptRequest', (req,res) => {
//   const { friendId } = req.body;
//   dao.acceptRequest(res.locals.user.id,friendId, (err, resultado) => {
//     if (err) return res.status(500).json({ error: 'Error al obtener los datos' });
    
//     res.redirect('/friends')
//   });
// })

// router.post('/dropRequest', (req,res) => {
//   const { friendId } = req.body;
//   dao.dropRequest(res.locals.user.id,friendId, (err, resultado) => {
//     if (err) return res.status(500).json({ error: 'Error al obtener los datos' });
//     res.redirect('/friends')
//   });
// })


router.get("/getSelfId", (req, res) => {
  res.json({ id: res.locals.user.id });
});


module.exports = router;
