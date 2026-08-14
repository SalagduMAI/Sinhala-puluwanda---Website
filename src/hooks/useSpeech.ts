import { useCallback, useState, useEffect, useRef } from 'react';

export type VoiceGender = 'male' | 'female';

// Prevent Chromium / Safari Garbage Collection of active utterances
const activeUtterances = new Set<SpeechSynthesisUtterance>();

// Precise phonetic syllables for all 60 Sinhala alphabet characters
const SINHALA_PHONETICS: Record<string, string> = {
  // === Vowels (ස්වර) ===
  'අ': 'ah',
  'ආ': 'aah',
  'ඇ': 'ae',
  'ඈ': 'aae',
  'ඉ': 'ee',
  'ඊ': 'eee',
  'උ': 'oo',
  'ඌ': 'ooo',
  'ඍ': 'roo',
  'ඎ': 'rooo',
  'එ': 'eh',
  'ඒ': 'ay',
  'ඓ': 'eye',
  'ඔ': 'oh',
  'ඕ': 'ooh',
  'ඖ': 'ow',
  'අං': 'ung',
  'අඃ': 'ah-ha',

  // === Consonants (ව්‍යංජන) ===
  // Velar (කණ්ඨ්‍ය)
  'ක': 'kah',
  'ඛ': 'khah',
  'ග': 'gah',
  'ඝ': 'ghah',
  'ඞ': 'ngah',
  // Palatal (තාලව්‍ය)
  'ච': 'chah',
  'ඡ': 'chhah',
  'ජ': 'jah',
  'ඣ': 'jhah',
  'ඤ': 'nyah',
  'ඥ': 'gnyah',
  // Retroflex (මූර්ධන්‍ය)
  'ට': 'tah',
  'ඨ': 'thah',
  'ඩ': 'dah',
  'ඪ': 'dhah',
  'ණ': 'nah',
  // Dental (දන්ත්‍ය)
  'ත': 'thah',
  'ථ': 'thhah',
  'ද': 'dhah',
  'ධ': 'dhhah',
  'න': 'nah',
  // Labial (ඔෂ්ඨ්‍ය)
  'ප': 'pah',
  'ඵ': 'phah',
  'බ': 'bah',
  'භ': 'bhah',
  'ම': 'mah',
  // Semi-vowels & Sibilants
  'ය': 'yah',
  'ර': 'rah',
  'ල': 'lah',
  'ව': 'vah',
  'ශ': 'shah',
  'ෂ': 'shah',
  'ස': 'sah',
  'හ': 'hah',
  // Special & Pre-nasalized (සඤ්ඤක)
  'ළ': 'lah',
  'ෆ': 'fah',
  'ඟ': 'nggah',
  'ඦ': 'njah',
  'ඬ': 'ndah',
  'ඳ': 'ndhah',
  'ඹ': 'mbah',
};

// Convert Sinhala Unicode words/phrases into natural phonetic speech for fallback engines
function toSinhalaPhonetic(sinhalaText: string, fallback: string): string {
  const trimmed = sinhalaText.trim();
  
  // Check exact single letter match first
  if (SINHALA_PHONETICS[trimmed]) {
    return SINHALA_PHONETICS[trimmed];
  }

  // Check if string is composed of mapped letters
  if (trimmed.length === 1 && SINHALA_PHONETICS[trimmed]) {
    return SINHALA_PHONETICS[trimmed];
  }

  if (fallback && fallback.trim()) {
    return fallback
      .replace(/aa|ā/gi, 'aah')
      .replace(/æ|ae/gi, 'ae')
      .replace(/ee|ī/gi, 'eee')
      .replace(/oo|ū/gi, 'ooo')
      .replace(/ō/gi, 'oh')
      .replace(/ē/gi, 'ay')
      .replace(/ṭ/gi, 't')
      .replace(/ḍ/gi, 'd')
      .replace(/ṇ/gi, 'n')
      .replace(/ḷ/gi, 'l')
      .replace(/ś|ṣ/gi, 'sh')
      .replace(/n̆g/gi, 'ngg')
      .replace(/n̆j/gi, 'nj')
      .replace(/n̆ḍ/gi, 'nd')
      .replace(/n̆d/gi, 'ndh')
      .replace(/m̆b/gi, 'mb')
      .replace(/ayubowan/gi, 'aah-yu-boh-wun')
      .replace(/sthuthi/gi, 'sthoo-thee')
      .replace(/karunakarala/gi, 'kuh-roo-nuh-kuh-ruh-luh')
      .replace(/kohomada/gi, 'koh-hoh-muh-duh')
      .replace(/subha/gi, 'soo-buh')
      .replace(/davasak/gi, 'duh-vuh-suk')
      .replace(/hondayi/gi, 'hon-duh-yee')
      .replace(/samavenna/gi, 'suh-muh-ven-nuh')
      .replace(/ow/gi, 'ovv')
      .replace(/nahe|nae|naha/gi, 'næ-hæ');
  }

  return sinhalaText;
}

export function useSpeech() {
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(() => {
    try {
      const saved = localStorage.getItem('sinhala_voice_gender');
      if (saved === 'male' || saved === 'female') return saved;
    } catch {}
    return 'female';
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSpeakingRef = useRef(false);

  // Load voices (they load async across different browsers)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    const updateVoices = () => {
      try {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) {
          setVoices(list);
        }
      } catch (e) {
        console.warn('Failed to load voices:', e);
      }
    };

    updateVoices();

    try {
      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
      window.speechSynthesis.onvoiceschanged = updateVoices;
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
        if (window.speechSynthesis.onvoiceschanged === updateVoices) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    } catch (e) {
      console.warn('Failed to register voiceschanged event:', e);
    }
  }, []);

  const speak = useCallback((text: string, romanizedFallback: string = '', lang: string = 'si-LK') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis is not supported in this browser.');
      return;
    }

    try {
      // Unfreeze browser speech queue if stuck
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Failed to cancel active speech:', e);
    }

    // 1. Check for dedicated Sinhala voices
    const sinhalaVoices = voices.filter(v => 
      v.lang.startsWith('si') || 
      /sinhala|sarala|thilini/i.test(v.name)
    );
    const hasSinhalaVoice = sinhalaVoices.length > 0;

    // 2. Check for Indic voices (Tamil/Hindi) which share accurate Brahmic phonetics
    const indicVoices = voices.filter(v => 
      v.lang.startsWith('ta') || 
      v.lang.startsWith('hi') ||
      /india|tamil|hindi/i.test(v.name)
    );
    const hasIndicVoice = indicVoices.length > 0;

    const genderHint = voiceGender === 'female' 
      ? /female|woman|zira|samantha|sarala|google.*(si|ta|hi)/i 
      : /male|man|david|thilini|google.*(si|ta|hi)/i;

    let chosenVoice: SpeechSynthesisVoice | undefined;
    let targetText = text;
    let targetLang = lang;

    if (hasSinhalaVoice) {
      chosenVoice = sinhalaVoices.find(v => genderHint.test(v.name)) || sinhalaVoices[0];
      targetText = text;
      targetLang = chosenVoice.lang || 'si-LK';
    } else if (hasIndicVoice) {
      chosenVoice = indicVoices.find(v => genderHint.test(v.name)) || indicVoices[0];
      targetText = toSinhalaPhonetic(text, romanizedFallback);
      targetLang = chosenVoice.lang || 'ta-LK';
    } else {
      const allMatching = voices.filter(v => genderHint.test(v.name));
      if (allMatching.length) chosenVoice = allMatching[0];
      
      targetText = toSinhalaPhonetic(text, romanizedFallback);
      targetLang = chosenVoice?.lang || 'en-US';
    }

    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = targetLang;
    utterance.rate = 0.76;
    utterance.volume = 1;
    utterance.pitch = voiceGender === 'female' ? 1.2 : 0.88;

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    // GC protection - retain reference until audio finishes
    activeUtterances.add(utterance);
    utterance.onend = () => {
      activeUtterances.delete(utterance);
      isSpeakingRef.current = false;
    };
    utterance.onerror = () => {
      activeUtterances.delete(utterance);
      isSpeakingRef.current = false;
    };

    isSpeakingRef.current = true;

    // Small timeout prevents browser cancel/speak race condition
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis speak error:', err);
      }
    }, 20);
  }, [voiceGender, voices]);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        try {
          window.speechSynthesis.cancel();
          activeUtterances.clear();
        } catch (error) {
          console.error('Failed to cancel speech synthesis on unmount:', error);
        }
      }
    };
  }, [isSupported]);

  const toggleGender = useCallback(() => {
    setVoiceGender(prev => {
      const next = prev === 'female' ? 'male' : 'female';
      try { localStorage.setItem('sinhala_voice_gender', next); } catch {}
      return next;
    });
  }, []);

  return { speak, isSupported, voiceGender, toggleGender, setVoiceGender };
}
