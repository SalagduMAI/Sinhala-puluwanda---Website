import { useCallback, useState, useEffect, useRef } from 'react';

export type VoiceGender = 'male' | 'female';
export type SpeechSpeed = 'normal' | 'slow';

// Prevent Chromium / Safari Garbage Collection of active utterances
const activeUtterances = new Set<SpeechSynthesisUtterance>();

// Precise phonetic syllables for isolated letters
const SINHALA_ROOT_PHONETICS: Record<string, string> = {
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
  'ක': 'kah', 'ඛ': 'khah', 'ග': 'gah', 'ඝ': 'ghah', 'ඞ': 'ngah',
  'ච': 'chah', 'ඡ': 'chhah', 'ජ': 'jah', 'ඣ': 'jhah', 'ඤ': 'nyah', 'ඥ': 'gnyah',
  'ට': 'tah', 'ඨ': 'thah', 'ඩ': 'dah', 'ඪ': 'dhah', 'ණ': 'nah',
  'ත': 'thah', 'ථ': 'thhah', 'ද': 'dhah', 'ධ': 'dhhah', 'න': 'nah',
  'ප': 'pah', 'ඵ': 'phah', 'බ': 'bah', 'භ': 'bhah', 'ම': 'mah',
  'ය': 'yah', 'ර': 'rah', 'ල': 'lah', 'ව': 'vah',
  'ශ': 'shah', 'ෂ': 'shah', 'ස': 'sah', 'හ': 'hah',
  'ළ': 'lah', 'ෆ': 'fah',
  'ඟ': 'nggah', 'ඦ': 'njah', 'ඬ': 'ndah', 'ඳ': 'ndhah', 'ඹ': 'mbah',
};

// Consonant base stems (without default 'a' vowel)
const CONSONANT_STEMS: Record<string, string> = {
  'ක': 'k', 'ඛ': 'kh', 'ග': 'g', 'ඝ': 'gh', 'ඞ': 'ng',
  'ච': 'ch', 'ඡ': 'chh', 'ජ': 'j', 'ඣ': 'jh', 'ඤ': 'ny', 'ඥ': 'gny',
  'ට': 't', 'ඨ': 'th', 'ඩ': 'd', 'ඪ': 'dh', 'ණ': 'n',
  'ත': 'th', 'ථ': 'thh', 'ද': 'dh', 'ධ': 'dhh', 'න': 'n',
  'ප': 'p', 'ඵ': 'ph', 'බ': 'b', 'භ': 'bh', 'ම': 'm',
  'ය': 'y', 'ර': 'r', 'ල': 'l', 'ව': 'v',
  'ශ': 'sh', 'ෂ': 'sh', 'ස': 's', 'හ': 'h',
  'ළ': 'l', 'ෆ': 'f',
  'ඟ': 'ngg', 'ඦ': 'nj', 'ඬ': 'nd', 'ඳ': 'ndh', 'ඹ': 'mb',
};

// Independent vowels mapping
const VOWEL_SOUNDS: Record<string, string> = {
  'අ': 'a', 'ආ': 'aah', 'ඇ': 'ae', 'ඈ': 'aae', 'ඉ': 'ee', 'ඊ': 'eee',
  'උ': 'oo', 'ඌ': 'ooo', 'ඍ': 'roo', 'ඎ': 'rooo', 'එ': 'e', 'ඒ': 'ay',
  'ඓ': 'eye', 'ඔ': 'oh', 'ඕ': 'ooh', 'ඖ': 'ow',
};

// Diacritic modifiers (Pillam)
const PILLAM_VOWELS: Record<string, string> = {
  '\u0DCA': '',       // ් (Hal kirima - silent consonant)
  '\u0DCF': 'aah',    // ා (Aela pilla)
  '\u0DD0': 'ae',     // ැ (Aeda pilla)
  '\u0DD1': 'aae',    // ෑ (Diga aeda pilla)
  '\u0DD2': 'ee',     // ි (Ispilla)
  '\u0DD3': 'eee',    // ී (Diga ispilla)
  '\u0DD4': 'oo',     // ු (Paapilla)
  '\u0DD6': 'ooo',    // ූ (Diga paapilla)
  '\u0DD8': 'roo',    // ෘ (Gaetapilla)
  '\u0DF2': 'rooo',   // ෲ (Diga gaetapilla)
  '\u0DD9': 'e',      // ෙ (Kombuva)
  '\u0DDA': 'ay',     // ේ (Kombuva + Hal)
  '\u0DDB': 'eye',    // ෛ (Kombu deka)
  '\u0DDC': 'oh',     // ො (Kombuva + Aela)
  '\u0DDD': 'ooh',    // ෝ (Kombuva + Hal + Aela)
  '\u0DDE': 'ow',     // ෞ (Kombuva + Gayanukitta)
  '\u0D82': 'ung',    // ං (Anusvaraya)
  '\u0D83': 'ah',     // ඃ (Visargaya)
};

/**
 * Robust Sinhala Unicode-to-Phonetics Transliterator.
 * Decomposes any Sinhala string into natural phonetic English syllables
 * for flawless TTS audio playback on devices lacking native si-LK voice.
 */
export function sinhalaToPhonetics(text: string): string {
  if (!text || !text.trim()) return '';
  const trimmed = text.trim();

  // 1. Check isolated single letter match
  if (SINHALA_ROOT_PHONETICS[trimmed]) {
    return SINHALA_ROOT_PHONETICS[trimmed];
  }

  // 2. Transliterate Sinhala Unicode graphemes
  let result = '';
  let i = 0;
  const len = trimmed.length;

  while (i < len) {
    const char = trimmed[i];

    // Check independent vowel
    if (VOWEL_SOUNDS[char]) {
      result += VOWEL_SOUNDS[char];
      i++;
      continue;
    }

    // Check consonant
    if (CONSONANT_STEMS[char]) {
      const stem = CONSONANT_STEMS[char];
      let vowel = 'a'; // default inherent vowel
      let nextIdx = i + 1;

      // Check ZWJ conjuncts (e.g., ක්‍ය = kya, ක්‍ර = kra)
      if (nextIdx < len && trimmed[nextIdx] === '\u0DCA' && nextIdx + 2 < len && trimmed[nextIdx + 1] === '\u200D') {
        const conjunctChar = trimmed[nextIdx + 2];
        if (conjunctChar === 'ය') {
          result += stem + 'y';
          nextIdx += 3;
        } else if (conjunctChar === 'ර') {
          result += stem + 'r';
          nextIdx += 3;
        } else {
          result += stem;
          nextIdx += 2;
        }
      }

      // Check subsequent Pillam diacritic
      if (nextIdx < len && PILLAM_VOWELS[trimmed[nextIdx]] !== undefined) {
        vowel = PILLAM_VOWELS[trimmed[nextIdx]];
        nextIdx++;
      }

      result += stem + vowel;
      i = nextIdx;
      continue;
    }

    // Anusvaraya / Visargaya alone
    if (PILLAM_VOWELS[char] !== undefined) {
      result += PILLAM_VOWELS[char];
      i++;
      continue;
    }

    // Whitespace / punctuation
    result += char;
    i++;
  }

  return result;
}

// Convert Sinhala Unicode words/phrases into natural phonetic speech for fallback engines
function toSinhalaPhonetic(sinhalaText: string, fallback: string): string {
  const trimmed = sinhalaText.trim();
  
  if (SINHALA_ROOT_PHONETICS[trimmed]) {
    return SINHALA_ROOT_PHONETICS[trimmed];
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

  // Use algorithmic decomposition when fallback string is omitted
  return sinhalaToPhonetics(sinhalaText);
}

export function useSpeech() {
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(() => {
    try {
      const saved = localStorage.getItem('sinhala_voice_gender');
      if (saved === 'male' || saved === 'female') return saved;
    } catch {}
    return 'female';
  });

  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>(() => {
    try {
      const saved = localStorage.getItem('sinhala_speech_speed');
      if (saved === 'normal' || saved === 'slow') return saved;
    } catch {}
    return 'normal';
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

  const speak = useCallback((
    text: string,
    romanizedFallback: string = '',
    customSpeed?: SpeechSpeed
  ) => {
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
    let targetLang = 'si-LK';

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

    const currentSpeed = customSpeed || speechSpeed;
    const rate = currentSpeed === 'slow' ? 0.55 : 0.82;

    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = targetLang;
    utterance.rate = rate;
    utterance.volume = 1;
    utterance.pitch = voiceGender === 'female' ? 1.15 : 0.88;

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
  }, [speechSpeed, voiceGender, voices]);

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

  const toggleSpeed = useCallback(() => {
    setSpeechSpeed(prev => {
      const next = prev === 'normal' ? 'slow' : 'normal';
      try { localStorage.setItem('sinhala_speech_speed', next); } catch {}
      return next;
    });
  }, []);

  return {
    speak,
    isSupported,
    voiceGender,
    toggleGender,
    setVoiceGender,
    speechSpeed,
    toggleSpeed,
    setSpeechSpeed
  };
}
