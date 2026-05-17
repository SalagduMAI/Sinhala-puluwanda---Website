import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, lang: string = 'si-LK') => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a Sinhala voice, fallback to default
    const voices = window.speechSynthesis.getVoices();
    const sinhalaVoice = voices.find(v => v.lang.startsWith('si'));
    if (sinhalaVoice) {
      utterance.voice = sinhalaVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const isSupported = 'speechSynthesis' in window;

  return { speak, isSupported };
}
