import { useState } from 'react';
import { alphabet } from '../data/lessons';
import { PILLAM_LIST, PILLAM_CONSONANTS, combinePillam, Pillam } from '../data/pillam';
import { useSpeech } from '../hooks/useSpeech';

interface AlphabetSectionProps {
  darkMode: boolean;
  soundEnabled: boolean;
}

export default function AlphabetSection({ darkMode, soundEnabled }: AlphabetSectionProps) {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'pillam'>('alphabet');
  const [selectedLetter, setSelectedLetter] = useState<typeof alphabet[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'vowel' | 'consonant'>('all');
  const [selectedConsonant, setSelectedConsonant] = useState('ක');
  const [selectedPillam, setSelectedPillam] = useState<Pillam | null>(null);
  const [customWord, setCustomWord] = useState('');

  const { speak, isSupported, voiceGender, toggleGender, speechSpeed, toggleSpeed } = useSpeech();

  const filtered = filter === 'all' ? alphabet : alphabet.filter(a => a.type === filter);
  const vowelCount = alphabet.filter(a => a.type === 'vowel').length;
  const consonantCount = alphabet.filter(a => a.type === 'consonant').length;

  const handleLetterClick = (item: typeof alphabet[0]) => {
    setSelectedLetter(item);
    if (isSupported && soundEnabled) {
      speak(item.letter, item.romanized);
    }
  };

  const handlePlaySound = (speedOverride?: 'normal' | 'slow') => {
    if (selectedLetter && isSupported && soundEnabled) {
      speak(selectedLetter.letter, selectedLetter.romanized, speedOverride || speechSpeed);
    }
  };

  const handlePillamClick = (pillam: Pillam) => {
    setSelectedPillam(pillam);
    const combined = combinePillam(selectedConsonant, pillam.symbol);
    if (isSupported && soundEnabled) {
      speak(combined, '', speechSpeed);
    }
  };

  const handlePlayCustomWord = (speedOverride?: 'normal' | 'slow') => {
    if (customWord.trim() && isSupported && soundEnabled) {
      speak(customWord.trim(), '', speedOverride || speechSpeed);
    }
  };

  return (
    <section id="alphabet" className={`py-16 sm:py-24 px-5 sm:px-6 ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700/60 mb-6 shadow-inner">
            <button
              onClick={() => setActiveTab('alphabet')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'alphabet'
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-saffron-500'
              }`}
            >
              🔤 60 Alphabet Letters
            </button>
            <button
              onClick={() => setActiveTab('pillam')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'pillam'
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-saffron-500'
              }`}
            >
              ✨ Pillam Masterclass (පිල්ලම්)
            </button>
          </div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-3 font-space tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <span className="sinhala-text" lang="si">{activeTab === 'alphabet' ? 'සිංහල හෝඩිය' : 'පිල්ලම් අභ්‍යාසය'}</span>
          </h2>
          <p className={`text-base sm:text-lg ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {activeTab === 'alphabet'
              ? `The Complete Sinhala Alphabet — ${vowelCount} Vowels + ${consonantCount} Consonants`
              : 'Interactive Diacritics Combiner — Learn how 18 vowel marks transform consonants into syllables'}
          </p>
        </div>

        {/* Global Sound Controls Toolbar */}
        {soundEnabled && isSupported && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            <button
              onClick={toggleSpeed}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                speechSpeed === 'slow'
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 ring-2 ring-amber-500/20'
                  : darkMode ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-white text-slate-600 border border-slate-200'
              }`}
              title="Toggle Slow / Normal audio speed"
            >
              <span>{speechSpeed === 'slow' ? '🐢 Slow Speed (0.55x)' : '🐇 Normal Speed (0.8x)'}</span>
            </button>

            <button
              onClick={toggleGender}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                darkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30' : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}
            >
              <span>{voiceGender === 'female' ? '👩 Female Voice' : '👨 Male Voice'}</span>
            </button>
          </div>
        )}

        {/* TAB 1: 60 Alphabet Letters */}
        {activeTab === 'alphabet' && (
          <div>
            {/* Filter tabs */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {(['all', 'vowel', 'consonant'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                    filter === f
                      ? 'bg-saffron-500 text-white shadow-md shadow-saffron-500/20'
                      : darkMode ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {f === 'all' ? `All (${alphabet.length})` : f === 'vowel' ? `Vowels (${vowelCount})` : `Consonants (${consonantCount})`}
                </button>
              ))}
            </div>

            {/* Letter Grid */}
            <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 sm:gap-2.5">
              {filtered.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleLetterClick(item)}
                  className={`group relative aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                    selectedLetter?.letter === item.letter
                      ? 'bg-gradient-to-br from-saffron-400 to-saffron-600 text-white shadow-lg shadow-saffron-500/30 scale-105 ring-2 ring-saffron-400/50'
                      : item.type === 'vowel'
                        ? darkMode ? 'bg-blue-900/30 text-blue-300 border border-blue-800/50 hover:bg-blue-800/40' : 'bg-blue-50 text-slate-800 border border-blue-200 hover:bg-blue-100'
                        : darkMode ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="sinhala-text text-lg sm:text-xl md:text-2xl font-semibold leading-none" lang="si">{item.letter}</span>
                  <span className={`text-[8px] sm:text-[9px] mt-0.5 leading-none ${
                    selectedLetter?.letter === item.letter ? 'text-white/80' : darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>{item.romanized}</span>
                </button>
              ))}
            </div>

            {/* Selected letter detail */}
            {selectedLetter && (
              <div className="mt-8 sm:mt-10 animate-scale-in">
                <div className={`max-w-lg mx-auto rounded-3xl p-6 sm:p-8 text-center shadow-xl border ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-saffron-200'
                }`}>
                  <button
                    onClick={() => handlePlaySound()}
                    className="sinhala-text text-7xl sm:text-8xl md:text-9xl font-bold text-saffron-500 block mb-3 animate-wiggle hover:scale-105 active:scale-95 transition-transform mx-auto focus:outline-none cursor-pointer"
                    lang="si"
                    title="Click to hear pronunciation"
                  >
                    {selectedLetter.letter}
                  </button>
                  <p className={`text-xl sm:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{selectedLetter.romanized}</p>
                  <span className={`inline-block px-3 sm:px-4 py-1 rounded-full text-xs font-semibold mb-3 ${
                    selectedLetter.type === 'vowel'
                      ? darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30' : 'bg-blue-100 text-blue-700'
                      : darkMode ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/30' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {selectedLetter.type === 'vowel' ? 'Vowel (ස්වරය)' : 'Consonant (ව්‍යංජනය)'}
                  </span>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>🎵 {selectedLetter.audio}</p>

                  {soundEnabled && isSupported && (
                    <div className="flex flex-wrap gap-2.5 justify-center">
                      <button
                        onClick={() => handlePlaySound('normal')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        🔊 Normal Play
                      </button>
                      <button
                        onClick={() => handlePlaySound('slow')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl font-semibold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all"
                      >
                        🐢 Slow (0.55x)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Pillam Explorer (පිල්ලම් අභ්‍යාසය) */}
        {activeTab === 'pillam' && (
          <div className="space-y-8 animate-fade-in">
            {/* Consonant Selector Bar */}
            <div className={`p-4 sm:p-6 rounded-3xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <p className="text-xs font-bold uppercase tracking-wider text-saffron-500 mb-3 text-center sm:text-left">
                1. Select a Base Consonant (ව්‍යංජනයක් තෝරන්න):
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {PILLAM_CONSONANTS.map((c) => (
                  <button
                    key={c.char}
                    onClick={() => {
                      setSelectedConsonant(c.char);
                      if (selectedPillam && isSupported && soundEnabled) {
                        speak(combinePillam(c.char, selectedPillam.symbol), '', speechSpeed);
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-base sm:text-lg font-bold transition-all ${
                      selectedConsonant === c.char
                        ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg scale-110 ring-2 ring-saffron-400'
                        : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="sinhala-text" lang="si">{c.char}</span>
                    <span className="text-[10px] ml-1 font-normal opacity-70">({c.name})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pillam Transformations Grid */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-saffron-500 mb-4 text-center sm:text-left">
                2. Tap Any Diacritic Mark (පිල්ලම මත ක්ලික් කර ශබ්දය අසන්න):
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {PILLAM_LIST.map((pillam) => {
                  const combinedGlyph = combinePillam(selectedConsonant, pillam.symbol);
                  const isCurrent = selectedPillam?.id === pillam.id;

                  return (
                    <button
                      key={pillam.id}
                      onClick={() => handlePillamClick(pillam)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 hover:scale-[1.03] active:scale-95 flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-gradient-to-br from-saffron-500/15 to-orange-500/10 border-saffron-500 ring-2 ring-saffron-500/30'
                          : darkMode ? 'bg-slate-800/80 border-slate-700 hover:border-saffron-500/50' : 'bg-white border-slate-200 hover:border-saffron-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="sinhala-text text-3xl font-black text-saffron-500" lang="si">
                          {combinedGlyph}
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-saffron-500/10 text-saffron-600 dark:text-saffron-400">
                          {pillam.symbol}
                        </span>
                      </div>

                      <div className="mt-3">
                        <h4 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>
                          {pillam.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {pillam.nameEnglish}
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-400 mt-1">
                          {pillam.vowelEffect}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pillam Detail Card */}
            {selectedPillam && (
              <div className={`p-6 sm:p-8 rounded-3xl border animate-scale-in max-w-2xl mx-auto ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
              }`}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="text-center">
                    <span className="sinhala-text text-7xl font-black text-saffron-500 block leading-none" lang="si">
                      {combinePillam(selectedConsonant, selectedPillam.symbol)}
                    </span>
                    <span className="text-xs text-slate-400 mt-2 block">
                      {selectedConsonant} + {selectedPillam.symbol} ({selectedPillam.name})
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {selectedPillam.name}
                      </h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-saffron-500/10 text-saffron-500">
                        {selectedPillam.nameEnglish}
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {selectedPillam.description}
                    </p>

                    <div className="pt-2">
                      <p className="text-xs font-semibold text-slate-400">Example Word in Context:</p>
                      <p className="text-sm font-bold text-saffron-500">
                        <span className="sinhala-text mr-1.5" lang="si">{selectedPillam.exampleWord}</span>
                        <span className="text-xs text-slate-400 font-normal">({selectedPillam.exampleMeaning})</span>
                      </p>
                    </div>

                    {soundEnabled && isSupported && (
                      <div className="pt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                        <button
                          onClick={() => speak(combinePillam(selectedConsonant, selectedPillam.symbol), '', 'normal')}
                          className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                        >
                          🔊 Play ({combinePillam(selectedConsonant, selectedPillam.symbol)})
                        </button>
                        <button
                          onClick={() => speak(combinePillam(selectedConsonant, selectedPillam.symbol), '', 'slow')}
                          className="px-4 py-2 bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded-xl text-xs font-bold transition-all active:scale-95"
                        >
                          🐢 Slow Speed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Word Pronouncer Widget */}
        <div className={`mt-10 sm:mt-14 rounded-3xl p-6 border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        } max-w-xl mx-auto space-y-4`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔊</span>
            <div className="text-left">
              <h3 className={`font-bold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Universal Sinhala Word & Sentence Pronouncer
              </h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Type or paste any Sinhala word, diacritic, or phrase to hear natural pronunciation
              </p>
            </div>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handlePlayCustomWord(); }} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., ආයුබෝවන්, ස්තූතියි, කොහොමද..."
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value)}
              aria-label="Enter a Sinhala word to hear pronunciation"
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-saffron-500 ${
                darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
            />
            <button
              type="submit"
              disabled={!customWord.trim()}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 transition-all ${
                !customWord.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 shadow-md shadow-saffron-500/10'
              }`}
            >
              Speak
            </button>
          </form>
        </div>

        {/* Educational Info Footer */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-10 sm:mt-14">
          <div className={`rounded-2xl p-5 sm:p-6 card-3d ${darkMode ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔤</span>
              <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>18 Vowels (<span lang="si">ස්වර</span>)</h3>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-blue-300/70' : 'text-blue-700/80'}`}>
              Includes short/long pairs, vocalic r (ඍ/ඎ), diphthongs (ඓ/ඖ), and special marks (අං/අඃ). Vowels appear at word beginnings or as diacritical marks on consonants.
            </p>
          </div>
          <div className={`rounded-2xl p-5 sm:p-6 card-3d ${darkMode ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔡</span>
              <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>42 Consonants (<span lang="si">ව්‍යංජන</span>)</h3>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-emerald-300/70' : 'text-emerald-700/80'}`}>
              Organized by articulation point — velar, palatal, retroflex, dental, labial. Includes aspirated pairs, nasals, sibilants, and 5 pre-nasalized stops unique to Sinhala.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
