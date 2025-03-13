import { useEffect, useState, useRef } from 'react';
import Timer from './Timer';

function Nitadoro() {

    // States the timer can be in
    const state = {
        WORKING: "working",
        PAUSED: "paused",
        BREAKING: "breaking",
        LIMBO: "limbo",
    }

    // Variables
    const [timerState, setTimerState] = useState(state.LIMBO);
    const [shortBreak, setShortBreak] = useState(5);
    const [longBreak, setLongBreak] = useState(10);
    const [nitadoro, setNitadoro] = useState(15);
    const breakCount = useRef(0);
    const hadBreakYet = useRef(true);
    const previousTimerState = useRef(null);
    const nextTimerState = useRef(null);
    const [time, setTime] = useState(null);
    const timer = useRef(new Timer(ring, setTime));

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
            previousTimerState.current = timerState;
            timer.current.pauseTimer();
            setTimerState(state.PAUSED);
        } catch (error) {
            console.log(error.message);
        }
    }

    /** 
     * Resumes the timer
     */
    function resumeTimer() {
        try {
            timer.current.resumeTimer();
            setTimerState(previousTimerState.current)
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * Resets the timer
     */
    function resetTimer() {
        timer.current = new Timer(ring, setTime);
        breakCount.current = 0;
        hadBreakYet.current = true;
        previousTimerState.current = null;
        setTimerState(state.NOT_STARTED);
        configNextTimer();
    }


    /**
     * Starts the next timer in the Nitadoro sequence
     */
    function startNextTimer() {
        try {
            if (timer.current.counting) {
                throw new Error("Timer is already running")
            }
            if (nextTimerState.current === state.WORKING) {
                setTimerState(state.WORKING)
                hadBreakYet.current = false;
                timer.current.startTimer();;
            } else if (nextTimerState.current === state.BREAKING) {
                setTimerState(state.BREAKING);
                hadBreakYet.current = true;
                breakCount.current++;
                timer.current.startTimer();
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
            timer.current.time = nitadoro;
            nextTimerState.current = state.WORKING;
        } else if (!hadBreakYet.current) {
            if (breakCount.current < 3) {
                timer.current.time = shortBreak;
                nextTimerState.current = state.BREAKING;
            } else {
                timer.current.time = longBreak;
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
        setTimerState(state.LIMBO)
        configNextTimer();
    }

    return (
        <div className="nitadoro">
            <p>{timerState}</p>
            <p>{minutes > 9 ? minutes : `0${minutes}`}:{seconds > 9 ? seconds : `0${seconds}`}</p>
            <button onClick={startNextTimer}>start</button>
            <button onClick={pauseTimer}>pause</button>
            <button onClick={resumeTimer}>resume</button>
            <button onClick={resetTimer}>reset</button>
        </div>
    )
}

export default Nitadoro;