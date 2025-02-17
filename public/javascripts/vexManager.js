const { Factory, EasyScore, System, Formatter } = Vex.Flow;

var vf, score, system
const notas = ['b3' ,'c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5', 'd5', 'e5', 'f5', 'g5', 'a5', 'b5'];

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
  vf = new Vex.Flow.Factory({renderer:  { elementId: 'myCanvas', width: 106, height: 230 }})
  score = vf.EasyScore()
  system = vf.System()
}

function randomNote() {
  return notas[Math.floor(Math.random() * notas.length)]
}

function randomClef(trebleRatio) {
  return Math.random() > trebleRatio ? "treble" : "bass"
}

function getNote(note, clef) {
  if(clef === "bass") return notaDesplazada(note[0])
  return note[0]
}

function notaDesplazada(nota) {
  const notas = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
  const indice = notas.indexOf(nota);
  if (indice === -1) return null; 
  const nuevaPosicion = (indice + 2) % notas.length;
  return notas[nuevaPosicion];
}

function getOctave(note) {
  return note[1]
}

export { dibujarNota, emptyClef, randomNote, randomClef, getNote, getOctave, resetCanvas };