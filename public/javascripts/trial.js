import { dibujarNota, randomNote, randomClef, getNoteAndOctave, getNote, getOctave, resetCanvas } from './vexManager.js';
import { Cronometro } from './cronometro.js';

let TRIAL_CLEF = 1
let TRIAL_MAX_DISPERSION = 3
let TRIAL_ROUNDS = 20
let DEBUG_MODE = true
let contador = 0;
let expectedNote = ""
let aciertos = 0
let fallos = 0
let times = []
let individualTimes = []
let cronometro;
let keyMap = {
    'a': 'c',
    's': 'd',
    'd': 'e',
    'f': 'f',
    'g': 'g',
    'h': 'a',
    'j': 'b'
};

$(function() {
    dibujarNota("","")
    cronometro = new Cronometro($($("#timer"))[0])
    if(!DEBUG_MODE) $("#debugDiv").hide()
    // new bootstrap.Modal($("#tutorialModal")).show();
});

$("#empezar").on("click", function() {
    $(this).prop("disabled",true)
    cronometro.start()
    updateGame()
    $(document).on("keydown", function(event) {
        if (contador < TRIAL_ROUNDS) {
            if (keyMap[event.key]) {
                getTime()
                contador++
                checkCorrect(event.key)
                updateGame()
                updateUI()
                debugginTool()
            }
        }
    });
})

function updateGame() {
    if (contador === TRIAL_ROUNDS) endGame()
    else {
        let note = randomNote() // e5
        let clef = randomClef(0) // bass
        let realNote = getNoteAndOctave(note,clef) // e5 + bass = g3
        dibujarNota(realNote,clef)
        expectedNote = getNote(note,clef) //g
    }
}

function checkCorrect(keyevent) {
    if (keyMap[keyevent] === expectedNote) {
        aciertos++
        flashBackground("#d7ffb8")
    } 
    else {
        fallos++
        flashBackground("#ffdfe0")
    }
}

function endGame() {
    cronometro.pause()
    dibujarNota("","")
    new bootstrap.Modal($("#resultModal")).show();

    // times.forEach((ele) => console.log(ele))
    individualTimes.forEach((ele) => console.log(ele))
}

function getTime() {
    times.push(cronometro.getTime())
    if(contador === 0) individualTimes.push(cronometro.getTime())
    else individualTimes.push((times[contador] - times[contador-1]))
}

function updateUI() {
    $(".slider").css("width",((contador/TRIAL_ROUNDS)*100) + "%")
}

function flashBackground(color) {
    const div = document.getElementById("divFeedback");
    if (!div) return;
    div.style.transition = 'none';
    div.style.backgroundColor =color;
    
    setTimeout(() => {
        div.style.transition = "background-color 1s ease-in-out";
        div.style.backgroundColor = "white";
    }, 250);
}

function debugginTool() {
    if(DEBUG_MODE) {
        $("#aciertos").text(aciertos)
        $("#fallos").text(fallos)
        $("#noteTime").append(cronometro.getTime() + "  \n")
        $("#esperada").text(note)
    } 
}

$(document).ready(function () {
    // Mapeo de teclas del teclado a las notas
    const keyMap = {
      "a": ".DO4",
      "s": ".RE4",
      "d": ".MI4",
      "f": ".FA4",
      "g": ".SOL4",
      "h": ".LA4",
      "j": ".SI4",
    };
  
    $(document).on("keydown", function (event) {
      let tecla = keyMap[event.key.toLowerCase()];
      if (tecla) {
        $(tecla).addClass("pressed");
      }
    });
  
    $(document).on("keyup", function (event) {
      let tecla = keyMap[event.key.toLowerCase()];
      if (tecla) {
        $(tecla).removeClass("pressed");
      }
    });
  });
  