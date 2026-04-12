import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

function BreathingBubble() {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('READY'); // READY, INHALE, HOLD_1, EXHALE, HOLD_2
    const [timer, setTimer] = useState(0);
    const [duration, setDuration] = useState(60); // Default 1 min
    const [timeLeft, setTimeLeft] = useState(60);

    // Box breathing: INHALE (4s) -> HOLD (4s) -> EXHALE (4s) -> HOLD (4s)
    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsActive(false);
                        API.put('/users/log-activity', { activityType: 'breathing' })
                           .then(res => {
                               if (res.data.newBadges?.length > 0) {
                                   window.dispatchEvent(new CustomEvent('newBadgesEarned', { detail: res.data.newBadges }));
                               }
                           })
                           .catch(console.error);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setPhase('READY');
            setTimer(0);
            setTimeLeft(duration);
        }
        return () => clearInterval(interval);
    }, [isActive, duration]);

    useEffect(() => {
        if (!isActive) {
            setTimeLeft(duration);
        }
    }, [duration, isActive]);

    useEffect(() => {
        if (!isActive) return;
        
        const cycle = timer % 16; // 4 * 4 = 16 seconds cycle
        
        if (cycle < 4) {
            setPhase('INHALE');
        } else if (cycle < 8) {
            setPhase('HOLD_1');
        } else if (cycle < 12) {
            setPhase('EXHALE');
        } else {
            setPhase('HOLD_2');
        }
    }, [timer, isActive]);

    const getInstructionDisplay = () => {
        switch(phase) {
            case 'READY': return 'Ready?';
            case 'INHALE': return 'Breathe In...';
            case 'HOLD_1': return 'Hold...';
            case 'EXHALE': return 'Breathe Out...';
            case 'HOLD_2': return 'Hold...';
            default: return '';
        }
    };

    const getBubbleScale = () => {
        switch(phase) {
            case 'INHALE': return 'scale-150';
            case 'HOLD_1': return 'scale-150';
            case 'EXHALE': return 'scale-100';
            case 'HOLD_2': return 'scale-100';
            default: return 'scale-100';
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl relative overflow-hidden">
            <Link to="/therapy-modules" className="absolute top-6 left-6 text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                <ArrowLeft size={20} /> Back to Modules
            </Link>
            
            <div className="text-center z-10 mb-8">
                <h1 className="text-4xl font-extrabold text-blue-800 mb-4">Box Breathing</h1>
                <p className="text-blue-600 mb-6">Calm your mind and regulate your nervous system.</p>
                
                {/* Duration Selector */}
                {!isActive ? (
                    <div className="flex justify-center gap-3">
                        {[60, 180, 300].map(time => (
                            <button
                                key={time}
                                onClick={() => setDuration(time)}
                                className={`px-4 py-2 rounded-full font-semibold transition-all ${duration === time ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'}`}
                            >
                                {time / 60} Min{time / 60 > 1 ? 's' : ''}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-2xl font-bold text-blue-700 bg-white/50 inline-block px-6 py-2 rounded-full shadow-inner border border-white">
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            <div className="relative flex items-center justify-center w-64 h-64 mb-16">
                {/* The breathing bubble */}
                <div 
                    className={`absolute w-40 h-40 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-60 shadow-2xl transition-all ease-in-out duration-[4000ms] ${getBubbleScale()}`}
                ></div>
                {/* Inner stable bubble */}
                <div className="absolute w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-50 z-10">
                    <span className="text-xl font-bold text-blue-700 transition-opacity duration-500">
                        {getInstructionDisplay()}
                    </span>
                </div>
            </div>

            <button
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white transition-all shadow-xl hover:scale-105 active:scale-95 ${
                    isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isActive ? <><Square size={20} /> Stop Practice</> : <><Play size={20} /> Start Breathing</>}
            </button>
        </div>
    );
}

export default BreathingBubble;