
import React, { useState, useEffect, useRef } from 'react';

const Pomodoro: React.FC = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  // Use any to avoid "Cannot find namespace 'NodeJS'" error in browser environment
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && time > 0) {
      timerRef.current = setInterval(() => {
        setTime(t => t - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTime(nextMode === 'work' ? 25 * 60 : 5 * 60);
      alert(nextMode === 'work' ? "Break's over! Let's focus." : "Great work! Take a 5-minute break.");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, time, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (time / (mode === 'work' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="36" className="stroke-gray-100 fill-none" strokeWidth="6" />
            <circle 
              cx="40" cy="40" r="36" 
              className={`fill-none transition-all duration-1000 ${mode === 'work' ? 'stroke-emerald-600' : 'stroke-sky-500'}`}
              strokeWidth="6"
              strokeDasharray={226}
              strokeDashoffset={226 - (226 * (100 - progress)) / 100}
            />
          </svg>
          <span className="absolute font-mono font-bold text-gray-800">{formatTime(time)}</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{mode === 'work' ? 'Focus Session' : 'Short Break'}</h3>
          <p className="text-gray-500 text-sm">Stay productive, keep going.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggleTimer}
          className={`px-8 py-3 rounded-2xl font-bold transition-all transform active:scale-95 ${
            isActive 
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
              : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700'
          }`}
        >
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button
          onClick={resetTimer}
          className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Pomodoro;
