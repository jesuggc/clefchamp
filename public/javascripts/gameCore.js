import { dibujarNota, emptyClef, randomNote, randomClef, getNote, getOctave, resetCanvas } from './vexManager.js';
import { Cronometro } from './cronometro.js';
import { flashBackground, fadeOut, addPointsAnimation, addProgresively, growAndBack, secuencialShow} from './animations.js'
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
        individualTime: 0,
        gameStarted: false,
        streak: 0,
        difficulty: null
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
    initialize() {
        this.current.difficulty = window.location.pathname.split("/")[3].toUpperCase();
        Object.assign(this.config, getConfig(this.current.difficulty));
        
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
            $playAgainDiv: $("#playAgainDiv") 
        };

        // Inicializar cronómetro
        this.cronometro = new Cronometro();
        
        // Mostrar tutorial
        emptyClef();
        new bootstrap.Modal(this.elements.$tutorialModal).show();
        
        // Configurar eventos
        this.setupEventListeners();
    },

    // Configurar eventos
    setupEventListeners() {
        $(document).on("keydown", (event) => this.handleKeyDown(event));
        $(document).on("keyup", (event) => this.handleKeyUp(event));
        this.elements.$startBtn.on("click", () => this.startGame());
        
        // Agregar el evento para volver a jugar
        this.elements.$playAgainBtn.on("click", () => this.resetGame());
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
        this.elements.$startBtn.hide();
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
        this.current.aciertos++;
        this.current.streak++;
        const feedback = this.getFeedback(this.current.individualTime);
        this.elements.$successMessage.text(feedback.TITLE).css("color", feedback.COLOR);
        fadeOut(this.elements.$successMessage);
    },

    // Obtener feedback basado en tiempo de respuesta
    getFeedback(time) {
        if (time < this.config.PERFORMANCE.PERFECT.THRESHOLD) 
            return this.config.PERFORMANCE.PERFECT;
        if (time < this.config.PERFORMANCE.EXCELLENT.THRESHOLD) 
            return this.config.PERFORMANCE.EXCELLENT;
        if (time < this.config.PERFORMANCE.GREAT.THRESHOLD) 
            return this.config.PERFORMANCE.GREAT;
        if (time < this.config.PERFORMANCE.GOOD.THRESHOLD) 
            return this.config.PERFORMANCE.GOOD;
        return this.config.PERFORMANCE.OK;
    },

    // Manejar nota incorrecta
    handleWrongNote(pressedNote) {
        this.current.fallos++;
        this.current.streak = 0;
        $(`.note${pressedNote}`).each((_, ele) => flashBackground(ele, this.config.COLOR_WRONG));
    },

    // Finalizar el juego
    endGame() {
        this.cronometro.pause();
        emptyClef();
        this.openResultDiv();
        if(this.current.difficulty === "TRIAL") setTimeout(() => this.showFidelization(), 500);
        else setTimeout(() => this.showResults(), 500);
    },

    // Abrir div de resultados
    openResultDiv() {
        this.elements.$divResultados.css("height", this.elements.$divFeedback.css("height")).addClass('show');
    },

    // Mostrar resultados
    async showResults() {
        let percentage = Math.round((this.current.aciertos / this.config.ROUNDS) * 100);
        let winExp = true; // Siempre gana experiencia por ahora
        let experienceToAdd = winExp ? this.config.EXPERIENCE : 0;
        
        let levelUp = await this.handleExperience(winExp, experienceToAdd);
        
        this.elements.$experienceSpan.text(
            winExp ? this.config.EXPERIENCE : `Para conseguir experiencia supera el ${this.config.experienceThreshold}%`
        );
        this.elements.$resultSpan.text(percentage + "%");
        this.elements.$resultSpan.css("color", winExp ? this.config.COLOR_CORRECT : this.config.COLOR_WRONG);
        
        let experiencePercentage = (this.userData.locals.experience / (this.userData.locals.experience + this.userData.locals.experienceToNext)) * 100;
        
        setTimeout(() => this.elements.$resultDiv.css('opacity', 1), 500);
        setTimeout(() => this.elements.$experienceDiv.css('opacity', 1), 1000);
        setTimeout(() => this.elements.$totalExpDiv.css('opacity', 1), 1500);
        
        if (levelUp) {
            this.showLevelUpModal();
            setTimeout(() => this.elements.$experienceBar.css("width", "100%"), 2000);
            setTimeout(() => this.elements.$levelSpan.text(this.userData.locals.level), 2600);
            setTimeout(() => this.elements.$experienceBar.css("opacity", 0), 2600);
            setTimeout(() => this.elements.$experienceBar.css("width", "0%"), 2600);
            setTimeout(() => this.elements.$experienceBar.css("opacity", 1), 3200);
            setTimeout(() => this.elements.$experienceBar.css("width", experiencePercentage + "%"), 3200);
        } else {
            setTimeout(() => this.elements.$experienceBar.css("width", experiencePercentage + "%"), 2000);
        }
        
        // Mostrar el botón para volver a jugar
        setTimeout(() => this.elements.$playAgainDiv.css('opacity', 1), 3500);
    },

    showFidelization() {
        let percentage = Math.round((this.current.aciertos / this.config.ROUNDS) * 100);
        // let winExp = true; // Siempre gana experiencia por ahora
        // let experienceToAdd = winExp ? this.config.EXPERIENCE : 0;
        // 
        // let levelUp = await this.handleExperience(winExp, experienceToAdd);
        
        this.elements.$experienceSpan.text(
           "Unete porfa"
        );
        this.elements.$resultSpan.text(percentage + "%");
        
        // let experiencePercentage = (this.userData.locals.experience / (this.userData.locals.experience + this.userData.locals.experienceToNext)) * 100;
        
        setTimeout(() => this.elements.$resultDiv.css('opacity', 1), 500);
        setTimeout(() => this.elements.$experienceDiv.css('opacity', 1), 1000);
        // setTimeout(() => this.elements.$totalExpDiv.css('opacity', 1), 1500);
        
        // if (levelUp) {
        //     this.showLevelUpModal();
        //     setTimeout(() => this.elements.$experienceBar.css("width", "100%"), 2000);
        //     setTimeout(() => this.elements.$levelSpan.text(this.userData.locals.level), 2600);
        //     setTimeout(() => this.elements.$experienceBar.css("opacity", 0), 2600);
        //     setTimeout(() => this.elements.$experienceBar.css("width", "0%"), 2600);
        //     setTimeout(() => this.elements.$experienceBar.css("opacity", 1), 3200);
        //     setTimeout(() => this.elements.$experienceBar.css("width", experiencePercentage + "%"), 3200);
        // } else {
        //     setTimeout(() => this.elements.$experienceBar.css("width", experiencePercentage + "%"), 2000);
        // }
        
        // // Mostrar el botón para volver a jugar
        // setTimeout(() => this.elements.$playAgainDiv.css('opacity', 1), 3500);
    },

    // Manejar la experiencia ganada
    async handleExperience(winExp, experienceToAdd) {
        await this.getLocals();
        let totalExp = this.userData.locals.experience + this.userData.locals.experienceToNext;
        this.userData.locals.experience += experienceToAdd;
        this.userData.locals.experienceToNext -= experienceToAdd;
        let levelUp = this.userData.locals.experienceToNext <= 0;
        
        if (levelUp) {
            await this.getExpNextLevel();
            this.userData.locals.level++;
            this.userData.locals.experienceToNext = this.userData.experienceInNext + this.userData.locals.experienceToNext;
            this.userData.locals.experience -= totalExp;
        }
        
        await this.updateUserLevel(
            this.userData.locals.id,
            this.userData.locals.level,
            this.userData.locals.experience,
            this.userData.locals.experienceToNext
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
            this.elements.$streak.css("opacity", 1);
        } else {
            this.elements.$streak.css("opacity", 0);
        }
        
        growAndBack(this.elements.$divFeedback);
    },

    // Reiniciar el juego (nueva funcionalidad)
    resetGame() {
        // Ocultar resultados
        this.elements.$divResultados.removeClass('show');
        this.elements.$resultDiv.css('opacity', 0);
        this.elements.$experienceDiv.css('opacity', 0);
        this.elements.$totalExpDiv.css('opacity', 0);
        this.elements.$playAgainBtn.hide();
        
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
        
        // Reiniciar interfaz
        this.elements.$progressBar.css("width", "0%");
        this.elements.$streak.css("opacity", 0);
        this.elements.$startBtn.show();
        
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