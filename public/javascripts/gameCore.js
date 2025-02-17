import { dibujarNota, emptyClef, randomNote, randomClef, getNote, getOctave, resetCanvas } from './vexManager.js';
import { Cronometro } from './cronometro.js';
import { flashBackground, fadeOut, addPointsAnimation, addProgresively, growAndBack, secuencialShow} from './animations.js'
import { getConfig } from './levelConfig.js'


let PERFORMANCE
let CLEF_PROB 
let ROUNDS
let COLOR_CORRECT = "#d7ffb8"
let COLOR_WRONG = "#ffdfe0"
let contador = 0;
let expectedNote = ""
let aciertos = 0
let fallos = 0
let times = []
let individualTimes = []
let individualTime = 0;
let cronometro;
let gameStarted = false
let streak = 0;
let KEYCODE_1 = 'a'
let KEYCODE_2 = 's'
let KEYCODE_3 = 'd'
let KEYCODE_4 = 'f'
let KEYCODE_5 = 'j'
let KEYCODE_6 = 'k'
let KEYCODE_7 = 'l'
let experienceThreshold = 50
let EXPERIENCE
let locals
let experienceInNext
let difficulty = window.location.pathname.split("/")[3].toUpperCase()


// ----
let $startBtn = $("#startBtn")
let $successMessage = $("#successMessage")
let $tutorialModal = $("#tutorialModal")
let $progressBar = $("#progressBar")
let $divFeedback = $("#divFeedback")
let $streak = $("#streak")
let $streakNumber = $("#streakNumber")

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
    ({ ROUNDS, CLEF_PROB, EXPERIENCE, PERFORMANCE } = getConfig(difficulty));
    emptyClef()
    cronometro = new Cronometro()
    new bootstrap.Modal($tutorialModal).show();

    $(document).on("keydown", function (event) {
        if (visualKeyMap[event.key.toLowerCase()]) $(visualKeyMap[event.key.toLowerCase()]).addClass("pressed");

        if (gameStarted && contador < ROUNDS && keyMap[event.key]) {
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

$startBtn.on("click", function() {
    growAndBack($($divFeedback))
    $(this).hide()
    cronometro.start()
    updateGame()
    gameStarted = true
})

function updateGame() {
    if (contador === ROUNDS) {
        endGame()
        return
    }
    let note = randomNote()
    let clef = randomClef(CLEF_PROB)
    dibujarNota(note ,clef )
    expectedNote = getNote(note, clef)
}

function checkCorrect(keyevent) {
    const pressedNote = keyMap[keyevent]
    $(".note"+expectedNote).each((_, ele) => flashBackground(ele, COLOR_CORRECT));
    
    if (pressedNote === expectedNote) handleCorrectNote()
    else handleWrongNote(pressedNote)
    
}

function handleCorrectNote() {
    aciertos++
    streak++
    const feedback = getFeedback(individualTime)
    $($successMessage).text(feedback.TITLE).css("color",feedback.COLOR)
    fadeOut($successMessage)
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
    streak=0
    $(".note"+pressedNote).each((_, ele) => flashBackground(ele, COLOR_WRONG));
}

function endGame() {
    cronometro.pause()
    emptyClef()
    openResultDiv()
    setTimeout(() => {
        showResults()
    }, 500);
    // getRewards()
    // individualTimes.forEach((ele) => console.log(ele))
} 

function openResultDiv() {
    $("#divResultados").css("height", $('#divFeedback').css("height")).addClass('show');
}
async function showResults() {
    let percentage = Math.round((aciertos/ROUNDS)*100)
    let winExp = true
    // let winExp = percentage > experienceThreshold
    let experienceToAdd = winExp ? EXPERIENCE : 0 
    
    await handleExperience(winExp,experienceToAdd)
    
    $("#experienceSpan").text(winExp ? `Has ganado ${EXPERIENCE} experiencia` : "Para conseguir experiencia supera el "+  experienceThreshold + "%")
    $("#resultSpan").text(percentage+"%")
    $("#resultSpan").css("color", winExp ? COLOR_CORRECT : COLOR_WRONG)
    
    
    let experiencePercentage = (locals.experience / (locals.experience + locals.experienceToNext)) * 100
    // let experiencePercentage = 75
    
    setTimeout(() => $("#resultDiv").css('opacity', 1), 500);
    setTimeout(() => $("#experienceDiv").css('opacity', 1), 1000);
    setTimeout(() => $("#totalExpDiv").css('opacity', 1), 1500);
    setTimeout(() => $("#experienceBar").css("width",experiencePercentage + "%") , 12500);
    
    
}

async function handleExperience(winExp, experienceToAdd) {
    await getLocals()
    let totalExp = locals.experience + locals.experienceToNext
    locals.experience += experienceToAdd;
    locals.experienceToNext -= experienceToAdd;
    
    if (locals.experienceToNext <= 0) {
        await getExpNextLevel()
        locals.level++;
        locals.experienceToNext = experienceInNext + locals.experienceToNext;
        locals.experience -= totalExp
    }
    updateUserLevel(locals.id, locals.level, locals.experience, locals.experienceToNext)
}

async function getLocals() {
    try {
        const response1 = await fetch('/users/api/getLocals');
        const data1 = await response1.json();
        locals = data1.locals
    } catch (error) {
        console.error('Error:', error); 
    }
}

  
async function getExpNextLevel() {
    try {  
        const response2 = await fetch(`/play/getExperienceRequired/${(locals.level+2)}`);
        const data2 = await response2.json(); 
        experienceInNext = data2

    } catch (error) {
        console.error('Error:', error); 
    }
} 

async function updateUserLevel(userId, level, experience, experienceToNext) {
    try {
        await fetch('/play/addExperience', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                level: level,
                experience: experience,
                experienceToNext: experienceToNext,
            }),
        });

    } catch (error) {
        console.error('Error:', error.message);
}
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
    $($progressBar).css("width",((contador/ROUNDS)*100) + "%")
    if(streak > 2)  {
        $($streakNumber).text(streak) 
        $($streak).css("opacity",1)
    } else $($streak).css("opacity",0)
    growAndBack($($divFeedback))
}