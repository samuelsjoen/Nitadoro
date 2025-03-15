/**
 * A timer object for counting down time
 */
class Timer {
    /**
     * @param {*} ring The function to be executed once timer finishes
     */
    constructor(ring, update) {
        this.counting = false;
        this.timerCount = null;
        this.timerId = null;
        this.ring = ring;
        this.update = update;
    }

    /** Starts the timer */
    start() {
        if (this.counting) {
            throw new Error("Timer already started");
        }
        if (!this.timerCount) {
            throw new Error("Timer duration is not set");
        }
        this.counting = true;

        this.timerId = setInterval(() => {
                this.timerCount--;
                this.update(this.timerCount);
                if (this.timerCount === 0) {
                    this.counting = false;
                    clearInterval(this.timerId);
                    this.ring();
                }
            }, 1000);
    }

    /**
     * Pauses the timer if running
     * @throws {Error} if timer is currently not running
     */
    pause() {
        if (this.counting && this.timerCount != 0) {
            clearInterval(this.timerId);
            this.counting = false;
        } else {
            throw new Error("Unable to pause timer, no timer currently running");
        }
    }

    /**
     * Resumes the timer if it's paused
     * @throws {Error} if timer is already running
     */
    resume() {
        if (!this.counting && this.timerCount > 0) {
            this.start();
        } else {
            throw new Error("Unable to resume timer, timer already running");
        }
    }

    reset() {
        if (this.counting) {
            clearInterval(this.timerId);
        }
        this.counting = false;
        this.timerCount = null;
        this.timerId = null;
    }
    /**
     * @returns the current time of the timer
     */
    get time() {
        return this.timerCount;
    }

    /**
     * Sets the time of the timer
     */
    set time(time) {
        this.timerCount=time;
        this.update(this.timerCount);
    }

    /**
     * @returns a bool describing wether the timer is running or not
     */
    get isCounting() {
        return this.counting;
    }
}

export default Timer;