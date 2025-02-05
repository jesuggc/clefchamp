export class Cronometro {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
    }

    start() {
        if (this.timerInterval) return;
        this.startTime = Date.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
        }, 10);
    }

    pause() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.updateDisplay();
    }

    getTime() {
        return this.elapsedTime;
    }

    updateDisplay() {
        const totalMilliseconds = this.elapsedTime;
        const minutes = Math.floor(totalMilliseconds / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((totalMilliseconds % 60000) / 1000).toString().padStart(2, '0');
        const milliseconds = Math.floor((totalMilliseconds % 1000) / 10).toString().padStart(2, '0');
        this.displayElement.textContent = `${minutes}:${seconds}:${milliseconds}`;
    }
}