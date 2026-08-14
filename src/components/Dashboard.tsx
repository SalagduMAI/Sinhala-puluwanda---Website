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
  userName: string;
  onBack: () => void;
  onToggleStarWord: (lessonId: number, wordIndex: number) => void;
  onChangeAvatar: (avatarId: string) => void;
  onUpdateProfile?: (name: string, avatar: string) => void;
  onResetProgress?: () => void;
  onSetDailyGoal?: (goal: number) => void;
  onImportState: (state: Record<string, unknown>) => boolean;
}

export const PROFILE_AVATARS = [
  { emoji: '🦁', name: 'Lion of Lanka', tag: 'Brave' },
  { emoji: '🐘', name: 'Royal Tusker', tag: 'Wise' },
  { emoji: '🌴', name: 'Island Explorer', tag: 'Adventurer' },
  { emoji: '🏄', name: 'Arugam Surfer', tag: 'Energetic' },
  { emoji: '🇱🇰', name: 'Sri Lankan Flag', tag: 'Proud' },
  { emoji: '🌟', name: 'Star Learner', tag: 'Bright' },
  { emoji: '🎓', name: 'Sinhala Scholar', tag: 'Studious' },
  { emoji: '👑', name: 'King of Kandy', tag: 'Royal' },
  { emoji: '🦚', name: 'Peacock Spirit', tag: 'Graceful' },
  { emoji: '🪷', name: 'Sacred Lotus', tag: 'Serene' },
  { emoji: '⚡', name: 'Fast Learner', tag: 'Quick' },
  { emoji: '🚀', name: 'Fluent Voyager', tag: 'Future' },
];

export interface LeaderboardEntry {
  name: string;
  xp: number;
  level: number;
  avatar: string;
  country: string;
  isUser?: boolean;
  rank?: number;
}

const GLOBAL_LEARNERS: LeaderboardEntry[] = [
  { name: 'Kasun Senanayake 🇱🇰', xp: 3250, level: 33, avatar: '🦁', country: 'Sri Lanka' },
  { name: 'Emily Watson 🇬🇧', xp: 2450, level: 25, avatar: '🎓', country: 'United Kingdom' },
  { name: 'Liam O\'Connor 🇦🇺', xp: 1890, level: 19, avatar: '🏄', country: 'Australia' },
  { name: 'Taro Tanaka 🇯🇵', xp: 1340, level: 14, avatar: '🌴', country: 'Japan' },
  { name: 'Sophie Dubois 🇫🇷', xp: 950, level: 10, avatar: '🪷', country: 'France' },
  { name: 'Johannes Müller 🇩🇪', xp: 680, level: 7, avatar: '⚡', country: 'Germany' },
  { name: 'Maya Patel 🇮🇳', xp: 450, level: 5, avatar: '🦚', country: 'India' },
  { name: 'David Chen 🇨🇦', xp: 220, level: 3, avatar: '🚀', country: 'Canada' },
];

export default function Dashboard({
  darkMode, xp, level, streak, xpProgress, totalWordsLearned, achievements,
  totalQuizzes, perfectScores, wordsLearned, dailyXp, dailyGoal,
  starredWords, srsData, avatar = '🦁', userName = 'Learner',
  onBack, onToggleStarWord, onChangeAvatar, onUpdateProfile, onResetProgress, onSetDailyGoal, onImportState
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'starred' | 'leaderboard' | 'settings'>('stats');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const [customGoal, setCustomGoal] = useState(dailyGoal);

  const { speak } = useSpeech();

  const dailyProgress = dailyGoal > 0 ? Math.min((dailyXp / dailyGoal) * 100, 100) : 100;
  const totalPhrases = lessons.reduce((sum, lesson) => sum + lesson.words.length, 0);

  // Calculate live global leaderboard with user ranked dynamically
  const leaderboard: LeaderboardEntry[] = useMemo(() => {
    const userEntry: LeaderboardEntry = {
      name: `${userName} (You)`,
      xp,
      level,
      avatar,
      country: 'Your Account',
      isUser: true,
      rank: 1,
    };

    const all = [...GLOBAL_LEARNERS, userEntry].sort((a, b) => b.xp - a.xp);
    return all.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [userName, xp, level, avatar]);

  const userRank = useMemo(() => {
    const found = leaderboard.find(item => 'isUser' in item && item.isUser);
    return found ? found.rank : 1;
  }, [leaderboard]);

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
            romanized: word.transliteration,
          });
        }
      });
    });
    return list;
  }, [starredWords]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(editName, selectedAvatar);
    } else {
      onChangeAvatar(selectedAvatar);
    }
    if (onSetDailyGoal && customGoal !== dailyGoal) {
      onSetDailyGoal(customGoal);
    }
    setIsEditProfileOpen(false);
  };

  const handleExecuteReset = () => {
    if (onResetProgress) {
      onResetProgress();
    }
    setIsResetConfirmOpen(false);
  };

  const handleExport = () => {
    const backupData = {
      userName,
      avatar,
      xp,
      level,
      streak,
      wordsLearned,
      achievements,
      totalQuizzesTaken: totalQuizzes,
      perfectScores,
      starredWords,
      srsData,
      dailyGoal,
      version: '6.1.3',
      exportDate: Date.now(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinhala_puluwanda_${userName.toLowerCase().replace(/\s+/g, '_')}_backup.json`;
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
        const requiredKeys = ['xp', 'level', 'streak', 'wordsLearned'];
        const isValid = requiredKeys.every(k => k in parsed);
        if (!isValid) {
          alert('❌ Invalid backup file: missing required progress fields.');
          return;
        }
        const success = onImportState(parsed);
        if (success) {
          setTimeout(() => window.location.reload(), 200);
        }
      } catch (err) {
        console.error('❌ Error reading backup file:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 sm:px-6 ${darkMode ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-slate-50 to-white text-slate-950'}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top User Profile Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border transition-all ${
          darkMode ? 'bg-slate-900/80 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-lg'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* User Avatar & Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative group">
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-saffron-400 to-saffron-600 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/20"
                  title="Click to customize profile avatar"
                >
                  <span>{avatar}</span>
                </button>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="absolute -bottom-1 -right-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-1.5 rounded-lg text-xs shadow-md opacity-80 hover:opacity-100 hover:scale-110 transition-all"
                  aria-label="Edit Profile"
                >
                  ✏️
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black font-space tracking-tight">
                    {userName}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    darkMode ? 'bg-saffron-500/20 text-saffron-400 border border-saffron-500/30' : 'bg-saffron-100 text-saffron-700'
                  }`}>
                    Level {level}
                  </span>
                </div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Rank #{userRank} Global • {xp} Total XP • 🔥 {streak} Day Streak
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>✏️</span> Edit Profile
              </button>

              <button
                onClick={onBack}
                className="px-4 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-saffron-500/20 flex items-center justify-center gap-1.5"
              >
                <span>🏠</span> Home
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/20 pb-2">
          {[
            { id: 'stats', label: '📊 Stats & Progress' },
            { id: 'leaderboard', label: `🏆 Global Leaderboard (Rank #${userRank})` },
            { id: 'starred', label: `⭐ Starred Words (${starredList.length})` },
            { id: 'settings', label: '⚙️ Settings & Reset' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-saffron-500 text-white shadow-lg shadow-saffron-500/20'
                  : darkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: STATS & OVERVIEW */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Key 4 Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Level & Rank', value: `Lv.${level}`, icon: '⭐', color: 'from-amber-400 to-amber-600', sub: `Rank #${userRank} Global` },
                { label: 'Day Streak', value: `${streak}d`, icon: '🔥', color: 'from-orange-400 to-red-500', sub: streak > 0 ? 'Active Streak!' : 'Start Today' },
                { label: 'Words Learned', value: totalWordsLearned, icon: '📚', color: 'from-blue-400 to-blue-600', sub: `out of ${totalPhrases} words` },
                { label: 'Quizzes Taken', value: totalQuizzes, icon: '🧪', color: 'from-purple-400 to-purple-600', sub: `${perfectScores} Perfect Scores` },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`rounded-3xl p-5 border transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                    }`}>{stat.sub}</span>
                  </div>
                  <p className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Level progress & Daily Goal */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Level progress */}
              <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
                <h3 className="font-bold text-sm mb-4">Level Progress</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-lg text-white font-bold text-xl">
                    {level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">Level {level}</span>
                      <span className="text-xs text-slate-500">{xp % XP_PER_LEVEL}/{XP_PER_LEVEL} XP</span>
                    </div>
                    <div role="progressbar" aria-valuenow={xpProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Level progress" className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full transition-all duration-700 xp-bar-glow" style={{ width: `${xpProgress}%` }} />
                    </div>
                  </div>
                </div>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {XP_PER_LEVEL - (xp % XP_PER_LEVEL)} XP needed to reach Level {level + 1}
                </p>
              </div>

              {/* Daily goal */}
              <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">🎯 Daily Goal</h3>
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="text-xs text-saffron-500 hover:underline font-semibold"
                  >
                    Change Goal
                  </button>
                </div>
                <div className="flex items-center justify-center mb-3">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100" role="progressbar" aria-valuenow={Math.round(dailyProgress)} aria-valuemin={0} aria-valuemax={100} aria-label="Daily goal progress">
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
                      <span className="text-xl font-bold">{dailyXp}</span>
                      <span className="text-[10px] text-slate-500">/{dailyGoal} XP</span>
                    </div>
                  </div>
                </div>
                <p className={`text-center text-xs ${
                  dailyProgress >= 100
                    ? 'text-emerald-500 font-semibold'
                    : darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {dailyProgress >= 100 ? '🎉 Daily goal completed for today!' : `${Math.round(dailyProgress)}% complete`}
                </p>
              </div>
            </div>

            {/* Lesson breakdown */}
            <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
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
            <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm">🏆 Achievements ({achievements.length}/{ALL_ACHIEVEMENTS.length})</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {ALL_ACHIEVEMENTS.map(ach => {
                  const unlocked = achievements.includes(ach.id);
                  return (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        unlocked
                          ? darkMode
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-amber-50 border-amber-200 shadow-sm'
                          : darkMode
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-40 grayscale'
                          : 'bg-slate-50 border-slate-200/60 opacity-40 grayscale'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{ach.icon}</span>
                      <p className={`font-bold text-xs mb-1 ${
                        unlocked
                          ? darkMode ? 'text-amber-400' : 'text-amber-700'
                          : darkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>{ach.title}</p>
                      <p className="text-[10px] text-slate-400 leading-snug">{ach.description}</p>
                      {unlocked && <span className="text-[10px] text-emerald-500 font-bold mt-1.5 block">✓ Unlocked</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>🏆</span> Global Sinhala Learners Leaderboard
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                    Real-time world ranking based on cumulative experience points (XP).
                  </p>
                </div>
                <div className="px-4 py-2 bg-saffron-500/10 border border-saffron-500/30 rounded-2xl text-saffron-500 font-bold text-xs">
                  Your Rank: #{userRank} ({xp} XP)
                </div>
              </div>

              <div className="space-y-3">
                {leaderboard.map((item, idx) => {
                  const isUser = 'isUser' in item && item.isUser;

                  return (
                    <div
                      key={idx}
                      className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between transition-all ${
                        isUser
                          ? 'bg-gradient-to-r from-saffron-500/15 via-amber-500/10 to-transparent border-saffron-500 text-saffron-500 font-bold ring-2 ring-saffron-500/20 shadow-md'
                          : darkMode
                          ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                          item.rank === 1
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md'
                            : item.rank === 2
                            ? 'bg-slate-400 text-white'
                            : item.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-700/20 text-slate-400'
                        }`}>
                          #{item.rank}
                        </span>
                        <span className="text-2xl">{item.avatar}</span>
                        <div>
                          <div className="text-sm font-bold flex items-center gap-1.5">
                            {item.name}
                            {isUser && <span className="text-[10px] px-1.5 py-0.5 rounded bg-saffron-500 text-white font-bold">YOU</span>}
                          </div>
                          <div className="text-[11px] opacity-70">
                            Level {item.level} • {item.country}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base sm:text-lg font-black font-space text-saffron-500">
                          {item.xp.toLocaleString()} XP
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {Math.floor(item.xp / XP_PER_LEVEL)} Levels
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STARRED WORDS */}
        {activeTab === 'starred' && (
          <div className={`rounded-3xl p-6 sm:p-8 border ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          } space-y-4`}>
            <h3 className="font-bold text-base">⭐ Starred Vocabulary ({starredList.length})</h3>
            {starredList.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-10 text-center">
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
                          onClick={(e) => { e.stopPropagation(); speak(item.sinhala, item.romanized); }}
                          className="text-xs p-1.5 rounded-lg hover:bg-slate-700/20 text-saffron-500"
                          aria-label="Speak pronunciation"
                        >
                          🔊
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-saffron-500">{item.english}</p>
                      <p className="text-[10px] text-slate-400 italic">[{item.romanized}]</p>
                    </div>
                    
                    <button
                      onClick={() => onToggleStarWord(item.lessonId, item.wordIdx)}
                      className="p-2 rounded-xl text-saffron-500 hover:bg-saffron-500/10 transition-colors"
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

        {/* TAB 4: SETTINGS, PROFILE & RESET */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Profile Customization Section */}
            <div className={`rounded-3xl p-6 sm:p-8 border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            } space-y-4`}>
              <h3 className="font-bold text-base">👤 Custom Profile Settings</h3>
              <p className="text-xs text-slate-400">
                Personalize your display name, choose your favorite avatar, and adjust your daily study goals.
              </p>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-5 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                ✏️ Edit Name, Avatar & Goals
              </button>
            </div>

            {/* Backup & Restore */}
            <div className={`rounded-3xl p-6 sm:p-8 border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            } space-y-6`}>
              <div>
                <h3 className="font-bold text-base mb-1">💾 Progress Backup & Cloud Sync</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Export your current progress or transfer your level, achievements, and learned words to another device.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Export Backup</h4>
                    <p className="text-[11px] text-slate-400">
                      Saves your complete learning profile as a JSON file.
                    </p>
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md shadow-saffron-500/10"
                  >
                    💾 Download Progress Backup
                  </button>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Restore Backup</h4>
                    <p className="text-[11px] text-slate-400">
                      Upload a previous JSON backup to restore your data.
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
                        darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700 shadow-sm'
                      }`}
                    >
                      📤 Upload backup (.json)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* DANGER ZONE: Reset Level & Progress */}
            <div className={`rounded-3xl p-6 sm:p-8 border border-rose-500/30 ${
              darkMode ? 'bg-rose-950/10' : 'bg-rose-50/50'
            } space-y-4`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <h3 className="font-bold text-base text-rose-500">Danger Zone — Reset Progress</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                If you wish to restart your learning journey from the beginning, you can reset your Level back to 1, XP to 0, and clear learned lessons.
              </p>
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 active:scale-95 transition-all"
              >
                🔄 Reset Level & All Progress
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h2 className="text-xl font-bold font-space mb-4 flex items-center gap-2">
              <span>✏️</span> Edit Learner Profile
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Name input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                  Your Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  maxLength={30}
                  required
                />
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                  Select Profile Avatar ({PROFILE_AVATARS.length} Options)
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                  {PROFILE_AVATARS.map(av => (
                    <button
                      key={av.name}
                      type="button"
                      onClick={() => setSelectedAvatar(av.emoji)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                        selectedAvatar === av.emoji
                          ? 'bg-saffron-500/20 border-2 border-saffron-500 scale-105 shadow-md'
                          : darkMode
                          ? 'bg-slate-950 border border-slate-800 hover:bg-slate-800'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                      }`}
                      title={av.name}
                    >
                      <span className="text-2xl mb-1">{av.emoji}</span>
                      <span className="text-[9px] font-semibold truncate w-full">{av.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Goal Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                  Daily XP Goal
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, 200].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setCustomGoal(g)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        customGoal === g
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : darkMode
                          ? 'bg-slate-950 border-slate-800 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {g} XP
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700/20">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl ${
            darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className="text-center mb-6">
              <span className="text-4xl block mb-3">🔄</span>
              <h2 className="text-xl font-bold font-space text-rose-500 mb-2">Reset Progress & Level?</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will reset your XP back to 0, Level back to 1, clear all learned words, quizzes, and streaks. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReset}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
