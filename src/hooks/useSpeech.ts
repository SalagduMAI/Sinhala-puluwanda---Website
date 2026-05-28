import { useCallback, useState, useEffect } from 'react';

export type VoiceGender = 'male' | 'female';

export function useSpeech() {
  const [voiceGender, setVoiceGender] = useState<VoiceGender>('female');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load voices (they load async in some browsers)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  const speak = useCallback((text: string, lang: string = 'si-LK') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.75;
    utterance.volume = 1;

    // Set pitch based on gender preference
    utterance.pitch = voiceGender === 'female' ? 1.3 : 0.8;

    // Try to find a matching Sinhala voice, preferring the chosen gender
    const sinhalaVoices = voices.filter(v => v.lang.startsWith('si'));
    const genderHint = voiceGender === 'female' ? /female|woman|zira|samantha|google.*si/i : /male|man|david|google.*si/i;

    let chosen = sinhalaVoices.find(v => genderHint.test(v.name));
    if (!chosen) chosen = sinhalaVoices[0];

    // Fallback: try any voice matching gender hint, then use pitch to simulate
    if (!chosen) {
      const allMatching = voices.filter(v => genderHint.test(v.name));
      if (allMatching.length) chosen = allMatching[0];
    }

    if (chosen) utterance.voice = chosen;
    window.speechSynthesis.speak(utterance);
  }, [voiceGender, voices]);

  const isSupported = 'speechSynthesis' in window;

  const toggleGender = useCallback(() => {
    setVoiceGender(prev => prev === 'female' ? 'male' : 'female');
  }, []);

  return { speak, isSupported, voiceGender, toggleGender, setVoiceGender };
}
