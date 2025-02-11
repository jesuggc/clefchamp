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


router.get("/profilePhoto/:id", isLoggedIn, (request,response) => {
  let id = Number(request.params.id)
  midao.getProfilePhoto(id,(err,foto) => {
    if(err) console.log(err)
    else response.end(foto)
  })
})

router.get("/profile", isLoggedIn, (request,response) => {
  response.render('profile')
})

router.get("/logout", isLoggedIn, (request, response) => { //Redirige a pagina principal, cerrando sesion en locals y session
  request.session.destroy()
  response.locals.user = request.session
  response.status(200)
  response.redirect('/');
})

router.get("/login", alreadyLoggedIn, (request, response) => {//Renderiza pagina de login
  response.status(200)
  response.render('login');
})

router.post("/login", function (request, response) {//Inicia sesion
  response.status(200)
  let email = request.body.email
  let contrasena = request.body.password
  midao.checkUser(email,contrasena,(err, res) => {
    if (err) console.log("Error: ", err)
    else if(!res) response.json(false)
    else {
    let userId = res.id
    midao.getUserLevel(userId, (error, result) => {
      if (error) console.log("Error: ", error)
      else if(!res) response.json(false)
      else {
        const user = {
          ...res,
          ...result[0]
        };
        
        request.session.user = user
        response.locals.user = user
        response.json({existe:true, nombre:res.nombre,correo:res.correo})
        }
      })
    }
  })
});

router.get("/register", alreadyLoggedIn ,(request, response) => {//Renderiza pagina de register
  response.render('register');
})

router.post("/register", (request, response) => { //Crea el nuevo usuario tras submit en vista de register
  let user = request.body
  user.icon = "default.png"
  midao.createUser(user, (err,res) => {
    if (err) console.log("Error: ", err)
    else response.json(true)
  })
  
});

router.get("/checkTagname", (request, response) => { //Crea el nuevo usuario tras submit en vista de register
  let tagname = request.query.tagname
  midao.checkTagname(tagname, (err,res) => {
    if (err) errorHandler(err)
    else response.json({valido:res})
  })
  
});

router.get("/checkEmail", function (request, response) {//En validar login y register
  midao.checkEmail(request.query, (err, res) => {
      if(err) errorHandler(err)
      else response.json({valido:res})
  })
});


router.get("/checkEmailOrTagname", function (request, response) {
  midao.checkEmailOrTagname(request.query.email, (err, res) => {
      if(err) errorHandler(err)
      else response.json({existe:res})
  })
});

router.get("/correo", isLoggedIn, (request, response) => { //Renderiza pagina de correo
  response.status(200)
  
  midao.getEmails(response.locals.user.id, (err,emails) => {
    if(err) console.log(err)
    else {
      emails.forEach(ele => {
        ele.hora = ele.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).split(",")[1].trim()
        ele.fecha = ele.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).split(",")[0]
      });
      response.render("correo",{emails})
    } 
  })
})

router.get("/emailContent", isLoggedIn, (request, response) => { //Renderiza pagina de correo
  response.status(200)
  midao.getEmail(request.query.id ,(err,email) => {
    if(err) console.log(err)
    else {
        email.hora = email.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).split(",")[1].trim()
        email.fecha = email.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).split(",")[0]
        response.json(email)
    };
  })
})

router.post("/updateEmail", isLoggedIn, (request,response) => {
  let id = request.body.id
  let callback = (err,res) => {
    if(err) console.log(err)
    else response.json(res)
  }
  if(request.body.action === "fav") {
    midao.toggleFavEmail(id,callback)
  } else if (request.body.action === "archive") {
    midao.toggleArchiveEmail(id,callback)
  } else if (request.body.action === "delete") {
    midao.deleteEmail(id,callback)
  } else {
    midao.readEmail(id,callback)  
  }
})

router.post("/sendMessage", isLoggedIn, (request,response) => {
  response.status(200)
  let id = response.locals.user.id
  midao.getIdByEmail(request.body.email, (err,idDestino) => {
    if(err) console.log(err)
    else {
      midao.createMessage(id, idDestino, request.body.asunto, request.body.cuerpo, (err,res) => {
        if(err) console.log(err)
        else response.json(res)
      })
    }
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
