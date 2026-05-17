import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface PhraseBuilderProps {
  darkMode: boolean;
  soundEnabled: boolean;
}

interface PhraseCategory {
  category: string;
  phrases: { sinhala: string; transliteration: string; english: string; }[];
}

const phraseData: PhraseCategory[] = [
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
      { sinhala: 'මට කොළඹ යන්න ඕනේ', transliteration: 'maṭa Koḷamba yanna ōnē', english: 'I want to go to Colombo' },
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
      { sinhala: 'මට වෙන්කිරීමක් තියෙනවා', transliteration: 'maṭa venkiriimak thiyenavā', english: 'I have a reservation' },
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
  const [activeCategory, setActiveCategory] = useState(0);
  const [revealedPhrases, setRevealedPhrases] = useState<Set<number>>(new Set());
  const { speak, isSupported } = useSpeech();

  const toggleReveal = (index: number) => {
    setRevealedPhrases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  return (
    <section className={`py-20 px-4 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-white to-saffron-50/30'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
            darkMode ? 'bg-saffron-900/30 text-saffron-400 border border-saffron-800/30' : 'bg-saffron-100 text-saffron-700'
          }`}>
            🗣️ Practical Phrases
          </span>
          <h2 className={`text-4xl md:text-5xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <span className="sinhala-text">ප්‍රයෝජනවත් වාක්‍ය</span>
          </h2>
          <p className={`text-xl ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Useful Phrases for Travelers</p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {phraseData.map((cat, i) => (
            <button
              key={i}
              onClick={() => { setActiveCategory(i); setRevealedPhrases(new Set()); }}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeCategory === i
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/20'
                  : darkMode
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Phrases */}
        <div className="grid gap-3 max-w-2xl mx-auto">
          {phraseData[activeCategory].phrases.map((phrase, i) => (
            <div
              key={`${activeCategory}-${i}`}
              onClick={() => toggleReveal(i)}
              className={`animate-slide-up cursor-pointer rounded-2xl p-5 transition-all duration-300 ${
                darkMode
                  ? 'bg-slate-900 border border-slate-800 hover:border-saffron-800/50'
                  : 'bg-white border border-slate-200 hover:border-saffron-300 hover:shadow-md'
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className={`sinhala-text text-xl font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {phrase.sinhala}
                  </p>
                  <p className={`text-sm italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{phrase.transliteration}</p>
                  {revealedPhrases.has(i) && (
                    <p className="text-saffron-500 font-semibold mt-2 animate-fade-in">{phrase.english}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {soundEnabled && isSupported && (
                    <button
                      onClick={(e) => { e.stopPropagation(); speak(phrase.sinhala); }}
                      className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <span className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    revealedPhrases.has(i)
                      ? darkMode ? 'bg-saffron-900/30 text-saffron-400' : 'bg-saffron-100 text-saffron-600'
                      : darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {revealedPhrases.has(i) ? 'Hide' : 'Reveal'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
