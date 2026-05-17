import { useLocalStorage } from './useLocalStorage';
import { useCallback, useMemo } from 'react';

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
  { id: 'all_lessons', title: 'Course Complete', titleSinhala: 'පාඨමාලාව සම්පූර්ණයි', description: 'Study all 6 lessons', icon: '🎊' },
  { id: 'match_master', title: 'Match Master', titleSinhala: 'ගැලපුම් මාස්ටර්', description: 'Win the word match game', icon: '🃏' },
];

export const XP_PER_LEVEL = 100;
export const XP_WORD_LEARNED = 10;
export const XP_QUIZ_CORRECT = 15;
export const XP_QUIZ_PERFECT = 50;
export const XP_MATCH_WIN = 30;

export function useGameState() {
  const [state, setState] = useLocalStorage<GameState>('sinhala-puluwanda-v2', DEFAULT_STATE);

  const today = new Date().toISOString().slice(0, 10);

  // Check and update streak on load
  const checkedState = useMemo(() => {
    const s = { ...state };
    if (s.dailyGoalDate !== today) {
      s.dailyXpEarned = 0;
      s.dailyGoalDate = today;
    }
    if (s.lastActiveDate && s.lastActiveDate !== today) {
      const lastDate = new Date(s.lastActiveDate);
      const diff = Math.floor((new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 1) {
        s.streak = 0;
      }
    }
    return s;
  }, [state, today]);

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

      const newAchievements = [...prev.achievements];
      if (totalWords >= 1 && !newAchievements.includes('first_word')) newAchievements.push('first_word');
      if (totalWords >= 10 && !newAchievements.includes('ten_words')) newAchievements.push('ten_words');
      if (totalWords >= 30 && !newAchievements.includes('thirty_words')) newAchievements.push('thirty_words');
      if (totalWords >= 144 && !newAchievements.includes('all_words')) newAchievements.push('all_words');
      if (lessonsStudied >= 12 && !newAchievements.includes('all_lessons')) newAchievements.push('all_lessons');

      return { ...prev, wordsLearned: newWordsLearned, achievements: newAchievements };
    });
    addXP(XP_WORD_LEARNED);
  }, [setState, addXP]);

  const recordQuiz = useCallback((lessonId: number, score: number, total: number) => {
    setState(prev => {
      const newQuizzes = prev.totalQuizzesTaken + 1;
      const isPerfect = score === total;
      const newPerfect = isPerfect ? prev.perfectScores + 1 : prev.perfectScores;

      const newAchievements = [...prev.achievements];
      if (!newAchievements.includes('first_quiz')) newAchievements.push('first_quiz');
      if (isPerfect && !newAchievements.includes('perfect_quiz')) newAchievements.push('perfect_quiz');
      if (newQuizzes >= 5 && !newAchievements.includes('five_quizzes')) newAchievements.push('five_quizzes');

      return {
        ...prev,
        quizScores: [...prev.quizScores, { lessonId, score, total, date: Date.now() }],
        totalQuizzesTaken: newQuizzes,
        perfectScores: newPerfect,
        achievements: newAchievements,
      };
    });
    const xp = score * XP_QUIZ_CORRECT + (score === total ? XP_QUIZ_PERFECT : 0);
    addXP(xp);
  }, [setState, addXP]);

  const unlockMatchAchievement = useCallback(() => {
    setState(prev => {
      if (prev.achievements.includes('match_master')) return prev;
      return { ...prev, achievements: [...prev.achievements, 'match_master'] };
    });
    addXP(XP_MATCH_WIN);
  }, [setState, addXP]);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, [setState]);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, [setState]);

  const totalWordsLearned = useMemo(() => {
    return Object.values(checkedState.wordsLearned).reduce((sum, arr) => sum + arr.length, 0);
  }, [checkedState.wordsLearned]);

  const xpForCurrentLevel = checkedState.xp % XP_PER_LEVEL;
  const xpProgress = (xpForCurrentLevel / XP_PER_LEVEL) * 100;

  return {
    state: checkedState,
    addXP,
    learnWord,
    recordQuiz,
    unlockMatchAchievement,
    toggleDarkMode,
    toggleSound,
    totalWordsLearned,
    xpForCurrentLevel,
    xpProgress,
  };
}
