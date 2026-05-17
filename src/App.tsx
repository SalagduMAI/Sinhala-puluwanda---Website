import { useState, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AlphabetSection from './components/AlphabetSection';
import LessonsSection from './components/LessonsSection';
import LessonView from './components/LessonView';
import QuizView from './components/QuizView';
import PracticeSection from './components/PracticeSection';
import WordMatchGame from './components/WordMatchGame';
import ConversationView from './components/ConversationView';
import PhraseBuilder from './components/PhraseBuilder';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import XPToast from './components/XPToast';
import Footer from './components/Footer';
import { Lesson } from './data/lessons';

type View = 'home' | 'lesson' | 'quiz' | 'dashboard' | 'match-game' | 'conversation';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', xp: 0 });
  const [chatOpen, setChatOpen] = useState(false);

  const {
    state, learnWord, recordQuiz, unlockMatchAchievement,
    toggleDarkMode, totalWordsLearned, xpProgress,
  } = useGameState();

  const darkMode = state.darkMode;
  if (darkMode) { document.documentElement.classList.add('dark'); }
  else { document.documentElement.classList.remove('dark'); }

  const showToast = useCallback((message: string, xp: number) => {
    setToast({ show: true, message, xp });
  }, []);

  const handleSelectLesson = useCallback((lesson: Lesson) => {
    setSelectedLesson(lesson); setView('lesson'); window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setView('home'); setSelectedLesson(null);
    setTimeout(() => document.getElementById('lessons')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  const handleStartQuiz = useCallback(() => {
    setView('quiz'); window.scrollTo(0, 0);
  }, []);

  const handleWordLearned = useCallback((lessonId: number, wordIndex: number) => {
    if (!state.wordsLearned[lessonId]?.includes(wordIndex)) {
      learnWord(lessonId, wordIndex);
      showToast('Word learned!', 10);
    }
  }, [learnWord, showToast, state.wordsLearned]);

  const handleQuizComplete = useCallback((score: number, total: number) => {
    if (selectedLesson) {
      recordQuiz(selectedLesson.id, score, total);
      const xp = score * 15 + (score === total ? 50 : 0);
      showToast(score === total ? 'Perfect quiz! 🏆' : 'Quiz completed!', xp);
    }
  }, [recordQuiz, selectedLesson, showToast]);

  const handleStart = useCallback(() => {
    document.getElementById('lessons')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((section: string) => {
    if (section === 'home') {
      setView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (['alphabet', 'lessons', 'practice', 'about', 'contact'].includes(section)) {
      if (view !== 'home') {
        setView('home');
        setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }), 150);
      } else {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [view]);

  const navProps = {
    level: state.level, xp: state.xp, xpProgress,
    streak: state.streak, darkMode,
    onToggleDark: toggleDarkMode, onNavigate: handleNavigate,
    onOpenDashboard: () => { setView('dashboard'); window.scrollTo(0, 0); },
  };

  const toastEl = <XPToast {...toast} onDone={() => setToast(t => ({ ...t, show: false }))} />;
  const chatbotEl = <Chatbot darkMode={darkMode} isOpen={chatOpen} onClose={() => setChatOpen(false)} />;

  // Floating chat button (visible on all views)
  const chatFab = !chatOpen && (
    <button
      onClick={() => setChatOpen(true)}
      className="fixed bottom-5 right-5 z-[80] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-2xl shadow-xl shadow-saffron-500/30 hover:shadow-saffron-500/50 flex items-center justify-center text-2xl sm:text-3xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Open Sinhala Helper Chatbot"
    >
      <span className="group-hover:scale-110 transition-transform">🤖</span>
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-leaf-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      </span>
    </button>
  );

  // ===== Sub-views =====
  if (view === 'dashboard') {
    return (
      <div className={darkMode ? 'bg-slate-950 min-h-screen' : 'min-h-screen'}>
        <Navbar {...navProps} currentView="dashboard" />
        <Dashboard
          darkMode={darkMode} xp={state.xp} level={state.level}
          streak={state.streak} xpProgress={xpProgress}
          totalWordsLearned={totalWordsLearned} achievements={state.achievements}
          totalQuizzes={state.totalQuizzesTaken} perfectScores={state.perfectScores}
          wordsLearned={state.wordsLearned}
          dailyXp={state.dailyXpEarned} dailyGoal={state.dailyGoal}
          onBack={() => { setView('home'); window.scrollTo(0, 0); }}
        />
        {toastEl}{chatFab}{chatbotEl}
      </div>
    );
  }

  if (view === 'match-game') {
    return (
      <div className={darkMode ? 'bg-slate-950 min-h-screen' : 'min-h-screen'}>
        <Navbar {...navProps} currentView="match-game" />
        <WordMatchGame darkMode={darkMode}
          onComplete={() => { unlockMatchAchievement(); showToast('Match game won! 🃏', 30); }}
          onBack={() => { setView('home'); setTimeout(() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
        />
        {toastEl}{chatFab}{chatbotEl}
      </div>
    );
  }

  if (view === 'conversation') {
    return (
      <div className={darkMode ? 'bg-slate-950 min-h-screen' : 'min-h-screen'}>
        <Navbar {...navProps} currentView="conversation" />
        <ConversationView darkMode={darkMode} soundEnabled={state.soundEnabled}
          onBack={() => { setView('home'); setTimeout(() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
        />
        {toastEl}{chatFab}{chatbotEl}
      </div>
    );
  }

  if (view === 'lesson' && selectedLesson) {
    return (
      <div className={darkMode ? 'bg-slate-950 min-h-screen' : 'min-h-screen'}>
        <Navbar {...navProps} currentView="lesson" />
        <LessonView
          lesson={selectedLesson} darkMode={darkMode} soundEnabled={state.soundEnabled}
          onBack={handleBack} onStartQuiz={handleStartQuiz}
          onWordLearned={handleWordLearned}
          learnedWords={state.wordsLearned[selectedLesson.id] || []}
        />
        {toastEl}{chatFab}{chatbotEl}
      </div>
    );
  }

  if (view === 'quiz' && selectedLesson) {
    return (
      <div className={darkMode ? 'bg-slate-950 min-h-screen' : 'min-h-screen'}>
        <Navbar {...navProps} currentView="quiz" />
        <QuizView lesson={selectedLesson} darkMode={darkMode}
          onBack={() => { setView('lesson'); window.scrollTo(0, 0); }}
          onComplete={handleQuizComplete}
        />
        {toastEl}{chatFab}{chatbotEl}
      </div>
    );
  }

  // ===== HOME VIEW =====
  return (
    <div className={`relative ${darkMode ? 'bg-slate-950' : ''}`}>
      <Navbar {...navProps} currentView="home" />
      <Hero onStart={handleStart} darkMode={darkMode} totalWords={totalWordsLearned} level={state.level} streak={state.streak} />
      <AlphabetSection darkMode={darkMode} soundEnabled={state.soundEnabled} />
      <LessonsSection onSelectLesson={handleSelectLesson} progress={state.wordsLearned} darkMode={darkMode} />
      <PracticeSection darkMode={darkMode}
        onOpenGame={() => { setView('match-game'); window.scrollTo(0, 0); }}
        onOpenConversation={() => { setView('conversation'); window.scrollTo(0, 0); }}
        onOpenChatbot={() => setChatOpen(true)}
      />
      <PhraseBuilder darkMode={darkMode} soundEnabled={state.soundEnabled} />
      <AboutSection darkMode={darkMode} />
      <ContactSection darkMode={darkMode} />
      <Footer darkMode={darkMode} onNavigate={handleNavigate} />
      {toastEl}{chatFab}{chatbotEl}
    </div>
  );
}
