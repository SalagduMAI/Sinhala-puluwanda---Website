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
  const { speak, isSupported, voiceGender, toggleGender } = useSpeech();

  const filtered = filter === 'all' ? alphabet : alphabet.filter(a => a.type === filter);
  const vowelCount = alphabet.filter(a => a.type === 'vowel').length;
  const consonantCount = alphabet.filter(a => a.type === 'consonant').length;

  const handleLetterClick = (item: typeof alphabet[0]) => {
    if (selectedLetter?.letter === item.letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(item);
      if (soundEnabled && isSupported) speak(item.letter);
    }
  };

  return (
    <section id="alphabet" className={`py-16 sm:py-24 px-5 sm:px-6 ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-5 ${
            darkMode ? 'glass-glow text-saffron-400' : 'bg-saffron-100 text-saffron-700'
          }`}>
            📖 Complete Script — All 60 Letters
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-3 font-space tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <span className="sinhala-text">සිංහල හෝඩිය</span>
          </h2>
          <p className={`text-base sm:text-lg ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>The Complete Sinhala Alphabet — {vowelCount} Vowels + {consonantCount} Consonants</p>
          <p className={`mt-2 max-w-xl mx-auto text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Click any letter to hear its pronunciation{isSupported && ' 🔊'}. Toggle male/female voice below.
          </p>
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {/* Filter tabs */}
          {(['all', 'vowel', 'consonant'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 ${
                filter === f
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/20'
                  : darkMode ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-white text-slate-600 border border-slate-200'
              }`}>
              {f === 'all' ? `All (${alphabet.length})` : f === 'vowel' ? `Vowels (${vowelCount})` : `Consonants (${consonantCount})`}
            </button>
          ))}

          {/* Voice gender toggle */}
          {soundEnabled && isSupported && (
            <button onClick={toggleGender}
              className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                darkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30 hover:border-purple-700' : 'bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300'
              }`}>
              <span>{voiceGender === 'female' ? '👩' : '👨'}</span>
              {voiceGender === 'female' ? 'Female Voice' : 'Male Voice'}
            </button>
          )}
        </div>

        {/* Letter grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 sm:gap-2.5">
          {filtered.map((item, i) => (
            <button key={i} onClick={() => handleLetterClick(item)}
              className={`group relative aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                selectedLetter?.letter === item.letter
                  ? 'bg-gradient-to-br from-saffron-400 to-saffron-600 text-white shadow-lg shadow-saffron-500/30 scale-105 ring-2 ring-saffron-400/50'
                  : item.type === 'vowel'
                    ? darkMode ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50 hover:bg-blue-800/40' : 'bg-blue-50 text-slate-800 border border-blue-200 hover:bg-blue-100'
                    : darkMode ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300'
              }`}>
              <span className="sinhala-text text-lg sm:text-xl md:text-2xl font-semibold leading-none">{item.letter}</span>
              <span className={`text-[8px] sm:text-[9px] mt-0.5 leading-none ${
                selectedLetter?.letter === item.letter ? 'text-white/80' : darkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>{item.romanized}</span>
            </button>
          ))}
        </div>

        {/* Selected letter detail */}
        {selectedLetter && (
          <div className="mt-8 sm:mt-10 animate-scale-in">
            <div className={`max-w-lg mx-auto rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-xl ${
              darkMode ? 'glass-dark' : 'glass-card border-saffron-200'
            }`}>
              <span className="sinhala-text text-7xl sm:text-8xl md:text-9xl font-bold text-saffron-500 block mb-3 animate-wiggle">{selectedLetter.letter}</span>
              <p className={`text-xl sm:text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>{selectedLetter.romanized}</p>
              <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium mb-3 ${
                selectedLetter.type === 'vowel'
                  ? darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30' : 'bg-blue-100 text-blue-700'
                  : darkMode ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/30' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedLetter.type === 'vowel' ? 'Vowel (ස්වරය)' : 'Consonant (ව්‍යංජනය)'}
              </span>
              <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>🎵 {selectedLetter.audio}</p>

              {/* Pronunciation buttons */}
              {soundEnabled && isSupported && (
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={() => { speak(selectedLetter.letter); }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-xl font-medium text-xs sm:text-sm hover:scale-105 transition-transform shadow-lg shadow-saffron-500/20">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
                    {voiceGender === 'female' ? '👩 Female' : '👨 Male'} Voice
                  </button>
                  <button onClick={toggleGender}
                    className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                      darkMode ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}>
                    🔄 Switch to {voiceGender === 'female' ? '👨 Male' : '👩 Female'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-10 sm:mt-14">
          <div className={`rounded-2xl p-5 sm:p-6 card-3d ${darkMode ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔤</span>
              <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>18 Vowels (ස්වර)</h3>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-blue-300/70' : 'text-blue-700/80'}`}>
              Includes short/long pairs, vocalic r (ඍ/ඎ), diphthongs (ඓ/ඖ), and special marks (අං/අඃ).
              Vowels appear at word beginnings or as diacritical marks on consonants.
            </p>
          </div>
          <div className={`rounded-2xl p-5 sm:p-6 card-3d ${darkMode ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔡</span>
              <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>42 Consonants (ව්‍යංජන)</h3>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-emerald-300/70' : 'text-emerald-700/80'}`}>
              Organized by articulation point — velar, palatal, retroflex, dental, labial.
              Includes aspirated pairs, nasals, sibilants, and 5 pre-nasalized stops unique to Sinhala.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
