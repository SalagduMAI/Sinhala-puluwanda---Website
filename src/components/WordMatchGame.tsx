import { useState, useEffect, useCallback, useRef } from 'react';
import { lessons } from '../data/lessons';

interface WordMatchGameProps {
  darkMode: boolean;
  onComplete: () => void;
  onBack: () => void;
}

interface Card {
  id: number;
  text: string;
  pairId: number;
  type: 'sinhala' | 'english';
  isFlipped: boolean;
  isMatched: boolean;
}

export default function WordMatchGame({ darkMode, onComplete, onBack }: WordMatchGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const initGame = useCallback(() => {
    // Pick 6 random words from all lessons
    const allWords = lessons.flatMap(l => l.words);
    const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, 6);

    const cardPairs: Card[] = [];
    shuffled.forEach((word, i) => {
      cardPairs.push({ id: i * 2, text: word.sinhala, pairId: i, type: 'sinhala', isFlipped: false, isMatched: false });
      cardPairs.push({ id: i * 2 + 1, text: word.english, pairId: i, type: 'english', isFlipped: false, isMatched: false });
    });

    // Shuffle cards
    setCards(cardPairs.sort(() => Math.random() - 0.5));
    setSelected([]);
    setMatches(0);
    setMoves(0);
    setTimer(0);
    setIsRunning(false);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleCardClick = (cardId: number) => {
    if (!isRunning) setIsRunning(true);

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || selected.length >= 2) return;

    const newCards = cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setCards(newCards);

    const newSelected = [...selected, cardId];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newSelected;
      const first = newCards.find(c => c.id === firstId)!;
      const second = newCards.find(c => c.id === secondId)!;

      if (first.pairId === second.pairId && first.type !== second.type) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          ));
          const newMatches = matches + 1;
          setMatches(newMatches);
          setSelected([]);

          if (newMatches === 6) {
            setIsRunning(false);
            setIsComplete(true);
            onComplete();
            const stored = localStorage.getItem('sinhala-match-best');
            const currentBest = stored ? parseInt(stored) : null;
            if (!currentBest || timer < currentBest) {
              localStorage.setItem('sinhala-match-best', timer.toString());
              setBestTime(timer);
            }
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
          ));
          setSelected([]);
        }, 800);
      }
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  useEffect(() => {
    const stored = localStorage.getItem('sinhala-match-best');
    if (stored) setBestTime(parseInt(stored));
  }, []);

  if (isComplete) {
    const stars = moves <= 8 ? 3 : moves <= 12 ? 2 : 1;
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center px-4 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
        <div className="max-w-md w-full animate-scale-in">
          <div className={`rounded-3xl p-8 text-center ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-xl'}`}>
            <div className="text-5xl mb-4">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {stars === 3 ? 'Perfect!' : stars === 2 ? 'Great!' : 'Complete!'}
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              You matched all pairs!
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <p className={`text-2xl font-bold ${darkMode ? 'text-saffron-400' : 'text-saffron-600'}`}>{formatTime(timer)}</p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Time</p>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{moves}</p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Moves</p>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <p className={`text-2xl font-bold ${darkMode ? 'text-leaf-400' : 'text-leaf-600'}`}>+30</p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>XP</p>
              </div>
            </div>

            {bestTime !== null && (
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                🏆 Best time: {formatTime(bestTime)}
              </p>
            )}

            <div className="flex gap-3">
              <button onClick={() => initGame()} className="flex-1 px-5 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform">
                Play Again
              </button>
              <button onClick={onBack} className={`flex-1 px-5 py-3 rounded-xl font-semibold ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={onBack} className={`flex items-center gap-2 text-sm mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'} hover:text-saffron-500 transition-colors`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>🃏 Word Match</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-center px-3 py-1.5 rounded-xl ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
              <p className={`text-lg font-bold ${darkMode ? 'text-saffron-400' : 'text-saffron-600'}`}>{formatTime(timer)}</p>
              <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Time</p>
            </div>
            <div className={`text-center px-3 py-1.5 rounded-xl ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
              <p className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{moves}</p>
              <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Moves</p>
            </div>
            <div className={`text-center px-3 py-1.5 rounded-xl ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
              <p className={`text-lg font-bold ${darkMode ? 'text-leaf-400' : 'text-leaf-600'}`}>{matches}/6</p>
              <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Pairs</p>
            </div>
          </div>
        </div>

        <p className={`text-sm mb-6 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Match each Sinhala word with its English translation. Find all 6 pairs!
        </p>

        {/* Card grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched}
              className={`aspect-[4/3] rounded-2xl p-3 flex items-center justify-center text-center transition-all duration-300 ${
                card.isMatched
                  ? 'bg-gradient-to-br from-leaf-400 to-leaf-500 text-white scale-95 opacity-70'
                  : card.isFlipped
                    ? 'bg-gradient-to-br from-saffron-400 to-saffron-600 text-white shadow-lg shadow-saffron-500/20 scale-105'
                    : darkMode
                      ? 'bg-slate-800 border-2 border-slate-700 hover:border-saffron-600 hover:bg-slate-700 text-slate-400'
                      : 'bg-white border-2 border-slate-200 hover:border-saffron-300 hover:shadow-md text-slate-800'
              } ${!card.isFlipped && !card.isMatched ? 'cursor-pointer active:scale-95' : ''}`}
            >
              {card.isFlipped || card.isMatched ? (
                <span className={`font-bold ${card.type === 'sinhala' ? 'sinhala-text text-lg' : 'text-sm'}`}>
                  {card.text}
                </span>
              ) : (
                <span className="text-2xl">❓</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => initGame()} className={`px-4 py-2 rounded-xl text-sm font-medium ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
            🔄 New Game
          </button>
        </div>
      </div>
    </div>
  );
}
