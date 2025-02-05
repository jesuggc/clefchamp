import { dibujarNota, randomNote, randomClef, getNoteAndOctave, getNote, getOctave, resetCanvas } from './vexManager.js';
import { Cronometro } from './cronometro.js';

let TRIAL_CLEF = 1
let TRIAL_MAX_DISPERSION = 3
let TRIAL_ROUNDS = 20
let DEBUG_MODE = false
let contador = 0;
let expectedNote = ""
let aciertos = 0
let fallos = 0
let times = []
let individualTimes = []
let keyMap = {
        'a': 'c',
        's': 'd',
        'd': 'e',
        'f': 'f',
        'g': 'g',
        'h': 'a',
        'j': 'b'
    };
dibujarNota("","")
const cronometro = new Cronometro($($("#timer"))[0])
if(!DEBUG_MODE) $("#debugDiv").hide()


$("#empezar").on("click", function() {
    $(this).prop("disabled",true)
    cronometro.start()
    updateGame()
    $(document).on("keydown", function(event) {
        if (contador < TRIAL_ROUNDS) {
            if (keyMap[event.key]) {
                getTime()
                contador++
                resetCanvas()
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
    if (keyMap[keyevent] === expectedNote) aciertos++
    else fallos++
}

function endGame() {
    cronometro.pause()
    resetCanvas()
    dibujarNota("","")

    // times.forEach((ele) => console.log(ele))
    // individualTimes.forEach((ele) => console.log(ele))
}

function getTime() {
    times.push(cronometro.getTime())
    if(contador === 0) individualTimes.push(cronometro.getTime())
    else individualTimes.push((times[contador] - times[contador-1]))
}

function updateUI() {
    $(".slider").css("width",((contador/TRIAL_ROUNDS)*100) + "%")
}

function debugginTool() {
    if(DEBUG_MODE) {
        $("#aciertos").text(aciertos)
        $("#fallos").text(fallos)
        $("#noteTime").append(cronometro.getTime() + "  \n")
        $("#esperada").text(note)
    } 
}
