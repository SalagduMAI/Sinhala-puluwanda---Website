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

interface PracticeItem {
  character: string;
  romanized: string;
  name: string;
  category: 'vowel' | 'consonant' | 'number' | 'word';
  startHint: string;
}

const SINHALA_NUMBERS: PracticeItem[] = [
  { character: '෧', romanized: 'eka (1)', name: 'Number One', category: 'number', startHint: 'Start from top curve, loop clockwise' },
  { character: '෨', romanized: 'deka (2)', name: 'Number Two', category: 'number', startHint: 'Start top-left, curve down and right' },
  { character: '෩', romanized: 'thuna (3)', name: 'Number Three', category: 'number', startHint: 'Start top arch, curve down into base' },
  { character: '෪', romanized: 'hathara (4)', name: 'Number Four', category: 'number', startHint: 'Top loop down to bottom cross' },
  { character: '෫', romanized: 'paha (5)', name: 'Number Five', category: 'number', startHint: 'Start top bar, curve downward' },
  { character: '෬', romanized: 'haya (6)', name: 'Number Six', category: 'number', startHint: 'Clockwise circle with top tail' },
  { character: '෭', romanized: 'hatha (7)', name: 'Number Seven', category: 'number', startHint: 'Top bar, slant down left' },
  { character: '෮', romanized: 'ata (8)', name: 'Number Eight', category: 'number', startHint: 'Figure-eight continuous curve' },
  { character: '෯', romanized: 'namaya (9)', name: 'Number Nine', category: 'number', startHint: 'Top round loop, tail curving right' },
  { character: '෦', romanized: 'binduwa (0)', name: 'Zero', category: 'number', startHint: 'Smooth circular loop counter-clockwise' },
];

const ESSENTIAL_WORDS: PracticeItem[] = [
  { character: 'මම', romanized: 'mama', name: 'I / Me', category: 'word', startHint: 'Write "Ma" twice starting from left' },
  { character: 'අපි', romanized: 'api', name: 'We', category: 'word', startHint: 'Write "A" then "Pa" with Ispilla' },
  { character: 'ඔව්', romanized: 'ov', name: 'Yes', category: 'word', startHint: 'Start "O", end with Hal Va' },
  { character: 'නැහැ', romanized: 'næhæ', name: 'No', category: 'word', startHint: 'Na with Aeda pilla + Ha with Aeda pilla' },
  { character: 'තේ', romanized: 'thē', name: 'Tea', category: 'word', startHint: 'Kombuva before Tha with Hal' },
  { character: 'බත්', romanized: 'bath', name: 'Rice', category: 'word', startHint: 'Write Ba, then Tha with Hal' },
  { character: 'මල්', romanized: 'mal', name: 'Flowers', category: 'word', startHint: 'Write Ma, then La with Hal' },
  { character: 'ගෙදර', romanized: 'gedara', name: 'Home', category: 'word', startHint: 'Kombuva Ga + Da + Ra' },
];

export default function WritingPractice({ darkMode, soundEnabled, onBack, onAwardXP }: WritingPracticeProps) {
  const [activeCategory, setActiveCategory] = useState<'vowel' | 'consonant' | 'number' | 'word'>('vowel');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [brushSize, setBrushSize] = useState(8);
  const [brushColor, setBrushColor] = useState('#f59e0b');
  const [accuracyModal, setAccuracyModal] = useState<{ score: number; grade: string; message: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const { speak, isSupported, speechSpeed, toggleSpeed } = useSpeech();

  // Combine items by category
  const getCategoryItems = (): PracticeItem[] => {
    if (activeCategory === 'number') return SINHALA_NUMBERS;
    if (activeCategory === 'word') return ESSENTIAL_WORDS;
    const filteredAlphabet = alphabet.filter(a => a.type === activeCategory);
    return filteredAlphabet.map(a => ({
      character: a.letter,
      romanized: a.romanized,
      name: a.type === 'vowel' ? 'Vowel' : 'Consonant',
      category: a.type as 'vowel' | 'consonant',
      startHint: a.type === 'vowel' ? 'Start from central loop curving upward' : 'Begin from top hook flowing clockwise'
    }));
  };

  const currentItems = getCategoryItems();
  const currentItem = currentItems[selectedIdx] || currentItems[0] || {
    character: 'අ', romanized: 'a', name: 'Vowel', category: 'vowel', startHint: 'Start from central loop'
  };

  const defaultColor = darkMode ? '#f8fafc' : '#0f172a';
  const colors = [
    { value: '#f59e0b', name: 'Saffron', bgClass: 'bg-amber-500' },
    { value: '#10b981', name: 'Emerald', bgClass: 'bg-emerald-500' },
    { value: '#3b82f6', name: 'Blue', bgClass: 'bg-blue-500' },
    { value: '#f43f5e', name: 'Rose', bgClass: 'bg-rose-500' },
    { value: defaultColor, name: 'Default', bgClass: darkMode ? 'bg-slate-100' : 'bg-slate-900' }
  ];

  // Redraw canvas strokes
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

  // Canvas resize observer
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

  useEffect(() => {
    redrawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes]);

  const handleItemChange = (idx: number) => {
    setSelectedIdx(idx);
    setStrokes([]);
    currentStrokeRef.current = null;
    setAccuracyModal(null);
    if (soundEnabled && isSupported) {
      const item = currentItems[idx];
      if (item) speak(item.character, item.romanized, speechSpeed);
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
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    currentStrokeRef.current = null;
    setStrokes([]);
    setAccuracyModal(null);
  };

  const undoLast = () => {
    currentStrokeRef.current = null;
    setStrokes(prev => prev.slice(0, -1));
  };

  // Animated trace guide demo
  const playTraceDemo = () => {
    if (isDemoPlaying) return;
    setIsDemoPlaying(true);
    clearCanvas();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.28;

    let angle = 0;
    const animatedPoints: Point[] = [];

    const interval = setInterval(() => {
      angle += 0.15;
      const x = cx + Math.cos(angle) * (radius * (0.8 + 0.2 * Math.sin(angle * 2)));
      const y = cy + Math.sin(angle) * (radius * (0.8 + 0.2 * Math.cos(angle * 2)));
      animatedPoints.push({ x, y });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;

      ctx.beginPath();
      if (animatedPoints.length > 0) {
        ctx.moveTo(animatedPoints[0].x, animatedPoints[0].y);
        for (let i = 1; i < animatedPoints.length; i++) {
          ctx.lineTo(animatedPoints[i].x, animatedPoints[i].y);
        }
        ctx.stroke();
      }

      // Draw guide laser dot
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      if (angle >= Math.PI * 4) {
        clearInterval(interval);
        setIsDemoPlaying(false);
      }
    }, 30);
  };

  // Evaluate handwriting accuracy
  const evaluateHandwritingAccuracy = () => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const userImageData = ctx.getImageData(0, 0, width, height);
    const userPixels = userImageData.data;

    const refCanvas = document.createElement('canvas');
    refCanvas.width = width;
    refCanvas.height = height;
    const refCtx = refCanvas.getContext('2d');
    if (!refCtx) return;

    const fontSize = Math.floor(height * (currentItem.character.length > 2 ? 0.35 : 0.65));
    refCtx.font = `900 ${fontSize}px 'Noto Sans Sinhala', sans-serif`;
    refCtx.textAlign = 'center';
    refCtx.textBaseline = 'middle';
    refCtx.fillStyle = '#000000';
    refCtx.fillText(currentItem.character, width / 2, height / 2);

    const refImageData = refCtx.getImageData(0, 0, width, height);
    const refPixels = refImageData.data;

    let refPixelCount = 0;
    let matchCount = 0;
    let userDrawnCount = 0;

    for (let i = 3; i < userPixels.length; i += 4) {
      const isRefDrawn = refPixels[i] > 30;
      const isUserDrawn = userPixels[i] > 30;

      if (isRefDrawn) refPixelCount++;
      if (isUserDrawn) userDrawnCount++;
      if (isRefDrawn && isUserDrawn) matchCount++;
    }

    if (refPixelCount === 0 || userDrawnCount === 0) {
      setAccuracyModal({ score: 0, grade: 'Need Drawing', message: 'Please trace inside the box first.' });
      return;
    }

    const recall = matchCount / refPixelCount;
    const precision = matchCount / userDrawnCount;
    const f1Score = (2 * precision * recall) / (precision + recall || 1);
    const accuracyPercent = Math.min(100, Math.max(20, Math.round(f1Score * 100 * 1.35)));

    let grade = 'C';
    let message = 'Good practice! Try following the stroke path more closely.';
    let bonusXP = 10;

    if (accuracyPercent >= 85) {
      grade = 'A+';
      message = 'Outstanding handwriting! Perfect stroke coverage!';
      bonusXP = 25;
    } else if (accuracyPercent >= 70) {
      grade = 'A';
      message = 'Great letter curvature! Very clear and readable.';
      bonusXP = 20;
    } else if (accuracyPercent >= 50) {
      grade = 'B';
      message = 'Well done! Keep practicing for smooth strokes.';
      bonusXP = 15;
    }

    setAccuracyModal({ score: accuracyPercent, grade, message });
    onAwardXP(bonusXP);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} py-8 px-4 font-sans`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-700/30 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className={`p-2.5 rounded-xl transition-all ${
                darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Back to main page"
            >
              ⬅️ Back
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-space">Sinhala Writing & Stroke Practice</h1>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                අකුරු සහ ඉලක්කම් ලියන්න පුහුණු වෙමු
              </p>
            </div>
          </div>

          {soundEnabled && isSupported && (
            <button
              onClick={toggleSpeed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                speechSpeed === 'slow'
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/40 ring-2 ring-amber-500/20'
                  : darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {speechSpeed === 'slow' ? '🐢 Slow (0.55x)' : '🐇 Normal'}
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {[
            { id: 'vowel', label: '🔤 Vowels (18)' },
            { id: 'consonant', label: '🔡 Consonants (42)' },
            { id: 'number', label: '🔢 Numbers 1-10' },
            { id: 'word', label: '📖 Common Words' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id as any);
                setSelectedIdx(0);
                setStrokes([]);
                setAccuracyModal(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeCategory === tab.id
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                  : darkMode ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Item Selector Column */}
          <div className={`rounded-3xl p-4 sm:p-5 border ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          } max-h-[520px] overflow-y-auto space-y-3`}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-saffron-500 px-1">
              Select Character to Practice:
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {currentItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleItemChange(idx)}
                  className={`h-12 flex flex-col items-center justify-center rounded-xl transition-all font-semibold border ${
                    selectedIdx === idx
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-500 shadow-md scale-105 ring-2 ring-amber-400'
                      : darkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/50'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="sinhala-text text-base font-bold" lang="si">{item.character}</span>
                  <span className="text-[9px] opacity-70 leading-none truncate max-w-full px-1">{item.romanized}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas & Tracing Pad Column */}
          <div className="md:col-span-2 space-y-4">
            <div className={`relative rounded-3xl border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            } p-6 flex flex-col items-center overflow-hidden`}>
              
              {/* Target Character Header */}
              <div className="w-full flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-500">
                    {currentItem.name}
                  </span>
                  <h3 className="text-xl font-bold font-space">
                    Trace "{currentItem.character}" <span className="text-sm font-normal text-slate-400">({currentItem.romanized})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    💡 {currentItem.startHint}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => speak(currentItem.character, currentItem.romanized, speechSpeed)}
                    className="p-2.5 rounded-xl bg-saffron-500/10 hover:bg-saffron-500/20 text-saffron-500 font-bold text-xs transition-all flex items-center gap-1.5"
                    title="Pronounce character"
                  >
                    🔊 Listen
                  </button>
                  <button
                    onClick={playTraceDemo}
                    disabled={isDemoPlaying}
                    className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                    title="Watch stroke animation demo"
                  >
                    ▶️ Demo Guide
                  </button>
                </div>
              </div>

              {/* Tracing Canvas Area */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                
                {/* Background Stencil Guide */}
                {showGuide && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center font-black select-none pointer-events-none text-slate-200 dark:text-slate-800/40 transition-colors font-sans ${
                      currentItem.character.length > 2 ? 'text-7xl sm:text-8xl' : 'text-[170px] sm:text-[210px]'
                    }`}
                    lang="si"
                    aria-hidden="true"
                  >
                    {currentItem.character}
                  </div>
                )}

                {/* Drawing Layer */}
                <canvas
                  ref={canvasRef}
                  role="img"
                  aria-label={`Interactive drawing canvas for tracing Sinhala character ${currentItem.character}`}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                />
              </div>

              {/* Toolbar Controls */}
              <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-700/20">
                {/* Brush size & colors */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Color:</span>
                  <div className="flex gap-1.5">
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setBrushColor(c.value)}
                        className={`w-6 h-6 rounded-full transition-all ${c.bgClass} ${
                          brushColor === c.value ? 'ring-2 ring-offset-2 ring-saffron-500 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-slate-400 ml-2">Size:</span>
                  <input
                    type="range"
                    min={4}
                    max={20}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-16 accent-saffron-500 cursor-pointer"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowGuide(!showGuide)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      showGuide ? 'bg-saffron-500/10 text-saffron-500 border-saffron-500/30' : 'text-slate-400 border-slate-700'
                    }`}
                  >
                    👁️ {showGuide ? 'Hide Guide' : 'Show Guide'}
                  </button>

                  <button
                    onClick={undoLast}
                    disabled={strokes.length === 0}
                    className="p-2 rounded-xl text-xs text-slate-400 hover:text-white border border-slate-700/50 disabled:opacity-30"
                    title="Undo stroke"
                  >
                    ↩️ Undo
                  </button>

                  <button
                    onClick={clearCanvas}
                    className="p-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/30"
                    title="Clear canvas"
                  >
                    🗑️ Clear
                  </button>

                  <button
                    onClick={evaluateHandwritingAccuracy}
                    disabled={strokes.length === 0}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-md shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-40"
                  >
                    ✓ Check Accuracy
                  </button>
                </div>
              </div>

              {/* Accuracy Feedback Banner */}
              {accuracyModal && (
                <div className="mt-4 w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-green-500/10 border border-emerald-500/30 text-center animate-slide-up">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">🏅</span>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-emerald-500">Grade: {accuracyModal.grade}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          {accuracyModal.score}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{accuracyModal.message}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
