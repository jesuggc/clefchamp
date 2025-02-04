const { Factory, EasyScore, System, Formatter } = Vex.Flow;

var vf, score, system
const notas = ['a3', 'b3' ,'c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5', 'd5', 'e5', 'f5', 'g5', 'a5', 'b5', 'c6'];
const noteTranslationMap = {
  "c6 treble": "c6", "b5 treble": "b5", "a5 treble": "a5", "g5 treble": "g5", "f5 treble": "f5", "e5 treble": "e5", "d5 treble": "d5", "c5 treble": "c5", "b4 treble": "b4", "g4 treble": "g4", "f4 treble": "f4", "e4 treble": "e4", "d4 treble": "d4", "c4 treble": "c4", "b3 treble": "b3", "a3 treble": "a3",
  "c6 bass": "e4", "b5 bass": "d4", "a5 bass": "c4", "g5 bass": "b3", "f5 bass": "a3", "e5 bass": "g3", "d5 bass": "f3", "c5 bass": "e3", "b4 bass": "d3", "g4 bass": "c3", "f4 bass": "b3", "e4 bass": "a3", "d4 bass": "g2", "c4 bass": "f2", "b3 bass": "e2", "a3 bass": "d2"
};

function dibujarNota(nota, clef) {
  resetCanvas()
  try {
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
  vf = new Vex.Flow.Factory({renderer:  { elementId: 'myCanvas', width: 500, height: 260 }})
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

export { dibujarNota, randomNote, randomClef, getNoteAndOctave, getNote, getOctave, resetCanvas };