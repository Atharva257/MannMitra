import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Heart, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

function GratitudeJournal() {
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState('');
    const [streak, setStreak] = useState(0);

    const checkAndSetStreak = (savedEntries) => {
        if (savedEntries.length === 0) return setStreak(0);
        
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let dateToCheck = new Date(today);
        
        // Group entries by date
        const datesWithEntries = new Set(savedEntries.map(e => {
            const date = new Date(e.timestamp);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        }));

        // Allow continuing streak if missed today but had one yesterday
        if (datesWithEntries.has(today.getTime()) || datesWithEntries.has(today.getTime() - 86400000)) {
            while (datesWithEntries.has(dateToCheck.getTime()) || currentStreak === 0) {
                if (datesWithEntries.has(dateToCheck.getTime())) {
                    currentStreak++;
                }
                // move back 1 day
                dateToCheck.setDate(dateToCheck.getDate() - 1);
            }
        }
        
        setStreak(currentStreak);
    };

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('mannmitra_gratitude_entries') || '[]');
        setEntries(savedEntries);
        checkAndSetStreak(savedEntries);
    }, []);

    const handleSave = () => {
        if (!newEntry.trim()) return;

        const entry = {
            id: Date.now().toString(),
            text: newEntry,
            timestamp: new Date().toISOString()
        };

        const updatedEntries = [entry, ...entries];
        setEntries(updatedEntries);
        localStorage.setItem('mannmitra_gratitude_entries', JSON.stringify(updatedEntries));
        setNewEntry('');
        checkAndSetStreak(updatedEntries);
        API.put('/users/log-activity', { activityType: 'journal' })
            .then(res => {
                if (res.data.newBadges?.length > 0) {
                    window.dispatchEvent(new CustomEvent('newBadgesEarned', { detail: res.data.newBadges }));
                }
            })
            .catch(console.error);
    };

    const formatDate = (isoString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
        return new Date(isoString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 min-h-[80vh]">
            <Link to="/therapy-modules" className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors mb-4">
                <ArrowLeft size={20} /> Back to Modules
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Input Section */}
                <div className="w-full md:w-2/3 bg-white p-8 rounded-[2rem] shadow-sm border border-pink-50">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="p-3 bg-pink-100 text-pink-500 rounded-full">
                            <Heart size={24} className="fill-current" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-800">Gratitude Journal</h1>
                            <p className="text-gray-500">Focus on the good. What made you smile today?</p>
                        </div>
                    </div>

                    <textarea
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        placeholder="I am grateful for..."
                        className="w-full p-4 h-32 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-pink-300 focus:ring-0 outline-none transition-colors mb-4 resize-none text-gray-700"
                    ></textarea>

                    <button
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-colors font-bold shadow-lg shadow-pink-200"
                    >
                        <Save size={20} /> Save Entry
                    </button>
                </div>

                {/* Stats Section */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-8 rounded-[2rem] text-white shadow-xl text-center">
                        <Award size={48} className="mx-auto mb-4 opacity-90" />
                        <div className="text-6xl font-black mb-2">{streak}</div>
                        <p className="text-yellow-100 font-medium">Day Streak</p>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                        <Calendar size={32} className="mx-auto mb-3 text-blue-400" />
                        <div className="text-3xl font-black text-gray-800 mb-1">{entries.length}</div>
                        <p className="text-gray-500 text-sm">Total Entries</p>
                    </div>
                </div>

            </div>

            {/* Entries List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-6">Past Entries</h3>
                {entries.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl text-gray-400 italic">
                        Your journal is empty. Start by adding a thought above!
                    </div>
                ) : (
                    entries.map(entry => (
                        <div key={entry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 hover:border-pink-100 transition-colors text-left flex flex-col items-start w-full">
                            <p className="text-gray-700 text-lg mb-3">{entry.text}</p>
                            <span className="text-xs text-gray-400 tracking-wider font-semibold w-full text-right">
                                {formatDate(entry.timestamp)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default GratitudeJournal;