import { dibujarNota, randomNote, randomClef, getNoteAndOctave, getNote, getOctave, resetCanvas } from './vexManager.js';

dibujarNota("","")
let TRIAL_CLEF = 1
let TRIAL_MAX_DISPERSION = 3
let TRIAL_ROUNDS = 20
let contador = 0;
let expectedNote = ""
let aciertos = 0
let fallos = 0
let times = []
let keyMap = {
        'a': 'c',
        's': 'd',
        'd': 'e',
        'f': 'f',
        'g': 'g',
        'h': 'a',
        'j': 'b'
    };
$('.slider').attr('max', TRIAL_ROUNDS); 
$('.slider').val(0); 


$("#empezar").on("click", function() {
    $(document).on("keydown", function(event) {
        if (contador < TRIAL_ROUNDS) {
            if (keyMap[event.key]) {
                resetCanvas()
                updateGame()
                checkCorrect(event.key)
                updateUI()
            }
        }
    });
})

function updateGame() {
    let note = randomNote() // e5
    let clef = randomClef(0) // bass
    let realNote = getNoteAndOctave(note,clef) // e5 + bass = g3
    dibujarNota(realNote,clef)
    expectedNote =  getNote(note,clef) //g
    contador++;
}

function checkCorrect(keyevent) {
    if (keyMap[keyevent] === expectedNote) aciertos++
    else fallos++
}
function updateUI() {
    $(".slider").val(contador)
    $("#aciertos").text(aciertos)
    $("#fallos").text(fallos)
}
