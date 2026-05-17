import { useState, useEffect } from 'react';
import { Lesson, QuizQuestion, generateQuiz } from '../data/lessons';

interface QuizViewProps {
  lesson: Lesson;
  darkMode: boolean;
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export default function QuizView({ lesson, darkMode, onBack, onComplete }: QuizViewProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setQuestions(generateQuiz(lesson.id));
  }, [lesson.id]);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === currentQuestion.correctIndex;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true);
      if (score === questions.length) setShowConfetti(true);
      onComplete(score + (isCorrect ? 0 : 0), questions.length); // score already updated
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const handleRetry = () => {
    setQuestions(generateQuiz(lesson.id));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setShowConfetti(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const emoji = percentage === 100 ? '🏆' : percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪';
    const message = percentage === 100 ? 'Perfect Score!' : percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Try!' : 'Keep Practicing!';
    const xpEarned = score * 15 + (percentage === 100 ? 50 : 0);

    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#ff7d07', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
                  animation: `confetti-fall ${2 + Math.random() * 3}s ease-in forwards`,
                  animationDelay: `${Math.random() * 1}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-md w-full animate-scale-in">
          <div className={`rounded-3xl p-8 text-center ${
            darkMode ? 'bg-slate-900 border border-slate-800 shadow-2xl' : 'bg-white border border-slate-200 shadow-xl'
          }`}>
            <span className="text-7xl block mb-4">{emoji}</span>
            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{message}</h2>
            <p className={`mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {lesson.title} — <span className="sinhala-text">{lesson.titleSinhala}</span>
            </p>

            <div className={`rounded-2xl p-6 mb-4 ${
              darkMode ? 'bg-gradient-to-br from-saffron-900/20 to-orange-900/10 border border-saffron-800/20' : 'bg-gradient-to-br from-saffron-50 to-orange-50'
            }`}>
              <p className="text-5xl font-bold text-saffron-500 mb-1">{score}/{questions.length}</p>
              <p className={`text-sm font-medium ${darkMode ? 'text-saffron-400/60' : 'text-saffron-500'}`}>Correct Answers</p>
              <div className={`mt-3 h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-saffron-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-saffron-400 to-saffron-600 rounded-full transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* XP earned */}
            <div className={`rounded-xl p-3 mb-6 ${darkMode ? 'bg-slate-800' : 'bg-leaf-50'}`}>
              <span className="text-leaf-500 font-bold">⚡ +{xpEarned} XP earned</span>
            </div>

            <div className="flex gap-3">
              <button onClick={handleRetry} className="flex-1 px-5 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform">
                Try Again
              </button>
              <button onClick={onBack} className={`flex-1 px-5 py-3 rounded-xl font-semibold ${
                darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              } transition-colors`}>
                Back
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
            <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit
            </button>
            <div className="flex items-center gap-4">
              {streak >= 2 && (
                <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                  🔥 {streak} streak!
                </span>
              )}
              <span className="text-white font-bold bg-white/20 px-3 py-1 rounded-full text-sm">
                {score}/{questions.length}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i < currentIndex ? 'bg-white' : i === currentIndex ? 'bg-white/60' : 'bg-white/20'
              }`} />
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-slide-up" key={currentIndex}>
          <div className="text-center mb-8">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
              darkMode ? 'bg-saffron-900/30 text-saffron-400' : 'bg-saffron-100 text-saffron-700'
            }`}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {currentQuestion.question}
            </h2>
            {currentQuestion.questionSinhala && (
              <p className="sinhala-text text-4xl text-saffron-500 font-bold mt-3">
                {currentQuestion.questionSinhala}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {currentQuestion.options.map((option, index) => {
              let classes = darkMode
                ? 'bg-slate-900 border-2 border-slate-800 hover:border-saffron-700 text-slate-300'
                : 'bg-white border-2 border-slate-200 hover:border-saffron-300 hover:bg-saffron-50 text-slate-800';

              if (selectedAnswer !== null) {
                if (index === currentQuestion.correctIndex) {
                  classes = darkMode
                    ? 'bg-leaf-900/20 border-2 border-leaf-500/50 text-leaf-400 shadow-lg shadow-leaf-900/20'
                    : 'bg-leaf-50 border-2 border-leaf-400 text-leaf-800 shadow-lg shadow-leaf-100';
                } else if (index === selectedAnswer && !isCorrect) {
                  classes = darkMode
                    ? 'bg-red-900/20 border-2 border-red-500/50 text-red-400'
                    : 'bg-red-50 border-2 border-red-400 text-red-800';
                } else {
                  classes = darkMode
                    ? 'bg-slate-900/50 border-2 border-slate-800 opacity-40 text-slate-600'
                    : 'bg-slate-50 border-2 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`${classes} rounded-2xl p-5 text-left transition-all duration-300 ${
                    selectedAnswer === null ? 'active:scale-95 cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedAnswer !== null && index === currentQuestion.correctIndex
                        ? 'bg-leaf-500 text-white'
                        : selectedAnswer === index && !isCorrect
                          ? 'bg-red-500 text-white'
                          : darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {selectedAnswer !== null && index === currentQuestion.correctIndex ? '✓' :
                       selectedAnswer === index && !isCorrect ? '✗' :
                       String.fromCharCode(65 + index)}
                    </span>
                    <span className={`font-semibold ${
                      currentQuestion.type === 'english-to-sinhala' ? 'sinhala-text text-xl' : 'text-base'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="mt-8 text-center animate-slide-up">
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold mb-4 ${
                isCorrect
                  ? darkMode ? 'bg-leaf-900/30 text-leaf-400' : 'bg-leaf-100 text-leaf-700'
                  : darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
              }`}>
                {isCorrect ? '🎉 Correct! +15 XP' : '❌ Not quite!'}
              </div>
              <br />
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold rounded-xl shadow-lg shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-transform"
              >
                {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
