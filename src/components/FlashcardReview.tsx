import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { lessons } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';
import { useSoundFX } from '../hooks/useSoundFX';

interface FlashcardReviewProps {
  darkMode: boolean;
  soundEnabled: boolean;
  state: {
    wordsLearned: Record<number, number[]>;
    srsData: Record<string, { interval: number; ease: number; repetitions: number; nextReview: number }>;
  };
  onBack: () => void;
  onReviewWord: (lessonId: number, wordIndex: number, rating: number) => void;
  onAwardXP: (amount: number) => void;
}

export default function FlashcardReview({
  darkMode,
  soundEnabled,
  state,
  onBack,
  onReviewWord,
  onAwardXP
}: FlashcardReviewProps) {
  const [reviewAll, setReviewAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const { speak, isSupported } = useSpeech();
  const { playCardFlip, playCorrect, playIncorrect, playLevelUp } = useSoundFX(soundEnabled);

  // Get all learned words with details
  const learnedWords = useMemo(() => {
    const list: Array<{ lessonId: number; wordIdx: number; sinhala: string; english: string; romanized: string; example?: string; exampleTranslation?: string }> = [];
    Object.entries(state.wordsLearned).forEach(([lIdStr, wordIndices]) => {
      const lessonId = parseInt(lIdStr);
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) return;
      wordIndices.forEach(wordIdx => {
        const word = lesson.words[wordIdx];
        if (word) {
          list.push({
            lessonId,
            wordIdx,
            sinhala: word.sinhala,
            english: word.english,
            romanized: word.transliteration,
            example: word.example,
            exampleTranslation: word.exampleTranslation
          });
        }
      });
    });
    return list;
  }, [state.wordsLearned]);

  // Filter words that are currently due for review
  const dueWords = useMemo(() => {
    const now = Date.now();
    return learnedWords.filter(item => {
      const key = `${item.lessonId}-${item.wordIdx}`;
      const srs = state.srsData?.[key];
      // If no SRS record exists, treat it as due
      if (!srs) return true;
      return srs.nextReview <= now;
    });
  }, [learnedWords, state.srsData]);

  // Active pool depends on selection
  const activePool = reviewAll ? learnedWords : dueWords;
  
  const [sessionStarted, setSessionStarted] = useState(false);
  const poolSnapshotRef = useRef<typeof learnedWords>([]);

  const startSession = (pool: typeof learnedWords) => {
    poolSnapshotRef.current = [...pool];
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionXP(0);
    setSessionCount(0);
    setSessionStarted(true);
  };

  useEffect(() => {
    if (!sessionStarted && activePool.length > 0) {
      startSession(activePool);
    }
  }, [sessionStarted, activePool]);

  const currentCard = sessionStarted ? poolSnapshotRef.current[currentIndex] : undefined;
  const isTransitioningRef = useRef(false);

  const handleFlip = useCallback(() => {
    playCardFlip();
    setIsFlipped(prev => !prev);
  }, [playCardFlip]);

  const handleRate = useCallback((rating: number) => {
    if (!currentCard || isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (rating >= 3) {
      playCorrect();
    } else {
      playIncorrect();
    }

    // Call state updater for SM-2
    onReviewWord(currentCard.lessonId, currentCard.wordIdx, rating);

    // XP calculation: correct rating (>=3) gets +15 XP, incorrect (1 or 2) gets +5 XP for practicing
    const xpEarned = rating >= 3 ? 15 : 5;
    onAwardXP(xpEarned);
    setSessionXP(prev => prev + xpEarned);
    setSessionCount(prev => prev + 1);

    // Flip card back first
    setIsFlipped(false);

    // Wait for card flip animation to finish before changing word
    setTimeout(() => {
      if (currentIndex < poolSnapshotRef.current.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // End of pool reached
        playLevelUp();
        setCurrentIndex(poolSnapshotRef.current.length);
      }
      isTransitioningRef.current = false;
    }, 300);
  }, [currentCard, currentIndex, onAwardXP, onReviewWord, playCorrect, playIncorrect, playLevelUp]);

  const handlePlaySound = useCallback((e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    if (currentCard && isSupported) {
      speak(currentCard.sinhala, currentCard.romanized);
    }
  }, [currentCard, isSupported, speak]);

  // Global keyboard shortcuts for flashcards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handlePlaySound();
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleRate(1);
        } else if (e.key === '2') {
          e.preventDefault();
          handleRate(2);
        } else if (e.key === '3') {
          e.preventDefault();
          handleRate(3);
        } else if (e.key === '4') {
          e.preventDefault();
          handleRate(4);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handlePlaySound, handleRate, isFlipped]);

  const resetSession = () => {
    startSession(activePool);
  };

  // UI rendering states
  if (learnedWords.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} py-12 px-4 flex items-center justify-center font-sans`}>
        <div className={`max-w-md w-full rounded-3xl p-8 border text-center space-y-6 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          <div className="text-6xl animate-bounce">📚</div>
          <h1 className="text-2xl font-bold">No words learned yet</h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
            Study vocabulary words in the Lessons section first to unlock Spaced Repetition reviews!
          </p>
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-200"
          >
            Go to Lessons
          </button>
        </div>
      </div>
    );
  }

  // Session completed view
  if (sessionStarted && currentCard === undefined && poolSnapshotRef.current.length > 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} py-12 px-4 flex items-center justify-center font-sans`}>
        <div className={`max-w-md w-full rounded-3xl p-8 border text-center space-y-6 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          <div className="text-6xl animate-pulse">🎉</div>
          <h1 className="text-2xl font-black font-space">Review Session Finished!</h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
            Excellent work! You successfully reviewed <span className="font-bold text-amber-500">{sessionCount} words</span> and earned <span className="font-bold text-emerald-500">+{sessionXP} XP</span>.
          </p>
          <div className={`p-4 rounded-2xl flex justify-around text-center border ${
            darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="text-xl font-bold text-amber-500">{sessionCount}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Reviewed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-500">+{sessionXP}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">XP Gained</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={onBack}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-200"
            >
              Back to Practice
            </button>
            <button
              onClick={resetSession}
              className={`w-full py-3.5 rounded-2xl font-bold border transition-all ${
                darkMode ? 'hover:bg-slate-800 text-slate-400 border-slate-700' : 'hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Review Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All caught up view (no due cards)
  if (activePool.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} py-12 px-4 flex items-center justify-center font-sans`}>
        <div className={`max-w-md w-full rounded-3xl p-8 border text-center space-y-6 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          <div className="text-6xl">✨</div>
          <h1 className="text-2xl font-bold">You're all caught up!</h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
            No words are currently due for spaced repetition review today. You've memorized everything perfectly!
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => { setReviewAll(true); startSession(learnedWords); }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-200"
            >
              Review All Learned Words ({learnedWords.length})
            </button>
            <button
              onClick={onBack}
              className={`w-full py-3.5 rounded-2xl font-bold border transition-all ${
                darkMode ? 'hover:bg-slate-800 text-slate-400 border-slate-700' : 'hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} py-8 px-4 font-sans`}>
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/30 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className={`p-2.5 rounded-xl transition-all ${
                darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Back to practice menu"
            >
              ⬅️
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-space">Leitner Flashcards</h1>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Card {currentIndex + 1} of {poolSnapshotRef.current.length} {reviewAll ? '(All Mode)' : '(Due Mode)'}
              </p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
            darkMode ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/30' : 'bg-emerald-100 text-emerald-700'
          }`}>
            🎯 Spaced Repetition (SRS)
          </div>
        </div>

        {/* 3D Flip Flashcard */}
        <div 
          onClick={handleFlip}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFlip(); } }}
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? 'Card showing English translation. Click to flip back.' : 'Card showing Sinhala word. Click to flip and reveal translation.'}
          className="relative w-full h-[360px] sm:h-[400px] cursor-pointer group select-none"
          style={{ perspective: '1000px' }}
        >
          <div 
            className="w-full h-full rounded-[32px] transition-transform duration-500 shadow-xl border relative"
            style={{ 
              transformStyle: 'preserve-3d', 
              transform: isFlipped ? 'rotateY(180deg)' : 'none',
              backgroundColor: darkMode ? '#0f172a' : '#ffffff',
              borderColor: darkMode ? '#1e293b' : '#e2e8f0'
            }}
          >
            {/* Front of card */}
            <div 
              className="absolute inset-0 w-full h-full p-8 flex flex-col justify-between items-center rounded-[32px]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                Sinhala word
              </span>

              <div className="text-center space-y-4">
                <h2 className="text-5xl sm:text-6xl font-extrabold tracking-normal text-slate-900 dark:text-white font-sans" lang="si">
                  {currentCard?.sinhala}
                </h2>
                {soundEnabled && (
                  <button
                    onClick={handlePlaySound}
                    className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      darkMode ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                    }`}
                  >
                    <span>🔊 Listen</span>
                  </button>
                )}
              </div>

              <span className="text-xs text-slate-400 font-medium italic animate-pulse">
                Click Card to Reveal Translation
              </span>
            </div>

            {/* Back of card */}
            <div 
              className="absolute inset-0 w-full h-full p-8 flex flex-col justify-between rounded-[32px]"
              style={{ 
                backfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg)',
              }}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Translation
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {currentCard?.romanized}
                </span>
              </div>

              {/* Middle Row (Content) */}
              <div className="space-y-4 text-center my-auto">
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-500 font-space">
                  {currentCard?.english}
                </h3>
                {currentCard?.example && (
                  <div className={`p-4 rounded-2xl text-left text-xs ${
                    darkMode ? 'bg-slate-950 border border-slate-800' : 'bg-slate-50 border border-slate-200'
                  } space-y-1 max-w-sm mx-auto`}>
                    <div className="font-bold text-slate-500">Example:</div>
                    <div className="sinhala-text font-semibold text-slate-800 dark:text-slate-200" lang="si">
                      {currentCard?.example}
                    </div>
                    <div className="text-slate-400 italic">
                      {currentCard?.exampleTranslation}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-xs text-slate-400 text-center font-medium italic">
                How well did you remember this?
              </span>
            </div>

          </div>
        </div>

        {/* Rating Controls (Only visible when card is flipped/reviewed) */}
        <div className={`transition-all duration-300 ${
          isFlipped ? 'opacity-100 pointer-events-auto transform translate-y-0' : 'opacity-30 pointer-events-none transform translate-y-2'
        }`}>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleRate(1)}
              className="py-3 sm:py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-rose-500/10 active:scale-95 transition-all flex flex-col items-center"
            >
              <span>🔴</span>
              <span className="mt-1">Again</span>
            </button>
            <button
              onClick={() => handleRate(2)}
              className="py-3 sm:py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-amber-500/10 active:scale-95 transition-all flex flex-col items-center"
            >
              <span>🟡</span>
              <span className="mt-1">Hard</span>
            </button>
            <button
              onClick={() => handleRate(3)}
              className="py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/10 active:scale-95 transition-all flex flex-col items-center"
            >
              <span>🟢</span>
              <span className="mt-1">Good</span>
            </button>
            <button
              onClick={() => handleRate(4)}
              className="py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/10 active:scale-95 transition-all flex flex-col items-center"
            >
              <span>🔵</span>
              <span className="mt-1">Easy</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
