import { useSpeech } from '../hooks/useSpeech';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const CHEAT_SHEET_DATA = [
  {
    category: '🙏 Essential Courtesies & Greetings',
    color: 'from-amber-500 to-orange-500',
    items: [
      { sinhala: 'ආයුබෝවන්', roman: 'Āyubōvan', english: 'Hello / Greetings (May you live long)' },
      { sinhala: 'ස්තූතියි', roman: 'Sthūthiyi', english: 'Thank you' },
      { sinhala: 'බොහොම ස්තූතියි', roman: 'Bohoma sthūthiyi', english: 'Thank you very much' },
      { sinhala: 'කරුණාකරලා', roman: 'Karuṇākaralā', english: 'Please' },
      { sinhala: 'සමාවෙන්න', roman: 'Samāvenna', english: 'Sorry / Excuse me' },
      { sinhala: 'ඔව් / නැහැ', roman: 'Ow / Næhæ', english: 'Yes / No' },
      { sinhala: 'සුභ දවසක්', roman: 'Subha davasak', english: 'Have a nice day' },
      { sinhala: 'ගිහින් එන්නම්', roman: 'Gihin ennam', english: 'Goodbye (I will go and return)' },
    ],
  },
  {
    category: '🚕 Tuk-Tuk, Transport & Directions',
    color: 'from-blue-500 to-indigo-500',
    items: [
      { sinhala: 'මීටරේ දාන්න පුළුවන්ද?', roman: 'Mīṭarē dānna puḷuvanda?', english: 'Can you put the meter?' },
      { sinhala: 'මෙතන නවත්තන්න', roman: 'Methana navaththanna', english: 'Stop here please' },
      { sinhala: 'කොච්චර දුරද?', roman: 'Kochchara durada?', english: 'How far is it?' },
      { sinhala: 'වමට / දකුණට', roman: 'Vamaṭa / Dakuṇaṭa', english: 'Left / Right' },
      { sinhala: 'කෙලින්ම යන්න', roman: 'Kelinma yanna', english: 'Go straight ahead' },
      { sinhala: 'දුම්රිය ස්ථානය කොහෙද?', roman: 'Dumriya sthānaya koheda?', english: 'Where is the train station?' },
      { sinhala: 'බස් එක කීයටද?', roman: 'Bas eka kīyaṭada?', english: 'What time is the bus?' },
      { sinhala: 'මට කොළඹට යන්න ඕනෙ', roman: 'Maṭa Koḷambaṭa yanna ōne', english: 'I want to go to Colombo' },
    ],
  },
  {
    category: '🍛 Dining, Cafes & Food',
    color: 'from-emerald-500 to-teal-500',
    items: [
      { sinhala: 'මට වතුර දෙන්න', roman: 'Maṭa vathura denna', english: 'Please give me water' },
      { sinhala: 'කෑම ලැයිස්තුව දෙන්න', roman: 'Kǣma læyisthuva denna', english: 'Give me the menu' },
      { sinhala: 'සැර අඩු කරන්න', roman: 'Særa aḍu karanna', english: 'Make it less spicy' },
      { sinhala: 'මට බත් සහ ව්‍යංජන ඕනේ', roman: 'Maṭa bath saha vyañjana ōnē', english: 'I want rice and curry' },
      { sinhala: 'තේ එකක් දෙන්න', roman: 'Thē ekak denna', english: 'Give me a cup of Ceylon tea' },
      { sinhala: 'බිල්පත දෙන්න', roman: 'Bilpatha denna', english: 'Give me the bill' },
      { sinhala: 'ඉතාම රසයි!', roman: 'Ithāma rasayi!', english: 'Very delicious!' },
      { sinhala: 'එළවළු කෑම තියෙනවද?', roman: 'Eḷavaḷu kǣma thiyenavada?', english: 'Do you have vegetarian food?' },
    ],
  },
  {
    category: '🛒 Shopping & Bargaining',
    color: 'from-purple-500 to-pink-500',
    items: [
      { sinhala: 'මේක කීයද?', roman: 'Mēka kīyada?', english: 'How much is this?' },
      { sinhala: 'ගණන් වැඩියි', roman: 'Gaṇan væḍiyi', english: 'It is too expensive' },
      { sinhala: 'ටිකක් අඩු කරන්න පුළුවන්ද?', roman: 'Ṭikak aḍu karanna puḷuvanda?', english: 'Can you reduce the price a bit?' },
      { sinhala: 'මට මේක ඕනේ', roman: 'Maṭa mēka ōnē', english: 'I want this one' },
      { sinhala: 'කාඩ් එකෙන් ගෙවන්න පුළුවන්ද?', roman: 'Card eken gevanna puḷuvanda?', english: 'Can I pay by card?' },
      { sinhala: 'රිසිට්පත දෙන්න', roman: 'Receipt patha denna', english: 'Please give me a receipt' },
    ],
  },
  {
    category: '🏥 Emergencies & Healthcare',
    color: 'from-rose-500 to-red-500',
    items: [
      { sinhala: 'මට උදව් කරන්න!', roman: 'Maṭa udav karanna!', english: 'Help me please!' },
      { sinhala: 'මම අසනීපයි', roman: 'Mama asanīpayi', english: 'I am sick / unwell' },
      { sinhala: 'වෛද්‍යවරයෙක් ඕනේ', roman: 'Vaidyavarayek ōnē', english: 'I need a doctor' },
      { sinhala: 'රෝහල කොහෙද?', roman: 'Rōhala koheda?', english: 'Where is the hospital?' },
      { sinhala: 'පොලීසිය කැඳවන්න (119)', roman: 'Polīsiya kændavanna', english: 'Call the Police (119)' },
      { sinhala: 'සුවසැරිය ගිලන් රථය (1990)', roman: 'Suwa Seriya Ambulance', english: 'Free Emergency Ambulance (1990)' },
    ],
  },
  {
    category: '🔢 Numbers & Practical Counting',
    color: 'from-cyan-500 to-blue-500',
    items: [
      { sinhala: 'එක, දෙක, තුන, හතර, පහ', roman: 'Eka, Deka, Thuna, Hathara, Paha', english: '1, 2, 3, 4, 5' },
      { sinhala: 'හය, හත, අට, නමය, දහය', roman: 'Haya, Hatha, Aṭa, Namaya, Dahaya', english: '6, 7, 8, 9, 10' },
      { sinhala: 'විස්ස (20), පනහ (50)', roman: 'Vissa (20), Panaha (50)', english: '20, 50' },
      { sinhala: 'සීය (100), පන්සීය (500)', roman: 'Sīya (100), Pansīya (500)', english: '100, 500' },
      { sinhala: 'දාහ (1,000), පන්දහස (5,000)', roman: 'Dāha (1,000), Pandahasa (5,000)', english: '1,000, 5,000 LKR' },
    ],
  },
];

export default function CheatSheetModal({ isOpen, onClose, darkMode }: CheatSheetModalProps) {
  const { speak } = useSpeech();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Top Header (Hidden in Print) */}
        <div className="p-5 border-b border-slate-700/20 flex items-center justify-between gap-4 print:hidden bg-slate-950/20">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-space">
                Sri Lanka Travel Sinhala Cheat Sheet
              </h2>
              <p className="text-xs text-slate-400">
                Essential survival phrases for travelers and everyday life in Sri Lanka.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>🖨️</span> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Cheat Sheet Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 print:p-0 print:space-y-4">
          
          {/* Print only header */}
          <div className="hidden print:block border-b-2 border-slate-800 pb-3 mb-4 text-center">
            <h1 className="text-2xl font-black text-slate-900">🇱🇰 සිංහල පුළුවන්ද? — Sri Lanka Travel Cheat Sheet</h1>
            <p className="text-xs text-slate-600">Essential survival phrases for tourists and language learners • sinhala-puluwanda.vercel.app</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 print:grid-cols-2 print:gap-3">
            {CHEAT_SHEET_DATA.map((cat, i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                  darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                } print:border-slate-300 print:bg-white print:p-3`}
              >
                <h3 className="font-bold text-sm sm:text-base mb-3 flex items-center gap-2 text-saffron-500 print:text-slate-900 border-b pb-2 border-slate-700/20">
                  {cat.category}
                </h3>

                <div className="space-y-2.5 print:space-y-1.5">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2 text-xs">
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white print:text-black font-sans" lang="si">
                            {item.sinhala}
                          </span>
                          <span className="text-[11px] text-saffron-500 font-semibold print:text-slate-700">
                            [{item.roman}]
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600">
                          {item.english}
                        </p>
                      </div>

                      <button
                        onClick={() => speak(item.sinhala, item.roman)}
                        className="print:hidden p-1 rounded hover:bg-saffron-500/10 text-saffron-500 text-xs flex-shrink-0"
                        title="Listen"
                        aria-label="Speak phrase"
                      >
                        🔊
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Helplines Callout Box */}
          <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
            darkMode ? 'bg-rose-950/20 border-rose-800/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
          } print:border-slate-400 print:bg-slate-100 print:text-black`}>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block">🚨 24/7 Sri Lanka Tourist Hotlines:</span>
              <p className="text-xs">Tourist Police: <strong>1912</strong> • Police Emergency: <strong>119</strong> • Free Ambulance: <strong>1990</strong> • Govt Info: <strong>1919</strong></p>
            </div>
            <span className="text-xs font-bold font-space print:hidden">සිංහල පුළුවන්ද? v6.1.3</span>
          </div>

        </div>

      </div>
    </div>
  );
}
