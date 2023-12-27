import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [running, setRunning] = useState('play');
  const [counts, setCounts] = useState(sessionTime*60);
  const [currentTimer, setCurrentTimer] = useState('session');

  // Calculate minutes
  let minutes = Math.floor(counts / 60)
    .toString()
    .padStart(2, '0');

  // Calculate seconds
  let seconds = (counts - minutes * 60).toString().padStart(2, '0');

  // Rerender as sessionTime is changed
  useEffect(() => {
    if (sessionTime > 60){
      setSessionTime(60);
    }
    else if (sessionTime < 1){
      setSessionTime(1);
    }
    if (currentTimer === 'session'){
      setCounts(sessionTime * 60);
    }
  }, [sessionTime, currentTimer]);

  // Rerender as breakTime is changed
  useEffect(() => {
    if (breakTime > 60){
      setBreakTime(60);
    }
    else if (breakTime < 1){
      setBreakTime(1);
    }
    if (currentTimer === 'break'){
      setCounts(breakTime * 60);
    }
  }, [breakTime, currentTimer]);

  // Rerender as counts is changed / Timer functionality
  useEffect(() => {
    if (running === 'play') {
      return;
    }
    const timer =
      counts > 0 && setInterval(() => setCounts(counts - 1), 1000);
    return () => clearInterval(timer);
  }, [counts, running]);

  // Set the colors
  useEffect(()=>{
    if (currentTimer === 'session'){
      document.body.classList.remove('bg-orange');
      document.getElementById('to-bg').classList.remove('bg-bx-orange');
      document.body.classList.add('bg-blue');
      document.getElementById('to-bg').classList.add('bg-bx-blue');
    }
    else if (currentTimer === 'break'){
      document.body.classList.remove('bg-blue');
      document.getElementById('to-bg').classList.remove('bg-bx-blue');
      document.body.classList.add('bg-orange');
      document.getElementById('to-bg').classList.add('bg-bx-orange');
    }
  },[currentTimer])

  // Rerender as timer reaches zero and shift to break/session timers
  useEffect(() => {
    let audio = document.getElementById("beep");
    let timer_label = document.getElementById("timer-label");
    if (counts === 0 && currentTimer === "break"){
      timer_label.innerText = "Prepare to focus!";
      audio.play();
      setTimeout(() => {
        setCurrentTimer('session');
        setCounts(sessionTime*60);
        setRunning('pause');
        timer_label.innerText = "Session";
      }, 4000);
    }
    else if (counts === 0 && currentTimer === "session"){
      timer_label.innerText = "Prepare to relax!";
      audio.play();
      setTimeout(() => {
        setCurrentTimer('break');
        setCounts(breakTime*60);
        setRunning('pause');
        timer_label.innerText = "Break";
      }, 4000);
    }
  }, [counts, currentTimer, breakTime, sessionTime]);

  // Reset timer
  const resetTimer = () => {
    let audio = document.getElementById("beep");
    audio.pause();
    audio.load();
    document.getElementById("timer-label").innerText = "Session";
    setCurrentTimer('session');
    setBreakTime(5);
    setSessionTime(25);
    setCounts(sessionTime*60);
    setRunning('play');
  }

  // Decrement break time
  const decrementBreakTime = () => {
    if (breakTime >= 2){
      setBreakTime((breakTime) => { return breakTime - 1});
    }
  };

  // Increment break time
  const incrementBreakTime = () => {
    if (breakTime <= 59){
      setBreakTime((breakTime) => { return breakTime + 1});
    }
  };

  // Decrement session time
  const decrementSessionTime = () => {
    if (sessionTime >= 2){
      setSessionTime((sessionTime) => { return sessionTime - 1});
    }
  };

  // Increment session time
  const incrementSessionTime = () => {
    if (sessionTime <= 59){
      setSessionTime((sessionTime) => { return sessionTime + 1});
    }
  };

  // Play pause button functionality
  const playPauseButton = () => {
    if (running === 'play') {
      setRunning('pause');
    }
    else{
      setRunning('play');
    }
  }

  return (
    <div>
      <h1 className="text-center">Pomodoro Timer</h1>
      <p className="text-center">-: by Bhargav Jois :-</p>
      <div className="center-flex-column mbl-flex-main">

        {/* Break length panel */}
        <div className="center-flex mbl-flex">
          <div className="center-flex-column break">
            <label id="break-label">Break Length</label>
            <div className="center-flex">
              <button id="break-decrement" onClick={decrementBreakTime}>&darr;</button>
              <label id="break-length" className="value">{breakTime}</label>
              <button id="break-increment" onClick={incrementBreakTime}>&uarr;</button>
            </div>
          </div>

          {/* Session length panel */}
          <div className="center-flex-column session">
            <label id="session-label">Session Length</label>
            <div className="center-flex">
              <button id="session-decrement" onClick={decrementSessionTime}>&darr;</button>
              <label id="session-length" className="value">{sessionTime}</label>
              <button id="session-increment" onClick={incrementSessionTime}>&uarr;</button>
            </div>
          </div>
        </div>

        {/* Timer panel */}
        <div className="center-flex-column timer" id="to-bg">
          <label id="timer-label">Session</label>
          <label id="time-left" className="timer-value">{minutes}:{seconds}</label>
          <div className="center-flex">
            <button id="start_stop" className="main-button" onClick={playPauseButton}><i className={`fa fa-${running} fa-2x`}></i></button>
            <button id="reset" className="main-button" onClick={resetTimer}><i className="fa fa-refresh fa-2x"></i></button>
          </div>
        </div>

        {/* Audio */}
        <audio id="beep" preload='auto' src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    </div>
  );
}

export default App;