import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Lesson, QuizQuestion, generateQuiz } from '../data/lessons';
import { useSoundFX } from '../hooks/useSoundFX';
import { useSpeech } from '../hooks/useSpeech';

interface QuizViewProps {
  lesson: Lesson;
  darkMode: boolean;
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export default function QuizView({ lesson, darkMode, onBack, onComplete }: QuizViewProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => generateQuiz(lesson.id));
  const { playCorrect, playIncorrect, playLevelUp } = useSoundFX();
  const { speak, isSupported, speechSpeed } = useSpeech();
  
  const [listeningMode, setListeningMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // For Sentence-Order questions
  const [assembledTiles, setAssembledTiles] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<string[]>([]);

  const hasAnsweredRef = useRef(false);
  const finalScoreRef = useRef(0);

  useEffect(() => {
    setQuestions(generateQuiz(lesson.id));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setShowConfetti(false);
    setAssembledTiles([]);
    hasAnsweredRef.current = false;
    finalScoreRef.current = 0;
  }, [lesson.id]);

  const currentQuestion = questions[currentIndex];

  // Initialize available tiles on question change & auto-play audio for listening questions or listening mode
  useEffect(() => {
    hasAnsweredRef.current = false;
    setSelectedAnswer(null);
    setIsCorrect(null);

    if (currentQuestion?.type === 'sentence-order' && currentQuestion.orderTiles) {
      setAvailableTiles([...currentQuestion.orderTiles]);
      setAssembledTiles([]);
    }

    const audioText = currentQuestion?.audioPrompt || currentQuestion?.questionSinhala;
    if ((currentQuestion?.type === 'audio-listen' || listeningMode) && audioText && isSupported) {
      const timer = setTimeout(() => {
        speak(audioText, currentQuestion?.transliteration || '', speechSpeed);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentQuestion, isSupported, listeningMode, speak, speechSpeed]);

  const confettiParticles = useMemo(() => {
    if (!showConfetti) return [];
    return Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      color: ['#ff7d07', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
      duration: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 1}s`,
    }));
  }, [showConfetti]);

  const handleAnswer = useCallback((index: number) => {
    if (hasAnsweredRef.current || selectedAnswer !== null) return;
    if (!currentQuestion || index < 0 || index >= currentQuestion.options.length) return;

    hasAnsweredRef.current = true;
    setSelectedAnswer(index);
    const correct = index === currentQuestion.correctIndex;
    setIsCorrect(correct);
    if (correct) {
      playCorrect();
      setScore(s => {
        const nextScore = s + 1;
        finalScoreRef.current = nextScore;
        return nextScore;
      });
      setStreak(s => s + 1);
    } else {
      playIncorrect();
      setStreak(0);
      finalScoreRef.current = score;
    }
  }, [currentQuestion, playCorrect, playIncorrect, score, selectedAnswer]);

  // Handle Tile Click in Sentence Order question
  const handleSelectTile = (tile: string, index: number) => {
    if (hasAnsweredRef.current) return;
    setAssembledTiles(prev => [...prev, tile]);
    setAvailableTiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveTile = (tile: string, index: number) => {
    if (hasAnsweredRef.current) return;
    setAvailableTiles(prev => [...prev, tile]);
    setAssembledTiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckSentenceOrder = () => {
    if (hasAnsweredRef.current || !currentQuestion?.correctOrder) return;
    hasAnsweredRef.current = true;
    const isMatched = assembledTiles.join(' ') === currentQuestion.correctOrder.join(' ');
    setIsCorrect(isMatched);
    setSelectedAnswer(isMatched ? 1 : 0);

    if (isMatched) {
      playCorrect();
      setScore(s => {
        const nextScore = s + 1;
        finalScoreRef.current = nextScore;
        return nextScore;
      });
      setStreak(s => s + 1);
    } else {
      playIncorrect();
      setStreak(0);
      finalScoreRef.current = score;
    }
  };

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true);
      const finalScore = finalScoreRef.current;
      if (finalScore === questions.length) {
        setShowConfetti(true);
        playLevelUp();
      } else if (finalScore >= questions.length * 0.7) {
        playCorrect();
      }
      onComplete(finalScore, questions.length);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      hasAnsweredRef.current = false;
    }
  }, [currentIndex, onComplete, playCorrect, playLevelUp, questions.length]);

  const handleRetry = useCallback(() => {
    setQuestions(generateQuiz(lesson.id));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setShowConfetti(false);
    setAssembledTiles([]);
    hasAnsweredRef.current = false;
    finalScoreRef.current = 0;
  }, [lesson.id]);

  // Quiz keyboard shortcuts (1-4, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (isFinished) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleRetry();
        }
        return;
      }

      if (hasAnsweredRef.current) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      if (currentQuestion?.type !== 'sentence-order') {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= (currentQuestion?.options?.length || 0)) {
          e.preventDefault();
          handleAnswer(num - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, handleAnswer, handleNext, handleRetry, isFinished]);

  if (questions.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="text-center space-y-4">
          <p className="text-4xl">⚠️</p>
          <h2 className="text-xl font-bold">No questions available for this lesson yet.</h2>
          <button onClick={onBack} className="px-6 py-2.5 bg-saffron-500 text-white rounded-xl font-semibold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Quiz Finished Results View
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const xpEarned = score * 15 + (percentage === 100 ? 50 : 0);

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex items-center justify-center p-4 relative overflow-hidden`}>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {confettiParticles.map((p, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-fall"
                style={{
                  left: p.left,
                  backgroundColor: p.color,
                  animationDuration: p.duration,
                  animationDelay: p.delay,
                  top: '-10px',
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-md w-full animate-scale-up">
          <div className={`rounded-3xl p-8 text-center shadow-2xl border ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-6xl mb-4 animate-bounce">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🌟' : '💪'}
            </div>

            <h2 className="text-2xl font-bold font-space mb-1">
              {percentage === 100 ? 'Perfection!' : percentage >= 80 ? 'Awesome Work!' : percentage >= 60 ? 'Good Effort!' : 'Keep Practicing!'}
            </h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              You scored {score} out of {questions.length} ({percentage}%)
            </p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-saffron-500 font-black text-lg">⚡ +{xpEarned} XP earned</span>
            </div>

            <div className="flex gap-3">
              <button onClick={handleRetry} className="flex-1 px-5 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold rounded-2xl shadow-lg shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-all">
                🔄 Try Again
              </button>
              <button onClick={onBack} className={`flex-1 px-5 py-3 rounded-2xl font-bold border transition-all ${
                darkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}>
                Back to Lessons
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      
      {/* Header */}
      <div className={`bg-gradient-to-r ${lesson.color} pt-20 pb-6 px-4`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors" aria-label="Exit Quiz">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit
            </button>

            <div className="flex items-center gap-3">
              {/* Listening Mode Toggle */}
              <button
                onClick={() => setListeningMode(!listeningMode)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  listeningMode
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black ring-2 ring-white/50'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
                title="Toggle Blind Listening Mode"
              >
                <span>🎧</span>
                <span>{listeningMode ? 'Listening: ON' : 'Listening: OFF'}</span>
              </button>

              {streak >= 2 && (
                <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                  🔥 {streak} streak!
                </span>
              )}
              <span className="text-white font-black bg-white/20 px-3 py-1 rounded-full text-xs">
                Score: {score}/{questions.length}
              </span>
            </div>
          </div>

          <div className="flex gap-2" role="progressbar" aria-valuenow={currentIndex} aria-valuemin={0} aria-valuemax={questions.length} aria-label="Questions progress">
            {questions.map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i < currentIndex ? 'bg-white' : i === currentIndex ? 'bg-white/90' : 'bg-white/20'
              }`} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-slide-up" key={currentIndex}>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                darkMode ? 'bg-saffron-900/30 text-saffron-400' : 'bg-saffron-100 text-saffron-700'
              }`}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              
              {(currentQuestion.type === 'audio-listen' || listeningMode) && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400">
                  🎧 Listening Task
                </span>
              )}
              {currentQuestion.type === 'sentence-order' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400">
                  🧩 Word Order Task
                </span>
              )}
            </div>

            <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {listeningMode ? 'Listen to the audio and select the meaning:' : currentQuestion.question}
            </h2>

            {/* Audio Listen Prompt */}
            {(currentQuestion.type === 'audio-listen' || listeningMode) && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    const text = currentQuestion.audioPrompt || currentQuestion.questionSinhala || '';
                    speak(text, currentQuestion.transliteration || '', speechSpeed);
                  }}
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="text-2xl animate-pulse">🔊</span>
                  <span>Play Sinhala Audio (Replay)</span>
                </button>
              </div>
            )}

            {/* Sinhala Text Prompt (Hidden in blind listening mode) */}
            {!listeningMode && currentQuestion.type !== 'audio-listen' && currentQuestion.questionSinhala && (
              <p className="sinhala-text text-3xl sm:text-4xl text-saffron-500 font-bold mt-2" lang="si">
                {currentQuestion.questionSinhala}
              </p>
            )}
          </div>

          {/* QUESTION TYPE 1: Multiple Choice Options */}
          {currentQuestion.type !== 'sentence-order' && (
            <div role="radiogroup" aria-label="Quiz Options" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto">
              {currentQuestion.options.map((option, index) => {
                let classes = darkMode
                  ? 'bg-slate-900 border-2 border-slate-800 hover:border-saffron-500/50 text-slate-300'
                  : 'bg-white border-2 border-slate-200 hover:border-saffron-300 hover:bg-saffron-50 text-slate-800 shadow-sm';

                if (selectedAnswer !== null) {
                  if (index === currentQuestion.correctIndex) {
                    classes = darkMode
                      ? 'bg-emerald-950/40 border-2 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-950/40'
                      : 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 shadow-md shadow-emerald-100';
                  } else if (index === selectedAnswer && !isCorrect) {
                    classes = darkMode
                      ? 'bg-rose-950/40 border-2 border-rose-500 text-rose-400'
                      : 'bg-rose-50 border-2 border-rose-500 text-rose-900';
                  } else {
                    classes = darkMode
                      ? 'bg-slate-900/40 border-2 border-slate-800/40 opacity-40 text-slate-600'
                      : 'bg-slate-50 border-2 border-slate-200/60 opacity-40 text-slate-400';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    role="radio"
                    aria-checked={selectedAnswer === index}
                    className={`${classes} rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 ${
                      selectedAnswer === null ? 'active:scale-95 cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        selectedAnswer !== null && index === currentQuestion.correctIndex
                          ? 'bg-emerald-500 text-white'
                          : selectedAnswer === index && !isCorrect
                            ? 'bg-rose-500 text-white'
                            : darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {selectedAnswer !== null && index === currentQuestion.correctIndex ? '✓' :
                         selectedAnswer === index && !isCorrect ? '✗' :
                         String.fromCharCode(65 + index)}
                      </span>
                      <span className={`font-semibold ${
                        currentQuestion.type === 'english-to-sinhala' ? 'sinhala-text text-lg' : 'text-sm sm:text-base'
                      }`} lang={currentQuestion.type === 'english-to-sinhala' ? 'si' : undefined}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* QUESTION TYPE 2: Sentence Order Scramble */}
          {currentQuestion.type === 'sentence-order' && (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Assembled Area */}
              <div className={`p-4 min-h-[70px] rounded-2xl border-2 border-dashed flex flex-wrap gap-2 items-center justify-center ${
                selectedAnswer !== null
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-rose-500 bg-rose-500/10'
                  : darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-300 bg-slate-50'
              }`}>
                {assembledTiles.length === 0 && (
                  <span className="text-xs text-slate-400 italic">Tap words below in the correct SOV order</span>
                )}
                {assembledTiles.map((tile, i) => (
                  <button
                    key={i}
                    onClick={() => handleRemoveTile(tile, i)}
                    disabled={selectedAnswer !== null}
                    className="px-3.5 py-2 rounded-xl bg-saffron-500 text-white font-bold text-base shadow-sm hover:scale-105 active:scale-95 transition-all"
                  >
                    <span className="sinhala-text" lang="si">{tile}</span>
                  </button>
                ))}
              </div>

              {/* Available Choices */}
              <div className="flex flex-wrap gap-2 justify-center">
                {availableTiles.map((tile, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectTile(tile, i)}
                    disabled={selectedAnswer !== null}
                    className={`px-4 py-2.5 rounded-xl font-bold text-base border transition-all hover:scale-105 active:scale-95 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-saffron-500' : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:border-saffron-400'
                    }`}
                  >
                    <span className="sinhala-text" lang="si">{tile}</span>
                  </button>
                ))}
              </div>

              {selectedAnswer === null && (
                <div className="text-center pt-2">
                  <button
                    onClick={handleCheckSentenceOrder}
                    disabled={assembledTiles.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold rounded-2xl shadow-lg shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
                  >
                    Check Order ✓
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Answer Explanations & Next Button */}
          {selectedAnswer !== null && (
            <div className="mt-8 max-w-xl mx-auto animate-slide-up space-y-4">
              <div className={`p-5 rounded-3xl border text-center ${
                isCorrect
                  ? darkMode ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : darkMode ? 'bg-rose-950/40 border-rose-800/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
                  <span className="text-base font-black">
                    {isCorrect ? 'Correct! +15 XP' : 'Educational Insight:'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="px-10 py-3.5 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-white font-bold rounded-2xl shadow-lg shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {currentIndex + 1 >= questions.length ? 'See Results 🏆' : 'Next Question →'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
