import { useCallback, useState, useEffect } from 'react';

export type VoiceGender = 'male' | 'female';

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
      return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
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

    // Try to find a matching Sinhala voice, preferring the chosen gender
    const sinhalaVoices = voices.filter(v => v.lang.startsWith('si'));
    const hasSinhalaVoice = sinhalaVoices.length > 0;
    const genderHint = voiceGender === 'female' ? /female|woman|zira|samantha|google.*si/i : /male|man|david|google.*si/i;

    let chosen = sinhalaVoices.find(v => genderHint.test(v.name));
    if (!chosen && hasSinhalaVoice) chosen = sinhalaVoices[0];

    // Fallback: try any voice matching gender hint
    if (!chosen) {
      const allMatching = voices.filter(v => genderHint.test(v.name));
      if (allMatching.length) chosen = allMatching[0];
    }

    // Determine target text and language based on voice availability
    const targetText = (!hasSinhalaVoice && romanizedFallback) ? romanizedFallback : text;
    const targetLang = (!hasSinhalaVoice && romanizedFallback) ? 'en-US' : lang;

    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.lang = targetLang;
    // Slow down rate slightly for clearer learning pronunciation
    utterance.rate = 0.7;
    utterance.volume = 1;

    // Set pitch based on gender preference
    utterance.pitch = voiceGender === 'female' ? 1.3 : 0.8;

    if (chosen) utterance.voice = chosen;

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
