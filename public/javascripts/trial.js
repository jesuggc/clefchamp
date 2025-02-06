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
let individualTime = 0;
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
    new bootstrap.Modal($("#tutorialModal")).show();
    const keyMap = {
        "a": ".noteC",
        "s": ".noteD",
        "d": ".noteE",
        "f": ".noteF",
        "g": ".noteG",
        "h": ".noteA",
        "j": ".noteB",
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
    let $tecla = $($(".note"+expectedNote[0].toUpperCase()))[0] 
    let $tecla2 = $($(".note"+expectedNote[0].toUpperCase()))[1] 
    flashBackground($tecla,"#d7ffb8")
    flashBackground($tecla2,"#d7ffb8")
    let $wrongtecla = $($(".note"+keyMap[keyevent][0].toUpperCase()))[0] 
    let $wrongtecla2 = $($(".note"+keyMap[keyevent][0].toUpperCase()))[1] 
    if (keyMap[keyevent] === expectedNote) {
        aciertos++
        let $message =  $($(".successMessages"))[0]
    if (individualTime < 1000) {
        $($message).text("Perfecto")
        $($message).css("color","rgb(255, 251, 0)")
    } else if (individualTime < 2000) {
        $($message).text("Excelente")
        $($message).css("color","rgb(174, 0, 255)")
    } else if (individualTime < 4000) {
        $($message).text("Genial")
        $($message).css("color","rgb(0, 162, 255)")
    } else if (individualTime < 8000) {
        $($message).text("Bien")
        $($message).css("color","rgb(0, 255, 55)")
    } else {
        $($message).text("Mejorable")
        $($message).css("color","rgb(255, 102, 0)")
    }
    fadeOutBackground($message)
    } 
    else {
        fallos++
        flashBackground($wrongtecla,"#ffdfe0")
        flashBackground($wrongtecla2,"#ffdfe0")
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
    let totalTime = cronometro.getTime()
    times.push(totalTime)
    if(contador === 0) individualTimes.push(totalTime)
    individualTime = (times[contador] - times[contador-1])
    if(contador > 0) individualTimes.push(individualTime)
}

function updateUI() {
    $(".slider").css("width",((contador/TRIAL_ROUNDS)*100) + "%")
}

function flashBackground(div, color) {
    if (!div) return;
    div.style.transition = 'none';
    div.style.backgroundColor =color;
    
    setTimeout(() => {
        div.style.transition = "background-color 1s ease-in-out";
        div.style.backgroundColor = "white";
    }, 250);
}
function fadeOutBackground(div) {
    if (!div) return;
    
    div.style.transition = 'none';
    div.style.opacity = "1"; 

    setTimeout(() => {
        div.style.transition = "opacity 1s ease-in-out";
        div.style.opacity = "0";
    }, 100);
}

function debugginTool() {
    if(DEBUG_MODE) {
        $("#aciertos").text(aciertos)
        $("#fallos").text(fallos)
        $("#noteTime").append(cronometro.getTime() + "  \n")
    } 
}
