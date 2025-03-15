import { useEffect, useState, useRef } from 'react';
import Timer from './Timer';

function NitadoroTimer() {

    // States the timer can be in
    const state = {
        WORKING: "working",
        PAUSED: "paused",
        BREAKING: "breaking",
        LIMBO: "limbo",
    }

    // Text for multibutton
    const multiButtonOpt = {
        START: "Start",
        RESUME: "Resume",
        PAUSE: "Pause",
    }

    // Variables
    const timerState = useRef(state.LIMBO);
    const shortBreak = useRef(300);
    const longBreak = useRef(1200);
    const nitadoro = useRef(1500);
    const breakCount = useRef(0);
    const hadBreakYet = useRef(true);
    const previousTimerState = useRef(null);
    const nextTimerState = useRef(null);
    const [time, setTime] = useState(0);
    const timer = useRef(new Timer(ring, setTime));
    const [multiButton, setMultiButton] = useState(multiButtonOpt.START);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    useEffect(() => {
        configNextTimer();
    }, []);
    

    /** 
     * Pauses the timer 
     */
    function pauseTimer() {
        try {
            previousTimerState.current = timerState.current;
            timer.current.pause();
            timerState.current = state.PAUSED;
        } catch (error) {
            console.log(error.message);
        }
    }

    /** 
     * Resumes the timer
     */
    function resumeTimer() {
        try {
            timer.current.resume();
            timerState.current = previousTimerState.current;
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * Resets the timer
     */
    function resetTimer() {
        timer.current.reset();
        breakCount.current = 0;
        hadBreakYet.current = true;
        previousTimerState.current = null;
        timerState.current = state.LIMBO;
        setMultiButton(multiButtonOpt.START);
        configNextTimer();
    }


    /**
     * Starts the next timer in the Nitadoro sequence
     */
    function startNextTimer() {
        try {
            if (timer.current.isCounting) {
                throw new Error("Timer is already running")
            }
            if (nextTimerState.current === state.WORKING) {
                timerState.current = state.WORKING;
                hadBreakYet.current = false;
                timer.current.start();;
            } else if (nextTimerState.current === state.BREAKING) {
                timerState.current = state.BREAKING;
                hadBreakYet.current = true;
                breakCount.current++;
                timer.current.start();
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * Configures the next timer to be started in the Nitadoro sequence.
     * - If the initial timer hasn't been started or a break has recently finished,
     * a work timer will be next.
     * - If a break hasn't been had yet, a break timer will be next. If it's the fourth break
     * in the sequence, a long break will start. Otherwise a short break.
     */
    function configNextTimer() {
        if (hadBreakYet.current) {
            timer.current.time = nitadoro.current;
            nextTimerState.current = state.WORKING;
        } else if (!hadBreakYet.current) {
            if (breakCount.current < 3) {
                timer.current.time = shortBreak.current;
                nextTimerState.current = state.BREAKING;
            } else {
                timer.current.time = longBreak.current;
                breakCount.current = 0;
                nextTimerState.current = state.BREAKING;
            }

        }
        setTime(timer.current.time);
    }

    /**
     * Alerts the user that the timer has finished 
     */
    function ring() {
        alert("Timer done");
        timerState.current = state.LIMBO;
        setMultiButton(multiButtonOpt.START);
        configNextTimer();
    }

    function handleMultiButton() {
        switch(timerState.current) {
            case state.BREAKING:
                pauseTimer();
                setMultiButton(multiButtonOpt.RESUME);
                break;
            case state.LIMBO:
                startNextTimer();
                setMultiButton(multiButtonOpt.PAUSE);
                break;
            case state.PAUSED:
                resumeTimer();
                setMultiButton(multiButtonOpt.PAUSE);
                break;
            case state.WORKING:
                pauseTimer();
                setMultiButton(multiButtonOpt.RESUME);
                break;
        }
    }

    return (
        <div className="nitadoro">
            <p>{minutes > 9 ? minutes : `0${minutes}`}:{seconds > 9 ? seconds : `0${seconds}`}</p>
            <button onClick={handleMultiButton}>{multiButton}</button>
            <button onClick={resetTimer}>reset</button>
        </div>
    )
}

export default NitadoroTimer;