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
  avatar: 'novice',
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_word', title: 'First Step', titleSinhala: 'පළමු පියවර', description: 'Learn your first word', icon: '🌱' },
  { id: 'ten_words', title: 'Word Collector', titleSinhala: 'වචන එකතුකරු', description: 'Learn 10 words', icon: '📚' },
  { id: 'thirty_words', title: 'Vocabulary Master', titleSinhala: 'වචන මාස්ටර්', description: 'Learn 30 words', icon: '🎓' },
  { id: 'all_words', title: 'Word Wizard', titleSinhala: 'වචන මායාකාරයා', description: 'Learn all 144 words', icon: '🧙' },
  { id: 'first_quiz', title: 'Quiz Starter', titleSinhala: 'ප්‍රශ්නාවලිය', description: 'Complete your first quiz', icon: '🧪' },
  { id: 'perfect_quiz', title: 'Perfectionist', titleSinhala: 'පරිපූර්ණ', description: 'Get a perfect quiz score', icon: '💯' },
  { id: 'five_quizzes', title: 'Quiz Champion', titleSinhala: 'ප්‍රශ්න ශූරයා', description: 'Complete 5 quizzes', icon: '🏆' },
  { id: 'level_5', title: 'Rising Star', titleSinhala: 'නැගී එන තරුව', description: 'Reach level 5', icon: '⭐' },
  { id: 'level_10', title: 'Sinhala Expert', titleSinhala: 'සිංහල විශේෂඥයා', description: 'Reach level 10', icon: '👑' },
  { id: 'three_streak', title: 'On Fire', titleSinhala: 'ගින්නෙන්', description: '3-day learning streak', icon: '🔥' },
  { id: 'seven_streak', title: 'Dedicated Learner', titleSinhala: 'කැපවූ ඉගෙනුම්කරු', description: '7-day learning streak', icon: '💎' },
  { id: 'daily_goal', title: 'Goal Crusher', titleSinhala: 'ඉලක්ක බිඳිනා', description: 'Complete your daily XP goal', icon: '🎯' },
  { id: 'all_lessons', title: 'Course Complete', titleSinhala: 'පාඨමාලාව සම්පූර්ණයි', description: 'Study all 12 lessons', icon: '🎊' },
  { id: 'match_master', title: 'Match Master', titleSinhala: 'ගැලපුම් මාස්ටර්', description: 'Win the word match game', icon: '🃏' },
];

export const XP_PER_LEVEL = 100;
export const XP_WORD_LEARNED = 10;
export const XP_QUIZ_CORRECT = 15;
export const XP_QUIZ_PERFECT = 50;
export const XP_MATCH_WIN = 30;
export const XP_SRS_REVIEW = 15;

export function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
    if (!s.avatar) s.avatar = 'novice';

    if (s.dailyGoalDate !== today) {
      s.dailyXpEarned = 0;
      s.dailyGoalDate = today;
    }
    if (s.lastActiveDate && s.lastActiveDate !== today) {
      const lastParts = s.lastActiveDate.split('-').map(Number);
      const todayParts = today.split('-').map(Number);
      const lastDays = lastParts[0] * 365 + lastParts[1] * 31 + lastParts[2];
      const todayDays = todayParts[0] * 365 + todayParts[1] * 31 + todayParts[2];
      const diff = todayDays - lastDays;
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
      !state.avatar
    ) {
      setState(checkedState);
    }
  }, [state, checkedState, setState]);

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      const newDailyXp = (prev.dailyGoalDate === today ? prev.dailyXpEarned : 0) + amount;
      const isNewDay = prev.lastActiveDate !== today;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;

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
      const isNewDay = prev.lastActiveDate !== today;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;

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
      const isNewDay = prev.lastActiveDate !== today;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;

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
      const isNewDay = prev.lastActiveDate !== today;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;

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
      const isNewDay = prev.lastActiveDate !== today;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;

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

  // Set avatar badge selection
  const changeAvatar = useCallback((avatarId: string) => {
    setState(prev => ({
      ...prev,
      avatar: avatarId
    }));
  }, [setState]);

  // Safe validated import progress state
  const importProgressState = useCallback((imported: any): boolean => {
    try {
      if (!imported || typeof imported !== 'object') return false;

      // Schema checks
      const hasXP = typeof imported.xp === 'number';
      const hasLevel = typeof imported.level === 'number';
      const hasStreak = typeof imported.streak === 'number';
      const hasWords = imported.wordsLearned && typeof imported.wordsLearned === 'object';

      if (!hasXP || !hasLevel || !hasStreak || !hasWords) {
        return false;
      }

      const mergedState: GameState = {
        ...DEFAULT_STATE,
        ...imported,
        xp: Number(imported.xp),
        level: Number(imported.level),
        streak: Number(imported.streak),
      };

      setState(mergedState);
      return true;
    } catch (e) {
      console.error('Import validation failed:', e);
      return false;
    }
  }, [setState]);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, [setState]);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, [setState]);

  const totalWordsLearned = useMemo(() => {
    return Object.values(checkedState.wordsLearned).reduce((sum, arr) => sum + arr.length, 0);
  }, [checkedState.wordsLearned]);

  const xpProgress = useMemo(() => {
    const xpForCurrentLevel = checkedState.xp % XP_PER_LEVEL;
    return (xpForCurrentLevel / XP_PER_LEVEL) * 100;
  }, [checkedState.xp]);

  return {
    state: checkedState,
    addXP,
    learnWord,
    recordQuiz,
    unlockMatchAchievement,
    toggleStarWord,
    reviewSRSWord,
    changeAvatar,
    importProgressState,
    toggleDarkMode,
    toggleSound,
    totalWordsLearned,
    xpProgress,
  };
}
