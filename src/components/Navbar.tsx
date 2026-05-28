import { useState, useEffect } from 'react';

interface NavbarProps {
  level: number;
  xp: number;
  xpProgress: number;
  streak: number;
  darkMode: boolean;
  onToggleDark: () => void;
  onNavigate: (section: string) => void;
  onOpenDashboard: () => void;
  currentView: string;
}

export default function Navbar({ level, xp, xpProgress, streak, darkMode, onToggleDark, onNavigate, onOpenDashboard, currentView }: NavbarProps) {
  const [showMobile, setShowMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setShowMobile(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isHero = currentView === 'home' && !scrolled;

  const navLinks = [
    { label: 'Home', id: 'home', icon: '🏠' },
    { label: 'Alphabet', id: 'alphabet', icon: '📖' },
    { label: 'Lessons', id: 'lessons', icon: '📚' },
    { label: 'Practice', id: 'practice', icon: '🎮' },
    { label: 'About', id: 'about', icon: '👤' },
    { label: 'Contact', id: 'contact', icon: '✉️' },
  ];

  const textColor = isHero
    ? 'text-white/80 hover:text-white'
    : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHero
          ? 'glass-nav'
          : darkMode
            ? 'glass-nav-solid bg-slate-950/80 border-b border-slate-800/50'
            : 'glass-nav-solid bg-white/80 border-b border-slate-200/60 shadow-sm shadow-slate-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-[68px]">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-lg shadow-saffron-500/25 group-hover:shadow-saffron-500/40 group-hover:scale-110 transition-all duration-300">
              <span className="text-white text-xs font-bold sinhala-text">සිං</span>
            </div>
            <div className="hidden sm:block">
              <span className={`font-bold text-sm font-space tracking-tight ${isHero ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'}`}>
                Sinhala Puluwanda
              </span>
              <span className={`block text-[10px] font-medium -mt-0.5 ${isHero ? 'text-saffron-300/80' : 'text-saffron-500'}`}>
v6.1.3
              </span>
            </div>
          </button>

          {/* Center nav — desktop */}
          <div className="hidden lg:flex items-center gap-0.5 px-2 py-1.5 rounded-2xl">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${textColor}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* XP badge */}
            <button
              onClick={onOpenDashboard}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                isHero
                  ? 'glass'
                  : darkMode ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-slate-50 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs">⭐</span>
                <span className={`text-xs font-bold ${isHero ? 'text-saffron-300' : darkMode ? 'text-saffron-400' : 'text-saffron-600'}`}>
                  Lv.{level}
                </span>
              </div>
              <div className={`w-14 h-1.5 rounded-full overflow-hidden ${isHero ? 'bg-white/15' : darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
              </div>
              <span className={`text-[10px] font-medium ${isHero ? 'text-white/50' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{xp}</span>
            </button>

            {/* Streak */}
            {streak > 0 && (
              <div className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl ${
                isHero ? 'glass' : darkMode ? 'bg-orange-950/40 border border-orange-900/30' : 'bg-orange-50 border border-orange-200/60'
              }`}>
                <span className="text-xs">🔥</span>
                <span className={`text-xs font-bold ${isHero ? 'text-orange-300' : darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{streak}</span>
              </div>
            )}

            {/* Dark mode */}
            <button onClick={onToggleDark} className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${textColor}`} aria-label="Toggle dark mode">
              {darkMode ? (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            {/* Dashboard */}
            <button onClick={onOpenDashboard} className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${textColor}`} aria-label="Dashboard">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setShowMobile(!showMobile)}
              className={`lg:hidden p-2 rounded-xl transition-all ${isHero ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'}`}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobile
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${showMobile ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${showMobile ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowMobile(false)} />

        {/* Panel */}
        <div className={`absolute right-0 top-0 bottom-0 w-[280px] sm:w-[320px] transition-transform duration-500 ease-out ${
          showMobile ? 'translate-x-0' : 'translate-x-full'
        } ${darkMode ? 'glass-dark' : 'bg-white/95 backdrop-blur-xl border-l border-slate-200/60'}`}>
          <div className="p-6 pt-20 flex flex-col h-full">
            {/* Mobile XP card */}
            <div className={`rounded-2xl p-4 mb-6 ${darkMode ? 'bg-slate-800/60 border border-slate-700/50' : 'bg-slate-50 border border-slate-200/60'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">{level}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Level {level}</span>
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{xp} XP</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
                  </div>
                </div>
                {streak > 0 && <div className="flex items-center gap-0.5"><span className="text-sm">🔥</span><span className="text-sm font-bold text-orange-500">{streak}</span></div>}
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 space-y-1">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => { onNavigate(link.id); setShowMobile(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium transition-all duration-200 ${
                    darkMode ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { onOpenDashboard(); setShowMobile(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium transition-all duration-200 ${
                  darkMode ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">📊</span>
                Dashboard
              </button>
            </nav>

            {/* Bottom of drawer */}
            <div className={`pt-4 border-t mt-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="sinhala-text text-saffron-500 text-sm font-medium text-center">සිංහල පුළුවන්ද? v6.1.3</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
