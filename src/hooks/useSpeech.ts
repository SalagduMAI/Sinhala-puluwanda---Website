import { useCallback, useState, useEffect } from 'react';

export type VoiceGender = 'male' | 'female';

// Precise phonetic syllables for individual Sinhala alphabet letters
const SINHALA_LETTER_PHONETICS: Record<string, string> = {
  // Vowels (ස්වර)
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

  // Consonants (ව්‍යංජන with inherent vowel)
  'ක': 'kah',
  'ඛ': 'khah',
  'ග': 'gah',
  'ඝ': 'ghah',
  'ඞ': 'ngah',
  'ච': 'chah',
  'ඡ': 'chhah',
  'ජ': 'jah',
  'ඣ': 'jhah',
  'ඤ': 'nyah',
  'ඥ': 'gnyah',
  'ඦ': 'njah',
  'ට': 'tah',
  'ඨ': 'thah',
  'ඩ': 'dah',
  'ඪ': 'dhah',
  'ණ': 'nah',
  'ඬ': 'ndah',
  'ත': 'thah',
  'ථ': 'thhah',
  'ද': 'dhah',
  'ධ': 'dhhah',
  'න': 'nah',
  'ඳ': 'ndhah',
  'ප': 'pah',
  'ඵ': 'phah',
  'බ': 'bah',
  'භ': 'bhah',
  'ම': 'mah',
  'ඹ': 'mbah',
  'ය': 'yah',
  'ර': 'rah',
  'ල': 'lah',
  'ව': 'vah',
  'ශ': 'shah',
  'ෂ': 'shah',
  'ස': 'sah',
  'හ': 'hah',
  'ළ': 'lah',
  'ෆ': 'fah',
};

// Convert Sinhala Unicode words/phrases into natural phonetic speech for fallback engines
function toSinhalaPhonetic(sinhalaText: string, fallback: string): string {
  const trimmed = sinhalaText.trim();
  
  // Check exact single letter match first
  if (SINHALA_LETTER_PHONETICS[trimmed]) {
    return SINHALA_LETTER_PHONETICS[trimmed];
  }

  if (fallback && fallback.trim()) {
    // Convert romanized text into natural phonetic English TTS syllables
    return fallback
      .replace(/aa|ā/gi, 'aah')
      .replace(/æ|ae/gi, 'ae')
      .replace(/ee|ī/gi, 'eee')
      .replace(/oo|ū/gi, 'ooo')
      .replace(/ō/gi, 'oh')
      .replace(/ē/gi, 'ay')
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

  // Load voices (they load async in some browsers)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const load = () => {
      try {
        setVoices(window.speechSynthesis.getVoices());
      } catch (e) {
        console.warn('Failed to load voices:', e);
      }
    };
    load();
    try {
      window.speechSynthesis.addEventListener('voiceschanged', load);
      window.speechSynthesis.onvoiceschanged = load;
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', load);
        if (window.speechSynthesis.onvoiceschanged === load) {
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
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Failed to cancel active speech:', e);
    }

    // 1. Try to find a native Sinhala voice
    const sinhalaVoices = voices.filter(v => 
      v.lang.startsWith('si') || 
      /sinhala|sarala|thilini/i.test(v.name)
    );
    const hasSinhalaVoice = sinhalaVoices.length > 0;

    // 2. Try to find Indic regional voices (Tamil, Hindi) which share accurate Brahmic phonetics
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
      // Indic engines read Sinhala Unicode text or phonetic transliteration with authentic South Asian sounds
      targetText = toSinhalaPhonetic(text, romanizedFallback);
      targetLang = chosenVoice.lang || 'ta-LK';
    } else {
      // Fallback to best available generic voice with authentic Sinhala phonetic transcription
      const allMatching = voices.filter(v => genderHint.test(v.name));
      if (allMatching.length) chosenVoice = allMatching[0];
      
      targetText = toSinhalaPhonetic(text, romanizedFallback);
      targetLang = 'en-US';
    }

    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = targetLang;
    // Clear, natural speaking rate
    utterance.rate = 0.78;
    utterance.volume = 1;

    // Set pitch based on gender preference
    utterance.pitch = voiceGender === 'female' ? 1.25 : 0.85;

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [voiceGender, voices]);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        try {
          window.speechSynthesis.cancel();
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
