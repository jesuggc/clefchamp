var express = require('express');
var router = express.Router();
const dao = require("../public/javascripts/DAO.js");
const midao = new dao("localhost","root","","clefchamp","3306")
const multer=require('multer');
const multerFactory= multer({storage: multer.memoryStorage()})

const isLoggedIn = (req, res, next) => {
  if (res.locals.user) return next();
  res.redirect('/users/login');
};

const isAdmin = (req, res, next) => {
  if (res.locals.user.admin === 1) return next();
  res.render("accessDenied");
};

const passLocals = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};

router.use(isLoggedIn)
router.use(isAdmin)
router.use(passLocals)

router.get("/", (request, response) => { //Renderiza pagina de admin
    response.status(200)
    response.render('admin');
})

router.get("/changeRols", (request, response) => { //Llama a vista de usuarios verificados para convertirlo en admin (AJAX)
  midao.getVerifiedUsers((err, res) => {
    if (err) console.log("Error: ", err)
    else response.json(res)
  })
})

router.post("/changeRols", (request, response) => { //Convierte a un usuario por su id en admin (AJAX)
  midao.updateAdmin(request.body.id,(err, res) => {
    if (err) console.log("Error: ", err)
    else response.json(res)
  })
})

//SOLICITUDES
router.get("/solicitudes", (request, response) => { //Llama a vista de usuarios registrados aun pendientes por verificar (AJAX)
  midao.getRequests((err, res) => {
    if (err) console.log("Error: ", err)
    else response.json(res)
  })
})



router.post("/dropRequest", (request,response) => {//Elimina el registro de un usuario (AJAX)
  midao.dropRequest(request.body.id, (err,res) => {
    if(err) console.log(err)
    else response.json(res)
  })
})

//LIST USERS
router.get("/listUsers", (request, response) => {
  midao.getVerifiedUsers(((err,users) => {
    if(err) console.log("Error: ", err)
    else response.render("listUsers",{users});
  }))
})

router.post("/photoToServer",multerFactory.single('foto'), (request,response)=>{
  response.send({img:request.file.buffer})
})

router.get("/appearance", (request, response) =>{
  response.render("appearance")
})

router.get("/history",(request,response)=>{
  response.render("history")
})
router.get("/historyList", (request,response)=>{
  let inputSearch = request.query.inputSearch;
  midao.getUsersByInput(inputSearch,(err,users) => {
    if(err) console.log("Error: ", err)
    else response.json(users);
  })
})

router.post("/updateAppearance", multerFactory.fields([{name:"logo"},{name:"favicon"}]), (request,response) => {
  let favicon = request.files["favicon"] ? request.files["favicon"][0] : null
  let logo = request.files["logo"] ? request.files["logo"][0] : null
  let miObjeto = request.body
  for (let clave in miObjeto) {
    if (miObjeto[clave] === '') {
      miObjeto[clave] = null;
    }
  }
  midao.updateAppearance( request.body.titulo, request.body.nombre, request.body.direccion, request.body.numero, request.body.correo, request.body.abreviacion, logo, favicon, (err,updated)=>{
    if(err) console.log("Error: ", err)
    else {
      request.app.locals.configuration.nombre = request.body.nombre ? request.body.nombre : request.app.locals.configuration.nombre
      request.app.locals.configuration.direccion = request.body.direccion ? request.body.direccion : request.app.locals.configuration.direccion
      request.app.locals.configuration.numero = request.body.numero ? request.body.numero : request.app.locals.configuration.numero
      request.app.locals.configuration.titulo = request.body.titulo ? request.body.titulo : request.app.locals.configuration.titulo
      request.app.locals.configuration.correo = request.body.correo ? request.body.correo : request.app.locals.configuration.correo
      request.app.locals.configuration.abreviacion = request.body.abreviacion ? request.body.abreviacion : request.app.locals.configuration.abreviacion
      request.app.locals.configuration.logo = logo ? logo : request.app.locals.configuration.logo
      request.app.locals.configuration.favicon = favicon ? favicon : request.app.locals.configuration.favicon
      response.redirect("/admin/appearance")
    } 
  })
})

router.get("/filterList", (request,response)=>{
  let inputSearch = request.query.inputSearch;
  let option = request.query.option;
  midao.getUsersByInputFiltered(inputSearch,option,(err,users) => {
    if(err) console.log("Error: ", err)
    else response.json(users);
  })
})

router.get("/stats/:id", (request,response) => {
  let id = Number(request.params.id)
  midao.getStatsByUserId(id,(err,res) => {
    if(err) console.log("Error: ", err)
    else response.render("stats",{id,res})
  })
  
})

router.get("/pertecentageStat", (request,response) => {
  let id = Number(request.query.id)
  midao.getPertencageStat(id ,(err,res) => {
    if(err) console.log("Error: ", err)
    else response.json(res)
  })
})

module.exports = router;