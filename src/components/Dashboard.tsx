import { ALL_ACHIEVEMENTS, XP_PER_LEVEL } from '../hooks/useGameState';
import { lessons } from '../data/lessons';

interface DashboardProps {
  darkMode: boolean;
  xp: number;
  level: number;
  streak: number;
  xpProgress: number;
  totalWordsLearned: number;
  achievements: string[];
  totalQuizzes: number;
  perfectScores: number;
  wordsLearned: Record<number, number[]>;
  dailyXp: number;
  dailyGoal: number;
  onBack: () => void;
}

export default function Dashboard({
  darkMode, xp, level, streak, xpProgress, totalWordsLearned, achievements,
  totalQuizzes, perfectScores, wordsLearned, dailyXp, dailyGoal, onBack
}: DashboardProps) {
  const dailyProgress = Math.min((dailyXp / dailyGoal) * 100, 100);

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={onBack} className={`flex items-center gap-2 text-sm mb-2 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>📊 Your Dashboard</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Track your Sinhala learning journey</p>
          </div>
        </div>

        {/* Main stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Level', value: level, icon: '⭐', color: 'from-saffron-400 to-saffron-600', sub: `${xp} total XP` },
            { label: 'Day Streak', value: streak, icon: '🔥', color: 'from-orange-400 to-red-500', sub: 'Keep it up!' },
            { label: 'Words Learned', value: totalWordsLearned, icon: '📚', color: 'from-blue-400 to-blue-600', sub: 'out of 144' },
            { label: 'Quizzes Taken', value: totalQuizzes, icon: '🧪', color: 'from-purple-400 to-purple-600', sub: `${perfectScores} perfect` },
          ].map((stat, i) => (
            <div
              key={i}
              className={`animate-slide-up rounded-2xl p-5 ${
                darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>{stat.sub}</span>
              </div>
              <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* XP Progress + Daily Goal */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* Level progress */}
          <div className={`rounded-2xl p-6 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Level Progress</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">{level}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Level {level}</span>
                  <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{xp % XP_PER_LEVEL}/{XP_PER_LEVEL} XP</span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-700 xp-bar-glow" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {XP_PER_LEVEL - (xp % XP_PER_LEVEL)} XP to Level {level + 1}
            </p>
          </div>

          {/* Daily goal */}
          <div className={`rounded-2xl p-6 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>🎯 Daily Goal</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className={darkMode ? 'stroke-slate-800' : 'stroke-slate-100'} />
                  <circle
                    cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                    className="stroke-saffron-500 transition-all duration-700"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - dailyProgress / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{dailyXp}</span>
                  <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>/{dailyGoal} XP</span>
                </div>
              </div>
            </div>
            <p className={`text-center text-sm ${
              dailyProgress >= 100
                ? 'text-leaf-500 font-semibold'
                : darkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {dailyProgress >= 100 ? '🎉 Goal completed!' : `${Math.round(dailyProgress)}% complete`}
            </p>
          </div>
        </div>

        {/* Lesson breakdown */}
        <div className={`rounded-2xl p-6 mb-8 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <h3 className={`font-bold mb-5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>📚 Lesson Progress</h3>
          <div className="space-y-4">
            {lessons.map(lesson => {
              const learned = wordsLearned[lesson.id]?.length || 0;
              const total = lesson.words.length;
              const pct = Math.round((learned / total) * 100);
              return (
                <div key={lesson.id} className="flex items-center gap-4">
                  <span className="text-2xl w-10 text-center">{lesson.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{lesson.title}</span>
                      <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{learned}/{total}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div className={`h-full rounded-full bg-gradient-to-r ${lesson.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {pct === 100 && <span className="text-leaf-500 text-sm font-bold">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className={`rounded-2xl p-6 ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>🏆 Achievements</h3>
            <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {achievements.length}/{ALL_ACHIEVEMENTS.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ALL_ACHIEVEMENTS.map(ach => {
              const unlocked = achievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`rounded-2xl p-4 text-center transition-all duration-300 ${
                    unlocked
                      ? darkMode
                        ? 'bg-saffron-900/20 border border-saffron-700/30'
                        : 'bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-200 shadow-sm'
                      : darkMode
                        ? 'bg-slate-800/50 border border-slate-700/50 opacity-50'
                        : 'bg-slate-50 border border-slate-200 opacity-40'
                  }`}
                >
                  <span className={`text-3xl block mb-2 ${unlocked ? '' : 'grayscale'}`}>{ach.icon}</span>
                  <p className={`text-xs font-bold mb-0.5 ${
                    unlocked
                      ? darkMode ? 'text-saffron-400' : 'text-saffron-700'
                      : darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>{ach.title}</p>
                  <p className={`text-[10px] ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>{ach.description}</p>
                  {unlocked && <span className="text-[10px] text-leaf-500 font-bold mt-1 block">✓ Unlocked</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
