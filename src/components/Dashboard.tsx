import React, { useState, useMemo } from 'react';
import { ALL_ACHIEVEMENTS, XP_PER_LEVEL } from '../hooks/useGameState';
import { lessons } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';

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
  starredWords: Record<number, number[]>;
  srsData: Record<string, { interval: number; ease: number; repetitions: number; nextReview: number }>;
  avatar: string;
  onBack: () => void;
  onToggleStarWord: (lessonId: number, wordIndex: number) => void;
  onChangeAvatar: (avatarId: string) => void;
  onImportState: (state: any) => boolean;
}

const AVATARS = [
  { id: 'novice', label: 'Novice 🌱', minLevel: 1, desc: 'Start learning' },
  { id: 'traveler', label: 'Traveler 🛺', minLevel: 2, desc: 'Level 2 Required' },
  { id: 'chatter', label: 'Chatter 💬', minLevel: 3, desc: 'Level 3 Required' },
  { id: 'scholar', label: 'Scholar 🎓', minLevel: 5, desc: 'Level 5 Required' },
  { id: 'expert', label: 'Expert 👑', minLevel: 10, desc: 'Level 10 Required' }
];

export default function Dashboard({
  darkMode, xp, level, streak, xpProgress, totalWordsLearned, achievements,
  totalQuizzes, perfectScores, wordsLearned, dailyXp, dailyGoal,
  starredWords, srsData, avatar, onBack, onToggleStarWord, onChangeAvatar, onImportState
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'starred' | 'settings'>('stats');
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const { speak, isSupported } = useSpeech();

  const dailyProgress = dailyGoal > 0 ? Math.min((dailyXp / dailyGoal) * 100, 100) : 100;
  const totalPhrases = lessons.reduce((sum, lesson) => sum + lesson.words.length, 0);

  // Count due words for SRS
  const srsDueCount = useMemo(() => {
    const now = Date.now();
    let count = 0;
    // Flatten learned words keys
    Object.entries(wordsLearned).forEach(([lIdStr, wordIndices]) => {
      const lessonId = parseInt(lIdStr);
      wordIndices.forEach(wordIdx => {
        const key = `${lessonId}-${wordIdx}`;
        const srs = srsData?.[key];
        if (!srs || srs.nextReview <= now) {
          count++;
        }
      });
    });
    return count;
  }, [wordsLearned, srsData]);

  // Flatten starred words list
  const starredList = useMemo(() => {
    const list: Array<{ lessonId: number; wordIdx: number; sinhala: string; english: string; romanized: string }> = [];
    Object.entries(starredWords || {}).forEach(([lIdStr, wordIndices]) => {
      const lessonId = parseInt(lIdStr);
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) return;
      wordIndices.forEach(wordIdx => {
        const word = lesson.words[wordIdx];
        if (word) {
          list.push({
            lessonId,
            wordIdx,
            sinhala: word.sinhala,
            english: word.english,
            romanized: word.transliteration
          });
        }
      });
    });
    return list;
  }, [starredWords]);

  const handleExport = () => {
    const backupData = {
      xp,
      level,
      streak,
      wordsLearned,
      achievements,
      totalQuizzesTaken: totalQuizzes,
      perfectScores,
      starredWords,
      srsData,
      avatar,
      version: '6.1.3',
      exportDate: Date.now()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinhala_puluwanda_progress_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const success = onImportState(parsed);
        if (success) {
          alert('🎉 Progress successfully restored! Re-loading dashboard...');
          window.location.reload();
        } else {
          alert('❌ Invalid backup file. Please upload a valid JSON backup file.');
        }
      } catch (err) {
        alert('❌ Error reading backup file. Make sure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const currentAvatarInfo = AVATARS.find(a => a.id === avatar) || AVATARS[0];

  const handlePlayWordSound = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    if (isSupported) {
      speak(word);
    }
  };

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 ${darkMode ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-slate-50 to-white text-slate-950'}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header with Back button and Avatar Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/20 pb-4">
          <div>
            <button onClick={onBack} className={`flex items-center gap-2 text-sm mb-2 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
              ⬅️ Back
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setAvatarMenuOpen(prev => !prev)}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-xl shadow-md border-2 border-white hover:scale-105 active:scale-95 transition-transform"
                  title="Choose Avatar Badge"
                >
                  {currentAvatarInfo.label.split(' ')[1] || '👤'}
                </button>
                
                {avatarMenuOpen && (
                  <div className={`absolute left-0 mt-2 w-56 rounded-2xl p-3 border shadow-2xl z-[90] space-y-2 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 pb-1 border-b border-slate-700/10">Select Badge</h4>
                    <div className="space-y-1">
                      {AVATARS.map(av => {
                        const unlocked = level >= av.minLevel;
                        return (
                          <button
                            key={av.id}
                            disabled={!unlocked}
                            onClick={() => { onChangeAvatar(av.id); setAvatarMenuOpen(false); }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                              unlocked
                                ? avatar === av.id
                                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20 font-bold'
                                  : 'hover:bg-slate-800/50 hover:text-amber-500 border border-transparent'
                                : 'opacity-40 cursor-not-allowed border border-transparent'
                            }`}
                          >
                            <span>{av.label}</span>
                            {!unlocked && <span className="text-[10px] text-slate-500">Lvl {av.minLevel}🔒</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-space">
                  {currentAvatarInfo.label.split(' ')[0]}'s Profile
                </h1>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Badge: <span className="font-semibold text-amber-500">{currentAvatarInfo.label}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Review Alert / CTA */}
          {srsDueCount > 0 && (
            <div className={`p-3 rounded-2xl flex items-center space-x-3 border ${
              darkMode ? 'bg-emerald-950/20 border-emerald-800/30' : 'bg-emerald-50 border-emerald-100'
            }`}>
              <div className="text-xl">📚</div>
              <div>
                <div className="text-xs font-bold">Review Spaced Repetition</div>
                <div className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  You have <span className="text-emerald-500 font-bold">{srsDueCount} words</span> due for review.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-700/20">
          {(['stats', 'starred', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-semibold text-sm border-b-2 -mb-[2px] transition-all capitalize ${
                activeTab === tab
                  ? 'border-amber-500 text-amber-500 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'stats' ? '📊 Progress Stats' : tab === 'starred' ? `⭐ Starred Words (${starredList.length})` : '⚙️ Backup & Restore'}
            </button>
          ))}
        </div>

        {/* TABS CONTAINER */}
        <div>
          {/* TAB 1: PROGRESS & STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Main stats grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Level', value: level, icon: '⭐', color: 'from-amber-400 to-amber-600', sub: `${xp} total XP` },
                  { label: 'Day Streak', value: streak, icon: '🔥', color: 'from-orange-400 to-red-500', sub: 'Keep it up!' },
                  { label: 'Words Learned', value: totalWordsLearned, icon: '📚', color: 'from-blue-400 to-blue-600', sub: `out of ${totalPhrases}` },
                  { label: 'Quizzes Taken', value: totalQuizzes, icon: '🧪', color: 'from-purple-400 to-purple-600', sub: `${perfectScores} perfect` },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-5 border ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>{stat.sub}</span>
                    </div>
                    <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* XP Progress + Daily Goal */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Level progress */}
                <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
                  <h3 className="font-bold text-sm mb-4">Level Progress</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg text-white font-bold text-xl">
                      {level}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold">Level {level}</span>
                        <span className="text-xs text-slate-500">{xp % XP_PER_LEVEL}/{XP_PER_LEVEL} XP</span>
                      </div>
                      <div role="progressbar" aria-valuenow={xpProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Level progress" className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700 xp-bar-glow" style={{ width: `${xpProgress}%` }} />
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {XP_PER_LEVEL - (xp % XP_PER_LEVEL)} XP to Level {level + 1}
                  </p>
                </div>

                {/* Daily goal */}
                <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
                  <h3 className="font-bold text-sm mb-4">🎯 Daily Goal</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100" role="progressbar" aria-valuenow={Math.round(dailyProgress)} aria-valuemin={0} aria-valuemax={100} aria-label="Daily goal progress">
                        <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className={darkMode ? 'stroke-slate-800' : 'stroke-slate-100'} />
                        <circle
                          cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                          className="stroke-amber-500 transition-all duration-700"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - dailyProgress / 100)}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">{dailyXp}</span>
                        <span className="text-[10px] text-slate-500">/{dailyGoal} XP</span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-center text-xs ${
                    dailyProgress >= 100
                      ? 'text-emerald-500 font-semibold'
                      : darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {dailyProgress >= 100 ? '🎉 Goal completed!' : `${Math.round(dailyProgress)}% complete`}
                  </p>
                </div>
              </div>

              {/* Lesson breakdown */}
              <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
                <h3 className="font-bold text-sm mb-5">📚 Lesson Progress</h3>
                <div className="space-y-4">
                  {lessons.map(lesson => {
                    const learned = wordsLearned[lesson.id]?.length || 0;
                    const total = lesson.words.length;
                    const pct = Math.round((learned / total) * 100);
                    return (
                      <div key={lesson.id} className="flex items-center gap-4">
                        <span className="text-xl w-8 text-center">{lesson.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold">{lesson.title}</span>
                            <span className="text-[10px] text-slate-500">{learned}/{total}</span>
                          </div>
                          <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${lesson.title} progress`} className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className={`h-full rounded-full bg-gradient-to-r ${lesson.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        {pct === 100 && <span className="text-emerald-500 text-xs font-bold">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Achievements */}
              <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-sm">🏆 Achievements</h3>
                  <span className="text-xs text-slate-500">
                    {achievements.length}/{ALL_ACHIEVEMENTS.length} unlocked
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ALL_ACHIEVEMENTS.map(ach => {
                    const unlocked = achievements.includes(ach.id);
                    return (
                      <div
                        key={ach.id}
                        className={`rounded-2xl p-4 text-center border transition-all duration-300 ${
                          unlocked
                            ? darkMode
                              ? 'bg-amber-900/20 border-amber-700/30'
                              : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm'
                            : darkMode
                              ? 'bg-slate-800/50 border-slate-700/50 opacity-50'
                              : 'bg-slate-50 border-slate-200 opacity-40'
                        }`}
                      >
                        <span className={`text-2xl block mb-1.5 ${unlocked ? '' : 'grayscale'}`}>{ach.icon}</span>
                        <p className={`text-xs font-bold mb-0.5 ${
                          unlocked
                            ? darkMode ? 'text-amber-400' : 'text-amber-700'
                            : darkMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>{ach.title}</p>
                        <p className="text-[9px] text-slate-400 leading-snug">{ach.description}</p>
                        {unlocked && <span className="text-[9px] text-emerald-500 font-bold mt-1 block">✓ Unlocked</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STARRED WORDS */}
          {activeTab === 'starred' && (
            <div className={`rounded-2xl p-6 border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            } space-y-4`}>
              <h3 className="font-bold text-sm">⭐ Starred Vocabulary</h3>
              {starredList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">
                  You haven't bookmarked any words yet. Star words in the lessons to study them here!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {starredList.map(item => (
                    <div
                      key={`${item.lessonId}-${item.wordIdx}`}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        darkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-800/30' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xl font-bold font-sans text-slate-900 dark:text-white" lang="si">
                            {item.sinhala}
                          </h4>
                          <button
                            onClick={(e) => handlePlayWordSound(e, item.sinhala)}
                            className="text-xs p-1 rounded hover:bg-slate-700/20 text-slate-400 hover:text-amber-500"
                            aria-label="Speak pronunciation"
                          >
                            🔊
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-amber-500">{item.english}</p>
                        <p className="text-[10px] text-slate-400 italic">[{item.romanized}]</p>
                      </div>
                      
                      <button
                        onClick={() => onToggleStarWord(item.lessonId, item.wordIdx)}
                        className="p-2 rounded-xl text-amber-500 hover:bg-amber-500/10 transition-colors"
                        aria-label="Remove Bookmark"
                      >
                        ★
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS & BACKUP */}
          {activeTab === 'settings' && (
            <div className={`rounded-2xl p-6 border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            } space-y-6`}>
              <div>
                <h3 className="font-bold text-sm mb-1">⚙️ Progress Backup & Restore</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Export your current XP, level, learned words, and achievements to a progress backup file, or upload a backup to restore your data on this or another browser/device.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Export panel */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Export Backup</h4>
                    <p className="text-[11px] text-slate-400">
                      Saves your complete learning profile as a JSON file to your device.
                    </p>
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md shadow-amber-500/10"
                  >
                    💾 Download Progress Backup
                  </button>
                </div>

                {/* Import panel */}
                <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Restore Backup</h4>
                    <p className="text-[11px] text-slate-400 text-rose-400 font-medium">
                      ⚠️ Warning: Restoring progress will overwrite your current progress state.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Upload backup file"
                    />
                    <button
                      className={`w-full py-2.5 font-bold rounded-xl text-xs text-center border transition-all pointer-events-none ${
                        darkMode
                          ? 'bg-slate-900 border-slate-800 text-slate-300'
                          : 'bg-white border-slate-300 text-slate-700 shadow-sm'
                      }`}
                    >
                      📤 Upload backup (.json)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
