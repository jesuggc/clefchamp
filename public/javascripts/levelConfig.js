const TRIAL_PERFORMANCE = {
    PERFECT: {
        THRESHOLD: 1000,
        COLOR: 'rgb(255, 251, 0)',
        TITLE: 'Perfecto'
    },
    EXCELLENT: {
        THRESHOLD: 2000,
        COLOR: 'rgb(174, 0, 255)',
        TITLE: 'Excelente'
    },
    GREAT: {
        THRESHOLD: 4000,
        COLOR: 'rgb(0, 162, 255)',
        TITLE: 'Genial'
    },
    GOOD: {
        THRESHOLD: 8000,
        COLOR: 'rgb(0, 255, 55)',
        TITLE: 'Bien'
    },
    OK: {
        THRESHOLD: Infinity,
        COLOR: 'rgb(255, 102, 0)',
        TITLE: 'Ok'
    }
};

const EASY_PERFORMANCE = {
    PERFECT: {
        THRESHOLD: 1000,
        COLOR: 'rgb(255, 251, 0)',
        TITLE: 'Perfecto'
    },
    EXCELLENT: {
        THRESHOLD: 2000,
        COLOR: 'rgb(174, 0, 255)',
        TITLE: 'Excelente'
    },
    GREAT: {
        THRESHOLD: 4000,
        COLOR: 'rgb(0, 162, 255)',
        TITLE: 'Genial'
    },
    GOOD: {
        THRESHOLD: 8000,
        COLOR: 'rgb(0, 255, 55)',
        TITLE: 'Bien'
    },
    OK: {
        THRESHOLD: Infinity,
        COLOR: 'rgb(255, 102, 0)',
        TITLE: 'Ok'
    }
};

const NORMAL_PERFORMANCE = {
    PERFECT: {
        THRESHOLD: 1000,
        COLOR: 'rgb(255, 251, 0)',
        TITLE: 'Perfecto'
    },
    EXCELLENT: {
        THRESHOLD: 2000,
        COLOR: 'rgb(174, 0, 255)',
        TITLE: 'Excelente'
    },
    GREAT: {
        THRESHOLD: 4000,
        COLOR: 'rgb(0, 162, 255)',
        TITLE: 'Genial'
    },
    GOOD: {
        THRESHOLD: 8000,
        COLOR: 'rgb(0, 255, 55)',
        TITLE: 'Bien'
    },
    OK: {
        THRESHOLD: Infinity,
        COLOR: 'rgb(255, 102, 0)',
        TITLE: 'Ok'
    }
};
const HARD_PERFORMANCE = {
    PERFECT: {
        THRESHOLD: 1000,
        COLOR: 'rgb(255, 251, 0)',
        TITLE: 'Perfecto'
    },
    EXCELLENT: {
        THRESHOLD: 2000,
        COLOR: 'rgb(174, 0, 255)',
        TITLE: 'Excelente'
    },
    GREAT: {
        THRESHOLD: 4000,
        COLOR: 'rgb(0, 162, 255)',
        TITLE: 'Genial'
    },
    GOOD: {
        THRESHOLD: 8000,
        COLOR: 'rgb(0, 255, 55)',
        TITLE: 'Bien'
    },
    OK: {
        THRESHOLD: Infinity,
        COLOR: 'rgb(255, 102, 0)',
        TITLE: 'Ok'
    }
};

const TRIAL_CLEF = 0
const TRIAL_ROUNDS = 20

const EASY_CLEF = 0
const EASY_ROUNDS = 10

const NORMAL_CLEF = 0.25
const NORMAL_ROUNDS = 45

const HARD_CLEF = 0.5
const HARD_ROUNDS = 80

function getTrialConfig(difficulty) {
    if (difficulty === "TRIAL") return { ROUNDS: TRIAL_ROUNDS, CLEF_PROB: TRIAL_CLEF, PERFORMANCE: TRIAL_PERFORMANCE };
    if (difficulty === "EASY") return { ROUNDS: EASY_ROUNDS, CLEF_PROB: EASY_CLEF, PERFORMANCE: EASY_PERFORMANCE };
    if (difficulty === "NORMAL") return { ROUNDS: NORMAL_ROUNDS, CLEF_PROB: NORMAL_CLEF, PERFORMANCE: NORMAL_PERFORMANCE };
    return { ROUNDS: HARD_ROUNDS, CLEF_PROB: HARD_CLEF, PERFORMANCE: HARD_PERFORMANCE };
}


export { getTrialConfig }