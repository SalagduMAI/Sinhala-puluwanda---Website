interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const SHORTCUTS = [
  { key: 'Ctrl + K  /  ⌘ + K', action: 'Open Global Vocabulary & Dictionary Search' },
  { key: '?', action: 'Show Keyboard Shortcuts Guide' },
  { key: 'Esc', action: 'Close any active modal or search' },
  { key: '1, 2, 3, 4', action: 'Select Options A, B, C, D in Quizzes' },
  { key: 'Space', action: 'Flip Flashcard during SRS Study session' },
  { key: 'R', action: 'Replay audio pronunciation in Flashcards' },
  { key: '1, 2, 3, 4 (on back)', action: 'Rate Flashcard memory (Again, Hard, Good, Easy)' },
  { key: 'Enter', action: 'Next question in Quiz or restart' },
];

export default function ShortcutsModal({ isOpen, onClose, darkMode }: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-7 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⌨️</span>
            <h2 className="text-lg font-bold font-space">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-lg border border-slate-700/40 text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        <div className="space-y-3">
          {SHORTCUTS.map((sc, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-slate-600 dark:text-slate-300 font-medium">{sc.action}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-saffron-500/10 border border-saffron-500/30 text-saffron-500 font-mono font-bold text-[11px] shadow-sm flex-shrink-0">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold text-xs rounded-xl shadow-md shadow-saffron-500/10"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
