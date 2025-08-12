import { dibujarNota, emptyClef, randomNote, randomClef, getNote, getOctave, resetCanvas } from './vexManager.js';
import { Cronometro } from './cronometro.js';
import { flashBackground, fadeOut, addPointsAnimation, addProgresively, growAndBack, secuencialShow, popAnimation} from './animations.js'
import { getConfig } from './levelConfig.js'

const GameState = {
    config: {
        ROUNDS: 0,
        CLEF_PROB: 0,
        EXPERIENCE: 0,
        PERFORMANCE: null,
        COLOR_CORRECT: "#d7ffb8",
        COLOR_WRONG: "#ffdfe0",
        experienceThreshold: 50
    },
    
    current: {
        contador: 0,
        expectedNote: "",
        aciertos: 0,
        fallos: 0,
        times: [],
        individualTimes: [],
        notes: [],
        results: [],
        individualTime: 0,
        gameStarted: false,
        streak: 0,
        difficulty: null,
        points: 0,
        pointsToAdd: 0,
        perfectCounter: 0,
        excellentCounter: 0,
        greatCounter: 0,
        goodCounter: 0,
        okCounter: 0
    },

    elements: {},

    // Mapeo de teclas
    keyMapping: {
        notes: [
            { key: 'a', note: 'c' },
            { key: 's', note: 'd' },
            { key: 'd', note: 'e' },
            { key: 'f', note: 'f' },
            { key: 'j', note: 'g' },
            { key: 'k', note: 'a' },
            { key: 'l', note: 'b' }
        ],
        keyMap: {},
        visualKeyMap: {}
    },

    // Datos de usuario
    userData: {
        locals: null,
        experienceInNext: 0
    },

    // Cronómetro del juego
    cronometro: null,

    // Inicializa el juego
    async initialize() {
        this.current.difficulty = window.location.pathname.split("/")[3].toUpperCase();
        if(this.current.difficulty !== "TRIAL") await this.getLocals()
        Object.assign(this.config, getConfig(this.current.difficulty));
        localStorage.setItem("lastPlayed",this.current.difficulty)
        // Inicializar mapeos de teclas
        this.keyMapping.keyMap = Object.fromEntries(this.keyMapping.notes.map(({ key, note }) => [key, note]));
        this.keyMapping.visualKeyMap = Object.fromEntries(this.keyMapping.notes.map(({ key, note }) => [key, `.note${note}`]));

        // Inicializar referencias a elementos
        this.elements = {
            $startBtn: $("#startBtn"),
            $successMessage: $("#successMessage"),
            $tutorialModal: $("#tutorialModal"),
            $progressBar: $("#progressBar"),
            $divFeedback: $("#divFeedback"),
            $streak: $("#streak"),
            $streakNumber: $("#streakNumber"),
            $divResultados: $("#divResultados"),
            $resultDiv: $("#resultDiv"),
            $experienceDiv: $("#experienceDiv"),
            $totalExpDiv: $("#totalExpDiv"),
            $experienceBar: $("#experienceBar"),
            $levelSpan: $("#levelSpan"),
            $experienceSpan: $("#experienceSpan"),
            $resultSpan: $("#resultSpan"),
            $playAgainBtn: $("#playAgainBtn"), 
            $playAgainDiv: $("#playAgainDiv"),
            $pointsSpan: $("#pointsSpan"),
            $scoreAdded: $("#scoreAdded"),
            $helpBtn: $("#helpBtn"),
            $startAgain: $("#startAgain"),
            $showAgain: $("#showAgain"),
            $createAccountDiv: $("#createAccountDiv"),
            $scoreDiv: $("#scoreDiv"),
            $totalPointsDiv: $("#totalPointsDiv"),
            $totalPointsSpan: $("#totalPointsSpan"),
        };

        // Inicializar cronómetro
        this.cronometro = new Cronometro();
        
        // Mostrar tutorial
        emptyClef();
        
        if (this.current.difficulty === "TRIAL" || this.userData.locals.preferences.showTutorial) new bootstrap.Modal(this.elements.$tutorialModal).show();
        else this.elements.$scoreDiv.removeClass("d-none")
        
        // Configurar eventos
        this.setupEventListeners();
    },
    
    // Configurar eventos
    setupEventListeners() {
        $(document).on("keydown", (event) => this.handleKeyDown(event));
        $(document).on("keyup", (event) => this.handleKeyUp(event));
        this.elements.$startBtn.on("click", () => this.startGame());
        this.elements.$helpBtn.on("click", () => new bootstrap.Modal(this.elements.$tutorialModal).show());
        this.elements.$showAgain.on("click", () => new bootstrap.Modal(this.elements.$tutorialModal).show());
        
        
        $('.notec, .noted, .notee, .notef, .noteg, .notea, .noteb')
        .on('mousedown touchstart', (event) => {
            event.preventDefault(); 
            const noteClass = event.target.className.split(' ')[1]; 
            const note = noteClass.replace('note', ''); 
            
            const keyMap = {
                'c': 'a',
                'd': 's',
                'e': 'd',
                'f': 'f',
                'g': 'j',
                'a': 'k',
                'b': 'l'
            };
            
            const keyEvent = new KeyboardEvent('keydown', {
                key: keyMap[note],
                code: `Key${keyMap[note].toUpperCase()}`,
                keyCode: keyMap[note].charCodeAt(0),
                which: keyMap[note].charCodeAt(0),
                bubbles: true
            });
            
            document.dispatchEvent(keyEvent);
        })
        .on('mouseup mouseleave touchend touchcancel', (event) => {
            event.preventDefault(); // Prevent default behavior
            const noteClass = event.target.className.split(' ')[1];
            const note = noteClass.replace('note', '');
            
            const keyMap = {
                'c': 'a',
                'd': 's',
                'e': 'd',
                'f': 'f',
                'g': 'j',
                'a': 'k',
                'b': 'l'
            };
            
            const keyUpEvent = new KeyboardEvent('keyup', {
                key: keyMap[note],
                code: `Key${keyMap[note].toUpperCase()}`,
                keyCode: keyMap[note].charCodeAt(0),
                which: keyMap[note].charCodeAt(0),
                bubbles: true
            });
            
            document.dispatchEvent(keyUpEvent);
        });
    
        // Agregar el evento para volver a jugar
        this.elements.$playAgainBtn.on("click", () => this.resetGame());
        this.elements.$startAgain.on("click", () => this.resetGame());
    },

    // Manejar evento de tecla presionada
    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        if (this.keyMapping.visualKeyMap[key]) {
            $(this.keyMapping.visualKeyMap[key]).addClass("pressed");
        }

        if (this.current.gameStarted && this.current.contador < this.config.ROUNDS && this.keyMapping.keyMap[key]) {
            this.getTime();
            this.current.contador++;
            this.checkCorrect(key);
            this.updateGame();
            this.updateUI();
        }
        if (event.code === "Space") {
            event.preventDefault();
            if (this.elements.$startBtn.is(":visible")) {
                this.startGame()
            }
            else if (this.current.contador === this.config.ROUNDS) {
                this.resetGame();
            }
        }
    },

    // Manejar evento de tecla liberada
    handleKeyUp(event) {
        const key = event.key.toLowerCase();
        if (this.keyMapping.visualKeyMap[key]) {
            $(this.keyMapping.visualKeyMap[key]).removeClass("pressed");
        }
    },

    // Iniciar el juego
    startGame() {
        growAndBack(this.elements.$divFeedback);
        this.elements.$startBtn.removeClass("d-flex").addClass("d-none");
        this.cronometro.start();
        this.updateGame();
        this.current.gameStarted = true;
    },

    // Actualizar el estado del juego
    updateGame() {
        if (this.current.contador === this.config.ROUNDS) {
            this.endGame();
            return;
        }
        let note = randomNote();
        let clef = randomClef(this.config.CLEF_PROB);
        dibujarNota(note, clef);
        this.current.expectedNote = getNote(note, clef);
        this.current.notes.push(getNote(note,clef) + getOctave(note,clef))
    },

    // Verificar si la nota presionada es correcta
    checkCorrect(keyEvent) {
        const pressedNote = this.keyMapping.keyMap[keyEvent];
        $(`.note${this.current.expectedNote}`).each((_, ele) => flashBackground(ele, this.config.COLOR_CORRECT));
        
        if (pressedNote === this.current.expectedNote) {
            this.handleCorrectNote();
        } else {
            this.handleWrongNote(pressedNote);
        }
    },

    // Manejar nota correcta
    handleCorrectNote() {
        this.current.results.push(true)
        this.current.aciertos++;
        this.current.streak++;
        const feedback = this.getFeedback(this.current.individualTime);
        if (feedback!=this.config.PERFORMANCE.OK )this.current.pointsToAdd = (feedback.BASE_POINTS + feedback.EXTRA_POINTS * (feedback.THRESHOLD  - this.current.individualTime));
        else this.current.pointsToAdd = feedback.BASE_POINTS
        this.current.points += this.current.pointsToAdd
        this.elements.$successMessage.text(feedback.TITLE).css("color", feedback.COLOR);
        fadeOut(this.elements.$successMessage);
    },

    // Obtener feedback basado en tiempo de respuesta
    getFeedback(time) {
        if (time < this.config.PERFORMANCE.PERFECT.THRESHOLD) {
            this.current.perfectCounter++
            return this.config.PERFORMANCE.PERFECT;
        }
        if (time < this.config.PERFORMANCE.EXCELLENT.THRESHOLD) {
            this.current.excellentCounter++
            return this.config.PERFORMANCE.EXCELLENT;
        } 
        if (time < this.config.PERFORMANCE.GREAT.THRESHOLD) {
            this.current.greatCounter++
            return this.config.PERFORMANCE.GREAT;
        } 
        if (time < this.config.PERFORMANCE.GOOD.THRESHOLD) {
            this.current.goodCounter++
            return this.config.PERFORMANCE.GOOD;
        } 
        this.current.okCounter++
        return this.config.PERFORMANCE.OK;
    },

    // Manejar nota incorrecta
    handleWrongNote(pressedNote) {
        this.current.results.push(false)
        this.current.fallos++;
        this.current.streak = 0;
        $(`.note${pressedNote}`).each((_, ele) => flashBackground(ele, this.config.COLOR_WRONG));
        this.current.pointsToAdd = 0
    },

    // Finalizar el juego
    endGame() {
        this.elements.$divFeedback.removeClass("d-flex").addClass("d-none")
        this.cronometro.pause();
        emptyClef();
        this.openResultDiv();
        if(this.current.difficulty === "TRIAL") setTimeout(() => this.showFidelization(), 500);
        else setTimeout(() => this.showResults(), 500);
        this.saveRecords()

    },
    
    // Abrir div de resultados
    openResultDiv() {
        this.elements.$divResultados.removeClass('d-none').addClass('d-flex');
        this.elements.$divResultados.css("height", this.elements.$divFeedback.css("height")).addClass('show');
    },

    // Mostrar resultados
    async showResults() {
        let percentage = Math.round((this.current.aciertos / this.config.ROUNDS) * 100);
        let winExp = percentage >= 50;
        let experienceToAdd = winExp ? this.config.EXPERIENCE : 0;
        this.elements.$totalPointsSpan.text(this.current.points + ' puntos');
        this.elements.$totalPointsDiv.css('opacity', 1)
        let levelUp = await this.handleExperience(winExp, experienceToAdd);
        
        this.elements.$experienceSpan.html(
            winExp ? `+ ${this.config.EXPERIENCE} exp.` : `Para conseguir experiencia supera el ${this.config.experienceThreshold}%`
        );
        this.elements.$resultSpan.text("Has acertado un " + percentage + "%");
        // this.elements.$resultSpan.css("color", winExp ? this.config.COLOR_CORRECT : this.config.COLOR_WRONG);
        
        let experiencePercentage = (this.userData.locals.experience / (this.userData.locals.experience + this.userData.locals.experienceToNext)) * 100;
        
        setTimeout(() => this.elements.$resultDiv.css('opacity', 1), 500);
        setTimeout(() => this.elements.$experienceDiv.css('opacity', 1), 1000);
        setTimeout(() => this.elements.$totalExpDiv.css('opacity', 1), 1500);

        
        if (levelUp) {
            this.showLevelUpModal();
            setTimeout(() => this.elements.$experienceBar.css("width", "100%"), 2000);
            setTimeout(() => this.elements.$levelSpan.text(this.userData.locals.level), 2600);
            setTimeout(() => this.elements.$experienceBar.css('opacity', 0), 2600);
            setTimeout(() => this.elements.$experienceBar.css("width", "0%"), 2600);
            setTimeout(() => this.elements.$experienceBar.css('opacity', 1), 3200);
            setTimeout(() => this.elements.$experienceBar.css("width", experiencePercentage + "%"), 3200);
            setTimeout(() => this.elements.$playAgainDiv.css('opacity', 1), 4200);
        } else {
            setTimeout(() => this.elements.$experienceBar.css("width", experiencePercentage + "%"), 2000);
            setTimeout(() => this.elements.$playAgainDiv.css('opacity', 1), 3000);
        }
        
        // Mostrar el botón para volver a jugar
    },

    showFidelization() {
        let percentage = Math.round((this.current.aciertos / this.config.ROUNDS) * 100);
        this.elements.$resultSpan.html(`¡Nivel completado! Obtuviste un ${percentage}%`);
        this.elements.$experienceSpan.html(`Registrate para guardar tu progreso y poder acceder a más niveles`);
        console.log("Puntuacion " + this.current.points)
        setTimeout(() => this.elements.$resultDiv.css('opacity', 1), 500);
        setTimeout(() => this.elements.$experienceDiv.css('opacity', 1), 1000);
        setTimeout(() => this.elements.$createAccountDiv.css('opacity', 1), 1500);
    },

    // Manejar la experiencia ganada
    async handleExperience(winExp, experienceToAdd) {
        await this.getLocals();
        let locals = this.userData.locals
        let totalExp = this.userData.locals.experience + locals.experienceToNext;
        locals.experience += experienceToAdd;
        locals.experienceToNext -= experienceToAdd;
        let levelUp = locals.experienceToNext <= 0;
        
        if (levelUp) {
            await this.getExpNextLevel();
            locals.level++;
            locals.experienceToNext = this.userData.experienceInNext + locals.experienceToNext;
            locals.experience -= totalExp;
        }
        await this.updateUserLevel(
            locals.id,
            locals.level,
            locals.experience,
            locals.experienceToNext
        );
        
        return levelUp;
    },

    // Obtener datos locales del usuario
    async getLocals() {
        try {
            const response = await fetch('/users/api/getLocals');
            const data = await response.json();
            this.userData.locals = data.locals;
        } catch (error) {
            console.error('Error:', error);
        }
    },

    // Obtener experiencia necesaria para el siguiente nivel
    async getExpNextLevel() {
        try {
            const response = await fetch(`/play/getExperienceRequired/${(this.userData.locals.level + 2)}`);
            const data = await response.json();
            this.userData.experienceInNext = data;
        } catch (error) {
            console.error('Error:', error);
        }
    },

    // Actualizar nivel de usuario en el servidor
    async updateUserLevel(userId, level, experience, experienceToNext) {
        try {
            await fetch('/play/addExperience', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    level,
                    experience,
                    experienceToNext,
                }),
            });
        } catch (error) {
            console.error('Error:', error.message);
        }
    },

    async saveRecords() {
        const userId = this.current.difficulty === "TRIAL" ? -1 : this.userData.locals.id
        await fetch('/play/saveRecords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                dificultad: this.current.difficulty,
                perfecto: this.current.perfectCounter,
                excelente: this.current.excellentCounter,
                genial: this.current.greatCounter,
                bien: this.current.goodCounter,
                ok: this.current.okCounter,
                aciertos: this.current.aciertos,
                fallos: this.current.fallos,
                puntuacion: this.current.points,
                tiemposIndividuales: this.current.individualTimes,
                notas: this.current.notes,
                resultados: this.current.results
            })
        })
        .then(response => response.json())
        .catch(error => console.error('Error al enviar los datos:', error));
    },
    // Mostrar modal de subida de nivel
    showLevelUpModal() {
        // Implementación del modal de nivel
    },

    // Obtener tiempo de respuesta
    getTime() {  
        let totalTime = this.cronometro.getTime();
        this.current.times.push(totalTime);
        if (this.current.contador === 0) {
            this.current.individualTimes.push(totalTime);
            this.current.individualTime = totalTime;
        } else {
            this.current.individualTime = (this.current.times[this.current.contador] - this.current.times[this.current.contador - 1]);
            this.current.individualTimes.push(this.current.individualTime);
        }
    },

    // Actualizar interfaz de usuario
    updateUI() {
        this.elements.$progressBar.css("width", ((this.current.contador / this.config.ROUNDS) * 100) + "%");
        
        if (this.current.streak > 2) {
            this.elements.$streakNumber.text(this.current.streak);
            this.elements.$streak.css('opacity', 1);
        } else {
            this.elements.$streak.css('opacity', 0);
        }
        
        addProgresively(this.elements.$pointsSpan, parseInt(this.elements.$pointsSpan.text()),this.current.points, 200)
        growAndBack(this.elements.$divFeedback);
        
        if(this.current.pointsToAdd > 0) {
            addPointsAnimation(this.elements.$scoreAdded, this.current.pointsToAdd)
            popAnimation(this.elements.$pointsSpan)
        }
        
    },

    
    resetGame() {
        // Ocultar resultados
        this.elements.$divResultados.removeClass('show');
        this.elements.$divResultados.removeClass('d-flex').addClass('d-none')
        this.elements.$divFeedback.removeClass('d-none')
        this.elements.$resultDiv.css('opacity', 0);
        this.elements.$experienceDiv.css('opacity', 0);
        this.elements.$totalExpDiv.css('opacity', 0);
        this.elements.$playAgainDiv.css('opacity', 0);
        
        // Reiniciar estado del juego
        this.current.contador = 0;
        this.current.expectedNote = "";
        this.current.aciertos = 0;
        this.current.fallos = 0;
        this.current.times = [];
        this.current.individualTimes = [];
        this.current.individualTime = 0;
        this.current.gameStarted = false;
        this.current.streak = 0;
        this.current.points = 0;
        this.current.perfectCounter = 0;
        this.current.excellentCounter = 0;
        this.current.greatCounter = 0;
        this.current.goodCounter = 0;
        this.current.okCounter = 0;        
        this.current.notes = [];        
        this.current.results = [];        
        // Reiniciar interfaz
        this.elements.$progressBar.css("width", "0%");
        this.elements.$streak.css('opacity', 0);
        this.elements.$startBtn.removeClass("d-none").addClass("d-flex");
        this.elements.$pointsSpan.text(0)
        // Reiniciar cronómetro
        this.cronometro = new Cronometro();
        
        // Vaciar pentagrama
        emptyClef();
    }
};
// Inicializar el juego cuando el documento esté listo
$(function() {
    GameState.initialize();
});