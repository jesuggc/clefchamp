 const GAME_CONFIG = {
    TRIAL: {
        ROUNDS: 20,
        CLEF_PROB: 0,
        EXPERIENCE: 0,
        PERFORMANCE: {
            PERFECT: { THRESHOLD: 1000, COLOR: 'rgb(255, 251, 0)', TITLE: 'Perfecto' },
            EXCELLENT: { THRESHOLD: 2000, COLOR: 'rgb(174, 0, 255)', TITLE: 'Excelente' },
            GREAT: { THRESHOLD: 4000, COLOR: 'rgb(0, 162, 255)', TITLE: 'Genial' },
            GOOD: { THRESHOLD: 8000, COLOR: 'rgb(0, 255, 55)', TITLE: 'Bien' },
            OK: { THRESHOLD: Infinity, COLOR: 'rgb(255, 102, 0)', TITLE: 'Ok' }
        }
    },
    EASY: {
        ROUNDS: 15,
        CLEF_PROB: 0,
        EXPERIENCE: 10,
        PERFORMANCE: {
            PERFECT: { THRESHOLD: 1000, COLOR: 'rgb(255, 251, 0)', TITLE: 'Perfecto' },
            EXCELLENT: { THRESHOLD: 2000, COLOR: 'rgb(174, 0, 255)', TITLE: 'Excelente' },
            GREAT: { THRESHOLD: 4000, COLOR: 'rgb(0, 162, 255)', TITLE: 'Genial' },
            GOOD: { THRESHOLD: 8000, COLOR: 'rgb(0, 255, 55)', TITLE: 'Bien' },
            OK: { THRESHOLD: Infinity, COLOR: 'rgb(255, 102, 0)', TITLE: 'Ok' }
        }
    },
    NORMAL: {
        ROUNDS: 20,
        CLEF_PROB: 0.25,
        EXPERIENCE: 17,
        PERFORMANCE: {
            PERFECT: { THRESHOLD: 1000, COLOR: 'rgb(255, 251, 0)', TITLE: 'Perfecto' },
            EXCELLENT: { THRESHOLD: 2000, COLOR: 'rgb(174, 0, 255)', TITLE: 'Excelente' },
            GREAT: { THRESHOLD: 4000, COLOR: 'rgb(0, 162, 255)', TITLE: 'Genial' },
            GOOD: { THRESHOLD: 8000, COLOR: 'rgb(0, 255, 55)', TITLE: 'Bien' },
            OK: { THRESHOLD: Infinity, COLOR: 'rgb(255, 102, 0)', TITLE: 'Ok' }
        }
    },
    HARD: {
        ROUNDS: 30,
        CLEF_PROB: 0.5,
        EXPERIENCE: 35,
        PERFORMANCE: {
            PERFECT: { THRESHOLD: 1000, COLOR: 'rgb(255, 251, 0)', TITLE: 'Perfecto' },
            EXCELLENT: { THRESHOLD: 2000, COLOR: 'rgb(174, 0, 255)', TITLE: 'Excelente' },
            GREAT: { THRESHOLD: 4000, COLOR: 'rgb(0, 162, 255)', TITLE: 'Genial' },
            GOOD: { THRESHOLD: 8000, COLOR: 'rgb(0, 255, 55)', TITLE: 'Bien' },
            OK: { THRESHOLD: Infinity, COLOR: 'rgb(255, 102, 0)', TITLE: 'Ok' }
        }
    }
};

function getConfig(difficulty) {
    return GAME_CONFIG[difficulty];
}


export { getConfig }