// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { calculateStringSimilarity } from '../hooks/useSpeechRecognition';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { TRANSLATIONS } from '../i18n/translations';

describe('New Real-World Features Unit Tests', () => {
  describe('Speech Similarity Scoring (Levenshtein Distance)', () => {
    it('should return 100% for identical words', () => {
      expect(calculateStringSimilarity('ආයුබෝවන්', 'ආයුබෝවන්')).toBe(100);
      expect(calculateStringSimilarity('ayubowan', 'Ayubowan ')).toBe(100);
    });

    it('should calculate accurate percentage for partial matches', () => {
      const score = calculateStringSimilarity('ayubowan', 'ayubowan!');
      expect(score).toBeGreaterThanOrEqual(80);
    });

    it('should return 0 for completely empty or non-matching strings', () => {
      expect(calculateStringSimilarity('', 'test')).toBe(0);
    });
  });

  describe('Sinhala Grammar Lessons Data Structure', () => {
    it('should contain all core grammar lessons (at least 4)', () => {
      expect(GRAMMAR_LESSONS.length).toBeGreaterThanOrEqual(4);
    });

    it('each grammar lesson should have rules, examples, and quizzes', () => {
      GRAMMAR_LESSONS.forEach((lesson) => {
        expect(lesson.id).toBeDefined();
        expect(lesson.title).toBeDefined();
        expect(lesson.rules.length).toBeGreaterThan(0);
        expect(lesson.examples.length).toBeGreaterThan(0);
        expect(lesson.quizzes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Multilingual i18n Translations', () => {
    it('should support English, Sinhala, Tamil, German, and French', () => {
      expect(TRANSLATIONS.en).toBeDefined();
      expect(TRANSLATIONS.si).toBeDefined();
      expect(TRANSLATIONS.ta).toBeDefined();
      expect(TRANSLATIONS.de).toBeDefined();
      expect(TRANSLATIONS.fr).toBeDefined();
    });

    it('should contain navigation keys across all supported languages', () => {
      (['en', 'si', 'ta', 'de', 'fr'] as const).forEach((lang) => {
        expect(TRANSLATIONS[lang]['nav.home']).toBeDefined();
        expect(TRANSLATIONS[lang]['nav.grammar']).toBeDefined();
        expect(TRANSLATIONS[lang]['nav.alphabet']).toBeDefined();
      });
    });
  });
});
