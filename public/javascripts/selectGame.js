let selected = "";
let textSelected = "";
let linkToEasy = "./atrapado/easy";
let linkToNormal = "./atrapado/normal";
let linkToHard = "./atrapado/hard";

let textToEasy = "Atrapa-do es un interactivo juego musical en el que tienes que leer las notas que vayan saliendo por pantalla.<br>" +
"En este divertido juego se premian los aciertos y el tiempo que tardes en responder.<br>" + 
"<strong>Fácil:</strong> en este modo solo aparecen notas en la clave de sol. Las notas aparecen en intervalos de primera, segunda y tercera.";

let textToNormal = "Atrapa-do es un interactivo juego musical en el que tienes que leer las notas que vayan saliendo por pantalla.<br>" +
"En este divertido juego se premian los aciertos y el tiempo que tardes en responder.<br>" + 
"<strong>Normal:</strong> en este modo aparecen notas en la clave de sol y algunas en la clave de fa. Las notas aparecen en intervalos mínimos de tercera.";

let textToHard = "Atrapa-do es un interactivo juego musical en el que tienes que leer las notas que vayan saliendo por pantalla.<br>" +
"En este divertido juego se premian los aciertos y el tiempo que tardes en responder.<br>" + 
"<strong>Difícil:</strong> en este modo aparecen notas en la clave de sol y fa indistintamente. Las notas aparecen en intervalos mínimos de quinta.";

let pathToEasy = "/images/bandaFacil.png"
let pathToNormal = "/images/bandaNormal.png"
let pathToHard = "/images/bandaDificil.png"
$("#playBtn").prop("disabled", true);

function changeImageWithFade(src) {
  $("#gameImage").fadeOut(150, function () {
      if(src=== "") $(this).removeAttr("src").fadeIn(150); 
      else $(this).attr("src", src).fadeIn(150);
  });
}

function changeTextWithFade(text) {
  $("#descriptionDiv").fadeOut(150, function () {
      $(this).html(text).fadeIn(150);
  });
}

$("#easyBtn").on("mouseenter", function() {
  if(selected !== pathToEasy) changeImageWithFade(pathToEasy);
  if(textSelected !== textToEasy) changeTextWithFade(textToEasy);
});
$("#easyBtn").on("mouseleave", function() {
  if(selected !== pathToEasy) changeImageWithFade(selected);
  if(textSelected !== textToEasy) changeTextWithFade(textSelected);
});
$("#easyBtn").on("click", function() {
  selected = pathToEasy
  textSelected = textToEasy;
  activatePlayBtn(linkToEasy)
  handleSelection("#easyBtn")
});

$("#normalBtn").on("mouseenter", function() {
  if(selected !== pathToNormal) changeImageWithFade(pathToNormal);
  if(textSelected !== textToNormal) changeTextWithFade(textToNormal);
});
$("#normalBtn").on("mouseleave", function() {
  if(selected !== pathToNormal) changeImageWithFade(selected);
  if(textSelected !== textToNormal) changeTextWithFade(textSelected);
});
$("#normalBtn").on("click", function() {
  selected = pathToNormal
  textSelected = textToNormal;
  activatePlayBtn(linkToNormal)
  handleSelection("#normalBtn")
});

$("#hardBtn").on("mouseenter", function() {
  if(selected !== pathToHard) changeImageWithFade(pathToHard);
  if(textSelected !== textToHard) changeTextWithFade(textToHard);
});
$("#hardBtn").on("mouseleave", function() {
  if(selected !== pathToHard) changeImageWithFade(selected);
  if(textSelected !== textToHard) changeTextWithFade(textSelected);
});
$("#hardBtn").on("click", function() {
  selected = pathToHard;
  textSelected = textToHard;
  activatePlayBtn(linkToHard)
  handleSelection("#hardBtn")
});
  
function handleSelection(selection) {
  $("#easyBtn").removeClass("gameSelectorsSelected")
  $("#normalBtn").removeClass("gameSelectorsSelected")
  $("#hardBtn").removeClass("gameSelectorsSelected")
  $(selection).addClass("gameSelectorsSelected")
}

function activatePlayBtn(link) {
  $("#playLink").attr("href", link);
  $("#playBtn").prop("disabled", false);
}