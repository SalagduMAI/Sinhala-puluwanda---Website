import { useState, useEffect, useRef } from 'react';

interface OnboardingModalProps {
  darkMode?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

const STEPS = [
  {
    emoji: '🇱🇰',
    title: 'Welcome to Sinhala Puluwanda!',
    titleSi: 'සිංහල පුළුවන්ද?',
    description: 'The most immersive and beautiful platform to learn Sinhala. Master the alphabet, conversational phrases, grammar rules, speech pronunciation, and handwritten strokes!',
  },
  {
    emoji: '⚡',
    title: 'Gamified Learning Journey',
    titleSi: 'ක්‍රීඩාශීලී ඉගෙනුම',
    description: 'Earn XP for every word learned, quiz aced, and grammar rule mastered. Unlock your AI Sinhala Survival Guide at Level 2, build daily streaks, and climb the leaderboard!',
  },
  {
    emoji: '🚀',
    title: 'Ready to Start?',
    titleSi: 'ආරම්භ කරමු!',
    description: 'Explore 60 alphabet characters, 12 practical lessons with native audio, interactive handwriting canvas, and SM-2 spaced repetition flashcards. Let\'s go!',
  },
];

export default function OnboardingModal({ darkMode = false, isOpen = true, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleFinish = () => {
    try {
      localStorage.setItem('sinhala_onboarding_done', 'true');
    } catch { /* ignore */ }
    if (onComplete) onComplete();
    if (onClose) onClose();
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  // Keyboard navigation (Escape to skip/close, Arrow keys for steps)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleFinish();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' && step > 0) {
        e.preventDefault();
        setStep(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        role="dialog" 
        aria-modal="true" 
        aria-label="Welcome tutorial"
        className={`max-w-md w-full rounded-3xl p-8 border text-center space-y-6 animate-scale-in ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xl'
        }`}
      >
        <div className="text-7xl animate-bounce" role="img" aria-label={current.emoji}>{current.emoji}</div>
        <div className="space-y-2">
          <h2 className={`text-2xl font-black font-space ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {current.title}
          </h2>
          <p className="sinhala-text text-saffron-500 font-bold text-lg" lang="si">{current.titleSi}</p>
        </div>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {current.description}
        </p>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-saffron-500' : i < step ? 'w-4 bg-saffron-300' : 'w-4 bg-slate-300 dark:bg-slate-700'
              }`} 
            />
          ))}
        </div>
        
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className={`flex-1 py-3.5 rounded-2xl font-bold border transition-all ${
                darkMode ? 'hover:bg-slate-800 text-slate-400 border-slate-700' : 'hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3.5 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-white font-bold rounded-2xl shadow-lg shadow-saffron-500/20 active:scale-95 transition-all duration-200"
          >
            {step === STEPS.length - 1 ? '🚀 Start Learning!' : 'Next →'}
          </button>
        </div>
        
        <button
          onClick={handleFinish}
          className={`text-xs ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'} transition-colors underline`}
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
}
