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

  it('should have 4 unique options in each question and correctIndex pointing to the correct answer', () => {
    const lesson = lessons[0];
    const quiz = generateQuiz(lesson.id);

    quiz.forEach(question => {
      // Should have 4 options
      expect(question.options.length).toBe(4);

      // Options should be unique
      const uniqueOptions = new Set(question.options);
      expect(uniqueOptions.size).toBe(4);

      // Verify the correct answer is indeed in options at correctIndex
      const correctAnswer = question.options[question.correctIndex];
      expect(correctAnswer).toBeTruthy();

      // Verify if correct answer matches one of the words in the lesson
      if (question.type === 'sinhala-to-english') {
        const matchingWord = lesson.words.find(w => w.sinhala === question.questionSinhala);
        expect(matchingWord).toBeDefined();
        expect(matchingWord?.english).toBe(correctAnswer);
      } else {
        // english-to-sinhala
        // the question title itself contains "How do you say "X" in Sinhala?"
        // let's extract X from question text or search for correct answer in lesson words
        const matchingWord = lesson.words.find(w => w.sinhala === correctAnswer);
        expect(matchingWord).toBeDefined();
        expect(question.question).toContain(`"${matchingWord?.english}"`);
      }
    });
  });
});
