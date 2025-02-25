const BASE_PERFORMANCE = {
    PERFECT: {
        THRESHOLD: 1000,
        COLOR: 'rgb(255, 251, 0)',
        TITLE: 'Perfecto',
        BASE_POINTS: 5000,
        EXTRA_POINTS:2
    },
    EXCELLENT: {
        THRESHOLD: 2000,
        COLOR: 'rgb(174, 0, 255)',
        TITLE: 'Excelente',
        BASE_POINTS: 4000,
        EXTRA_POINTS:1 
    },
    GREAT: {
        THRESHOLD: 4000,
        COLOR: 'rgb(0, 162, 255)',
        TITLE: 'Genial',
        BASE_POINTS: 2500,
        EXTRA_POINTS:0.75 
    },
    GOOD: {
        THRESHOLD: 8000,
        COLOR: 'rgb(0, 255, 55)',
        TITLE: 'Bien',
        BASE_POINTS: 1500,
        EXTRA_POINTS:0.25 
    },
    OK: {
        THRESHOLD: Infinity,
        COLOR: 'rgb(255, 102, 0)',
        TITLE: 'Ok',
        BASE_POINTS: 1000,
        EXTRA_POINTS:0 
    }
};

const GAME_CONFIG = {
    TRIAL: {
         ROUNDS: 20,
         CLEF_PROB: 0, 
         EXPERIENCE: 0,
         PERFORMANCE: BASE_PERFORMANCE
    },
    EASY: {
         ROUNDS: 15,
         CLEF_PROB: 0, 
         EXPERIENCE: 10,
         PERFORMANCE: BASE_PERFORMANCE
    },
    NORMAL: {
         ROUNDS: 20,
         CLEF_PROB: 0.25, 
         EXPERIENCE: 17,
         PERFORMANCE: BASE_PERFORMANCE
    },
    HARD: {
         ROUNDS: 30,
         CLEF_PROB: 0.5, 
         EXPERIENCE: 35,
         PERFORMANCE: BASE_PERFORMANCE
    }
};

function getConfig(difficulty) {
    return GAME_CONFIG[difficulty];
}

export { getConfig };