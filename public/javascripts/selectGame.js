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

$("#playBtn").prop("disabled", true);

function changeImageWithFade(src) {
  $("#gameImage").fadeOut(150, function () {
      $(this).attr("src", src).fadeIn(150);
  });
}

function changeTextWithFade(text) {
  $("#descriptionDiv").fadeOut(150, function () {
      $(this).html(text).fadeIn(150);
  });
}

$("#easyBtn").on("mouseenter", function() {
  changeImageWithFade("/images/bandaFacil.png");
  changeTextWithFade(textToEasy);
});
$("#easyBtn").on("mouseleave", function() {
  changeImageWithFade(selected);
  changeTextWithFade(textSelected);
});
$("#easyBtn").on("click", function() {
  selected = "/images/bandaFacil.png";
  textSelected = textToEasy;
  changeImageWithFade(selected);
  $("#playBtn").attr("href", linkToEasy);
  $("#playBtn").prop("disabled", false);
  changeTextWithFade(textSelected);
});

$("#normalBtn").on("mouseenter", function() {
  changeImageWithFade("/images/bandaNormal.png");
  changeTextWithFade(textToNormal);
});
$("#normalBtn").on("mouseleave", function() {
  changeImageWithFade(selected);
  changeTextWithFade(textSelected);
});
$("#normalBtn").on("click", function() {
  selected = "/images/bandaNormal.png";
  textSelected = textToNormal;
  changeImageWithFade(selected);
  $("#playBtn").attr("href", linkToNormal);
  changeTextWithFade(textSelected);
});

$("#hardBtn").on("mouseenter", function() {
  changeImageWithFade("/images/bandaDificil.png");
  changeTextWithFade(textToHard);
});
$("#hardBtn").on("mouseleave", function() {
  changeImageWithFade(selected);
  changeTextWithFade(textSelected);
});
$("#hardBtn").on("click", function() {
    selected = "/images/bandaDificil.png";
    textSelected = textToHard;
    changeImageWithFade(selected);
    $("#playBtn").attr("href", linkToHard);
    changeTextWithFade(textSelected);
});
