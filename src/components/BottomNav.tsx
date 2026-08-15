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
  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 py-2 border-t backdrop-blur-xl transition-all duration-300 ${
        darkMode
          ? 'bg-slate-950/85 border-slate-800/80 text-slate-400'
          : 'bg-white/85 border-slate-200/80 text-slate-600 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* 1. Home */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentView === 'home'
              ? 'text-saffron-500 font-bold scale-105'
              : 'hover:text-saffron-500'
          }`}
          aria-label="Go to Home"
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. Lessons */}
        <button
          onClick={() => {
            onNavigate('home');
            setTimeout(() => {
              const el = document.getElementById('lessons');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          className="flex flex-col items-center py-1 px-2 rounded-xl hover:text-saffron-500 transition-all"
          aria-label="View Lessons"
        >
          <span className="text-xl">📚</span>
          <span className="text-[10px] mt-0.5">Lessons</span>
        </button>

        {/* 3. Alphabet / Pillam */}
        <button
          onClick={() => {
            onNavigate('home');
            setTimeout(() => {
              const el = document.getElementById('alphabet');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          className="flex flex-col items-center py-1 px-2 rounded-xl hover:text-saffron-500 transition-all"
          aria-label="View Alphabet"
        >
          <span className="text-xl">🔤</span>
          <span className="text-[10px] mt-0.5">Alphabet</span>
        </button>

        {/* 4. Practice */}
        <button
          onClick={() => {
            onNavigate('home');
            setTimeout(() => {
              const el = document.getElementById('practice');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          className="flex flex-col items-center py-1 px-2 rounded-xl hover:text-saffron-500 transition-all"
          aria-label="View Practice Hub"
        >
          <span className="text-xl">🎮</span>
          <span className="text-[10px] mt-0.5">Practice</span>
        </button>

        {/* 5. Search Dictionary */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center py-1 px-2 rounded-xl hover:text-saffron-500 transition-all text-amber-500"
          aria-label="Open Vocabulary Search"
        >
          <span className="text-xl">🔍</span>
          <span className="text-[10px] mt-0.5 font-semibold">Search</span>
        </button>

        {/* 6. Dashboard / Profile */}
        <button
          onClick={onOpenDashboard}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentView === 'dashboard'
              ? 'text-saffron-500 font-bold scale-105'
              : 'hover:text-saffron-500'
          }`}
          aria-label="View Profile Dashboard"
        >
          <span className="text-xl">🦁</span>
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>

      </div>
    </nav>
  );
}
