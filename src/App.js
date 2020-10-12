import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
   const [sessionLength, setSessionLength] = useState(25)
   const [breakLength, setBreakLength] = useState(5)
   const [isPlaying, setIsPlaying] = useState(false)
   const [isSession, setIsSession] = useState(true)
   const [timeLeft, setTimeLeft] = useState(25 * 60)

   const audio = new Audio('beep.wav')

   // functions
   const handleIncrement = (type, length, increment) => {
      if (isPlaying) return
      if (increment > 0 && length === 60) return
      if (increment < 0 && length === 1) return
      type === 'session' ?
         setSessionLength(prevState => {
            if (isSession) {
               setTimeLeft((prevState + increment) * 60)
            }
            return prevState + increment
         })
         :
         setBreakLength(prevState => {
            if (!isSession) {
               setTimeLeft((prevState + increment) * 60)
            }
            return prevState + increment
         })
   }

   const handleReset = () => {
      setIsPlaying(false)
      setBreakLength(5)
      setSessionLength(25)
      setTimeLeft(25 * 60)
      setIsSession(true)
   }

   const handlePlay = () => {
      setIsPlaying(!isPlaying)
   }

   const minutes = Math.floor(timeLeft / 60)
   const displayMinutes = minutes.toString().length === 1 ? `0${minutes}` : minutes
   const seconds = (timeLeft % 60)
   const displaySeconds = seconds.toString().length === 1 ? `0${seconds}` : seconds

   useEffect(() => {
      if (timeLeft === 0) {
         isSession ? setTimeLeft(breakLength * 60) : setTimeLeft(sessionLength * 60)
         setIsSession(!isSession)
         audio.play()
      }
      const timer = setTimeout(() => {
         if (!isPlaying) return
         setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
   })

   return (
      <div className="App">
         <header>25 + 5 Clock</header>
         <div className="session-break">
            <div className="break">
               <div id="break-label">Break Length</div>
               <div className="controls">
                  <div id="break-decrement" onClick={() => handleIncrement('break', breakLength, -1)} ><i className="fas fa-arrow-circle-down"></i></div>
                  <div id="break-length">{breakLength}</div>
                  <div id="break-increment" onClick={() => handleIncrement('break', breakLength, 1)}><i className="fas fa-arrow-circle-up"></i></div>
               </div>
            </div>

            <div className="session">
               <div id="session-label">Session Length</div>
               <div className='controls'>
                  <div id="session-decrement" onClick={() => handleIncrement('session', sessionLength, -1)}><i className="fas fa-arrow-circle-down"></i></div>
                  <div id="session-length">{sessionLength}</div>
                  <div id="session-increment" onClick={() => handleIncrement('session', sessionLength, 1)} > <i className="fas fa-arrow-circle-up"></i></div>
               </div>
            </div>

         </div>

         {/* Timer */}
         <div className="timer">
            <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>

            <div id="time-left">{displayMinutes}:{displaySeconds}</div>
            <audio id="beep" src="/public/beep.wav"></audio>
         </div>
         <div className="timer-controls">
            <div id="start_stop" onClick={handlePlay}>{!isPlaying ? <i className="fas fa-play-circle"></i> : <i className="fas fa-pause-circle"></i>}</div>
            <div id="reset" onClick={handleReset}><i className="fas fa-history"></i></div>
         </div>
      </div>
   );
}

export default App;
