import { useState } from 'react';

interface OnboardingModalProps {
  darkMode: boolean;
  onComplete: () => void;
}

const STEPS = [
  {
    emoji: '🇱🇰',
    title: 'Welcome to Sinhala Puluwanda!',
    titleSi: 'සිංහල පුළුවන්ද?',
    description: 'The most beautiful way to learn the Sinhala language. Whether you\'re traveling to Sri Lanka or curious about this ancient language, we\'ve got you covered!',
  },
  {
    emoji: '⚡',
    title: 'How It Works',
    titleSi: 'මෙය ක්රියා කරන අයුරු',
    description: 'Earn XP by completing lessons, quizzes, and games. Level up to unlock the AI Chatbot helper at Level 2. Maintain your daily streak for bonus rewards!',
  },
  {
    emoji: '🚀',
    title: 'Ready to Start!',
    titleSi: 'ආරම්භ කරමු!',
    description: 'Explore the 60-letter alphabet, master 12+ real-world lessons, practice writing on canvas, and chat with our AI tutor. Let\'s go!',
  },
];

export default function OnboardingModal({ darkMode, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      try { localStorage.setItem('sinhala_onboarding_done', 'true'); } catch { /* ignore */ }
      onComplete();
    }
  };

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className={`max-w-md w-full rounded-3xl p-8 border text-center space-y-6 animate-scale-up ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xl'
      }`}
        role="dialog" aria-modal="true" aria-label="Welcome tutorial">
        <div className="text-7xl animate-bounce">{current.emoji}</div>
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
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-saffron-500' : i < step ? 'w-4 bg-saffron-300' : 'w-4 bg-slate-300 dark:bg-slate-700'
            }`} />
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
          onClick={() => { try { localStorage.setItem('sinhala_onboarding_done', 'true'); } catch { /* ignore */ } onComplete(); }}
          className={`text-xs ${darkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'} transition-colors`}
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
}
