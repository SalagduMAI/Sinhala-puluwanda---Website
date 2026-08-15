import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface PhraseBuilderProps {
  darkMode: boolean;
  soundEnabled: boolean;
}

interface SOVSlot {
  sinhala: string;
  transliteration: string;
  english: string;
}

const SUBJECT_OPTIONS: SOVSlot[] = [
  { sinhala: 'මම', transliteration: 'mama', english: 'I' },
  { sinhala: 'ඔයා', transliteration: 'oyā', english: 'You' },
  { sinhala: 'අපි', transliteration: 'api', english: 'We' },
  { sinhala: 'ඔහු', transliteration: 'ohu', english: 'He' },
  { sinhala: 'ඇය', transliteration: 'æya', english: 'She' },
  { sinhala: 'එයාලා', transliteration: 'eyālā', english: 'They' },
  { sinhala: 'මට', transliteration: 'maṭa', english: 'I need / To me' },
];

const TIME_LOC_OPTIONS: SOVSlot[] = [
  { sinhala: 'දැන්', transliteration: 'dæn', english: 'now' },
  { sinhala: 'හෙට', transliteration: 'heṭa', english: 'tomorrow' },
  { sinhala: 'හෝටලයට', transliteration: 'hōṭalayaṭa', english: 'to the hotel' },
  { sinhala: 'කොළඹට', transliteration: 'koḷambaṭa', english: 'to Colombo' },
  { sinhala: 'කඩේට', transliteration: 'kaḍēṭa', english: 'to the shop' },
  { sinhala: 'ගෙදරට', transliteration: 'gedaraṭa', english: 'home' },
  { sinhala: '', transliteration: '', english: '(none)' },
];

const OBJECT_OPTIONS: SOVSlot[] = [
  { sinhala: 'බත්', transliteration: 'bath', english: 'rice' },
  { sinhala: 'වතුර', transliteration: 'vathura', english: 'water' },
  { sinhala: 'කිරි තේ', transliteration: 'kiri thē', english: 'milk tea' },
  { sinhala: 'ටැක්සියක්', transliteration: 'ṭæksiyak', english: 'a taxi' },
  { sinhala: 'කෑම ලැයිස්තුව', transliteration: 'kǣma læyisthuva', english: 'the menu' },
  { sinhala: 'සිම් කාඩ් එකක්', transliteration: 'sim kāḍ ekak', english: 'a SIM card' },
  { sinhala: 'උදව්වක්', transliteration: 'udavvak', english: 'help' },
];

const VERB_OPTIONS: SOVSlot[] = [
  { sinhala: 'කනවා', transliteration: 'kanavā', english: 'eat' },
  { sinhala: 'බොනවා', transliteration: 'bonavā', english: 'drink' },
  { sinhala: 'යනවා', transliteration: 'yanavā', english: 'go' },
  { sinhala: 'ඕනේ', transliteration: 'ōnē', english: 'want / need' },
  { sinhala: 'දෙන්න', transliteration: 'denna', english: 'please give' },
  { sinhala: 'බලනවා', transliteration: 'balanavā', english: 'look / see' },
];

interface PhraseCategory {
  category: string;
  phrases: { sinhala: string; transliteration: string; english: string; }[];
}

const TRAVEL_PHRASES: PhraseCategory[] = [
  {
    category: '🛒 Shopping',
    phrases: [
      { sinhala: 'මේක කීයද?', transliteration: 'mēka kīyada?', english: 'How much is this?' },
      { sinhala: 'ටිකක් අඩු කරන්න', transliteration: 'ṭikak aḍu karanna', english: 'Please reduce the price' },
      { sinhala: 'මට මේක ඕනේ', transliteration: 'maṭa mēka ōnē', english: 'I want this' },
      { sinhala: 'මට බලන්න පුළුවන්ද?', transliteration: 'maṭa balanna puḷuvanda?', english: 'Can I see this?' },
    ],
  },
  {
    category: '🍽️ Restaurant',
    phrases: [
      { sinhala: 'කෑම ලැයිස්තුව දෙන්න', transliteration: 'kǣma læyisthuva denna', english: 'Give me the menu' },
      { sinhala: 'මට බත් එකක් දෙන්න', transliteration: 'maṭa bath ekak denna', english: 'Give me rice and curry' },
      { sinhala: 'ඉතාම රසයි!', transliteration: 'ithāma rasayi!', english: 'Very delicious!' },
      { sinhala: 'බිල්පත දෙන්න', transliteration: 'bilpatha denna', english: 'Give me the bill' },
    ],
  },
  {
    category: '🚕 Transport',
    phrases: [
      { sinhala: 'මට කොළඹ යන්න ඕනේ', transliteration: 'maṭa koḷamba yanna ōnē', english: 'I want to go to Colombo' },
      { sinhala: 'බස් එක කීයටද?', transliteration: 'bas eka kīyaṭada?', english: 'What time is the bus?' },
      { sinhala: 'මෙතන නවත්තන්න', transliteration: 'methana navaththanna', english: 'Stop here' },
      { sinhala: 'කොච්චර දුරද?', transliteration: 'kochchara durada?', english: 'How far is it?' },
    ],
  },
  {
    category: '🏥 Emergency',
    phrases: [
      { sinhala: 'මට උදව් කරන්න!', transliteration: 'maṭa udav karanna!', english: 'Help me!' },
      { sinhala: 'මට වෛද්‍යවරයෙක් ඕනේ', transliteration: 'maṭa vaidyavarayek ōnē', english: 'I need a doctor' },
      { sinhala: 'පොලීසිය කැඳවන්න', transliteration: 'polīsiya kændavanna', english: 'Call the police' },
      { sinhala: 'මම අසනීපයි', transliteration: 'mama asanīpayi', english: 'I am sick' },
    ],
  },
  {
    category: '🏨 Hotel',
    phrases: [
      { sinhala: 'මට වෙන්කිරීමක් තියෙනවා', transliteration: 'maṭa venkirīmak thiyenavā', english: 'I have a reservation' },
      { sinhala: 'WiFi මුරපදය මොකද?', transliteration: 'WiFi murapadaya mokada?', english: 'What is the WiFi password?' },
      { sinhala: 'උදේ කෑම කීයටද?', transliteration: 'udē kǣma kīyaṭada?', english: 'What time is breakfast?' },
      { sinhala: 'ටැක්සියක් කැඳවන්න', transliteration: 'ṭæksiyak kændavanna', english: 'Call a taxi for me' },
    ],
  },
  {
    category: '📸 Tourism',
    phrases: [
      { sinhala: 'ඡායාරූපයක් ගන්න පුළුවන්ද?', transliteration: 'chāyārūpayak ganna puḷuvanda?', english: 'Can I take a photo?' },
      { sinhala: 'ප්‍රවේශ පත්‍ර කීයද?', transliteration: 'pravēśa pathra kīyada?', english: 'How much is the entry ticket?' },
      { sinhala: 'මේ තැන අපූරුයි!', transliteration: 'mē thæna apūruyi!', english: 'This place is amazing!' },
      { sinhala: 'මාර්ගෝපදේශකයෙක් ඕනේද?', transliteration: 'mārgōpadēśakayek ōnēda?', english: 'Do I need a guide?' },
    ],
  },
];

export default function PhraseBuilder({ darkMode, soundEnabled }: PhraseBuilderProps) {
  const [activeTab, setActiveTab] = useState<'builder' | 'phrases'>('builder');
  
  // Builder Slot selections
  const [selectedSubj, setSelectedSubj] = useState<SOVSlot>(SUBJECT_OPTIONS[0]);
  const [selectedTimeLoc, setSelectedTimeLoc] = useState<SOVSlot>(TIME_LOC_OPTIONS[0]);
  const [selectedObj, setSelectedObj] = useState<SOVSlot>(OBJECT_OPTIONS[0]);
  const [selectedVerb, setSelectedVerb] = useState<SOVSlot>(VERB_OPTIONS[0]);

  // Phrase book state
  const [activeCategory, setActiveCategory] = useState(0);
  const [revealedPhrases, setRevealedPhrases] = useState<Set<number>>(new Set());
  
  const { speak, isSupported, speechSpeed } = useSpeech();

  // Assembled Sentence
  const builtSinhala = [
    selectedSubj.sinhala,
    selectedTimeLoc.sinhala,
    selectedObj.sinhala,
    selectedVerb.sinhala
  ].filter(Boolean).join(' ') + '.';

  const builtRomanized = [
    selectedSubj.transliteration,
    selectedTimeLoc.transliteration,
    selectedObj.transliteration,
    selectedVerb.transliteration
  ].filter(Boolean).join(' ') + '.';

  const builtEnglish = `${selectedSubj.english} ${selectedVerb.english} ${selectedObj.english}${selectedTimeLoc.english !== '(none)' ? ' ' + selectedTimeLoc.english : ''}.`;

  const handlePlayBuiltSentence = (speedOverride?: 'normal' | 'slow') => {
    if (isSupported && soundEnabled) {
      speak(builtSinhala, builtRomanized, speedOverride || speechSpeed);
    }
  };

  const toggleReveal = (index: number) => {
    setRevealedPhrases(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section id="phrases" className={`py-16 sm:py-24 px-4 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-white to-saffron-50/30'}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700/60 mb-6 shadow-inner">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'builder'
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-saffron-500'
              }`}
            >
              🧱 Interactive SOV Sentence Builder
            </button>
            <button
              onClick={() => setActiveTab('phrases')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'phrases'
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-saffron-500'
              }`}
            >
              📖 Practical Travel Phrases (24)
            </button>
          </div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-3 font-space tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <span className="sinhala-text" lang="si">{activeTab === 'builder' ? 'වාක්‍ය ගොඩනැගීම' : 'ප්‍රයෝජනවත් වාක්‍ය'}</span>
          </h2>
          <p className={`text-base sm:text-lg ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {activeTab === 'builder'
              ? 'Construct custom Sinhala sentences using Subject + Time/Location + Object + Verb (SOV) rules'
              : 'Essential travel phrases organized across 6 key survival situations'}
          </p>
        </div>

        {/* TAB 1: SOV Sentence Builder */}
        {activeTab === 'builder' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Assembled Sentence Display Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border text-center shadow-xl ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-saffron-200'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-saffron-500/10 text-saffron-500 border border-saffron-500/20">
                  SOV Grammar Rule: Subject + Time/Place + Object + Verb
                </span>
              </div>

              {/* Sinhala Sentence */}
              <h3 className="sinhala-text text-3xl sm:text-4xl md:text-5xl font-black text-saffron-500 mb-2" lang="si">
                {builtSinhala}
              </h3>

              {/* Transliteration */}
              <p className={`text-base sm:text-lg font-mono font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                [{builtRomanized}]
              </p>

              {/* English Meaning */}
              <p className={`text-base sm:text-xl font-bold italic mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                "{builtEnglish}"
              </p>

              {/* Word Tag Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Subject: {selectedSubj.sinhala} ({selectedSubj.english})
                </span>
                {selectedTimeLoc.sinhala && (
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    Time/Place: {selectedTimeLoc.sinhala} ({selectedTimeLoc.english})
                  </span>
                )}
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Object: {selectedObj.sinhala} ({selectedObj.english})
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Verb: {selectedVerb.sinhala} ({selectedVerb.english})
                </span>
              </div>

              {/* Audio Playback Controls */}
              {soundEnabled && isSupported && (
                <div className="flex flex-wrap gap-2.5 justify-center">
                  <button
                    onClick={() => handlePlayBuiltSentence('normal')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    🔊 Play Sentence
                  </button>
                  <button
                    onClick={() => handlePlayBuiltSentence('slow')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold text-xs sm:text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    🐢 Slow Speed (0.55x)
                  </button>
                </div>
              )}
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Slot 1: Subject */}
              <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
                  <span>1. Subject</span>
                  <span className="text-[10px] opacity-70">(කර්තෘ)</span>
                </h4>
                <div className="space-y-1.5">
                  {SUBJECT_OPTIONS.map((opt) => (
                    <button
                      key={opt.sinhala}
                      onClick={() => setSelectedSubj(opt)}
                      className={`w-full p-2.5 rounded-xl text-left font-semibold text-xs sm:text-sm border transition-all ${
                        selectedSubj.sinhala === opt.sinhala
                          ? 'bg-blue-500 text-white border-blue-500 shadow-sm scale-[1.02]'
                          : darkMode ? 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="sinhala-text font-bold mr-1.5" lang="si">{opt.sinhala}</span>
                      <span className="text-xs opacity-75">({opt.english})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot 2: Time / Location */}
              <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                  <span>2. Time / Place</span>
                  <span className="text-[10px] opacity-70">(කාලය/ස්ථානය)</span>
                </h4>
                <div className="space-y-1.5">
                  {TIME_LOC_OPTIONS.map((opt) => (
                    <button
                      key={opt.english}
                      onClick={() => setSelectedTimeLoc(opt)}
                      className={`w-full p-2.5 rounded-xl text-left font-semibold text-xs sm:text-sm border transition-all ${
                        selectedTimeLoc.english === opt.english
                          ? 'bg-purple-500 text-white border-purple-500 shadow-sm scale-[1.02]'
                          : darkMode ? 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="sinhala-text font-bold mr-1.5" lang="si">{opt.sinhala || '—'}</span>
                      <span className="text-xs opacity-75">({opt.english})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot 3: Object */}
              <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                  <span>3. Object</span>
                  <span className="text-[10px] opacity-70">(කර්මය)</span>
                </h4>
                <div className="space-y-1.5">
                  {OBJECT_OPTIONS.map((opt) => (
                    <button
                      key={opt.sinhala}
                      onClick={() => setSelectedObj(opt)}
                      className={`w-full p-2.5 rounded-xl text-left font-semibold text-xs sm:text-sm border transition-all ${
                        selectedObj.sinhala === opt.sinhala
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm scale-[1.02]'
                          : darkMode ? 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="sinhala-text font-bold mr-1.5" lang="si">{opt.sinhala}</span>
                      <span className="text-xs opacity-75">({opt.english})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot 4: Verb */}
              <div className={`p-4 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                  <span>4. Verb</span>
                  <span className="text-[10px] opacity-70">(ක්‍රියා පදය)</span>
                </h4>
                <div className="space-y-1.5">
                  {VERB_OPTIONS.map((opt) => (
                    <button
                      key={opt.sinhala}
                      onClick={() => setSelectedVerb(opt)}
                      className={`w-full p-2.5 rounded-xl text-left font-semibold text-xs sm:text-sm border transition-all ${
                        selectedVerb.sinhala === opt.sinhala
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm scale-[1.02]'
                          : darkMode ? 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="sinhala-text font-bold mr-1.5" lang="si">{opt.sinhala}</span>
                      <span className="text-xs opacity-75">({opt.english})</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: Practical Travel Phrases */}
        {activeTab === 'phrases' && (
          <div className="space-y-8 animate-fade-in">
            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {TRAVEL_PHRASES.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveCategory(i); setRevealedPhrases(new Set()); }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeCategory === i
                      ? 'bg-saffron-500 text-white shadow-md shadow-saffron-500/20 scale-105'
                      : darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Phrases list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TRAVEL_PHRASES[activeCategory].phrases.map((phrase, i) => (
                <div
                  key={i}
                  onClick={() => toggleReveal(i)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
                    darkMode ? 'bg-slate-900 border-slate-800 hover:border-saffron-500/40' : 'bg-white border-slate-200 hover:border-saffron-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="sinhala-text text-xl font-bold text-saffron-500" lang="si">
                        {phrase.sinhala}
                      </h4>
                      <p className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        [{phrase.transliteration}]
                      </p>
                      {revealedPhrases.has(i) && (
                        <p className="text-sm font-bold text-emerald-500 dark:text-emerald-400 mt-2 animate-fade-in">
                          {phrase.english}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      {soundEnabled && isSupported && (
                        <button
                          onClick={() => speak(phrase.sinhala, phrase.transliteration, speechSpeed)}
                          className="p-2 rounded-xl text-saffron-500 hover:bg-saffron-500/10 transition-colors"
                          title="Listen to pronunciation"
                        >
                          🔊
                        </button>
                      )}
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        revealedPhrases.has(i)
                          ? 'bg-saffron-500/10 text-saffron-500'
                          : darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {revealedPhrases.has(i) ? 'Hide' : 'Reveal'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
