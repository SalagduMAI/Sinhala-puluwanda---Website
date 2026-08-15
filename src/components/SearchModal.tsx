import { useState, useMemo, useEffect, useRef } from 'react';
import { lessons, Word } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  soundEnabled?: boolean;
  onSelectLesson: (lessonId: number) => void;
  starredWords: Record<number, number[]>;
  onToggleStarWord: (lessonId: number, wordIndex: number) => void;
}

interface SearchResult {
  lessonId: number;
  lessonTitle: string;
  lessonIcon: string;
  wordIdx: number;
  sinhala: string;
  english: string;
  transliteration: string;
  example?: string;
  exampleTranslation?: string;
}

export default function SearchModal({
  isOpen,
  onClose,
  darkMode,
  soundEnabled = true,
  onSelectLesson,
  starredWords,
  onToggleStarWord,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useSpeech();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Aggregate all words
  const allWords: SearchResult[] = useMemo(() => {
    const list: SearchResult[] = [];
    lessons.forEach(lesson => {
      lesson.words.forEach((word: Word, wordIdx: number) => {
        list.push({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonIcon: lesson.icon,
          wordIdx,
          sinhala: word.sinhala,
          english: word.english,
          transliteration: word.transliteration,
          example: word.example,
          exampleTranslation: word.exampleTranslation,
        });
      });
    });
    return list;
  }, []);

  // Filter results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allWords.slice(0, 15); // Default top 15 suggestions

    return allWords.filter(item =>
      item.english.toLowerCase().includes(q) ||
      item.sinhala.includes(q) ||
      item.transliteration.toLowerCase().includes(q) ||
      item.lessonTitle.toLowerCase().includes(q)
    );
  }, [allWords, query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        const selected = results[selectedIndex];
        onSelectLesson(selected.lessonId);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectLesson]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/20 flex items-center gap-3">
          <span className="text-xl">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search Sinhala words, English meanings, phrases (e.g. Water, Hello, 10)..."
            className={`flex-1 text-sm sm:text-base font-medium bg-transparent focus:outline-none placeholder:text-slate-400 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-700/40 text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <span className="text-4xl block">🥥</span>
              <p className="font-semibold text-sm">No matching vocabulary found</p>
              <p className="text-xs text-slate-500">Try searching for common words like "Tea", "Bus", "Ayubowan", "Thank you".</p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isStarred = (starredWords[item.lessonId] || []).includes(item.wordIdx);
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={`${item.lessonId}-${item.wordIdx}`}
                  onClick={() => { onSelectLesson(item.lessonId); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-saffron-500/15 border-saffron-500/50 shadow-md ring-1 ring-saffron-500/20'
                      : darkMode
                      ? 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{item.lessonIcon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold font-sans text-slate-900 dark:text-white" lang="si">
                          {item.sinhala}
                        </h4>
                        <span className="text-xs font-semibold text-saffron-500 truncate">
                          [{item.transliteration}]
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {item.english}
                      </p>
                      {item.example && (
                        <p className="text-[11px] text-slate-400 italic truncate mt-0.5">
                          "{item.example}" — {item.exampleTranslation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { if (soundEnabled) speak(item.sinhala, item.transliteration); }}
                      className="p-2 rounded-xl text-saffron-500 hover:bg-saffron-500/10 transition-colors"
                      title="Pronounce word"
                      aria-label="Speak pronunciation"
                    >
                      🔊
                    </button>

                    <button
                      onClick={() => onToggleStarWord(item.lessonId, item.wordIdx)}
                      className={`p-2 rounded-xl transition-colors ${
                        isStarred ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
                      }`}
                      title={isStarred ? 'Remove bookmark' : 'Bookmark word'}
                      aria-label="Bookmark word"
                    >
                      {isStarred ? '★' : '☆'}
                    </button>

                    <button
                      onClick={() => { onSelectLesson(item.lessonId); onClose(); }}
                      className="hidden sm:inline-flex px-3 py-1.5 bg-saffron-500/10 hover:bg-saffron-500 text-saffron-500 hover:text-white font-bold text-xs rounded-xl transition-all"
                    >
                      Study Lesson →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/40 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between px-5">
          <span>💡 Press <strong>↑↓</strong> to navigate, <strong>Enter</strong> to open lesson</span>
          <span>{results.length} words found</span>
        </div>

      </div>
    </div>
  );
}
