import { useState, useEffect } from 'react';

interface BottomNavProps {
  darkMode: boolean;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
  onOpenDashboard: () => void;
}

export default function BottomNav({
  darkMode,
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenDashboard
}: BottomNavProps) {
  const [activeSection, setActiveSection] = useState('home');

  // Track active section on scroll when on home view
  useEffect(() => {
    if (currentView !== 'home') {
      setActiveSection(currentView);
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      const sections = ['contact', 'about', 'phrases', 'practice', 'lessons', 'alphabet'];
      let current = 'home';

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el && el.offsetTop <= scrollPos) {
          current = sec;
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Hide BottomNav during immersive fullscreen focus modes
  const isImmersiveMode = ['quiz', 'writing-practice', 'match-game', 'flashcards'].includes(currentView);
  if (isImmersiveMode) return null;

  const handleSectionClick = (sectionId: string) => {
    if (currentView !== 'home') {
      onNavigate(sectionId);
    } else {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', isAction: false },
    { id: 'lessons', label: 'Lessons', icon: '📚', isAction: false },
    { id: 'alphabet', label: 'Alphabet', icon: '🔤', isAction: false },
    { id: 'practice', label: 'Practice', icon: '🎮', isAction: false },
    { id: 'search', label: 'Search', icon: '🔍', isAction: true, action: onOpenSearch },
    { id: 'dashboard', label: 'Profile', icon: '🦁', isAction: true, action: onOpenDashboard },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-2xl transition-all duration-300 ${
        darkMode
          ? 'bg-slate-950/90 border-slate-800/90 text-slate-400'
          : 'bg-white/90 border-slate-200/90 text-slate-600 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]'
      }`}
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 8px))' }}
    >
      <div className="max-w-md mx-auto px-2 pt-1 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = !item.isAction && (
            (currentView === 'home' && activeSection === item.id) ||
            (currentView === item.id)
          ) || (item.id === 'dashboard' && currentView === 'dashboard');

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction && item.action) {
                  item.action();
                } else {
                  handleSectionClick(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl min-w-[52px] min-h-[48px] transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-saffron-500 font-extrabold scale-105'
                  : 'hover:text-saffron-500 text-slate-500 dark:text-slate-400'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className={`text-[10px] mt-1 font-semibold leading-none ${isActive ? 'text-saffron-500 font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-saffron-500 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
