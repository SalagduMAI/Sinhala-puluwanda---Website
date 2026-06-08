// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useGameState } from './useGameState';

// Tell React we are in a testing environment that supports act(...)
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Custom renderHook helper using react-dom/client
function renderHook<T>(hookFn: () => T) {
  const result = { current: null as any };
  function TestComponent() {
    result.current = hookFn();
    return null;
  }
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(React.createElement(TestComponent));
  });
  return {
    result,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      document.body.removeChild(container);
    }
  };
}

describe('useGameState()', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default state', () => {
    const { result, unmount } = renderHook(() => useGameState());
    
    expect(result.current.state.xp).toBe(0);
    expect(result.current.state.level).toBe(1);
    expect(result.current.state.streak).toBe(0);
    expect(result.current.state.achievements).toEqual([]);
    expect(result.current.totalWordsLearned).toBe(0);
    expect(result.current.xpProgress).toBe(0);
    expect(result.current.state.avatar).toBe('novice');
    
    unmount();
  });

  it('should increase XP and calculate level correctly when adding XP', () => {
    const { result, unmount } = renderHook(() => useGameState());

    act(() => {
      result.current.addXP(150);
    });

    expect(result.current.state.xp).toBe(150);
    expect(result.current.state.level).toBe(2);
    expect(result.current.xpProgress).toBe(50); // 50% progress to next level

    unmount();
  });

  it('should unlock daily_goal achievement when daily XP goal is met', () => {
    const { result, unmount } = renderHook(() => useGameState());

    act(() => {
      result.current.addXP(60); // daily goal is 50 XP
    });

    expect(result.current.state.achievements).toContain('daily_goal');

    unmount();
  });

  it('should award XP and unlock first_word achievement when a word is learned', () => {
    const { result, unmount } = renderHook(() => useGameState());

    act(() => {
      result.current.learnWord(1, 0); // Lesson 1, word 0
    });

    expect(result.current.state.xp).toBe(10);
    expect(result.current.totalWordsLearned).toBe(1);
    expect(result.current.state.achievements).toContain('first_word');
    expect(result.current.state.srsData['1-0']).toBeDefined(); // SRS data initialized

    unmount();
  });

  it('should award score-based XP and perfect bonus when a quiz is perfectly completed', () => {
    const { result, unmount } = renderHook(() => useGameState());

    act(() => {
      result.current.recordQuiz(1, 5, 5); // perfect score on 5-question quiz
    });

    // 5 correct answers * 15 XP = 75 XP. Plus 50 XP perfect bonus = 125 XP.
    expect(result.current.state.xp).toBe(125);
    expect(result.current.state.achievements).toContain('first_quiz');
    expect(result.current.state.achievements).toContain('perfect_quiz');

    unmount();
  });

  it('should toggle starred state of words correctly', () => {
    const { result, unmount } = renderHook(() => useGameState());

    act(() => {
      result.current.toggleStarWord(1, 0); // Lesson 1, word 0
    });
    expect(result.current.state.starredWords[1]).toContain(0);

    act(() => {
      result.current.toggleStarWord(1, 0); // Toggle again (unstar)
    });
    expect(result.current.state.starredWords[1]).not.toContain(0);

    unmount();
  });

  it('should reschedule learned words using Spaced Repetition (SM-2) ratings', () => {
    const { result, unmount } = renderHook(() => useGameState());

    // Learn the word first
    act(() => {
      result.current.learnWord(1, 0);
    });

    // Review with Rating 4 (Easy)
    act(() => {
      result.current.reviewSRSWord(1, 0, 4);
    });

    const srs = result.current.state.srsData['1-0'];
    expect(srs).toBeDefined();
    expect(srs.repetitions).toBe(1);
    expect(srs.interval).toBe(1); // 1st rep is 1 day
    expect(srs.nextReview).toBeGreaterThan(Date.now());

    unmount();
  });

  it('should import and validate progress backup json safely', () => {
    const { result, unmount } = renderHook(() => useGameState());

    const validBackup = {
      xp: 450,
      level: 5,
      streak: 3,
      wordsLearned: { 1: [0, 1] },
      achievements: ['first_word']
    };

    let importSuccess = false;
    act(() => {
      importSuccess = result.current.importProgressState(validBackup);
    });

    expect(importSuccess).toBe(true);
    expect(result.current.state.xp).toBe(450);
    expect(result.current.state.level).toBe(5);
    expect(result.current.state.streak).toBe(3);

    // Invalid backup should be rejected
    let importFail = true;
    act(() => {
      importFail = result.current.importProgressState({ corrupt: 'data' });
    });
    expect(importFail).toBe(false);

    unmount();
  });
});
