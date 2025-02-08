const { Factory, EasyScore, System, Formatter } = Vex.Flow;

var vf, score, system
const notas = ['a3', 'b3' ,'c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5', 'd5', 'e5', 'f5', 'g5', 'a5', 'b5', 'c6'];
const noteTranslationMap = {
  "c6 treble": "c6", "c6 bass": "e4",
  "b5 treble": "b5", "b5 bass": "d4",
  "a5 treble": "a5", "a5 bass": "c4",
  "g5 treble": "g5", "g5 bass": "b3",
  "f5 treble": "f5", "f5 bass": "a3",
  "e5 treble": "e5", "e5 bass": "g3",
  "d5 treble": "d5", "d5 bass": "f3",
  "c5 treble": "c5", "c5 bass": "e3",
  "b4 treble": "b4", "b4 bass": "d3",
  "a4 treble": "a4", "a4 bass": "c3",
  "g4 treble": "g4", "g4 bass": "b2",
  "f4 treble": "f4", "f4 bass": "a2",
  "e4 treble": "e4", "e4 bass": "g2",
  "d4 treble": "d4", "d4 bass": "f2",
  "c4 treble": "c4", "c4 bass": "e2",
  "b3 treble": "b3", "b3 bass": "d2",
  "a3 treble": "a3", "a3 bass": "c2",
  
};
function emptyClef (){
  resetCanvas()
  system.addStave({ voices: [] }).addClef("treble").addTimeSignature("4/4")
  system.addStave({ voices: [] }).addClef("bass").addTimeSignature("4/4")
  vf.draw()
}
function dibujarNota(nota, clef) {
  try {
    resetCanvas()
    let voice = score.voice(score.notes(`${nota}/w`))
    system.addStave({
        voices: clef === "treble" ? [voice] : []
    }).addClef("treble").addTimeSignature("4/4")

    system.addStave({
        voices: clef === "bass" ? [voice] : []
    }).addClef("bass").addTimeSignature("4/4")

    vf.draw()
  } catch(e) {
    console.log("Si peta ni caso")
  }  
}

function resetCanvas() {
  $('#myCanvas').remove()
  $('#canvasParent').append('<div id="myCanvas"></div>')
  vf = new Vex.Flow.Factory({renderer:  { elementId: 'myCanvas', width: 106, height: 260 }})
  score = vf.EasyScore()
  system = vf.System()
}

function randomNote() {
  return notas[Math.floor(Math.random() * notas.length)]
}

function randomClef(trebleRatio) {
  return Math.random() > trebleRatio ? "treble" : "bass"
}

function getNoteAndOctave(note, clef) {
    return noteTranslationMap[`${note} ${clef}`] || "Invalid input";
}

function getNote(note, clef) {
  return getNoteAndOctave(note, clef)[0]
}

function getOctave(note, clef) {
  return getNoteAndOctave(note, clef)[1]
}

export { dibujarNota, emptyClef, randomNote, randomClef, getNoteAndOctave, getNote, getOctave, resetCanvas };