import React, { useState, useMemo, useEffect } from 'react';
import { ALL_ACHIEVEMENTS, XP_PER_LEVEL, QuizScore } from '../hooks/useGameState';
import { lessons } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';
import CertificateModal from './CertificateModal';
import {
  NotificationSettings,
  loadNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  sendStudyNotification,
  isNotificationSupported,
  getNotificationPermission
} from '../utils/notifications';

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
  activityHistory?: Record<string, number>;
  quizScores?: QuizScore[];
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
  starredWords, srsData = {}, avatar = '🦁', userName = 'Learner',
  activityHistory = {}, quizScores = [],
  onBack, onToggleStarWord, onChangeAvatar, onUpdateProfile, onResetProgress, onSetDailyGoal, onImportState
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'srs' | 'leaderboard' | 'starred' | 'settings'>('stats');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const [customGoal, setCustomGoal] = useState(dailyGoal);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Notification settings state
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(loadNotificationSettings);
  const [notifPermission, setNotifPermission] = useState<string>('default');

  const { speak } = useSpeech();

  const dailyProgress = dailyGoal > 0 ? Math.min((dailyXp / dailyGoal) * 100, 100) : 100;
  const totalPhrases = lessons.reduce((sum, lesson) => sum + lesson.words.length, 0);

  // Capture PWA beforeinstallprompt & Notification permissions
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    if (isNotificationSupported()) {
      setNotifPermission(getNotificationPermission());
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('To install on iOS: Tap Share ➔ "Add to Home Screen". On Chrome: Tap Menu (⋮) ➔ "Install App".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      setNotifPermission(getNotificationPermission());
      if (granted) {
        const next = { ...notifSettings, enabled: true };
        setNotifSettings(next);
        saveNotificationSettings(next);
        sendStudyNotification('🦁 Reminders Enabled!', 'We will remind you daily to maintain your Sinhala study streak!');
      } else {
        alert('Notification permission was blocked in browser settings. Please allow notifications to receive study reminders.');
      }
    } else {
      const next = { ...notifSettings, enabled: false };
      setNotifSettings(next);
      saveNotificationSettings(next);
    }
  };

  const handleHourChange = (hour: number) => {
    const next = { ...notifSettings, reminderHour: hour };
    setNotifSettings(next);
    saveNotificationSettings(next);
  };

  const handleSendTestNotification = () => {
    const ok = sendStudyNotification(
      '🦁 Sinhala Puluwanda Test Reminder',
      `Awesome! Your notifications are working perfectly. Streak: ${streak} days 🔥`
    );
    if (!ok) {
      alert('Please enable browser notification permissions first.');
    }
  };

  // 30-Day Activity Matrix
  const activityDays = useMemo(() => {
    const days: Array<{ dateStr: string; label: string; xp: number; intensity: number }> = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayXP = activityHistory[dateStr] || 0;
      let intensity = 0;
      if (dayXP >= 100) intensity = 4;
      else if (dayXP >= 50) intensity = 3;
      else if (dayXP >= 25) intensity = 2;
      else if (dayXP > 0) intensity = 1;

      days.push({
        dateStr,
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        xp: dayXP,
        intensity
      });
    }
    return days;
  }, [activityHistory]);

  // SRS Mastery Breakdown
  const srsBreakdown = useMemo(() => {
    const cards = Object.values(srsData || {});
    let apprentice = 0;
    let guru = 0;
    let master = 0;
    let enlightened = 0;
    let dueCount = 0;
    const now = Date.now();

    cards.forEach(card => {
      if (card.nextReview <= now) dueCount++;
      if (card.interval <= 4) apprentice++;
      else if (card.interval <= 14) guru++;
      else if (card.interval <= 30) master++;
      else enlightened++;
    });

    return {
      total: cards.length,
      apprentice,
      guru,
      master,
      enlightened,
      dueCount
    };
  }, [srsData]);

  // Live global leaderboard
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

  // Starred words list
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
      activityHistory,
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
          alert('❌ Invalid backup file: missing required fields.');
          return;
        }
        if (onImportState(parsed)) {
          alert('✅ Progress restored successfully!');
          setTimeout(() => window.location.reload(), 200);
        }
      } catch (err) {
        alert('❌ Corrupted or invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen pt-20 pb-24 px-4 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Card Top Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-4xl sm:text-5xl shadow-lg ring-4 ring-saffron-500/20 animate-scale-in">
                  {avatar}
                </div>
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                  Lv.{level}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black font-space">{userName}</h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-saffron-500/10 text-saffron-500">
                    Rank #{userRank}
                  </span>
                </div>
                <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  🔥 {streak} Day Streak &bull; ⚡ {xp} Total XP &bull; 🎓 {totalWordsLearned} Words Mastered
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 ${
                      darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>✏️</span> Edit Profile
                  </button>

                  <button
                    onClick={() => setIsCertOpen(true)}
                    className="px-3 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>🎓</span> Official Certificate
                  </button>

                  {!isInstalled && (
                    <button
                      onClick={handleInstallPWA}
                      className="px-3 py-1.5 rounded-xl font-bold text-xs bg-saffron-500 hover:bg-saffron-600 text-white shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <span>📲</span> Install App
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={onBack}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-saffron-500/20"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/20 pb-2">
          {[
            { id: 'stats', label: '📊 Stats & Activity' },
            { id: 'srs', label: `🧠 Spaced Memory (${srsBreakdown.total})` },
            { id: 'leaderboard', label: `🏆 Leaderboard (#${userRank})` },
            { id: 'starred', label: `⭐ Starred (${starredList.length})` },
            { id: 'settings', label: '⚙️ Settings & Notifications' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-saffron-500 text-white shadow-md shadow-saffron-500/20'
                  : darkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: STATS & 30-DAY HEATMAP */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Level & Rank', value: `Lv.${level}`, icon: '⭐', color: 'from-amber-400 to-amber-600', sub: `Rank #${userRank} Global` },
                { label: 'Active Streak', value: `${streak}d`, icon: '🔥', color: 'from-orange-400 to-red-500', sub: streak > 0 ? 'Consistent learner' : 'Start streak today' },
                { label: 'Words Mastered', value: totalWordsLearned, icon: '📚', color: 'from-blue-400 to-blue-600', sub: `out of ${totalPhrases} total` },
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

            {/* 30-Day Activity Streak Heatmap */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm">📅 30-Day Study Activity Matrix</h3>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Daily XP earned across the last 30 calendar days
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span>Less</span>
                  <div className="w-3 h-3 rounded-sm bg-slate-800 dark:bg-slate-800/60" />
                  <div className="w-3 h-3 rounded-sm bg-saffron-500/30" />
                  <div className="w-3 h-3 rounded-sm bg-saffron-500/60" />
                  <div className="w-3 h-3 rounded-sm bg-saffron-500" />
                  <span>More</span>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-2">
                {activityDays.map((d, idx) => {
                  let bg = darkMode ? 'bg-slate-800/60' : 'bg-slate-100';
                  if (d.intensity === 1) bg = 'bg-saffron-500/30 text-saffron-400';
                  else if (d.intensity === 2) bg = 'bg-saffron-500/55 text-white';
                  else if (d.intensity === 3) bg = 'bg-saffron-500/80 text-white';
                  else if (d.intensity === 4) bg = 'bg-saffron-500 text-white shadow-sm ring-1 ring-saffron-400';

                  return (
                    <div
                      key={idx}
                      className={`h-12 rounded-xl flex flex-col items-center justify-center p-1 border transition-all hover:scale-110 ${bg} ${
                        darkMode ? 'border-slate-800' : 'border-slate-200'
                      }`}
                      title={`${d.dateStr}: ${d.xp} XP`}
                    >
                      <span className="text-[9px] opacity-70 leading-none">{d.label.split(' ')[1]}</span>
                      <span className="text-[10px] font-black mt-0.5 leading-none">{d.xp > 0 ? `+${d.xp}` : '·'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level progress & Daily Goal */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
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
              <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
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

            {/* Achievements */}
            <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="font-bold text-sm mb-4">🏆 Achievements ({achievements.length}/{ALL_ACHIEVEMENTS.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {ALL_ACHIEVEMENTS.map(ach => {
                  const unlocked = achievements.includes(ach.id);
                  return (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        unlocked
                          ? darkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200 shadow-sm'
                          : darkMode ? 'bg-slate-950/40 border-slate-800/60 opacity-40 grayscale' : 'bg-slate-50 border-slate-200/60 opacity-40 grayscale'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{ach.icon}</span>
                      <p className={`font-bold text-xs mb-1 ${
                        unlocked ? darkMode ? 'text-amber-400' : 'text-amber-700' : darkMode ? 'text-slate-500' : 'text-slate-400'
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

        {/* TAB 2: SPACED REPETITION (SRS) MEMORY STAGES */}
        {activeTab === 'srs' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="font-bold text-base mb-1">🧠 Spaced Repetition (SRS) Memory Stages</h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-6`}>
                Scientific SuperMemo-2 retention algorithm tracking vocabulary mastery over time
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: '🌱 Apprentice', sub: 'Interval 1-4 days', count: srsBreakdown.apprentice, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' },
                  { label: '🧘 Guru', sub: 'Interval 5-14 days', count: srsBreakdown.guru, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/30' },
                  { label: '⚔️ Master', sub: 'Interval 15-30 days', count: srsBreakdown.master, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/30' },
                  { label: '👑 Enlightened', sub: 'Interval 30+ days', count: srsBreakdown.enlightened, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' }
                ].map((tier, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border text-center ${tier.bg}`}>
                    <span className="text-xs font-bold text-slate-400 block">{tier.label}</span>
                    <p className={`text-3xl font-black my-1 ${tier.color}`}>{tier.count}</p>
                    <span className="text-[10px] text-slate-400">{tier.sub}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold">⏰ Cards Due for Review: <span className="text-saffron-500 text-sm font-black">{srsBreakdown.dueCount}</span></p>
                  <p className="text-[11px] text-slate-400">Reviewing cards on schedule locks words into long-term permanent memory.</p>
                </div>
                <button
                  onClick={() => { window.location.hash = '#/flashcards'; window.scrollTo(0, 0); }}
                  className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  🚀 Review Due Cards
                </button>
              </div>
            </div>

            {/* Quiz Performance History */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="font-bold text-sm mb-4">🧪 Recent Quiz Performance</h3>
              {quizScores.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No quizzes taken yet. Complete lesson quizzes to record accuracy history!</p>
              ) : (
                <div className="space-y-2">
                  {quizScores.slice(-5).reverse().map((qs, i) => (
                    <div key={i} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span>Lesson #{qs.lessonId} Quiz</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-saffron-500">{qs.score}/{qs.total} ({Math.round((qs.score / qs.total) * 100)}%)</span>
                        <span className="text-[10px] text-slate-400">{new Date(qs.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GLOBAL LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} animate-fade-in`}>
            <h3 className="font-bold text-base mb-1">🏆 Global Learner Leaderboard</h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-6`}>
              Ranked dynamically by total XP earned across lessons and quizzes
            </p>

            <div className="space-y-2.5">
              {leaderboard.map((entry) => {
                const isYou = entry.isUser;
                return (
                  <div
                    key={entry.rank}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      isYou
                        ? 'bg-gradient-to-r from-saffron-500/15 to-orange-500/10 border-saffron-500 ring-2 ring-saffron-500/30'
                        : darkMode ? 'bg-slate-800/70 border-slate-700/70' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        entry.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-sm' :
                        entry.rank === 2 ? 'bg-slate-300 text-slate-950' :
                        entry.rank === 3 ? 'bg-amber-700 text-white' :
                        darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {entry.rank}
                      </span>
                      <span className="text-2xl">{entry.avatar}</span>
                      <div>
                        <p className={`text-xs sm:text-sm font-bold ${isYou ? 'text-saffron-500 font-black' : darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {entry.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{entry.country}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-black text-saffron-500">{entry.xp} XP</span>
                      <span className="text-[10px] text-slate-400 block">Level {entry.level}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: STARRED WORDS */}
        {activeTab === 'starred' && (
          <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} animate-fade-in`}>
            <h3 className="font-bold text-base mb-1">⭐ Starred Vocabulary Words</h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-6`}>
              Bookmark tricky words in lessons and quizzes for quick study
            </p>

            {starredList.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl block mb-2">⭐</span>
                <p className="text-xs text-slate-400">No starred words yet. Click the star icon on any vocabulary card to save it here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {starredList.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${
                    darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="sinhala-text text-lg font-bold text-saffron-500" lang="si">{item.sinhala}</span>
                      <p className="text-xs text-slate-400 italic">[{item.romanized}]</p>
                      <p className="text-xs font-semibold mt-0.5">{item.english}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speak(item.sinhala, item.romanized)}
                        className="p-2 text-saffron-500 hover:bg-saffron-500/10 rounded-xl"
                      >
                        🔊
                      </button>
                      <button
                        onClick={() => onToggleStarWord(item.lessonId, item.wordIdx)}
                        className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-xl"
                        title="Remove star"
                      >
                        ★
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SETTINGS & NOTIFICATIONS & BACKUP */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Daily Study Notifications Panel */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🔔</span>
                  <div>
                    <h3 className="font-bold text-base font-space">Daily Study Reminder Push Notifications</h3>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Receive automatic daily reminders to study and protect your streak.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifSettings.enabled}
                    onChange={(e) => handleToggleNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-saffron-500"></div>
                </label>
              </div>

              {notifSettings.enabled && (
                <div className={`p-4 rounded-2xl border space-y-4 pt-4 mt-2 ${
                  darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="text-xs font-bold block mb-1">Preferred Reminder Time:</label>
                      <span className="text-[11px] text-slate-400">Local device clock trigger</span>
                    </div>

                    <select
                      value={notifSettings.reminderHour}
                      onChange={(e) => handleHourChange(Number(e.target.value))}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value={8}>🌅 8:00 AM (Morning Coffee)</option>
                      <option value={12}>☀️ 12:00 PM (Lunch Break)</option>
                      <option value={18}>🌇 6:00 PM (Evening)</option>
                      <option value={19}>🌙 7:00 PM (After Work - Recommended)</option>
                      <option value={21}>🌌 9:00 PM (Before Bed)</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/20">
                    <span className="text-[11px] text-slate-400">
                      Permission: <strong className={notifPermission === 'granted' ? 'text-emerald-500' : 'text-amber-500'}>{notifPermission}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleSendTestNotification}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-saffron-500 hover:bg-saffron-600 text-white shadow-sm transition-all"
                    >
                      🚀 Send Test Notification
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Backup & Restore Progress */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="font-bold text-base mb-2">💾 Backup & Restore Progress</h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-6`}>
                Export your progress to a JSON backup file or restore from another device.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExport}
                  className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>📤</span> Export JSON Backup
                </button>

                <label className={`px-5 py-2.5 rounded-xl font-bold text-xs border cursor-pointer transition-all flex items-center gap-2 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}>
                  <span>📥</span> Restore Backup
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            {/* Reset Progress Danger Zone */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-rose-950/20 border-rose-900/30' : 'bg-rose-50 border-rose-200'}`}>
              <h3 className="font-bold text-base text-rose-500 mb-2">⚠️ Danger Zone</h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                Reset all XP, learned words, achievements, and restart your progress from Level 1.
              </p>
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Reset My Progress
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Official Completion Certificate Modal */}
      {isCertOpen && (
        <CertificateModal
          isOpen={isCertOpen}
          onClose={() => setIsCertOpen(false)}
          darkMode={darkMode}
          userName={userName}
          level={level}
          xp={xp}
          totalWordsLearned={totalWordsLearned}
          perfectScores={perfectScores}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`max-w-md w-full p-6 sm:p-8 rounded-3xl border shadow-2xl animate-scale-up ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-xl font-bold font-space mb-4">Edit Learner Profile</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Display Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Select Avatar:</label>
                <div className="grid grid-cols-4 gap-2">
                  {PROFILE_AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av.name}
                      onClick={() => setSelectedAvatar(av.emoji)}
                      className={`p-2.5 rounded-2xl text-2xl border transition-all ${
                        selectedAvatar === av.emoji
                          ? 'bg-saffron-500/20 border-saffron-500 scale-105 ring-2 ring-saffron-500/30'
                          : darkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Daily XP Goal:</label>
                <select
                  value={customGoal}
                  onChange={(e) => setCustomGoal(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value={30}>🌱 Casual (30 XP / day)</option>
                  <option value={50}>⚡ Regular (50 XP / day)</option>
                  <option value={100}>🔥 Serious (100 XP / day)</option>
                  <option value={150}>👑 Intense (150 XP / day)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className={`px-4 py-3 rounded-xl font-bold text-xs border ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`max-w-sm w-full p-6 rounded-3xl border shadow-2xl text-center space-y-4 animate-scale-up ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <span className="text-5xl block">⚠️</span>
            <h3 className="text-xl font-bold font-space">Are you sure?</h3>
            <p className="text-xs text-slate-400">
              This will reset all your XP, vocabulary, achievements, and level back to the beginning.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleExecuteReset}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs border ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
