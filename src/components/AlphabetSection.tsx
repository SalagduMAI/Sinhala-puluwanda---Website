import { useState } from 'react';
import { alphabet } from '../data/lessons';
import { useSpeech } from '../hooks/useSpeech';

interface AlphabetSectionProps {
  darkMode: boolean;
  soundEnabled: boolean;
}

export default function AlphabetSection({ darkMode, soundEnabled }: AlphabetSectionProps) {
  const [selectedLetter, setSelectedLetter] = useState<typeof alphabet[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'vowel' | 'consonant'>('all');
  const { speak, isSupported } = useSpeech();

  const filtered = filter === 'all' ? alphabet : alphabet.filter(a => a.type === filter);

  const handleLetterClick = (item: typeof alphabet[0]) => {
    if (selectedLetter?.letter === item.letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(item);
      if (soundEnabled && isSupported) {
        speak(item.letter);
      }
    }
  };

  return (
    <section id="alphabet" className={`py-20 px-4 ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
            darkMode ? 'bg-saffron-900/30 text-saffron-400 border border-saffron-800/30' : 'bg-saffron-100 text-saffron-700'
          }`}>
            📖 The Script
          </span>
          <h2 className={`text-4xl md:text-5xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <span className="sinhala-text">සිංහල හෝඩිය</span>
          </h2>
          <p className={`text-xl ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>The Sinhala Alphabet</p>
          <p className={`mt-2 max-w-xl mx-auto ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Click any letter to hear its pronunciation and see details. 
            {isSupported && ' 🔊 Audio enabled!'}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {(['all', 'vowel', 'consonant'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                filter === f
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/20'
                  : darkMode
                    ? 'bg-slate-800 text-slate-400 hover:text-slate-300 border border-slate-700'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f === 'all' ? 'All Letters' : f === 'vowel' ? 'Vowels (ස්වර)' : 'Consonants (ව්‍යංජන)'}
            </button>
          ))}
        </div>

        {/* Letter grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-3">
          {filtered.map((item, i) => (
            <button
              key={i}
              onClick={() => handleLetterClick(item)}
              className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
                selectedLetter?.letter === item.letter
                  ? 'bg-gradient-to-br from-saffron-400 to-saffron-600 text-white shadow-lg shadow-saffron-500/30 scale-110 animate-pulse-glow'
                  : item.type === 'vowel'
                    ? darkMode 
                      ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40 border border-blue-800/50'
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 text-slate-800 hover:from-blue-100 hover:to-blue-200 border border-blue-200'
                    : darkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="sinhala-text text-2xl md:text-3xl font-semibold">{item.letter}</span>
              <span className={`text-[10px] mt-0.5 ${
                selectedLetter?.letter === item.letter ? 'text-white/80' : darkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {item.romanized}
              </span>
              {/* Sound icon on hover */}
              {soundEnabled && isSupported && (
                <div className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                  selectedLetter?.letter === item.letter ? 'text-white/60' : 'text-saffron-400'
                }`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Selected letter detail */}
        {selectedLetter && (
          <div className="mt-10 animate-scale-in">
            <div className={`max-w-lg mx-auto rounded-3xl p-8 text-center shadow-xl ${
              darkMode
                ? 'bg-gradient-to-br from-slate-800 to-slate-800/50 border border-saffron-800/30'
                : 'bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-200'
            }`}>
              <div className="flex justify-center mb-4">
                <span className="sinhala-text text-8xl md:text-9xl font-bold text-saffron-500 animate-wiggle">
                  {selectedLetter.letter}
                </span>
              </div>
              <p className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>
                {selectedLetter.romanized}
              </p>
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
                selectedLetter.type === 'vowel' 
                  ? darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30' : 'bg-blue-100 text-blue-700' 
                  : darkMode ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/30' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedLetter.type === 'vowel' ? 'Vowel (ස්වරය)' : 'Consonant (ව්‍යංජනය)'}
              </span>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                🎵 {selectedLetter.audio}
              </p>
              {soundEnabled && isSupported && (
                <button
                  onClick={() => speak(selectedLetter.letter)}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-xl font-medium text-sm hover:scale-105 transition-transform shadow-lg shadow-saffron-500/20"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                  </svg>
                  Listen Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Info cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-14">
          <div className={`rounded-2xl p-6 card-3d ${
            darkMode ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔤</span>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>Vowels (ස්වර)</h3>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-blue-300/70' : 'text-blue-700/80'}`}>
              Sinhala has 18 vowels. Vowels can appear at the beginning of a word in their full form, 
              or as diacritical marks attached to consonants within words.
            </p>
          </div>
          <div className={`rounded-2xl p-6 card-3d ${
            darkMode ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔡</span>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>Consonants (ව්‍යංජන)</h3>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-emerald-300/70' : 'text-emerald-700/80'}`}>
              There are 42 consonants in Sinhala. Each consonant inherently carries the vowel sound "a" (අ). 
              Special marks are used to change or remove this vowel sound.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
