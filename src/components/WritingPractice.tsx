import React, { useState, useRef, useEffect, useCallback } from 'react';
import { alphabet } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';

interface WritingPracticeProps {
  darkMode: boolean;
  soundEnabled: boolean;
  onBack: () => void;
  onAwardXP: (amount: number) => void;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

export default function WritingPractice({ darkMode, soundEnabled, onBack, onAwardXP }: WritingPracticeProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [brushSize, setBrushSize] = useState(8);
  const [brushColor, setBrushColor] = useState('#f59e0b');
  const [hasPracticed, setHasPracticed] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const { speak, isSupported } = useSpeech();

  const letter = alphabet[selectedIdx];

  // Dynamic colors list adapting to darkMode
  const defaultColor = darkMode ? '#f8fafc' : '#0f172a';
  const colors = [
    { value: '#f59e0b', name: 'Saffron', bgClass: 'bg-amber-500' },
    { value: '#10b981', name: 'Emerald', bgClass: 'bg-emerald-500' },
    { value: '#3b82f6', name: 'Blue', bgClass: 'bg-blue-500' },
    { value: '#f43f5e', name: 'Rose', bgClass: 'bg-rose-500' },
    { value: defaultColor, name: 'Default', bgClass: darkMode ? 'bg-slate-100' : 'bg-slate-900' }
  ];

  // Redraw all strokes on canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokes.forEach(stroke => {
      if (stroke.points.length < 1) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [strokes]);

  // Canvas sizing — only on mount + resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      redrawCanvas();
    };
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw strokes when they change
  useEffect(() => {
    redrawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes]);

  // Handle letter switch
  const handleLetterChange = (idx: number) => {
    setSelectedIdx(idx);
    setStrokes([]);
    currentStrokeRef.current = null;
    setHasPracticed(false);
    if (soundEnabled && isSupported) {
      speak(alphabet[idx].letter);
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const coord = getCoordinates(e);
    const activeColor = brushColor === '#f8fafc' || brushColor === '#0f172a' ? defaultColor : brushColor;
    const newStroke: Stroke = {
      points: [coord],
      color: activeColor,
      size: brushSize
    };
    currentStrokeRef.current = newStroke;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.arc(coord.x, coord.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = activeColor;
      ctx.fill();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    e.preventDefault();
    const coord = getCoordinates(e);
    const stroke = currentStrokeRef.current;
    const prevCoord = stroke.points[stroke.points.length - 1];
    stroke.points.push(coord);

    // Direct 60fps 2D context drawing without component re-render
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx && prevCoord) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.beginPath();
      ctx.moveTo(prevCoord.x, prevCoord.y);
      ctx.lineTo(coord.x, coord.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      const finishedStroke = currentStrokeRef.current;
      currentStrokeRef.current = null;
      setStrokes(prev => [...prev, finishedStroke]);
      setHasPracticed(true);
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    currentStrokeRef.current = null;
    setStrokes([]);
    setHasPracticed(false);
  };

  const undoLast = () => {
    currentStrokeRef.current = null;
    setStrokes(prev => prev.slice(0, -1));
  };

  // Calculate handwriting stroke accuracy against reference letter stencil
  const [accuracyModal, setAccuracyModal] = useState<{ score: number; grade: string; message: string } | null>(null);

  const evaluateHandwritingAccuracy = () => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Get drawn user canvas data
    const userImageData = ctx.getImageData(0, 0, width, height);
    const userPixels = userImageData.data;

    // 2. Create offscreen canvas for reference letter template with matched typography
    const refCanvas = document.createElement('canvas');
    refCanvas.width = width;
    refCanvas.height = height;
    const refCtx = refCanvas.getContext('2d');
    if (!refCtx) return;

    const fontSize = Math.floor(height * 0.65);
    refCtx.font = `900 ${fontSize}px 'Noto Sans Sinhala', sans-serif`;
    refCtx.textAlign = 'center';
    refCtx.textBaseline = 'middle';
    refCtx.fillStyle = '#000000';
    refCtx.fillText(letter.letter, width / 2, height / 2);

    const refImageData = refCtx.getImageData(0, 0, width, height);
    const refPixels = refImageData.data;

    // 3. Compute overlap metrics
    let refPixelCount = 0;
    let matchCount = 0;
    let userDrawnCount = 0;

    for (let i = 3; i < userPixels.length; i += 4) {
      const isRefDrawn = refPixels[i] > 30; // Alpha threshold
      const isUserDrawn = userPixels[i] > 30;

      if (isRefDrawn) refPixelCount++;
      if (isUserDrawn) userDrawnCount++;
      if (isRefDrawn && isUserDrawn) matchCount++;
    }

    if (refPixelCount === 0 || userDrawnCount === 0) {
      setAccuracyModal({ score: 0, grade: 'Need Drawing', message: 'Please draw inside the box first.' });
      return;
    }

    // Coverage & Precision ratio
    const recall = matchCount / refPixelCount;
    const precision = matchCount / userDrawnCount;
    const f1Score = (2 * precision * recall) / (precision + recall || 1);
    const accuracyPercent = Math.min(100, Math.max(15, Math.round(f1Score * 100 * 1.35)));

    let grade = 'C';
    let message = 'Keep practicing the stroke path!';
    let bonusXP = 10;

    if (accuracyPercent >= 85) {
      grade = 'A+';
      message = 'Outstanding handwriting! Exceptional stroke precision!';
      bonusXP = 25;
    } else if (accuracyPercent >= 70) {
      grade = 'A';
      message = 'Great letter shape! Very clear handwriting.';
      bonusXP = 20;
    } else if (accuracyPercent >= 55) {
      grade = 'B';
      message = 'Good attempt! Try staying closer to the stencil outline.';
      bonusXP = 15;
    }

    setAccuracyModal({ score: accuracyPercent, grade, message });
    onAwardXP(bonusXP);
  };

  const triggerCelebrate = () => {
    if (!hasPracticed) return;
    evaluateHandwritingAccuracy();
  };

  const handlePlaySound = () => {
    if (isSupported) {
      speak(letter.letter);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} py-8 px-4 font-sans`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/30 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className={`p-2.5 rounded-xl transition-all ${
                darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Back to main page"
            >
              ⬅️
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-space">Writing Practice</h1>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>අකුරු ලියන්න පුහුණු වෙමු</p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
            darkMode ? 'bg-amber-950/40 text-amber-400 border border-amber-800/30' : 'bg-amber-100 text-amber-700'
          }`}>
            ✍️ Practice & Learn
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Letters Selector Column */}
          <div className={`rounded-3xl p-4 sm:p-5 border ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          } max-h-[500px] overflow-y-auto space-y-3`}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 px-2">Select a Letter</h2>
            <div className="grid grid-cols-4 gap-2">
              {alphabet.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLetterChange(idx)}
                  role="tab"
                  aria-selected={selectedIdx === idx}
                  aria-label={`Select letter ${item.letter}, pronounced ${item.romanized}`}
                  className={`h-11 sm:h-12 flex flex-col items-center justify-center rounded-xl transition-all font-semibold border ${
                    selectedIdx === idx
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-105'
                      : darkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/50'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="sinhala-text text-sm" lang="si">{item.letter}</span>
                  <span className="text-[9px] opacity-70 leading-none">{item.romanized}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas & Tracing Pad Column */}
          <div className="md:col-span-2 space-y-4">
            <div className={`relative rounded-3xl border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            } p-6 flex flex-col items-center overflow-hidden`}>
              
              {/* Target info */}
              <div className="w-full flex items-center justify-between mb-4">
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                    {letter.type} letter
                  </span>
                  <h3 className="text-lg font-bold font-space">
                    Trace "{letter.letter}" (<span className="italic">{letter.romanized}</span>)
                  </h3>
                </div>
                <button
                  onClick={handlePlaySound}
                  className={`p-2 rounded-xl transition-all ${
                    darkMode ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                  }`}
                  aria-label={`Pronounce letter ${letter.letter}`}
                >
                  🔊 Pronounce
                </button>
              </div>

              {/* Canvas Area */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                
                {/* Background Stencil Guide (HTML behind canvas) */}
                {showGuide && (
                  <div
                    className="absolute inset-0 flex items-center justify-center text-[180px] sm:text-[230px] font-black select-none pointer-events-none text-slate-200 dark:text-slate-800/40 transition-colors font-sans"
                    lang="si"
                    aria-hidden="true"
                  >
                    {letter.letter}
                  </div>
                )}

                {/* Drawing Layer */}
                <canvas
                  ref={canvasRef}
                  role="img"
                  aria-label={`Interactive drawing canvas for tracing Sinhala letter ${letter.letter}`}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  onTouchCancel={stopDrawing}
                  style={{ touchAction: 'none' }}
                  className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
                />
              </div>

              <p className="mt-3 text-xs text-slate-400 text-center italic">
                Draw inside the box using your mouse or touch screen.
              </p>

              {/* Canvas Controls */}
              <div className="w-full mt-6 grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between border-t border-slate-700/20 pt-4">
                
                {/* Colors picker */}
                <div className="flex items-center space-x-2">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setBrushColor(c.value)}
                      aria-label={`Set brush color to ${c.name}`}
                      className={`w-6 h-6 rounded-full ${c.bgClass} border-2 ${
                        brushColor === c.value
                          ? 'border-white ring-2 ring-amber-500 scale-110'
                          : 'border-transparent hover:scale-105'
                      } transition-transform`}
                      title={c.name}
                    />
                  ))}
                </div>

                {/* Brush size */}
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-500">Size:</span>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    value={brushSize}
                    aria-label="Brush stroke thickness"
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-24 accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Action buttons */}
                <div className="col-span-2 sm:col-auto flex items-center justify-end space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowGuide(prev => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      showGuide
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                        : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-800'
                    }`}
                  >
                    {showGuide ? 'Hide Guide' : 'Show Guide'}
                  </button>

                  <button
                    onClick={undoLast}
                    disabled={strokes.length === 0}
                    aria-label="Undo last stroke"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      strokes.length === 0
                        ? 'opacity-40 cursor-not-allowed border-slate-300 dark:border-slate-800 text-slate-400'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    ↩️ Undo
                  </button>

                  <button
                    onClick={clearCanvas}
                    disabled={strokes.length === 0}
                    aria-label="Clear canvas"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      strokes.length === 0
                        ? 'opacity-40 cursor-not-allowed border-slate-300 dark:border-slate-800 text-slate-400'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-500 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    🗑️ Clear
                  </button>
                </div>

              </div>

              {/* Complete Practice Button */}
              <button
                onClick={triggerCelebrate}
                disabled={!hasPracticed}
                className={`w-full mt-6 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 text-sm ${
                  hasPracticed
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.01] active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800/60 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-800 cursor-not-allowed'
                }`}
              >
                <span>Check and Done</span>
                {hasPracticed && <span>✨</span>}
              </button>

            </div>

            {/* Description card */}
            <div className={`p-5 rounded-3xl border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h4 className="font-bold text-sm mb-1">Pronunciation & Guide</h4>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                {letter.audio}
              </p>
            </div>

          </div>
        </div>

        {/* Accuracy Score Results Modal */}
        {accuracyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-label="Handwriting Accuracy Score">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 font-extrabold text-2xl flex items-center justify-center mx-auto border border-amber-500/30">
                {accuracyModal.grade}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {accuracyModal.score}% Accuracy
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {accuracyModal.message}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setAccuracyModal(null);
                    clearCanvas();
                    if (selectedIdx < alphabet.length - 1) {
                      handleLetterChange(selectedIdx + 1);
                    } else {
                      handleLetterChange(0);
                    }
                  }}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20"
                >
                  {selectedIdx < alphabet.length - 1 ? 'Next Letter ➔' : 'Restart Alphabet 🔄'}
                </button>
                <button
                  onClick={() => setAccuracyModal(null)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
