import { useState, useEffect } from 'react';
import { APP_VERSION } from '../constants';
import { useTranslation } from '../i18n/useTranslation';
import { LANGUAGES, Language } from '../i18n/translations';

interface NavbarProps {
  level: number;
  xp: number;
  xpProgress: number;
  streak: number;
  darkMode: boolean;
  onToggleDark: () => void;
  onNavigate: (section: string) => void;
  onOpenDashboard: () => void;
  onOpenSearch: () => void;
  onOpenCheatSheet: () => void;
  currentView: string;
}

const NAV_LINKS = [
  { label: 'Home', id: 'home', icon: '🏠' },
  { label: 'Alphabet', id: 'alphabet', icon: '🔤' },
  { label: 'Lessons', id: 'lessons', icon: '📚' },
  { label: 'Grammar', id: 'grammar', icon: '✍️' },
  { label: 'Practice', id: 'practice', icon: '🎮' },
  { label: 'Phrases', id: 'phrases', icon: '🗣️' },
  { label: 'About', id: 'about', icon: 'ℹ️' },
  { label: 'Contact', id: 'contact', icon: '✉️' },
];

export default function Navbar({
  level,
  xp,
  xpProgress,
  streak,
  darkMode,
  onToggleDark,
  onNavigate,
  onOpenDashboard,
  onOpenSearch,
  onOpenCheatSheet,
  currentView
}: NavbarProps) {
  const [showMobile, setShowMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { lang, setLanguage } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      if (currentView === 'home') {
        const sections = ['contact', 'about', 'phrases', 'practice', 'lessons', 'alphabet'];
        const scrollPos = window.scrollY + 200;
        
        let found = 'home';
        for (const sec of sections) {
          const el = document.getElementById(sec);
          if (el && el.offsetTop <= scrollPos) {
            found = sec;
            break;
          }
        }
        setActiveSection(found);
      } else {
        setActiveSection(currentView);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setShowMobile(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Escape key closes mobile menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMobile(false); };
    if (showMobile) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showMobile]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (showMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobile]);

  const isHero = currentView === 'home' && !scrolled;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHero
          ? 'bg-slate-950/40 backdrop-blur-md border-b border-white/10'
          : darkMode
            ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-slate-200/40'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 flex items-center justify-between h-16 sm:h-[68px]">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
              aria-label="Sinhala Puluwanda Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-md shadow-saffron-500/25 group-hover:shadow-saffron-500/40 group-hover:scale-105 transition-all duration-300">
                <span className="text-white text-xs sm:text-sm font-bold sinhala-text" lang="si">සිං</span>
              </div>
              <div>
                <span className={`font-black text-sm sm:text-base font-space tracking-tight leading-tight block ${
                  isHero ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Sinhala Puluwanda
                </span>
                <span className={`text-[10px] font-semibold -mt-0.5 block ${isHero ? 'text-saffron-300' : 'text-saffron-500'}`}>
                  v{APP_VERSION} &bull; ශ්‍රී ලංකා
                </span>
              </div>
            </button>
          </div>

          {/* Center: Desktop Navigation Links (>= 1024px) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-slate-500/5 dark:bg-slate-800/30 border border-slate-500/10">
            {NAV_LINKS.map(link => {
              const isActive = (currentView === 'home' && activeSection === link.id) || (currentView === link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-saffron-500 text-white shadow-sm shadow-saffron-500/30'
                      : isHero
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : darkMode
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions & Tools (Adaptive per device) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Quick Search Button (Desktop/Tablet >= 640px) */}
            <button
              onClick={onOpenSearch}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-slate-900/60 text-white/90 border-white/20 hover:bg-slate-900/80'
                  : darkMode
                  ? 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Search dictionary (Ctrl+K)"
              aria-label="Search vocabulary"
            >
              <svg className="w-3.5 h-3.5 text-saffron-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
              <kbd className="hidden md:inline-block px-1 py-0.5 text-[9px] bg-black/20 dark:bg-white/10 rounded font-mono">⌘K</kbd>
            </button>

            {/* Printable Cheat Sheet (Desktop >= 1024px) */}
            <button
              onClick={onOpenCheatSheet}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/30 hover:bg-amber-500/30'
                  : darkMode
                  ? 'bg-amber-950/40 text-amber-400 border-amber-800/40 hover:bg-amber-900/40'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="Printable Sri Lanka Travel Cheat Sheet"
              aria-label="Travel Cheat Sheet"
            >
              <span>📄</span>
              <span>Cheat Sheet</span>
            </button>

            {/* XP & Level Badge (Desktop/Tablet >= 768px) */}
            <button
              onClick={onOpenDashboard}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-slate-900/60 border-white/20 text-white'
                  : darkMode ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              aria-label="Open Learner Profile"
            >
              <div className="flex items-center gap-1">
                <span className="text-xs">⭐</span>
                <span className="text-xs font-bold text-saffron-500">Lv.{level}</span>
              </div>
              <div className={`w-12 h-1.5 rounded-full overflow-hidden ${isHero ? 'bg-white/20' : darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div
                  role="progressbar"
                  aria-valuenow={xpProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="XP level progress"
                  className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <span className={`text-[10px] font-mono font-medium ${isHero ? 'text-white/60' : darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {xp} XP
              </span>
            </button>

            {/* Streak Badge (Desktop/Tablet >= 768px) */}
            {streak > 0 && (
              <div className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border ${
                isHero ? 'bg-orange-500/20 border-orange-400/30 text-orange-300' : darkMode ? 'bg-orange-950/40 border-orange-900/40 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'
              }`}>
                <span className="text-xs">🔥</span>
                <span className="text-xs font-black">{streak}d</span>
              </div>
            )}

            {/* Language Selector Dropdown (All devices) */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Select UI Language"
                className={`text-xs font-bold px-2 sm:px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-saffron-500 ${
                  isHero
                    ? 'bg-slate-900/80 text-white border-white/20'
                    : darkMode
                    ? 'bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark Mode Toggle Button (All devices) */}
            <button
              onClick={onToggleDark}
              className={`p-2 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-slate-900/60 text-white border-white/20 hover:bg-slate-900/80'
                  : darkMode
                  ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Dashboard Icon Button (Desktop/Tablet) */}
            <button
              onClick={onOpenDashboard}
              className={`hidden sm:flex p-2 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-slate-900/60 text-white border-white/20 hover:bg-slate-900/80'
                  : darkMode
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Open Dashboard"
              aria-label="Dashboard"
            >
              <svg className="w-4 h-4 text-saffron-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>

            {/* Mobile Hamburger Drawer Toggle (< 1024px) */}
            <button
              onClick={() => setShowMobile(!showMobile)}
              className={`lg:hidden p-2 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-slate-900/60 text-white border-white/20 hover:bg-slate-900/80'
                  : darkMode
                  ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={showMobile}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobile
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer (< 1024px) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          showMobile ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowMobile(false)}
        />

        {/* Drawer Panel */}
        <div className={`absolute right-0 top-0 bottom-0 w-[290px] sm:w-[340px] max-h-[100dvh] overflow-y-auto shadow-2xl transition-transform duration-300 ease-out ${
          showMobile ? 'translate-x-0' : 'translate-x-full'
        } ${darkMode ? 'bg-slate-950/95 border-l border-slate-800 text-white' : 'bg-white/95 border-l border-slate-200 text-slate-900'} backdrop-blur-2xl`}>
          
          <div className="p-5 pt-6 flex flex-col min-h-full">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/20 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white font-bold text-xs sinhala-text" lang="si">
                  සිං
                </div>
                <div>
                  <h2 className="font-bold text-sm font-space">Sinhala Puluwanda</h2>
                  <span className="text-[10px] text-saffron-500 font-semibold">Menu & Navigation</span>
                </div>
              </div>

              <button
                onClick={() => setShowMobile(false)}
                className={`p-1.5 rounded-xl border ${darkMode ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-100'}`}
                aria-label="Close menu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile XP & Level Card */}
            <button
              onClick={() => { onOpenDashboard(); setShowMobile(false); }}
              className={`rounded-2xl p-4 mb-4 border text-left transition-all active:scale-95 ${
                darkMode ? 'bg-slate-900 border-slate-800 hover:border-saffron-500/40' : 'bg-slate-50 border-slate-200 hover:border-saffron-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                  {level}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Level {level}</span>
                    <span className="text-[11px] font-mono text-saffron-500 font-bold">{xp} XP</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div
                      role="progressbar"
                      aria-valuenow={xpProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="XP level progress"
                      className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-0.5 text-xs font-black text-orange-500">
                    <span>🔥</span>
                    <span>{streak}d</span>
                  </div>
                )}
              </div>
            </button>

            {/* Nav links */}
            <nav className="flex-1 space-y-1">
              {NAV_LINKS.map(link => {
                const isActive = (currentView === 'home' && activeSection === link.id) || (currentView === link.id);
                return (
                  <button
                    key={link.id}
                    onClick={() => { onNavigate(link.id); setShowMobile(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-saffron-500 text-white shadow-sm'
                        : darkMode ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{link.icon}</span>
                      <span>{link.label}</span>
                    </div>
                    {isActive && <span className="text-xs">●</span>}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-slate-700/20 space-y-1">
                <button
                  onClick={() => { onOpenSearch(); setShowMobile(false); }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold transition-all ${
                    darkMode ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">🔍</span>
                  <span>Search Dictionary</span>
                </button>

                <button
                  onClick={() => { onOpenCheatSheet(); setShowMobile(false); }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold transition-all ${
                    darkMode ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">📄</span>
                  <span>Travel Cheat Sheet</span>
                </button>

                <button
                  onClick={() => { onOpenDashboard(); setShowMobile(false); }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold transition-all ${
                    darkMode ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">🦁</span>
                  <span>Learner Profile & Stats</span>
                </button>
              </div>
            </nav>

            {/* Bottom Footer */}
            <div className="pt-4 border-t border-slate-700/20 mt-4 text-center">
              <span className="sinhala-text text-saffron-500 text-xs font-bold" lang="si">
                සිංහල පුළුවන්ද? v{APP_VERSION}
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
