var express = require('express');
var router = express.Router();
const dao = require("../config/dao.js");
const midao = new dao("localhost","root","","clefchamp","3306")

const passLocals = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};
router.use(passLocals)

router.get('/', function(req, res, next) {
  
  res.render('index');
});

router.get('/loading', (req, res) => {
  const redirectUrl = req.query.redirect || '/'; // URL de redirección, por defecto al inicio
  res.render('loadingScreen', { redirectUrl }); // Pasamos la URL como variable a la vista
});

router.get('/headerOptions', function(req, res, next) {
  midao.getOptions((err,options) => {
    if(err) console.log("Error: ", err)
    else res.json(options)
  })
});

router.get("/group/:idFacultad", (request, response) => {
  let idFacultad = request.params.idFacultad
  midao.getGrados(idFacultad, (err,resultado)=> {
    if(err) console.log("Error: ", err)
    else response.json({resultado:resultado});
  })
})

router.get("/prueba", (request, response) => {
    midao.getPrueba((err, res) => {
      console.log(err)
      console.log(res)
    })
    response.render("prueba")
})

router.get("/informacion", function (request, response) {
  response.status(200)
  let pag = request.query.data
  response.render("informacion", {pag})
});

router.get("/moreInformation", function (request, response) {
  response.status(200)
  response.render("moreInformation")
  res.redirect('/loading?redirect=/moreInformation');
});

router.get("/getLogo", (request,response) => {
  midao.getLogo((err,foto) => {
    if (err) console.log(err)
    else response.end(foto)
  })
})

router.get("/getFavicon", (request,response) => {
  midao.getFavicon((err,foto) => {
    if (err) console.log(err)
    else response.end(foto)
  })
})

router.get("/optionPhoto/:id", (request,response) => {
  let id = Number(request.params.id)
  midao.getTypeInstallationPhoto(id,(err,foto) => {
    if(err) console.log(err)
    else {
      let imageUrl = null
      if(foto) {
        const imageBase64 = foto.toString('base64');
        imageUrl = 'data:image/jpeg;base64,' + imageBase64;

      }
      response.json({imageUrl})
    } 
  })
})
module.exports = router;
