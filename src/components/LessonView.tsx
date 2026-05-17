import { useState } from 'react';
import { Lesson, Word } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';

interface LessonViewProps {
  lesson: Lesson;
  darkMode: boolean;
  soundEnabled: boolean;
  onBack: () => void;
  onStartQuiz: () => void;
  onWordLearned: (lessonId: number, wordIndex: number) => void;
  learnedWords: number[];
}

function WordCard({ word, index, isLearned, darkMode, soundEnabled, onLearn, onSpeak }: {
  word: Word; index: number; isLearned: boolean; darkMode: boolean; soundEnabled: boolean;
  onLearn: () => void; onSpeak: (text: string) => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="animate-slide-up" style={{ animationDelay: `${index * 0.04}s` }}>
      <div
        onClick={() => setFlipped(!flipped)}
        className={`relative cursor-pointer rounded-2xl p-6 min-h-[200px] flex flex-col justify-between transition-all duration-500 ${
          flipped
            ? darkMode
              ? 'bg-gradient-to-br from-saffron-900/30 to-orange-900/20 border-2 border-saffron-700/50 shadow-lg shadow-saffron-900/20'
              : 'bg-gradient-to-br from-saffron-50 to-orange-50 border-2 border-saffron-300 shadow-lg shadow-saffron-100'
            : darkMode
              ? 'bg-slate-900 border-2 border-slate-800 hover:border-saffron-800/50'
              : 'bg-white border-2 border-slate-200 hover:border-saffron-300 hover:shadow-md'
        }`}
      >
        {/* Learned badge */}
        {isLearned && (
          <div className="absolute top-3 right-3 bg-leaf-500/20 text-leaf-500 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            ✓
          </div>
        )}

        {/* Sound button */}
        {soundEnabled && (
          <button
            onClick={(e) => { e.stopPropagation(); onSpeak(word.sinhala); }}
            className={`absolute top-3 left-3 p-1.5 rounded-lg transition-colors ${
              darkMode ? 'text-slate-600 hover:text-saffron-400 hover:bg-slate-800' : 'text-slate-300 hover:text-saffron-500 hover:bg-saffron-50'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {!flipped ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className={`sinhala-text text-3xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {word.sinhala}
            </span>
            <span className={`text-sm italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{word.transliteration}</span>
            <p className="text-xs text-saffron-500 mt-4 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tap to reveal
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-2xl font-bold text-saffron-500 mb-1">{word.english}</span>
            <span className={`sinhala-text text-lg mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{word.sinhala}</span>
            <span className={`text-sm italic mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{word.transliteration}</span>

            {word.example && (
              <div className={`rounded-xl p-3 w-full ${darkMode ? 'bg-slate-800' : 'bg-white/80'}`}>
                <p className={`sinhala-text text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{word.example}</p>
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
}

export default function LessonView({ lesson, darkMode, soundEnabled, onBack, onStartQuiz, onWordLearned, learnedWords }: LessonViewProps) {
  const progress = Math.round((learnedWords.length / lesson.words.length) * 100);
  const { speak } = useSpeech();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${lesson.color} pt-20 pb-8 px-4`}>
        <div className="max-w-6xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lessons
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
              {lesson.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{lesson.title}</h1>
              <p className="sinhala-text text-white/80 text-lg">{lesson.titleSinhala}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-white font-bold text-sm">{learnedWords.length}/{lesson.words.length}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Vocabulary</h2>
            <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Tap each card to reveal • Learn all to complete</p>
          </div>
          <button
            onClick={onStartQuiz}
            className="px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-saffron-500/20 transition-all duration-300 hover:scale-105 text-sm"
          >
            🧪 Take Quiz
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lesson.words.map((word, index) => (
            <WordCard
              key={index}
              word={word}
              index={index}
              isLearned={learnedWords.includes(index)}
              darkMode={darkMode}
              soundEnabled={soundEnabled}
              onLearn={() => onWordLearned(lesson.id, index)}
              onSpeak={speak}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
