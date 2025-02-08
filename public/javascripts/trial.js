import { dibujarNota, emptyClef, randomNote, randomClef, getNoteAndOctave, getNote, getOctave, resetCanvas } from './vexManager.js';
import { Cronometro } from './cronometro.js';

const PERFORMANCE = {
    PERFECT: {
        THRESHOLD: 1000,
        COLOR: 'rgb(255, 251, 0)',
        TITLE: 'Perfecto'
    },
    EXCELLENT: {
        THRESHOLD: 2000,
        COLOR: 'rgb(174, 0, 255)',
        TITLE: 'Excelente'
    },
    GREAT: {
        THRESHOLD: 4000,
        COLOR: 'rgb(0, 162, 255)',
        TITLE: 'Genial'
    },
    GOOD: {
        THRESHOLD: 8000,
        COLOR: 'rgb(0, 255, 55)',
        TITLE: 'Bien'
    },
    OK: {
        THRESHOLD: Infinity,
        COLOR: 'rgb(255, 102, 0)',
        TITLE: 'Ok'
    }
};

let COLOR_CORRECT = "#d7ffb8"
let COLOR_WRONG = "#ffdfe0"
let TRIAL_CLEF = 0
let TRIAL_ROUNDS = 20
let contador = 0;
let expectedNote = ""
let aciertos = 0
let fallos = 0
let times = []
let individualTimes = []
let individualTime = 0;
let cronometro;
let gameStarted = false

let KEYCODE_1 = 'a'
let KEYCODE_2 = 's'
let KEYCODE_3 = 'd'
let KEYCODE_4 = 'f'
let KEYCODE_5 = 'j'
let KEYCODE_6 = 'k'
let KEYCODE_7 = 'l'


const notes = [
    { key: KEYCODE_1, note: 'c' },
    { key: KEYCODE_2, note: 'd' },
    { key: KEYCODE_3, note: 'e' },
    { key: KEYCODE_4, note: 'f' },
    { key: KEYCODE_5, note: 'g' },
    { key: KEYCODE_6, note: 'a' },
    { key: KEYCODE_7, note: 'b' }
];

const keyMap = Object.fromEntries(notes.map(({ key, note }) => [key, note]));
const visualKeyMap = Object.fromEntries(notes.map(({ key, note }) => [key, `.note${note}`]));

$(function() {
    emptyClef()
    cronometro = new Cronometro($($("#timer"))[0])
    // new bootstrap.Modal($("#tutorialModal")).show();

    $(document).on("keydown", function (event) {
        if (visualKeyMap[event.key.toLowerCase()]) $(visualKeyMap[event.key.toLowerCase()]).addClass("pressed");

        if (gameStarted && contador < TRIAL_ROUNDS && keyMap[event.key]) {
            getTime()
            contador++
            checkCorrect(event.key)
            updateGame()
            updateUI()
        }
    });

    $(document).on("keyup", function (event) {
        if (visualKeyMap[event.key.toLowerCase()]) $(visualKeyMap[event.key.toLowerCase()]).removeClass("pressed");
    });
});

$("#empezar").on("click", function() {
    $(this).prop("disabled",true)
    cronometro.start()
    updateGame()
    gameStarted = true
})

function updateGame() {
    if (contador === TRIAL_ROUNDS) {
        endGame()
        return
    } 
    let note = randomNote() 
    let clef = randomClef(TRIAL_CLEF) 
    let realNote = getNoteAndOctave(note,clef)
    dibujarNota(getNoteAndOctave(note,clef),clef)
    expectedNote = getNote(note,clef)
}

function checkCorrect(keyevent) {
    const pressedNote = keyMap[keyevent]
    $(".note"+expectedNote).each((_, ele) => flashBackground(ele, COLOR_CORRECT));
    
    if (pressedNote === expectedNote) handleCorrectNote()
    else handleWrongNote(pressedNote)
    
}

function handleCorrectNote() {
    aciertos++
    const feedback = getFeedback(individualTime)
    let $message =  $($("#successMessage"))[0]
    $($message).text(feedback.TITLE).css("color",feedback.COLOR)
    fadeOutBackground($message)
}

function getFeedback(time) {
    if (time < PERFORMANCE.PERFECT.THRESHOLD) 
        return PERFORMANCE.PERFECT
    if (time < PERFORMANCE.EXCELLENT.THRESHOLD) 
        return PERFORMANCE.EXCELLENT 
    if (time < PERFORMANCE.GREAT.THRESHOLD) 
        return PERFORMANCE.GREAT
    if (time < PERFORMANCE.GOOD.THRESHOLD) 
        return PERFORMANCE.GOOD
    return PERFORMANCE.OK
}

function handleWrongNote(pressedNote) {
    fallos++
    $(".note"+pressedNote).each((_, ele) => flashBackground(ele, COLOR_WRONG));
}

function endGame() {
    cronometro.pause()
    emptyClef()
    // new bootstrap.Modal($("#resultModal")).show();
    individualTimes.forEach((ele) => console.log(ele))
}


function getTime() {
    let totalTime = cronometro.getTime()
    times.push(totalTime)
    if(contador === 0) {
        individualTimes.push(totalTime)
        individualTime = totalTime
    } else {
        individualTime = (times[contador] - times[contador-1])
        individualTimes.push(individualTime)
    }
}

function updateUI() {
    $(".slider").css("width",((contador/TRIAL_ROUNDS)*100) + "%")
}

function flashBackground(div, color) {
    if (!div) return;
    
    $(div)
    .css({ transition: 'none', backgroundColor: color })
    .delay(250)
    .queue(function(next) {
        $(this).css({
            transition: 'background-color 1s ease-in-out',
            backgroundColor: 'white'
        });
        next();
    });
}
function fadeOutBackground(div) {
    if (!div) return;
    
    $(div)
    .css({ transition: 'none', opacity: 1 })
    .delay(100)
    .queue(function(next) {
        $(this).css({
            transition: 'opacity 1s ease-in-out',
            opacity: 0
        });
        next();
    });
}



// ---------------
let score = 300;
$("#try").on("click", function() {
    let pointsAdded = 50;
    $("#score").addClass("pop-animation")
    setTimeout(() => {
        $("#score").removeClass("pop-animation")
    }, 350);
    animateScore(score, score+pointsAdded, 100);
    score+=pointsAdded
    addPointsAnimation(pointsAdded);
})

function addPointsAnimation(points) {
    let newPoints = $("#scoreAdded")
    
    $(newPoints).show();

    $(newPoints).text(`+${points}`)
    $(newPoints).addClass("point-animation");
  
    
    setTimeout(() => {$(newPoints).hide();$(newPoints).removeClass("point-animation")}, 200);
  } 
function animateScore(start, end, duration) {
    let current = start;
    let increment = (end - start) / (duration / 16); // Aproximadamente 60 FPS
    let interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      document.getElementById("score").textContent = Math.round(current);
    }, 16);
  }
  