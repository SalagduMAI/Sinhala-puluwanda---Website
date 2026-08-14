import { useLocalStorage } from './useLocalStorage';
import { useCallback, useMemo, useEffect } from 'react';

export interface Achievement {
  id: string;
  title: string;
  titleSinhala: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface QuizScore {
  lessonId: number;
  score: number;
  total: number;
  date: number;
}

export interface SRSInfo {
  interval: number; // in days
  ease: number;
  repetitions: number;
  nextReview: number; // timestamp
}

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  wordsLearned: Record<number, number[]>;
  quizScores: QuizScore[];
  achievements: string[];
  totalQuizzesTaken: number;
  perfectScores: number;
  darkMode: boolean;
  soundEnabled: boolean;
  dailyGoal: number;
  dailyXpEarned: number;
  dailyGoalDate: string;
  starredWords: Record<number, number[]>;
  srsData: Record<string, SRSInfo>;
  avatar: string;
  userName: string;
  completedGrammarQuizzes: string[];
}

const DEFAULT_STATE: GameState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  wordsLearned: {},
  quizScores: [],
  achievements: [],
  totalQuizzesTaken: 0,
  perfectScores: 0,
  darkMode: false,
  soundEnabled: true,
  dailyGoal: 50,
  dailyXpEarned: 0,
  dailyGoalDate: '',
  starredWords: {},
  srsData: {},
  avatar: '🦁',
  userName: 'Learner',
  completedGrammarQuizzes: [],
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_word', title: 'First Step', titleSinhala: 'පළමු පියවර', description: 'Learn your first word', icon: '🌱' },
  { id: 'ten_words', title: 'Word Collector', titleSinhala: 'වචන එකතුකරු', description: 'Learn 10 words', icon: '📚' },
  { id: 'thirty_words', title: 'Vocabulary Master', titleSinhala: 'වචන මාස්ටර්', description: 'Learn 30 words', icon: '🎓' },
  { id: 'all_words', title: 'Word Wizard', titleSinhala: 'වචන මායාකාරයා', description: 'Learn all words in course', icon: '🧙' },
  { id: 'first_quiz', title: 'Quiz Starter', titleSinhala: 'ප්‍රශ්නාවලිය', description: 'Complete your first quiz', icon: '🧪' },
  { id: 'perfect_quiz', title: 'Perfectionist', titleSinhala: 'පරිපූර්ණ', description: 'Get a perfect quiz score', icon: '💯' },
  { id: 'five_quizzes', title: 'Quiz Champion', titleSinhala: 'ප්‍රශ්න ශූරයා', description: 'Complete 5 quizzes', icon: '🏆' },
  { id: 'level_5', title: 'Rising Star', titleSinhala: 'නැගී එන තරුව', description: 'Reach level 5', icon: '⭐' },
  { id: 'level_10', title: 'Sinhala Expert', titleSinhala: 'සිංහල විශේෂඥයා', description: 'Reach level 10', icon: '👑' },
  { id: 'three_streak', title: 'On Fire', titleSinhala: 'ගින්නෙන්', description: '3-day learning streak', icon: '🔥' },
  { id: 'seven_streak', title: 'Dedicated Learner', titleSinhala: 'කැපවූ ඉගෙනුම්කරු', description: '7-day learning streak', icon: '💎' },
  { id: 'daily_goal', title: 'Goal Crusher', titleSinhala: 'ඉලක්ක බිඳිනා', description: 'Complete your daily XP goal', icon: '🎯' },
  { id: 'all_lessons', title: 'Course Complete', titleSinhala: 'පාඨමාලාව සම්පූර්ණයි', description: 'Study all lessons', icon: '🎊' },
  { id: 'match_master', title: 'Match Master', titleSinhala: 'ගැලපුම් මාස්ටර්', description: 'Win the word match game', icon: '🃏' },
];

export const XP_PER_LEVEL = 100;
export const XP_WORD_LEARNED = 10;
export const XP_QUIZ_CORRECT = 15;
export const XP_QUIZ_PERFECT = 50;
export const XP_MATCH_WIN = 30;
export const XP_SRS_REVIEW = 15;
export const XP_GRAMMAR_QUIZ = 15;

export function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(d1: string, d2: string): number {
  if (!d1 || !d2) return 0;
  const p1 = d1.split('-').map(Number);
  const p2 = d2.split('-').map(Number);
  if (p1.length !== 3 || p2.length !== 3) return 0;
  const t1 = Date.UTC(p1[0], p1[1] - 1, p1[2]);
  const t2 = Date.UTC(p2[0], p2[1] - 1, p2[2]);
  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}

export function calculateNewStreak(lastActiveDate: string, today: string, currentStreak: number): number {
  if (!lastActiveDate) return 1;
  if (lastActiveDate === today) return currentStreak;
  const diff = getDaysDifference(lastActiveDate, today);
  if (diff === 1) return currentStreak + 1;
  return 1;
}

export function useGameState() {
  const [state, setState] = useLocalStorage<GameState>('sinhala-puluwanda-v2', DEFAULT_STATE);

  const today = getLocalDateString();

  // Check and update streak on load/render dynamically to ensure UI is correct on first render
  const checkedState = useMemo(() => {
    const s = { ...state };
    
    // Schema safety migrations:
    if (!s.starredWords) s.starredWords = {};
    if (!s.srsData) s.srsData = {};
    if (!s.avatar || s.avatar === 'novice') s.avatar = '🦁';
    if (!s.userName) s.userName = 'Learner';
    if (!s.completedGrammarQuizzes) s.completedGrammarQuizzes = [];

    if (s.dailyGoalDate !== today) {
      s.dailyXpEarned = 0;
      s.dailyGoalDate = today;
    }
    if (s.lastActiveDate && s.lastActiveDate !== today) {
      const diff = getDaysDifference(s.lastActiveDate, today);
      if (diff > 1) {
        s.streak = 0;
      }
    }
    return s;
  }, [state, today]);

  // Persist the daily reset changes to localStorage
  useEffect(() => {
    if (
      state.dailyGoalDate !== checkedState.dailyGoalDate ||
      state.dailyXpEarned !== checkedState.dailyXpEarned ||
      state.streak !== checkedState.streak ||
      state.achievements.length !== checkedState.achievements.length ||
      !state.starredWords ||
      !state.srsData ||
      !state.avatar ||
      !state.userName ||
      !state.completedGrammarQuizzes
    ) {
      setState(checkedState);
    }
  }, [state, checkedState, setState]);

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const newDailyXp = (prev.dailyGoalDate === today ? prev.dailyXpEarned : 0) + amount;
      const newStreak = calculateNewStreak(prev.lastActiveDate, today, prev.streak);

      const newAchievements = [...prev.achievements];
      // Check daily goal
      if (newDailyXp >= prev.dailyGoal && !newAchievements.includes('daily_goal')) {
        newAchievements.push('daily_goal');
      }
      // Check levels
      if (newLevel >= 5 && !newAchievements.includes('level_5')) newAchievements.push('level_5');
      if (newLevel >= 10 && !newAchievements.includes('level_10')) newAchievements.push('level_10');
      // Check streaks
      if (newStreak >= 3 && !newAchievements.includes('three_streak')) newAchievements.push('three_streak');
      if (newStreak >= 7 && !newAchievements.includes('seven_streak')) newAchievements.push('seven_streak');

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: today,
        dailyXpEarned: newDailyXp,
        dailyGoalDate: today,
        achievements: newAchievements,
      };
    });
  }, [setState, today]);

  const learnWord = useCallback((lessonId: number, wordIndex: number) => {
    setState(prev => {
      const currentWords = prev.wordsLearned[lessonId] || [];
      if (currentWords.includes(wordIndex)) return prev;

      const newWordsLearned = { ...prev.wordsLearned, [lessonId]: [...currentWords, wordIndex] };
      const totalWords = Object.values(newWordsLearned).reduce((sum, arr) => sum + arr.length, 0);
      const lessonsStudied = Object.keys(newWordsLearned).length;

      const xpAmount = XP_WORD_LEARNED;
      const newXp = prev.xp + xpAmount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const newDailyXp = (prev.dailyGoalDate === today ? prev.dailyXpEarned : 0) + xpAmount;
      const newStreak = calculateNewStreak(prev.lastActiveDate, today, prev.streak);

      const newAchievements = [...prev.achievements];
      if (totalWords >= 1 && !newAchievements.includes('first_word')) newAchievements.push('first_word');
      if (totalWords >= 10 && !newAchievements.includes('ten_words')) newAchievements.push('ten_words');
      if (totalWords >= 30 && !newAchievements.includes('thirty_words')) newAchievements.push('thirty_words');
      if (totalWords >= 144 && !newAchievements.includes('all_words')) newAchievements.push('all_words');
      if (lessonsStudied >= 12 && !newAchievements.includes('all_lessons')) newAchievements.push('all_lessons');

      // Check daily goal
      if (newDailyXp >= prev.dailyGoal && !newAchievements.includes('daily_goal')) {
        newAchievements.push('daily_goal');
      }
      // Check levels
      if (newLevel >= 5 && !newAchievements.includes('level_5')) newAchievements.push('level_5');
      if (newLevel >= 10 && !newAchievements.includes('level_10')) newAchievements.push('level_10');
      // Check streaks
      if (newStreak >= 3 && !newAchievements.includes('three_streak')) newAchievements.push('three_streak');
      if (newStreak >= 7 && !newAchievements.includes('seven_streak')) newAchievements.push('seven_streak');

      // Initialize SRS data for this newly learned word
      const wordKey = `${lessonId}-${wordIndex}`;
      const newSrsData = { ...(prev.srsData || {}) };
      if (!newSrsData[wordKey]) {
        newSrsData[wordKey] = {
          interval: 1,
          ease: 2.5,
          repetitions: 0,
          nextReview: Date.now() + 1 * 24 * 60 * 60 * 1000, // Due in 1 day
        };
      }

      return {
        ...prev,
        wordsLearned: newWordsLearned,
        achievements: newAchievements,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: today,
        dailyXpEarned: newDailyXp,
        dailyGoalDate: today,
        srsData: newSrsData,
      };
    });
  }, [setState, today]);

  const recordQuiz = useCallback((lessonId: number, score: number, total: number) => {
    setState(prev => {
      const newQuizzes = prev.totalQuizzesTaken + 1;
      const isPerfect = score === total;
      const newPerfect = isPerfect ? prev.perfectScores + 1 : prev.perfectScores;

      const xpAmount = score * XP_QUIZ_CORRECT + (isPerfect ? XP_QUIZ_PERFECT : 0);
      const newXp = prev.xp + xpAmount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const newDailyXp = (prev.dailyGoalDate === today ? prev.dailyXpEarned : 0) + xpAmount;
      const newStreak = calculateNewStreak(prev.lastActiveDate, today, prev.streak);

      const newAchievements = [...prev.achievements];
      if (!newAchievements.includes('first_quiz')) newAchievements.push('first_quiz');
      if (isPerfect && !newAchievements.includes('perfect_quiz')) newAchievements.push('perfect_quiz');
      if (newQuizzes >= 5 && !newAchievements.includes('five_quizzes')) newAchievements.push('five_quizzes');

      // Check daily goal
      if (newDailyXp >= prev.dailyGoal && !newAchievements.includes('daily_goal')) {
        newAchievements.push('daily_goal');
      }
      // Check levels
      if (newLevel >= 5 && !newAchievements.includes('level_5')) newAchievements.push('level_5');
      if (newLevel >= 10 && !newAchievements.includes('level_10')) newAchievements.push('level_10');
      // Check streaks
      if (newStreak >= 3 && !newAchievements.includes('three_streak')) newAchievements.push('three_streak');
      if (newStreak >= 7 && !newAchievements.includes('seven_streak')) newAchievements.push('seven_streak');

      return {
        ...prev,
        quizScores: [...prev.quizScores, { lessonId, score, total, date: Date.now() }],
        totalQuizzesTaken: newQuizzes,
        perfectScores: newPerfect,
        achievements: newAchievements,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: today,
        dailyXpEarned: newDailyXp,
        dailyGoalDate: today,
      };
    });
  }, [setState, today]);

  const unlockMatchAchievement = useCallback(() => {
    setState(prev => {
      const isMatchMaster = prev.achievements.includes('match_master');
      
      const xpAmount = XP_MATCH_WIN;
      const newXp = prev.xp + xpAmount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const newDailyXp = (prev.dailyGoalDate === today ? prev.dailyXpEarned : 0) + xpAmount;
      const newStreak = calculateNewStreak(prev.lastActiveDate, today, prev.streak);

      const newAchievements = [...prev.achievements];
      if (!isMatchMaster) {
        newAchievements.push('match_master');
      }

      // Check daily goal
      if (newDailyXp >= prev.dailyGoal && !newAchievements.includes('daily_goal')) {
        newAchievements.push('daily_goal');
      }
      // Check levels
      if (newLevel >= 5 && !newAchievements.includes('level_5')) newAchievements.push('level_5');
      if (newLevel >= 10 && !newAchievements.includes('level_10')) newAchievements.push('level_10');
      // Check streaks
      if (newStreak >= 3 && !newAchievements.includes('three_streak')) newAchievements.push('three_streak');
      if (newStreak >= 7 && !newAchievements.includes('seven_streak')) newAchievements.push('seven_streak');

      return {
        ...prev,
        achievements: newAchievements,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: today,
        dailyXpEarned: newDailyXp,
        dailyGoalDate: today,
      };
    });
  }, [setState, today]);

  // Toggle bookmark / starred word
  const toggleStarWord = useCallback((lessonId: number, wordIndex: number) => {
    setState(prev => {
      const currentStarred = prev.starredWords?.[lessonId] || [];
      const isStarred = currentStarred.includes(wordIndex);
      const newStarred = isStarred
        ? currentStarred.filter(idx => idx !== wordIndex)
        : [...currentStarred, wordIndex];
      return {
        ...prev,
        starredWords: {
          ...(prev.starredWords || {}),
          [lessonId]: newStarred
        }
      };
    });
  }, [setState]);

  // Review learned word using SuperMemo-2 (SM-2) Spaced Repetition Algorithm
  // rating: 1 = Again/Forgot, 2 = Hard, 3 = Good, 4 = Easy
  const reviewSRSWord = useCallback((lessonId: number, wordIndex: number, rating: number) => {
    setState(prev => {
      const wordKey = `${lessonId}-${wordIndex}`;
      const prevSrs = prev.srsData?.[wordKey] || {
        interval: 1,
        ease: 2.5,
        repetitions: 0,
        nextReview: Date.now()
      };

      let repetitions = prevSrs.repetitions;
      let ease = prevSrs.ease;
      let interval = prevSrs.interval;

      if (rating < 3) {
        // Forgot the word
        repetitions = 0;
        interval = 1; // repeat tomorrow
      } else {
        // Correct response
        if (repetitions === 0) {
          interval = 1; // 1 day
        } else if (repetitions === 1) {
          interval = 4; // 4 days
        } else {
          interval = Math.ceil(interval * ease);
        }
        repetitions++;
      }

      // Adjust ease factor (mapping 1..4 quality to SM2 quality 2..5)
      const quality = rating + 1;
      ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (ease < 1.3) ease = 1.3;

      const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

      const newSrsData = {
        ...(prev.srsData || {}),
        [wordKey]: {
          interval,
          ease,
          repetitions,
          nextReview
        }
      };

      // Award XP for SRS review
      const xpAmount = XP_SRS_REVIEW;
      const newXp = prev.xp + xpAmount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const newDailyXp = (prev.dailyGoalDate === today ? prev.dailyXpEarned : 0) + xpAmount;
      const newStreak = calculateNewStreak(prev.lastActiveDate, today, prev.streak);

      const newAchievements = [...prev.achievements];
      if (newDailyXp >= prev.dailyGoal && !newAchievements.includes('daily_goal')) {
        newAchievements.push('daily_goal');
      }
      if (newLevel >= 5 && !newAchievements.includes('level_5')) newAchievements.push('level_5');
      if (newLevel >= 10 && !newAchievements.includes('level_10')) newAchievements.push('level_10');

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: today,
        dailyXpEarned: newDailyXp,
        dailyGoalDate: today,
        srsData: newSrsData,
        achievements: newAchievements,
      };
    });
  }, [setState, today]);

  // Complete grammar quiz (guarantees XP is only awarded once per quiz ID)
  const completeGrammarQuiz = useCallback((quizId: string): boolean => {
    let wasAwarded = false;
    setState(prev => {
      const alreadyCompleted = (prev.completedGrammarQuizzes || []).includes(quizId);
      if (alreadyCompleted) return prev;

      wasAwarded = true;
      const xpAmount = XP_GRAMMAR_QUIZ;
      const newXp = prev.xp + xpAmount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const newDailyXp = (prev.dailyGoalDate === today ? prev.dailyXpEarned : 0) + xpAmount;
      const newStreak = calculateNewStreak(prev.lastActiveDate, today, prev.streak);
      const newCompleted = [...(prev.completedGrammarQuizzes || []), quizId];

      const newAchievements = [...prev.achievements];
      if (newDailyXp >= prev.dailyGoal && !newAchievements.includes('daily_goal')) {
        newAchievements.push('daily_goal');
      }
      if (newLevel >= 5 && !newAchievements.includes('level_5')) newAchievements.push('level_5');
      if (newLevel >= 10 && !newAchievements.includes('level_10')) newAchievements.push('level_10');

      return {
        ...prev,
        completedGrammarQuizzes: newCompleted,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: today,
        dailyXpEarned: newDailyXp,
        dailyGoalDate: today,
        achievements: newAchievements,
      };
    });
    return wasAwarded;
  }, [setState, today]);

  const changeAvatar = useCallback((newAvatar: string) => {
    setState(prev => ({ ...prev, avatar: newAvatar }));
  }, [setState]);

  const importProgressState = useCallback((imported: Partial<GameState>): boolean => {
    const requiredKeys = ['xp', 'level', 'streak', 'wordsLearned'];
    const isValid = requiredKeys.every(k => k in imported);
    if (!isValid) return false;

    setState(prev => ({
      ...prev,
      ...imported,
      wordsLearned: imported.wordsLearned || prev.wordsLearned,
      starredWords: imported.starredWords || prev.starredWords,
      srsData: imported.srsData || prev.srsData,
      completedGrammarQuizzes: imported.completedGrammarQuizzes || prev.completedGrammarQuizzes,
      achievements: Array.from(new Set([...(prev.achievements || []), ...(imported.achievements || [])]))
    }));
    return true;
  }, [setState]);

  const toggleDarkMode = useCallback(() => {
    setState(prev => {
      const nextDark = !prev.darkMode;
      if (typeof document !== 'undefined') {
        if (nextDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { ...prev, darkMode: nextDark };
    });
  }, [setState]);

  const updateProfile = useCallback((name: string, newAvatar: string) => {
    setState(prev => ({
      ...prev,
      userName: name.trim() || prev.userName || 'Learner',
      avatar: newAvatar || prev.avatar || '🦁'
    }));
  }, [setState]);

  const resetProgress = useCallback(() => {
    setState(prev => ({
      ...DEFAULT_STATE,
      userName: prev.userName || 'Learner',
      avatar: prev.avatar || '🦁',
      darkMode: prev.darkMode,
      soundEnabled: prev.soundEnabled,
    }));
  }, [setState]);

  const setDailyGoal = useCallback((newGoal: number) => {
    setState(prev => ({
      ...prev,
      dailyGoal: Math.max(10, newGoal)
    }));
  }, [setState]);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, [setState]);

  const totalWordsLearned = useMemo(() => {
    return Object.values(checkedState.wordsLearned || {}).reduce((sum, words) => sum + (words?.length || 0), 0);
  }, [checkedState.wordsLearned]);

  const xpProgress = useMemo(() => {
    const currentLevelXP = (checkedState.level - 1) * XP_PER_LEVEL;
    const progressXP = checkedState.xp - currentLevelXP;
    return Math.min(100, Math.max(0, Math.round((progressXP / XP_PER_LEVEL) * 100)));
  }, [checkedState.level, checkedState.xp]);

  return {
    state: checkedState,
    addXP,
    learnWord,
    recordQuiz,
    unlockMatchAchievement,
    toggleStarWord,
    reviewSRSWord,
    completeGrammarQuiz,
    changeAvatar,
    updateProfile,
    resetProgress,
    setDailyGoal,
    importProgressState,
    toggleDarkMode,
    toggleSound,
    totalWordsLearned,
    xpProgress,
  };
}
