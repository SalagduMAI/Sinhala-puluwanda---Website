import { describe, it, expect } from 'vitest';
import { generateQuiz, lessons } from './lessons';

describe('generateQuiz()', () => {
  it('should return empty array for an invalid lesson id', () => {
    const quiz = generateQuiz(999);
    expect(quiz).toEqual([]);
  });

  it('should generate at most 5 questions for a valid lesson', () => {
    const lesson = lessons[0];
    const quiz = generateQuiz(lesson.id);
    expect(quiz.length).toBeLessThanOrEqual(5);
    expect(quiz.length).toBeGreaterThan(0);
  });

  it('should generate valid multi-type questions with explanations', () => {
    const lesson = lessons[0];
    const quiz = generateQuiz(lesson.id);

    quiz.forEach(question => {
      expect(question.explanation).toBeTruthy();

      if (question.type === 'sentence-order') {
        expect(question.orderTiles?.length).toBeGreaterThan(0);
        expect(question.correctOrder?.length).toBeGreaterThan(0);
      } else {
        // Multiple choice question types (sinhala-to-english, english-to-sinhala, audio-listen)
        expect(question.options.length).toBe(4);
        const uniqueOptions = new Set(question.options);
        expect(uniqueOptions.size).toBe(4);

        const correctAnswer = question.options[question.correctIndex];
        expect(correctAnswer).toBeTruthy();
      }
    });
  });
});
