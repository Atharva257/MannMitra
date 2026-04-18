import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Eraser, Download, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

function MoodCanvas() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#3b82f6'); // default blue
    const [brushSize, setBrushSize] = useState(5);

    const colors = [
        { name: 'Calm Blue', hex: '#3b82f6' },
        { name: 'Peaceful Green', hex: '#22c55e' },
        { name: 'Energetic Yellow', hex: '#facc15' },
        { name: 'Warm Orange', hex: '#f97316' },
        { name: 'Passionate Red', hex: '#ef4444' },
        { name: 'Creative Purple', hex: '#a855f7' },
        { name: 'Deep Black', hex: '#1f2937' },
        { name: 'Eraser', hex: '#ffffff' },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Set white background initially
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Handle responsive canvas size
        const resizeCanvas = () => {
            const container = canvas.parentElement;
            if(container) {
                // Keep drawing content
                const imgData = ctx.getImageData(0,0, canvas.width, canvas.height);
                canvas.width = container.clientWidth;
                canvas.height = Math.max(400, container.clientHeight);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.putImageData(imgData, 0, 0); // Put back the drawing, it might crop
            }
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const startPosition = (e) => {
        setIsDrawing(true);
        draw(e);
    };

    const endPosition = () => {
        setIsDrawing(false);
        canvasRef.current.getContext('2d').beginPath();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const saveCanvas = () => {
        const dataURL = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'my-mood-canvas.png';
        link.href = dataURL;
        link.click();
        API.put('/users/log-activity', { activityType: 'canvas' })
            .then(res => {
                if (res.data.newBadges?.length > 0) {
                    window.dispatchEvent(new CustomEvent('newBadgesEarned', { detail: res.data.newBadges }));
                }
            })
            .catch(console.error);
    };

    return (
        <div className="flex flex-col h-[80vh] bg-gray-50 rounded-3xl overflow-hidden p-6 relative shadow-inner">
            <div className="flex justify-between items-center mb-6">
                <Link to="/therapy-modules" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <ArrowLeft size={20} /> Back
                </Link>
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-800">Mood Canvas</h1>
                    <p className="text-gray-500 text-sm">Express how you feel visually.</p>
                </div>
                <div className="w-20"></div> {/* Spacer for flex balance */}
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full min-h-[400px]">
                {/* Tools Sidebar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6 md:w-64 shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Colors</h3>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setColor(c.hex)}
                                    title={c.name}
                                    className={`w-10 h-10 rounded-full shadow-inner border-2 transition-transform hover:scale-110 ${color === c.hex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}`}
                                    style={{ backgroundColor: c.hex, border: c.hex === '#ffffff' ? '2px solid #e5e7eb' : '' }}
                                >
                                    {c.hex === '#ffffff' && <Eraser size={18} className="m-auto text-gray-400" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Brush Size</h3>
                        <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            value={brushSize} 
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="w-full accent-blue-600"
                        />
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                        <button onClick={clearCanvas} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold">
                            <RotateCcw size={18} /> Clear
                        </button>
                        <button onClick={saveCanvas} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold">
                            <Download size={18} /> Save Artwork
                        </button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startPosition}
                        onMouseUp={endPosition}
                        onMouseOut={endPosition}
                        onMouseMove={draw}
                        onTouchStart={startPosition}
                        onTouchEnd={endPosition}
                        onTouchMove={draw}
                        className="w-full h-full cursor-crosshair touch-none"
                    />
                </div>
            </div>
        </div>
    );
}

export default MoodCanvas;