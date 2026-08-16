import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useGame } from './contexts/GameContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AlphabetSection from './components/AlphabetSection';
import LessonsSection from './components/LessonsSection';
import PracticeSection from './components/PracticeSection';
import PhraseBuilder from './components/PhraseBuilder';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import XPToast from './components/XPToast';
import OnboardingModal from './components/OnboardingModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Lesson, lessons } from './data/lessons';

import LessonView from './components/LessonView';
import QuizView from './components/QuizView';
import SearchModal from './components/SearchModal';
import CheatSheetModal from './components/CheatSheetModal';
import ShortcutsModal from './components/ShortcutsModal';
import BottomNav from './components/BottomNav';
import { checkAndTriggerDailyReminder } from './utils/notifications';

// Lazy load heavy modal subviews
const GrammarSection = lazy(() => import('./components/GrammarSection').then(m => ({ default: m.GrammarSection })));
const Chatbot = lazy(() => import('./components/Chatbot'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const WordMatchGame = lazy(() => import('./components/WordMatchGame'));
const ConversationView = lazy(() => import('./components/ConversationView'));
const WritingPractice = lazy(() => import('./components/WritingPractice'));
const FlashcardReview = lazy(() => import('./components/FlashcardReview'));

type View = 'home' | 'lesson' | 'quiz' | 'dashboard' | 'match-game' | 'conversation' | 'writing-practice' | 'flashcards' | 'grammar';

const LoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-slate-900/5 dark:bg-slate-950/20 py-16">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading section...</p>
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [toastQueue, setToastQueue] = useState<{ message: string; xp: number }[]>([]);
  const [activeToast, setActiveToast] = useState<{ message: string; xp: number } | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      const done = localStorage.getItem('sinhala_onboarding_done');
      return !done;
    } catch {
      return false;
    }
  });

  const handleCloseOnboarding = useCallback(() => {
    setShowOnboarding(false);
    try {
      localStorage.setItem('sinhala_onboarding_done', 'true');
    } catch {}
  }, []);

  const {
    state, learnWord, recordQuiz, unlockMatchAchievement,
    toggleStarWord, reviewSRSWord, changeAvatar, updateProfile, resetProgress, setDailyGoal,
    importProgressState, toggleDarkMode, totalWordsLearned, xpProgress, addXP
  } = useGame();

  const darkMode = state.darkMode;

  // Global Keyboard Shortcuts (Ctrl+K for Search, ? for Shortcuts modal)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K: Global Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        return;
      }

      // '?' (Shift+/): Keyboard Shortcuts Modal (only when not typing in inputs)
      const target = e.target as HTMLElement | null;
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      if (e.key === '?' && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
        return;
      }

      // Escape key closes open modals
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isCheatSheetOpen) setIsCheatSheetOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSearchOpen, isCheatSheetOpen, isShortcutsOpen]);

  // Simple hash-based router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === '#/' || hash === '#/home') {
        setView('home');
        setSelectedLesson(null);
      } else if (hash === '#/dashboard') {
        setView('dashboard');
        setSelectedLesson(null);
      } else if (hash === '#/match-game') {
        setView('match-game');
        setSelectedLesson(null);
      } else if (hash === '#/conversation') {
        setView('conversation');
        setSelectedLesson(null);
      } else if (hash === '#/writing-practice') {
        setView('writing-practice');
        setSelectedLesson(null);
      } else if (hash === '#/flashcards') {
        setView('flashcards');
        setSelectedLesson(null);
      } else if (hash === '#/grammar') {
        setView('grammar');
        setSelectedLesson(null);
      } else if (hash.startsWith('#/lesson/')) {
        const id = parseInt(hash.replace('#/lesson/', ''), 10);
        const found = lessons.find(l => l.id === id);
        if (found) {
          setView('lesson');
          setSelectedLesson(found);
        } else {
          window.location.hash = '#/';
        }
      } else if (hash.startsWith('#/quiz/')) {
        const id = parseInt(hash.replace('#/quiz/', ''), 10);
        const found = lessons.find(l => l.id === id);
        if (found) {
          setView('quiz');
          setSelectedLesson(found);
        } else {
          window.location.hash = '#/';
        }
      } else {
        setView('home');
        setSelectedLesson(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Daily study reminder check
  useEffect(() => {
    checkAndTriggerDailyReminder(state.streak);
  }, [state.streak]);

  // Handle robust scrollIntoView after navigation/render
  useEffect(() => {
    if (view === 'home' && scrollToSection) {
      requestAnimationFrame(() => {
        const el = document.getElementById(scrollToSection);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          setScrollToSection(null);
        } else {
          // Retry next frame in case of delayed rendering
          requestAnimationFrame(() => {
            const elRetry = document.getElementById(scrollToSection);
            if (elRetry) {
              elRetry.scrollIntoView({ behavior: 'smooth' });
            }
            setScrollToSection(null);
          });
        }
      });
    }
  }, [view, scrollToSection]);

  const showToast = useCallback((message: string, xp: number) => {
    setToastQueue(prev => [...prev, { message, xp }]);
  }, []);

  // Process toast queue
  useEffect(() => {
    if (!activeToast && toastQueue.length > 0) {
      const nextToast = toastQueue[0];
      setActiveToast(nextToast);
      setToastQueue(prev => prev.slice(1));
    }
  }, [activeToast, toastQueue]);

  const handleToastDone = useCallback(() => {
    setActiveToast(null);
  }, []);

  const handleSelectLesson = useCallback((lesson: Lesson) => {
    window.location.hash = `#/lesson/${lesson.id}`;
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setScrollToSection('lessons');
    window.location.hash = '#/';
  }, []);

  const handleStartQuiz = useCallback(() => {
    if (selectedLesson) {
      window.location.hash = `#/quiz/${selectedLesson.id}`;
      window.scrollTo(0, 0);
    }
  }, [selectedLesson]);

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
    const el = document.getElementById('lessons');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNavigate = useCallback((section: string) => {
    if (section === 'home') {
      window.location.hash = '#/';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'grammar') {
      window.location.hash = '#/grammar';
      window.scrollTo(0, 0);
    } else if (['alphabet', 'lessons', 'practice', 'about', 'contact'].includes(section)) {
      if (view !== 'home') {
        setScrollToSection(section);
        window.location.hash = '#/';
      } else {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [view]);



  const navProps = {
    level: state.level,
    xp: state.xp,
    xpProgress,
    streak: state.streak,
    darkMode,
    onToggleDark: toggleDarkMode,
    onNavigate: handleNavigate,
    onOpenDashboard: () => { window.location.hash = '#/dashboard'; window.scrollTo(0, 0); },
    onOpenSearch: () => setIsSearchOpen(true),
    onOpenCheatSheet: () => setIsCheatSheetOpen(true),
  };

  const toastEl = activeToast ? (
    <XPToast
      message={activeToast.message}
      xp={activeToast.xp}
      show={true}
      onDone={handleToastDone}
    />
  ) : null;
  const chatbotEl = (
    <Suspense fallback={null}>
      <Chatbot darkMode={darkMode} isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </Suspense>
  );

  // Floating chat button (visible on all views, subject to Level 2 lock check)
  const chatFab = !chatOpen && (
    <button
      onClick={() => {
        if (state.level >= 2) {
          setChatOpen(true);
        } else {
          showToast('🔒 Reach Level 2 to unlock AI Sinhala Helper!', 0);
        }
      }}
      className="fixed bottom-20 lg:bottom-5 right-5 z-[80] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-2xl shadow-xl shadow-saffron-500/30 hover:shadow-saffron-500/50 flex items-center justify-center text-2xl sm:text-3xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Open Sinhala Helper Chatbot"
    >
      <span className="group-hover:scale-110 transition-transform">🤖</span>
      {state.level >= 2 ? (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-leaf-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </span>
      ) : (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">
          🔒
        </span>
      )}
    </button>
  );

  // ===== Sub-views rendering with ErrorBoundary and Suspense =====
  const renderSubView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard
                darkMode={darkMode} xp={state.xp} level={state.level}
                streak={state.streak} xpProgress={xpProgress}
                totalWordsLearned={totalWordsLearned} achievements={state.achievements}
                totalQuizzes={state.totalQuizzesTaken} perfectScores={state.perfectScores}
                wordsLearned={state.wordsLearned}
                dailyXp={state.dailyXpEarned} dailyGoal={state.dailyGoal}
                starredWords={state.starredWords || {}} srsData={state.srsData || {}}
                avatar={state.avatar || '🦁'}
                userName={state.userName || 'Learner'}
                activityHistory={state.activityHistory || {}}
                quizScores={state.quizScores || []}
                onBack={() => { window.location.hash = '#/'; window.scrollTo(0, 0); }}
                onToggleStarWord={toggleStarWord}
                onChangeAvatar={changeAvatar}
                onUpdateProfile={updateProfile}
                onResetProgress={resetProgress}
                onSetDailyGoal={setDailyGoal}
                onImportState={importProgressState}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 'match-game':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <WordMatchGame darkMode={darkMode}
                onComplete={() => { unlockMatchAchievement(); showToast('Match game won! 🃏', 30); }}
                onBack={() => { setScrollToSection('practice'); window.location.hash = '#/'; }}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 'conversation':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <ConversationView darkMode={darkMode} soundEnabled={state.soundEnabled}
                onBack={() => { setScrollToSection('practice'); window.location.hash = '#/'; }}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 'lesson':
        if (!selectedLesson) return <LoadingFallback />;
        return (
          <ErrorBoundary>
            <LessonView
              lesson={selectedLesson} darkMode={darkMode} soundEnabled={state.soundEnabled}
              onBack={handleBack} onStartQuiz={handleStartQuiz}
              onWordLearned={handleWordLearned}
              learnedWords={state.wordsLearned[selectedLesson.id] || []}
              starredWords={state.starredWords || {}}
              onToggleStarWord={toggleStarWord}
            />
          </ErrorBoundary>
        );

      case 'quiz':
        if (!selectedLesson) return <LoadingFallback />;
        return (
          <ErrorBoundary>
            <QuizView lesson={selectedLesson} darkMode={darkMode}
              onBack={() => { window.location.hash = `#/lesson/${selectedLesson.id}`; window.scrollTo(0, 0); }}
              onComplete={handleQuizComplete}
            />
          </ErrorBoundary>
        );

      case 'writing-practice':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <WritingPractice
                darkMode={darkMode}
                soundEnabled={state.soundEnabled}
                onBack={() => { setScrollToSection('practice'); window.location.hash = '#/'; }}
                onAwardXP={addXP}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 'flashcards':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <FlashcardReview
                darkMode={darkMode}
                soundEnabled={state.soundEnabled}
                state={state}
                onBack={() => { setScrollToSection('practice'); window.location.hash = '#/'; }}
                onReviewWord={reviewSRSWord}
                onAwardXP={addXP}
              />
            </Suspense>
          </ErrorBoundary>
        );

      case 'grammar':
        return (
          <ErrorBoundary>
            <div className="pt-20 pb-12">
              <Suspense fallback={<LoadingFallback />}>
                <GrammarSection onAddXP={addXP} />
              </Suspense>
            </div>
          </ErrorBoundary>
        );

      case 'home':
      default:
        return (
          <>
            <Hero
              onStart={handleStart}
              onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
              totalWords={totalWordsLearned}
              level={state.level}
              streak={state.streak}
            />
            <AlphabetSection darkMode={darkMode} soundEnabled={state.soundEnabled} />
            <LessonsSection onSelectLesson={handleSelectLesson} progress={state.wordsLearned} darkMode={darkMode} />
            <PracticeSection darkMode={darkMode} level={state.level}
              onOpenGame={() => { window.location.hash = '#/match-game'; window.scrollTo(0, 0); }}
              onOpenConversation={() => { window.location.hash = '#/conversation'; window.scrollTo(0, 0); }}
              onOpenWritingPractice={() => { window.location.hash = '#/writing-practice'; window.scrollTo(0, 0); }}
              onOpenFlashcards={() => { window.location.hash = '#/flashcards'; window.scrollTo(0, 0); }}
              onOpenChatbot={() => {
                if (state.level >= 2) {
                  setChatOpen(true);
                } else {
                  showToast('🔒 Reach Level 2 to unlock AI Sinhala Helper!', 0);
                }
              }}
            />
            <PhraseBuilder darkMode={darkMode} soundEnabled={state.soundEnabled} />
            <AboutSection darkMode={darkMode} />
            <ContactSection darkMode={darkMode} />
          </>
        );
    }
  };

  return (
    <div className={`relative min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <Navbar {...navProps} currentView={view} />
      <main id="main-content" className="outline-none pb-16 lg:pb-0">
        {renderSubView()}
      </main>
      {view === 'home' && <Footer darkMode={darkMode} onNavigate={handleNavigate} />}
      {toastEl}
      {chatFab}
      {chatbotEl}
      {showOnboarding && <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />}

      {/* Global Vocabulary Search & Dictionary Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        darkMode={darkMode}
        soundEnabled={state.soundEnabled}
        starredWords={state.starredWords || {}}
        onToggleStarWord={toggleStarWord}
        onSelectLesson={(lessonId: number) => {
          setIsSearchOpen(false);
          window.location.hash = `#/lesson/${lessonId}`;
          window.scrollTo(0, 0);
        }}
      />

      {/* 1-Click Printable / PDF Travel Cheat Sheet Modal */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
        darkMode={darkMode}
      />

      {/* Keyboard Shortcuts Guide Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        darkMode={darkMode}
      />

      {/* Persistent Mobile Bottom Navigation Bar (<1024px) */}
      <BottomNav
        darkMode={darkMode}
        currentView={view}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDashboard={() => { window.location.hash = '#/dashboard'; window.scrollTo(0, 0); }}
      />
    </div>
  );
}
