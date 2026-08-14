import { useState, useCallback, useRef } from 'react';

// Declare SpeechRecognition interface for TypeScript
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

// Levenshtein distance algorithm for similarity matching
export function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 100;
  if (!s1 || !s2) return 0;

  const track = Array(s2.length + 1).fill(null).map(() =>
    Array(s1.length + 1).fill(null)
  );

  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.max(0, Math.round(similarity));
}

function isSinhalaScript(text: string): boolean {
  return /[\u0D80-\u0DFF]/.test(text);
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  const startListening = useCallback((targetWord?: string, targetTransliteration?: string) => {
    setErrorMessage(null);
    setTranscript('');
    setAccuracyScore(null);

    if (!isSupported) {
      setErrorMessage('Speech recognition is not supported in this browser. Try Google Chrome or Edge.');
      return;
    }

    try {
      const SpeechRecognitionCtor = (window as unknown as Record<string, new () => SpeechRecognitionInstance>).SpeechRecognition ||
        (window as unknown as Record<string, new () => SpeechRecognitionInstance>).webkitSpeechRecognition;

      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'si-LK'; // Sinhala (Sri Lanka) language code

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult && lastResult[0]) {
          const spokenText = lastResult[0].transcript;
          setTranscript(spokenText);

          if (targetWord || targetTransliteration) {
            let score1 = 0, score2 = 0;
            const isSinhala = isSinhalaScript(spokenText);
            if (targetWord) {
              score1 = calculateStringSimilarity(spokenText, targetWord);
            }
            if (targetTransliteration) {
              score2 = calculateStringSimilarity(spokenText, targetTransliteration);
            }
            const matchScore = isSinhala ? score1 : (score2 > 0 ? score2 : score1);
            setAccuracyScore(matchScore);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setErrorMessage('No speech was detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow mic permissions.');
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setErrorMessage('Failed to start speech recognition.');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    accuracyScore,
    errorMessage,
    startListening,
    stopListening,
  };
}
