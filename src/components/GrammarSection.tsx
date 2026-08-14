import React, { useState } from 'react';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { useSpeech } from '../hooks/useSpeech';
import { useTranslation } from '../i18n/useTranslation';
import { useGame } from '../contexts/GameContext';

interface GrammarSectionProps {
  onAddXP?: (xp: number, reason?: string) => void;
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({ onAddXP }) => {
  const { speak } = useSpeech();
  const { t } = useTranslation();
  const { completeGrammarQuiz, state } = useGame();
  const [activeLessonId, setActiveLessonId] = useState<string>(GRAMMAR_LESSONS[0]?.id || 'sov-structure');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuizzes, setSubmittedQuizzes] = useState<Record<string, boolean>>({});

  const currentLesson = GRAMMAR_LESSONS.find((l) => l.id === activeLessonId) || GRAMMAR_LESSONS[0];

  const handleSelectOption = (quizId: string, optionIndex: number) => {
    if (submittedQuizzes[quizId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: optionIndex }));
  };

  const handleCheckQuiz = (quizId: string, correctIndex: number) => {
    setSubmittedQuizzes((prev) => ({ ...prev, [quizId]: true }));
    if (selectedAnswers[quizId] === correctIndex) {
      const awarded = completeGrammarQuiz(quizId);
      if (awarded && onAddXP) {
        onAddXP(15, 'Grammar Quiz Correct Answer!');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-3">
          <span>📖</span>
          <span>{t('nav.grammar', 'Sinhala Grammar Modules')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          {currentLesson.titleSinhala}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base">
          Master sentence structures, verb tenses, pronouns, and rules to construct natural Sinhala sentences effortlessly.
        </p>
      </div>

      {/* Lesson Navigation Tabs */}
      <div className="flex sm:flex-wrap items-center overflow-x-auto justify-start sm:justify-center gap-2.5 sm:gap-3 mb-8 pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {GRAMMAR_LESSONS.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          return (
            <button
              key={lesson.id}
              onClick={() => { setActiveLessonId(lesson.id); setSelectedAnswers({}); setSubmittedQuizzes({}); }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-medium transition-all duration-200 border text-xs sm:text-sm shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <span className="text-base sm:text-lg">{lesson.icon}</span>
              <span>{lesson.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Active Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Grammar Rules & Examples */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rules Box */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                📌
              </span>
              Grammar Rules & Structure
            </h2>
            <ul className="space-y-3">
              {currentLesson.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples Box */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400">
                💬
              </span>
              Example Sentences & Speech
            </h2>
            <div className="space-y-4">
              {currentLesson.examples.map((eg, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      {eg.sinhala}
                    </div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
                      {eg.transliteration}
                    </div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {eg.english}
                    </div>
                    {eg.explanation && (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 italic">
                        {eg.explanation}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => speak(eg.sinhala, eg.transliteration)}
                    className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition-all duration-200 shadow-md shadow-emerald-500/20 shrink-0"
                    title={`Pronounce: ${eg.sinhala}`}
                    aria-label={`Pronounce example sentence: ${eg.sinhala}`}
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Quizzes */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🏆</span>
              Practice Quizzes (+15 XP)
            </h2>

            <div className="space-y-6">
              {currentLesson.quizzes.map((quiz) => {
                const selected = selectedAnswers[quiz.id];
                const isSubmitted = submittedQuizzes[quiz.id];
                const isCorrect = selected === quiz.correctIndex;
                const isAlreadyCompleted = (state.completedGrammarQuizzes || []).includes(quiz.id);

                return (
                  <div key={quiz.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-400">Quiz</span>
                      {isAlreadyCompleted && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          ✓ Completed (+15 XP)
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      {quiz.question}
                    </p>

                    <div className="space-y-2 mb-4">
                      {quiz.options.map((opt, optIdx) => {
                        let optStyle = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700';
                        if (selected === optIdx) {
                          optStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold';
                        }
                        if (isSubmitted && optIdx === quiz.correctIndex) {
                          optStyle = 'bg-emerald-500 text-white border-emerald-500 font-semibold';
                        } else if (isSubmitted && selected === optIdx && !isCorrect) {
                          optStyle = 'bg-rose-500 text-white border-rose-500 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(quiz.id, optIdx)}
                            disabled={isSubmitted}
                            className={`w-full text-left p-3 rounded-xl border text-sm transition-all duration-150 ${optStyle}`}
                          >
                            {opt}
                            {isSubmitted && optIdx === quiz.correctIndex && " ✓"}
                            {isSubmitted && selected === optIdx && !isCorrect && " ✗"}
                          </button>
                        );
                      })}
                    </div>

                    {!isSubmitted ? (
                      <button
                        onClick={() => handleCheckQuiz(quiz.id, quiz.correctIndex)}
                        disabled={selected === undefined}
                        className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm disabled:opacity-50 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                      >
                        Check Answer ➔
                      </button>
                    ) : (
                      <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200'
                      }`}>
                        <span className="text-base">{isCorrect ? '✅' : '❌'}</span>
                        <div>
                          <div className="font-bold">{isCorrect ? 'Correct! +15 XP' : 'Incorrect'}</div>
                          <div className="mt-0.5">{quiz.explanation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
