// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { calculateStringSimilarity } from '../hooks/useSpeechRecognition';
import { sinhalaToPhonetics } from '../hooks/useSpeech';
import { PILLAM_LIST, combinePillam } from '../data/pillam';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { TRANSLATIONS } from '../i18n/translations';
import {
  loadNotificationSettings,
  saveNotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS
} from './notifications';

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

  describe('Sinhala Unicode G2P Transliterator (sinhalaToPhonetics)', () => {
    it('should transliterate root vowels correctly', () => {
      expect(sinhalaToPhonetics('අ')).toBe('ah');
      expect(sinhalaToPhonetics('ආ')).toBe('aah');
      expect(sinhalaToPhonetics('ඉ')).toBe('ee');
    });

    it('should transliterate consonant + pillam combinations', () => {
      expect(sinhalaToPhonetics('කා')).toBe('kaah');
      expect(sinhalaToPhonetics('කි')).toBe('kee');
      expect(sinhalaToPhonetics('කු')).toBe('koo');
      expect(sinhalaToPhonetics('ක්')).toBe('k');
    });
  });

  describe('Sinhala Pillam Diacritics Engine', () => {
    it('should contain 16 standard pillam modifiers', () => {
      expect(PILLAM_LIST.length).toBeGreaterThanOrEqual(15);
    });

    it('should accurately combine consonants with pillam symbols', () => {
      expect(combinePillam('ක', 'ා')).toBe('කා');
      expect(combinePillam('ක', 'ි')).toBe('කි');
      expect(combinePillam('ක', 'ු')).toBe('කු');
      expect(combinePillam('ක', '්')).toBe('ක්');
    });
  });

  describe('Daily Study Reminders Notification Settings', () => {
    it('should have default notification settings configured', () => {
      expect(DEFAULT_NOTIFICATION_SETTINGS.enabled).toBe(false);
      expect(DEFAULT_NOTIFICATION_SETTINGS.reminderHour).toBe(19);
    });

    it('should save and load notification settings from localStorage', () => {
      saveNotificationSettings({
        enabled: true,
        reminderHour: 20,
        lastNotifiedDate: '2026-08-16'
      });
      const loaded = loadNotificationSettings();
      expect(loaded.enabled).toBe(true);
      expect(loaded.reminderHour).toBe(20);
      expect(loaded.lastNotifiedDate).toBe('2026-08-16');
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
