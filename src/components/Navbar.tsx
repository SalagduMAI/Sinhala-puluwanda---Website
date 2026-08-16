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

const PRIMARY_NAV_LINKS = [
  { label: 'Home', id: 'home', icon: '🏠' },
  { label: 'Lessons', id: 'lessons', icon: '📚' },
  { label: 'Alphabet', id: 'alphabet', icon: '🔤' },
  { label: 'Grammar', id: 'grammar', icon: '✍️' },
  { label: 'Practice', id: 'practice', icon: '🎮' },
];

const SECONDARY_NAV_LINKS = [
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
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { lang, setLanguage } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      if (currentView === 'home') {
        const sections = ['contact', 'about', 'phrases', 'practice', 'grammar', 'lessons', 'alphabet'];
        const scrollPos = window.scrollY + 180;
        
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

  // Close menus on resize
  useEffect(() => {
    const handleResize = () => { 
      if (window.innerWidth >= 1024) setShowMobile(false); 
      setShowMoreMenu(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Escape key closes menus
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') {
        setShowMobile(false);
        setShowMoreMenu(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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
          ? 'bg-slate-950/60 backdrop-blur-md border-b border-white/10'
          : darkMode
            ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20'
            : 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-slate-200/40'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
              aria-label="Sinhala Puluwanda Home"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-md shadow-saffron-500/25 group-hover:scale-105 transition-all duration-300">
                <span className="text-white text-xs font-bold sinhala-text" lang="si">සිං</span>
              </div>
              <div className="hidden sm:block">
                <span className={`font-black text-sm font-space tracking-tight leading-tight block ${
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

          {/* Center: Core Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-500/5 dark:bg-slate-800/40 border border-slate-500/10">
            {PRIMARY_NAV_LINKS.map(link => {
              const isActive = (currentView === 'home' && activeSection === link.id) || (currentView === link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
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

            {/* More Menu Dropdown for secondary pages */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1 ${
                  ['phrases', 'about', 'contact'].includes(activeSection)
                    ? 'text-saffron-500 font-extrabold'
                    : isHero
                    ? 'text-white/70 hover:text-white'
                    : darkMode
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>More</span>
                <span className="text-[9px]">▾</span>
              </button>

              {showMoreMenu && (
                <div className={`absolute left-0 mt-2 w-36 rounded-2xl border shadow-xl p-1.5 z-50 animate-scale-up ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  {SECONDARY_NAV_LINKS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setShowMoreMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        activeSection === item.id
                          ? 'bg-saffron-500 text-white'
                          : darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right: Compact & Harmonious Tools & Controls */}
          <div className="flex items-center gap-2">
            
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-slate-900/60 text-white/90 border-white/20'
                  : darkMode
                  ? 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Search vocabulary (Ctrl+K)"
              aria-label="Search vocabulary"
            >
              <svg className="w-3.5 h-3.5 text-saffron-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden lg:inline-block px-1 py-0.2 text-[9px] bg-black/20 dark:bg-white/10 rounded font-mono">⌘K</kbd>
            </button>

            {/* Travel Cheat Sheet */}
            <button
              onClick={onOpenCheatSheet}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  : darkMode
                  ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title="Printable Sri Lanka Travel Cheat Sheet"
              aria-label="Travel Cheat Sheet"
            >
              <span>📄</span>
              <span className="hidden xl:inline">Cheat Sheet</span>
            </button>

            {/* Learner Profile / Level Badge */}
            <button
              onClick={onOpenDashboard}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-slate-900/60 border-white/20 text-white'
                  : darkMode ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}
              aria-label="Open Learner Profile"
              title={`Level ${level} • ${xp} XP (Click to open Dashboard)`}
            >
              <span className="text-xs">⭐</span>
              <span className="text-xs font-bold text-saffron-500">Lv.{level}</span>
              <div className={`hidden sm:block w-8 h-1 rounded-full overflow-hidden ${isHero ? 'bg-white/20' : darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}>
                <div
                  role="progressbar"
                  aria-valuenow={xpProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="XP level progress"
                  className="h-full bg-saffron-500 rounded-full"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              {streak > 0 && (
                <span className="text-[11px] font-black text-orange-500 flex items-center gap-0.5">
                  🔥{streak}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Select UI Language"
                className={`text-xs font-bold px-2 py-1.5 rounded-xl border transition-all cursor-pointer focus:outline-none ${
                  isHero
                    ? 'bg-slate-900/80 text-white border-white/20'
                    : darkMode
                    ? 'bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                    {l.flag} {l.code.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDark}
              className={`p-2 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
                isHero
                  ? 'bg-slate-900/60 text-white border-white/20'
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

            {/* Mobile Menu Hamburger (Visible < 1024px) */}
            <button
              onClick={() => setShowMobile(!showMobile)}
              className={`lg:hidden p-2 rounded-xl border transition-all ${
                isHero
                  ? 'bg-slate-900/60 text-white border-white/20'
                  : darkMode
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
              aria-label={showMobile ? 'Close menu' : 'Open menu'}
              aria-expanded={showMobile}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobile ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      {showMobile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-40 lg:hidden animate-fade-in"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobile(false)}
          />

          {/* Drawer Content */}
          <div className={`fixed inset-y-0 right-0 w-72 max-w-[80vw] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left ${
            darkMode ? 'bg-slate-900 border-l border-slate-800 text-white' : 'bg-white border-l border-slate-200 text-slate-900'
          }`}>
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-700/20 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white text-xs font-bold">
                    සිං
                  </div>
                  <span className="font-bold text-sm font-space">Menu</span>
                </div>
                <button
                  onClick={() => setShowMobile(false)}
                  className={`p-1.5 rounded-lg border text-xs ${
                    darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {[...PRIMARY_NAV_LINKS, ...SECONDARY_NAV_LINKS].map(link => {
                  const isActive = (currentView === 'home' && activeSection === link.id) || (currentView === link.id);
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        onNavigate(link.id);
                        setShowMobile(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-saffron-500 text-white shadow-md shadow-saffron-500/20'
                          : darkMode
                          ? 'hover:bg-slate-800 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{link.icon}</span>
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer / Profile summary */}
            <div className="pt-6 border-t border-slate-700/20 space-y-3">
              <button
                onClick={() => {
                  onOpenDashboard();
                  setShowMobile(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <span>⭐ Open Dashboard (Lv.{level})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
