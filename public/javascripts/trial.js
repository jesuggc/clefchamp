import { dibujarNota, randomNote, randomClef, getNoteAndOctave, getNote, getOctave, resetCanvas } from './vexManager.js';
import { Cronometro } from './cronometro.js';


let TRIAL_CLEF = 1
let TRIAL_MAX_DISPERSION = 3
let TRIAL_ROUNDS = 20
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
// $('.slider').attr('max', TRIAL_ROUNDS); 
// $('.slider').val(0); 
dibujarNota("","")
const cronometro = new Cronometro($($("#timer"))[0])


$("#empezar").on("click", function() {
    $("#empezar").prop("disabled",true)
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
        $("#esperada").text(note)
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
    times.forEach((ele) => console.log(ele))
    individualTimes.forEach((ele) => console.log(ele))
}

function getTime() {
    times.push(cronometro.getTime())
    if(contador === 0) individualTimes.push(cronometro.getTime())
    else individualTimes.push((times[contador] - times[contador-1]))
}

function updateUI() {
    // $(".slider").val(contador)
    let percentage = (contador/TRIAL_ROUNDS)*100
    console.log(percentage)
    $(".slider").css("width",percentage + "%")

    $("#aciertos").text(aciertos)
    $("#fallos").text(fallos)
    
    // $("#noteTime").append(cronometro.getTime() + "  \n")

}
