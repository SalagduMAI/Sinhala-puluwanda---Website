import { useState, memo } from 'react';
import { Lesson, Word } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';
import VoiceComparisonModal from './VoiceComparisonModal';

interface LessonViewProps {
  lesson: Lesson;
  darkMode: boolean;
  soundEnabled: boolean;
  onBack: () => void;
  onStartQuiz: () => void;
  onWordLearned: (lessonId: number, wordIndex: number) => void;
  learnedWords: number[];
  starredWords: Record<number, number[]>;
  onToggleStarWord: (lessonId: number, wordIndex: number) => void;
}

const WordCard = memo(function WordCard({
  word, index, isLearned, isStarred, darkMode, soundEnabled, onLearn, onSpeak, onToggleStar,
  onOpenStudio
}: {
  word: Word; index: number; isLearned: boolean; isStarred: boolean; darkMode: boolean; soundEnabled: boolean;
  onLearn: () => void; onSpeak: (text: string, romanizedFallback?: string) => void; onToggleStar: () => void;
  onOpenStudio: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="animate-slide-up" style={{ animationDelay: `${index * 0.04}s` }}>
      <div
        role="group"
        aria-expanded={flipped}
        aria-label={`Vocabulary Card ${index + 1}: ${word.english}. ${isLearned ? 'Learned' : 'Not learned'}`}
        onClick={() => setFlipped(!flipped)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFlipped(!flipped);
          }
        }}
        className={`relative cursor-pointer rounded-2xl p-4 sm:p-6 min-h-[180px] sm:min-h-[200px] flex flex-col justify-between transition-all duration-500 ${
          flipped
            ? darkMode
              ? 'bg-gradient-to-br from-saffron-900/30 to-orange-900/20 border-2 border-saffron-700/50 shadow-lg shadow-saffron-900/20'
              : 'bg-gradient-to-br from-saffron-50 to-orange-50 border-2 border-saffron-300 shadow-lg shadow-saffron-100'
            : darkMode
              ? 'bg-slate-900 border-2 border-slate-800 hover:border-saffron-800/50'
              : 'bg-white border-2 border-slate-200 hover:border-saffron-300 hover:shadow-md'
        }`}
      >
        {/* Star / Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStar(); }}
          className={`absolute top-3 right-3 p-1.5 rounded-lg transition-colors z-10 ${
            isStarred 
              ? 'text-amber-500 hover:text-amber-600 scale-110' 
              : darkMode 
                ? 'text-slate-600 hover:text-slate-400 hover:bg-slate-800' 
                : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
          }`}
          aria-label={isStarred ? "Remove Bookmark" : "Bookmark Word"}
        >
          {isStarred ? '★' : '☆'}
        </button>

        {/* Learned badge */}
        {isLearned && (
          <div className="absolute top-3 right-10 bg-leaf-500/20 text-leaf-500 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
            ✓
          </div>
        )}

        {/* Sound & Mic buttons */}
        {soundEnabled && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); onSpeak(word.sinhala, word.transliteration); }}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'text-slate-400 hover:text-saffron-400 hover:bg-slate-800' : 'text-slate-500 hover:text-saffron-500 hover:bg-saffron-50'
              }`}
              aria-label={`Pronounce ${word.english} in Sinhala`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Pronunciation Studio Modal trigger */}
            <button
              onClick={(e) => { e.stopPropagation(); onOpenStudio(); }}
              className={`p-1.5 rounded-lg transition-all ${
                darkMode
                  ? 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              title="Open Voice Studio & Waveform Evaluator"
              aria-label="Open Pronunciation Studio"
            >
              <span className="text-xs">🎙️</span>
            </button>
          </div>
        )}

        {/* Card front (English) */}
        {!flipped && (
          <div className="flex flex-col items-center justify-center flex-1 py-4 text-center mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold mb-1 tracking-tight text-slate-800 dark:text-white font-space">
              {word.english}
            </span>
            <span className="text-xs text-saffron-500 font-semibold mb-3">Tap to flip & learn</span>

            {!isLearned && (
              <button
                onClick={(e) => { e.stopPropagation(); onLearn(); }}
                className="px-4 py-2 bg-leaf-500 text-white text-xs font-bold rounded-xl hover:bg-leaf-600 transition-colors shadow-sm hover:scale-105 active:scale-95"
              >
                ✓ Mark as Learned (+10 XP)
              </button>
            )}
          </div>
        )}

        {/* Card back (Sinhala) */}
        {flipped && (
          <div className="flex flex-col items-center justify-center flex-1 py-4 text-center mt-4">
            <span className="sinhala-text text-3xl sm:text-4xl font-extrabold text-saffron-500 dark:text-saffron-400 mb-1" lang="si">
              {word.sinhala}
            </span>
            <span className={`text-sm italic mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{word.transliteration}</span>

            {word.example && (
              <div className={`rounded-xl p-3 w-full ${darkMode ? 'bg-slate-800' : 'bg-white/80'}`}>
                <p className={`sinhala-text text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} lang="si">{word.example}</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{word.exampleTranslation}</p>
              </div>
            )}

            {!isLearned && (
              <button
                onClick={(e) => { e.stopPropagation(); onLearn(); }}
                className="mt-3 px-4 py-2 bg-leaf-500 text-white text-sm font-semibold rounded-xl hover:bg-leaf-600 transition-colors shadow-sm hover:scale-105 active:scale-95"
              >
                ✓ Mark as Learned (+10 XP)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default function LessonView({
  lesson, darkMode, soundEnabled, onBack, onStartQuiz, onWordLearned, learnedWords, starredWords, onToggleStarWord
}: LessonViewProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [studioWord, setStudioWord] = useState<Word | null>(null);
  const progress = Math.round((learnedWords.length / lesson.words.length) * 100);
  const { speak } = useSpeech();

  const handleLearnWord = (idx: number) => {
    onWordLearned(lesson.id, idx);
    if (learnedWords.length + 1 === lesson.words.length) {
      setShowCelebration(true);
    }
  };

  const isStarred = (idx: number) => {
    return (starredWords[lesson.id] || []).includes(idx);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${lesson.color} pt-20 pb-8 px-4`}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-bold transition-colors"
          >
            ← Back to Lessons
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">{lesson.icon}</span>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-space tracking-tight">
                  {lesson.title}
                </h1>
              </div>
              <p className="text-white/80 text-sm">{lesson.description}</p>
            </div>

            <button
              onClick={onStartQuiz}
              className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm self-start sm:self-auto"
            >
              🧪 Take Quiz ({progress}%)
            </button>
          </div>
        </div>
      </div>

      {/* Words Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lesson.words.map((word, index) => (
            <WordCard
              key={index}
              word={word}
              index={index}
              isLearned={learnedWords.includes(index)}
              isStarred={isStarred(index)}
              darkMode={darkMode}
              soundEnabled={soundEnabled}
              onLearn={() => handleLearnWord(index)}
              onSpeak={speak}
              onToggleStar={() => onToggleStarWord(lesson.id, index)}
              onOpenStudio={() => setStudioWord(word)}
            />
          ))}
        </div>
      </div>

      {/* Voice Pronunciation Studio Modal */}
      {studioWord && (
        <VoiceComparisonModal
          isOpen={!!studioWord}
          onClose={() => setStudioWord(null)}
          darkMode={darkMode}
          word={studioWord}
        />
      )}

      {/* Celebration Modal Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-3xl p-8 border text-center space-y-6 animate-scale-up ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950 shadow-2xl'
          }`}>
            <div className="text-7xl animate-bounce">🎊🏆🎊</div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-space">Lesson Completed!</h3>
              <p className="sinhala-text text-amber-500 font-bold" lang="si">පාඩම සම්පූර්ණයි!</p>
            </div>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
              Incredible work! You have marked all {lesson.words.length} vocabulary words in {lesson.title} as learned. You are making fast progress!
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => { setShowCelebration(false); onStartQuiz(); }}
                className="w-full py-3.5 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-white font-bold rounded-2xl shadow-lg shadow-saffron-500/20 active:scale-95 transition-all duration-200"
              >
                🧪 Take Lesson Quiz
              </button>
              <button
                onClick={() => setShowCelebration(false)}
                className={`w-full py-3.5 rounded-2xl font-bold border transition-all ${
                  darkMode ? 'hover:bg-slate-800 text-slate-400 border-slate-700' : 'hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                Keep Studying
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
