import { useState, useEffect } from 'react';
import { conversations } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';
import { useSoundFX } from '../hooks/useSoundFX';

interface ConversationViewProps {
  darkMode: boolean;
  soundEnabled: boolean;
  onBack: () => void;
}

export default function ConversationView({ darkMode, soundEnabled, onBack }: ConversationViewProps) {
  const [activeConvo, setActiveConvo] = useState(0);
  const [mode, setMode] = useState<'read' | 'roleplay'>('read');
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set([0]));
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [roleplayStep, setRoleplayStep] = useState(0);
  const [selectedReply, setSelectedReply] = useState<number | null>(null);
  const [isReplyCorrect, setIsReplyCorrect] = useState<boolean | null>(null);

  const { speak, isSupported, speechSpeed, toggleSpeed } = useSpeech();
  const { playCorrect, playIncorrect, playLevelUp } = useSoundFX();

  const convo = conversations[activeConvo] || conversations[0];

  useEffect(() => {
    setRevealedLines(new Set([0]));
    setRoleplayStep(0);
    setSelectedReply(null);
    setIsReplyCorrect(null);
  }, [activeConvo, mode]);

  const revealNext = () => {
    const nextIndex = revealedLines.size;
    if (nextIndex < convo.lines.length) {
      setRevealedLines(prev => new Set(prev).add(nextIndex));
      const line = convo.lines[nextIndex];
      if (soundEnabled && isSupported) {
        speak(line.sinhala, line.transliteration, speechSpeed);
      }
    }
  };

  const resetConvo = () => {
    setRevealedLines(new Set([0]));
    setRoleplayStep(0);
    setSelectedReply(null);
    setIsReplyCorrect(null);
  };

  // Generate 2 distractors for Speaker B in Roleplay Mode
  const getRoleplayOptions = (currentLineIdx: number) => {
    const correctLine = convo.lines[currentLineIdx];
    const otherLines = convo.lines.filter((_, idx) => idx !== currentLineIdx);
    const options = [
      { text: correctLine.sinhala, english: correctLine.english, transliteration: correctLine.transliteration, isCorrect: true },
      { text: otherLines[0]?.sinhala || 'කමක් නැහැ', english: otherLines[0]?.english || 'No problem', transliteration: otherLines[0]?.transliteration || 'kamak næhæ', isCorrect: false },
      { text: otherLines[1]?.sinhala || 'මට තේරෙන්නේ නැහැ', english: otherLines[1]?.english || "I don't understand", transliteration: otherLines[1]?.transliteration || 'maṭa thērennē næhæ', isCorrect: false }
    ];
    // Deterministic shuffle based on step
    return currentLineIdx % 2 === 0 ? options : [options[1], options[0], options[2]];
  };

  const handleRoleplayChoice = (option: { text: string; english: string; transliteration: string; isCorrect: boolean }, idx: number) => {
    if (selectedReply !== null) return;
    setSelectedReply(idx);
    setIsReplyCorrect(option.isCorrect);

    if (option.isCorrect) {
      playCorrect();
      if (soundEnabled && isSupported) {
        speak(option.text, option.transliteration, speechSpeed);
      }
      setTimeout(() => {
        if (roleplayStep + 2 < convo.lines.length) {
          setRoleplayStep(prev => prev + 2);
          setSelectedReply(null);
          setIsReplyCorrect(null);
          // Auto-play next Speaker A line
          const nextA = convo.lines[roleplayStep + 2];
          if (nextA && soundEnabled && isSupported) {
            setTimeout(() => speak(nextA.sinhala, nextA.transliteration, speechSpeed), 500);
          }
        } else {
          setRoleplayStep(convo.lines.length);
          playLevelUp();
        }
      }, 1200);
    } else {
      playIncorrect();
      setTimeout(() => {
        setSelectedReply(null);
        setIsReplyCorrect(null);
      }, 1000);
    }
  };

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {soundEnabled && isSupported && (
            <button
              onClick={toggleSpeed}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                speechSpeed === 'slow'
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/40 ring-2 ring-amber-500/20'
                  : darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {speechSpeed === 'slow' ? '🐢 Slow (0.55x)' : '🐇 Normal'}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-2">
          <h1 className={`text-2xl font-black font-space ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            💬 Sinhala Conversations
          </h1>
          
          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setMode('read')}
              className={`px-3 py-1 rounded-lg transition-all ${mode === 'read' ? 'bg-saffron-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              📖 Read
            </button>
            <button
              onClick={() => setMode('roleplay')}
              className={`px-3 py-1 rounded-lg transition-all ${mode === 'roleplay' ? 'bg-saffron-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              🎭 Roleplay
            </button>
          </div>
        </div>

        <p className={`text-xs sm:text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {mode === 'read'
            ? 'Practice real-world dialogues. Reveal each line step by step with pronunciation!'
            : 'Interactive Roleplay: Play as Speaker B and choose the authentic response!'}
        </p>

        {/* Conversation selector pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {conversations.map((c, i) => (
            <button
              key={i}
              onClick={() => { 
                window.speechSynthesis.cancel(); 
                setActiveConvo(i); 
                resetConvo(); 
              }}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeConvo === i
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md shadow-saffron-500/20 scale-105'
                  : darkMode
                    ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="mr-1.5">{c.icon}</span>
              {c.title}
            </button>
          ))}
        </div>

        {/* Transliteration Toggle */}
        <div className="flex items-center justify-between mb-6 px-1">
          <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Show Romanized Transliteration
          </span>
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              showTransliteration ? 'bg-saffron-500' : darkMode ? 'bg-slate-700' : 'bg-slate-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${
              showTransliteration ? 'left-6' : 'left-1'
            }`} />
          </button>
        </div>

        {/* MODE 1: Read & Step-by-Step Reveal */}
        {mode === 'read' && (
          <div role="region" aria-label="Dialogue Transcript" className="space-y-4 mb-8">
            {convo.lines.map((line, i) => {
              const isRevealed = revealedLines.has(i);
              const isA = line.speaker === 'A';

              if (!isRevealed) {
                if (i === revealedLines.size) {
                  return (
                    <div key={i} className="flex justify-center py-2">
                      <button
                        onClick={revealNext}
                        className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm ${
                          darkMode
                            ? 'bg-slate-900 text-saffron-400 border border-saffron-500/30 hover:bg-slate-800'
                            : 'bg-white text-saffron-600 border-2 border-dashed border-saffron-300 hover:bg-saffron-50'
                        }`}
                      >
                        👇 Tap to reveal next line ({line.speaker === 'A' ? 'Speaker A' : 'Speaker B'})
                      </button>
                    </div>
                  );
                }
                return null;
              }

              return (
                <div
                  key={i}
                  className={`flex gap-3 animate-slide-up ${isA ? 'justify-start' : 'justify-end'}`}
                >
                  {isA && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md">
                      A
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-3xl p-4 sm:p-5 shadow-sm border ${
                    isA
                      ? darkMode
                        ? 'bg-slate-900 border-slate-800 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                      : 'bg-gradient-to-r from-saffron-500 to-saffron-600 border-saffron-500 text-white shadow-saffron-500/10'
                  }`}>
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className={`sinhala-text text-base sm:text-lg font-bold ${isA ? 'text-saffron-500 dark:text-saffron-400' : 'text-white'}`} lang="si">
                        {line.sinhala}
                      </p>
                      {soundEnabled && isSupported && (
                        <button
                          onClick={() => speak(line.sinhala, line.transliteration, speechSpeed)}
                          className={`p-1 rounded-lg transition-colors ${isA ? 'text-slate-400 hover:text-saffron-500' : 'text-white/80 hover:text-white'}`}
                          title="Listen to line"
                        >
                          🔊
                        </button>
                      )}
                    </div>

                    {showTransliteration && (
                      <p className={`text-xs italic mb-1 ${isA ? darkMode ? 'text-slate-400' : 'text-slate-500' : 'text-white/80'}`}>
                        [{line.transliteration}]
                      </p>
                    )}

                    <p className={`text-xs sm:text-sm font-medium ${isA ? darkMode ? 'text-slate-300' : 'text-slate-600' : 'text-white/95'}`}>
                      {line.english}
                    </p>
                  </div>

                  {!isA && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md">
                      B
                    </div>
                  )}
                </div>
              );
            })}

            {revealedLines.size >= convo.lines.length && (
              <div className="text-center pt-4">
                <button
                  onClick={resetConvo}
                  className={`px-5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    darkMode ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  🔄 Replay Conversation
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Roleplay Practice Mode */}
        {mode === 'roleplay' && (
          <div className="space-y-6 mb-8 animate-fade-in">
            {roleplayStep < convo.lines.length ? (
              <div className="space-y-6">
                {/* Speaker A Prompt */}
                <div className="flex gap-3 items-start animate-slide-up">
                  <div className="w-9 h-9 rounded-full bg-saffron-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-md">
                    A
                  </div>
                  <div className={`p-5 rounded-3xl border flex-1 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="sinhala-text text-lg font-bold text-saffron-500" lang="si">
                        {convo.lines[roleplayStep]?.sinhala}
                      </p>
                      {soundEnabled && isSupported && (
                        <button
                          onClick={() => speak(convo.lines[roleplayStep]?.sinhala, convo.lines[roleplayStep]?.transliteration, speechSpeed)}
                          className="p-1 text-slate-400 hover:text-saffron-500"
                        >
                          🔊
                        </button>
                      )}
                    </div>
                    {showTransliteration && (
                      <p className="text-xs text-slate-400 italic mb-1">
                        [{convo.lines[roleplayStep]?.transliteration}]
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-slate-400">
                      {convo.lines[roleplayStep]?.english}
                    </p>
                  </div>
                </div>

                {/* Speaker B (User Role) Response Choices */}
                {roleplayStep + 1 < convo.lines.length && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-400 text-center sm:text-left">
                      👉 Your Turn (Speaker B) — Choose the authentic reply:
                    </p>

                    <div className="space-y-2">
                      {getRoleplayOptions(roleplayStep + 1).map((opt, idx) => {
                        let btnStyle = darkMode
                          ? 'bg-slate-900 border-slate-800 hover:border-blue-500 text-white'
                          : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800 shadow-sm';

                        if (selectedReply !== null) {
                          if (opt.isCorrect) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
                          } else if (selectedReply === idx && !isReplyCorrect) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleRoleplayChoice(opt, idx)}
                            disabled={selectedReply !== null}
                            className={`w-full p-4 rounded-2xl border text-left transition-all ${btnStyle} hover:scale-[1.01] active:scale-95`}
                          >
                            <p className="sinhala-text text-base font-bold" lang="si">
                              {opt.text}
                            </p>
                            {showTransliteration && (
                              <p className="text-xs text-slate-400 italic">[{opt.transliteration}]</p>
                            )}
                            <p className="text-xs opacity-75 mt-0.5">{opt.english}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`p-8 rounded-3xl border text-center shadow-xl ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <span className="text-6xl block mb-3">🎊🏆🎊</span>
                <h3 className="text-xl font-bold font-space mb-2">Roleplay Completed!</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">
                  You successfully held an authentic conversation in Sinhala!
                </p>
                <button
                  onClick={resetConvo}
                  className="px-6 py-2.5 bg-saffron-500 text-white font-bold rounded-xl shadow-md"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
