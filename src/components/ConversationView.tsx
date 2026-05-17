import { useState } from 'react';
import { conversations } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';

interface ConversationViewProps {
  darkMode: boolean;
  soundEnabled: boolean;
  onBack: () => void;
}

export default function ConversationView({ darkMode, soundEnabled, onBack }: ConversationViewProps) {
  const [activeConvo, setActiveConvo] = useState(0);
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const [showTransliteration, setShowTransliteration] = useState(true);
  const { speak, isSupported } = useSpeech();

  const convo = conversations[activeConvo];

  const revealNext = () => {
    const nextIndex = revealedLines.size;
    if (nextIndex < convo.lines.length) {
      setRevealedLines(prev => new Set(prev).add(nextIndex));
    }
  };

  const resetConvo = () => {
    setRevealedLines(new Set());
  };

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button onClick={onBack} className={`flex items-center gap-2 text-sm mb-4 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>💬 Conversations</h1>
        <p className={`text-sm mb-6 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Practice real-world dialogues. Reveal each line step by step!
        </p>

        {/* Conversation selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {conversations.map((c, i) => (
            <button
              key={i}
              onClick={() => { setActiveConvo(i); resetConvo(); }}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                activeConvo === i
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/20'
                  : darkMode
                    ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="mr-2">{c.icon}</span>
              {c.title}
            </button>
          ))}
        </div>

        {/* Toggle transliteration */}
        <div className="flex items-center justify-between mb-6">
          <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Show pronunciation</span>
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`w-12 h-6 rounded-full relative transition-colors ${
              showTransliteration ? 'bg-saffron-500' : darkMode ? 'bg-slate-700' : 'bg-slate-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
              showTransliteration ? 'left-6' : 'left-0.5'
            }`} />
          </button>
        </div>

        {/* Chat bubbles */}
        <div className="space-y-4 mb-8">
          {convo.lines.map((line, i) => {
            const isRevealed = revealedLines.has(i);
            const isA = line.speaker === 'A';

            if (!isRevealed) {
              if (i === revealedLines.size) {
                return (
                  <div key={i} className="flex justify-center">
                    <button
                      onClick={revealNext}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                        darkMode
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-saffron-600'
                          : 'bg-white text-slate-500 border-2 border-dashed border-slate-300 hover:border-saffron-400'
                      }`}
                    >
                      Tap to reveal next line...
                    </button>
                  </div>
                );
              }
              return null;
            }

            return (
              <div key={i} className={`flex ${isA ? 'justify-start' : 'justify-end'} animate-slide-up`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  isA
                    ? darkMode
                      ? 'bg-slate-800 border border-slate-700 rounded-bl-sm'
                      : 'bg-white border border-slate-200 shadow-sm rounded-bl-sm'
                    : 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-br-sm shadow-lg shadow-saffron-500/20'
                }`}>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className={`sinhala-text text-lg font-semibold mb-1 ${
                        isA ? darkMode ? 'text-white' : 'text-slate-900' : 'text-white'
                      }`}>
                        {line.sinhala}
                      </p>
                      {showTransliteration && (
                        <p className={`text-xs italic mb-1 ${isA ? darkMode ? 'text-slate-500' : 'text-slate-400' : 'text-white/60'}`}>
                          {line.transliteration}
                        </p>
                      )}
                      <p className={`text-sm ${isA ? darkMode ? 'text-slate-400' : 'text-slate-500' : 'text-white/80'}`}>
                        {line.english}
                      </p>
                    </div>
                    {soundEnabled && isSupported && (
                      <button
                        onClick={() => speak(line.sinhala)}
                        className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
                          isA
                            ? darkMode ? 'hover:bg-slate-700 text-slate-500' : 'hover:bg-slate-100 text-slate-400'
                            : 'hover:bg-white/20 text-white/70'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {revealedLines.size === convo.lines.length && (
          <div className="text-center animate-fade-in">
            <p className={`text-sm mb-4 ${darkMode ? 'text-leaf-400' : 'text-leaf-600'}`}>🎉 Conversation complete!</p>
            <button onClick={resetConvo} className="px-6 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform">
              🔄 Practice Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
