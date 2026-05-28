export interface Word {
  sinhala: string;
  transliteration: string;
  english: string;
  example?: string;
  exampleTranslation?: string;
}

export interface Lesson {
  id: number;
  title: string;
  titleSinhala: string;
  description: string;
  icon: string;
  color: string;
  bgPattern: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  words: Word[];
}

export interface QuizQuestion {
  question: string;
  questionSinhala: string;
  options: string[];
  correctIndex: number;
  type: 'sinhala-to-english' | 'english-to-sinhala';
}

// Complete Sinhala Alphabet — 18 vowels (ස්වර) + 42 consonants (ව්‍යංජන) = 60 letters
export const alphabet = [
  // === 18 VOWELS (ස්වර) ===
  { letter: 'අ', romanized: 'a', type: 'vowel', audio: 'Short a — like "u" in "but"' },
  { letter: 'ආ', romanized: 'ā', type: 'vowel', audio: 'Long a — like "a" in "father"' },
  { letter: 'ඇ', romanized: 'æ', type: 'vowel', audio: 'Short æ — like "a" in "cat"' },
  { letter: 'ඈ', romanized: 'ǣ', type: 'vowel', audio: 'Long æ — like "a" in "bad" held longer' },
  { letter: 'ඉ', romanized: 'i', type: 'vowel', audio: 'Short i — like "i" in "sit"' },
  { letter: 'ඊ', romanized: 'ī', type: 'vowel', audio: 'Long i — like "ee" in "see"' },
  { letter: 'උ', romanized: 'u', type: 'vowel', audio: 'Short u — like "oo" in "book"' },
  { letter: 'ඌ', romanized: 'ū', type: 'vowel', audio: 'Long u — like "oo" in "moon"' },
  { letter: 'ඍ', romanized: 'ru', type: 'vowel', audio: 'Vocalic r — like "ri" in "Krishna"' },
  { letter: 'ඎ', romanized: 'rū', type: 'vowel', audio: 'Long vocalic r — prolonged "ri" sound' },
  { letter: 'එ', romanized: 'e', type: 'vowel', audio: 'Short e — like "e" in "bed"' },
  { letter: 'ඒ', romanized: 'ē', type: 'vowel', audio: 'Long e — like "ay" in "say"' },
  { letter: 'ඓ', romanized: 'ai', type: 'vowel', audio: 'Diphthong ai — like "i" in "mine"' },
  { letter: 'ඔ', romanized: 'o', type: 'vowel', audio: 'Short o — like "o" in "hot"' },
  { letter: 'ඕ', romanized: 'ō', type: 'vowel', audio: 'Long o — like "o" in "go"' },
  { letter: 'ඖ', romanized: 'au', type: 'vowel', audio: 'Diphthong au — like "ow" in "cow"' },
  { letter: 'අං', romanized: 'aṁ', type: 'vowel', audio: 'Anusvara — nasal "ng" sound' },
  { letter: 'අඃ', romanized: 'aḥ', type: 'vowel', audio: 'Visarga — breathy "h" after vowel' },
  // === 42 CONSONANTS (ව්‍යංජන) ===
  // Velar (කණ්ඨ්‍ය)
  { letter: 'ක', romanized: 'ka', type: 'consonant', audio: 'Voiceless velar — like "k" in "kite"' },
  { letter: 'ඛ', romanized: 'kha', type: 'consonant', audio: 'Aspirated k — breathy "k" sound' },
  { letter: 'ග', romanized: 'ga', type: 'consonant', audio: 'Voiced velar — like "g" in "go"' },
  { letter: 'ඝ', romanized: 'gha', type: 'consonant', audio: 'Aspirated g — breathy "g" sound' },
  { letter: 'ඞ', romanized: 'ṅa', type: 'consonant', audio: 'Velar nasal — like "ng" in "sing"' },
  // Palatal (තාලව්‍ය)
  { letter: 'ච', romanized: 'ca', type: 'consonant', audio: 'Voiceless palatal — like "ch" in "church"' },
  { letter: 'ඡ', romanized: 'cha', type: 'consonant', audio: 'Aspirated ch — breathy "ch" sound' },
  { letter: 'ජ', romanized: 'ja', type: 'consonant', audio: 'Voiced palatal — like "j" in "jump"' },
  { letter: 'ඣ', romanized: 'jha', type: 'consonant', audio: 'Aspirated j — breathy "j" sound' },
  { letter: 'ඤ', romanized: 'ña', type: 'consonant', audio: 'Palatal nasal — like "ny" in "canyon"' },
  // Retroflex (මූර්ධන්‍ය)
  { letter: 'ට', romanized: 'ṭa', type: 'consonant', audio: 'Retroflex t — tongue curled back' },
  { letter: 'ඨ', romanized: 'ṭha', type: 'consonant', audio: 'Aspirated retroflex t — breathy version' },
  { letter: 'ඩ', romanized: 'ḍa', type: 'consonant', audio: 'Retroflex d — tongue curled back' },
  { letter: 'ඪ', romanized: 'ḍha', type: 'consonant', audio: 'Aspirated retroflex d — breathy version' },
  { letter: 'ණ', romanized: 'ṇa', type: 'consonant', audio: 'Retroflex n — tongue curled back' },
  // Dental (දන්ත්‍ය)
  { letter: 'ත', romanized: 'ta', type: 'consonant', audio: 'Dental t — tongue touches upper teeth' },
  { letter: 'ථ', romanized: 'tha', type: 'consonant', audio: 'Aspirated dental t — breathy version' },
  { letter: 'ද', romanized: 'da', type: 'consonant', audio: 'Dental d — tongue touches upper teeth' },
  { letter: 'ධ', romanized: 'dha', type: 'consonant', audio: 'Aspirated dental d — breathy version' },
  { letter: 'න', romanized: 'na', type: 'consonant', audio: 'Dental n — tongue touches upper teeth' },
  // Labial (ඔෂ්ඨ්‍ය)
  { letter: 'ප', romanized: 'pa', type: 'consonant', audio: 'Voiceless labial — like "p" in "pen"' },
  { letter: 'ඵ', romanized: 'pha', type: 'consonant', audio: 'Aspirated p — breathy "p" sound' },
  { letter: 'බ', romanized: 'ba', type: 'consonant', audio: 'Voiced labial — like "b" in "bat"' },
  { letter: 'භ', romanized: 'bha', type: 'consonant', audio: 'Aspirated b — breathy "b" sound' },
  { letter: 'ම', romanized: 'ma', type: 'consonant', audio: 'Labial nasal — like "m" in "mother"' },
  // Semi-vowels & Sibilants (අර්ධ ස්වර)
  { letter: 'ය', romanized: 'ya', type: 'consonant', audio: 'Palatal glide — like "y" in "yes"' },
  { letter: 'ර', romanized: 'ra', type: 'consonant', audio: 'Alveolar trill — rolled "r" like Spanish' },
  { letter: 'ල', romanized: 'la', type: 'consonant', audio: 'Lateral — like "l" in "love"' },
  { letter: 'ව', romanized: 'va', type: 'consonant', audio: 'Labio-dental — like "v" in "very"' },
  { letter: 'ශ', romanized: 'śa', type: 'consonant', audio: 'Palatal sibilant — like "sh" in "ship"' },
  { letter: 'ෂ', romanized: 'ṣa', type: 'consonant', audio: 'Retroflex sibilant — harder "sh" sound' },
  { letter: 'ස', romanized: 'sa', type: 'consonant', audio: 'Dental sibilant — like "s" in "sun"' },
  { letter: 'හ', romanized: 'ha', type: 'consonant', audio: 'Glottal fricative — like "h" in "hat"' },
  // Special consonants unique to Sinhala
  { letter: 'ළ', romanized: 'ḷa', type: 'consonant', audio: 'Retroflex lateral — unique to Sinhala' },
  { letter: 'ෆ', romanized: 'fa', type: 'consonant', audio: 'Labio-dental — like "f" in "fun" (loanwords)' },
  // Pre-nasalized stops (unique to Sinhala)
  { letter: 'ඟ', romanized: 'n̆ga', type: 'consonant', audio: 'Pre-nasalized g — "ng" + "g" combined' },
  { letter: 'ඦ', romanized: 'n̆ja', type: 'consonant', audio: 'Pre-nasalized j — "n" + "j" combined' },
  { letter: 'ඬ', romanized: 'n̆ḍa', type: 'consonant', audio: 'Pre-nasalized ḍ — "ṇ" + "ḍ" combined' },
  { letter: 'ඳ', romanized: 'n̆da', type: 'consonant', audio: 'Pre-nasalized d — "n" + "d" combined' },
  { letter: 'ඹ', romanized: 'm̆ba', type: 'consonant', audio: 'Pre-nasalized b — "m" + "b" combined' },
];

// ===================== REAL-WORLD PRACTICAL LESSONS =====================
export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Survival Basics',
    titleSinhala: 'අත්‍යවශ්‍ය මූලික',
    description: 'The first 12 words you need to survive a day in Sri Lanka — greetings, yes/no, please and thank you',
    icon: '🆘',
    color: 'from-saffron-400 to-saffron-600',
    bgPattern: 'radial-gradient(circle at 20% 80%, rgba(255,157,7,0.12) 0%, transparent 50%)',
    difficulty: 'beginner',
    words: [
      { sinhala: 'ආයුබෝවන්', transliteration: 'āyubōvan', english: 'Hello', example: 'ආයුබෝවන්! කොහොමද?', exampleTranslation: 'Hello! How are you?' },
      { sinhala: 'ඔව්', transliteration: 'ov', english: 'Yes', example: 'ඔව්, මම එනවා', exampleTranslation: 'Yes, I am coming' },
      { sinhala: 'නැහැ', transliteration: 'næhæ', english: 'No', example: 'නැහැ, ස්තූතියි', exampleTranslation: 'No, thank you' },
      { sinhala: 'ස්තූතියි', transliteration: 'sthūthiyi', english: 'Thank you', example: 'බොහොම ස්තූතියි!', exampleTranslation: 'Thank you very much!' },
      { sinhala: 'කරුණාකරලා', transliteration: 'karuṇākaralā', english: 'Please', example: 'කරුණාකරලා මට උදව් කරන්න', exampleTranslation: 'Please help me' },
      { sinhala: 'සමාවෙන්න', transliteration: 'samāvenna', english: 'Sorry / Excuse me', example: 'සමාවෙන්න, මට තේරෙන්නේ නැහැ', exampleTranslation: 'Sorry, I don\'t understand' },
      { sinhala: 'හොඳින්', transliteration: 'hondin', english: 'Fine / Good', example: 'මම හොඳින්', exampleTranslation: 'I am fine' },
      { sinhala: 'හරි', transliteration: 'hari', english: 'OK / Alright', example: 'හරි, යමු!', exampleTranslation: 'OK, let\'s go!' },
      { sinhala: 'මට තේරෙන්නේ නැහැ', transliteration: 'maṭa thērennē næhæ', english: 'I don\'t understand', example: 'සමාවෙන්න, මට සිංහල තේරෙන්නේ නැහැ', exampleTranslation: 'Sorry, I don\'t understand Sinhala' },
      { sinhala: 'ඉංග්‍රීසි කතා කරනවද?', transliteration: 'iṅgrīsi kathā karanavada?', english: 'Do you speak English?', example: 'සමාවෙන්න, ඔයා ඉංග්‍රීසි කතා කරනවද?', exampleTranslation: 'Excuse me, do you speak English?' },
      { sinhala: 'මගේ නම...', transliteration: 'magē nama...', english: 'My name is...', example: 'මගේ නම කමල්', exampleTranslation: 'My name is Kamal' },
      { sinhala: 'ගිහින් එන්නම්', transliteration: 'gihin ennam', english: 'Goodbye', example: 'හරි, ගිහින් එන්නම්!', exampleTranslation: 'OK, goodbye!' },
    ],
  },
  {
    id: 2,
    title: 'At a Restaurant',
    titleSinhala: 'අවන්හලේ',
    description: 'Order food, ask about the menu, handle the bill — everything for dining out in Sri Lanka',
    icon: '🍽️',
    color: 'from-emerald-400 to-emerald-600',
    bgPattern: 'radial-gradient(circle at 80% 20%, rgba(16,185,129,0.12) 0%, transparent 50%)',
    difficulty: 'beginner',
    words: [
      { sinhala: 'කෑම ලැයිස්තුව', transliteration: 'kǣma læyisthuva', english: 'Menu', example: 'කෑම ලැයිස්තුව දෙන්න', exampleTranslation: 'Give me the menu' },
      { sinhala: 'බත් සහ කරි', transliteration: 'bath saha kari', english: 'Rice and curry', example: 'මට බත් සහ කරි දෙන්න', exampleTranslation: 'Give me rice and curry' },
      { sinhala: 'වතුර', transliteration: 'vathura', english: 'Water', example: 'සීතල වතුර බෝතලයක්', exampleTranslation: 'A bottle of cold water' },
      { sinhala: 'තේ එකක්', transliteration: 'thē ekak', english: 'A tea', example: 'කිරි තේ එකක් දෙන්න', exampleTranslation: 'Give me a milk tea' },
      { sinhala: 'ඉතාම රසයි!', transliteration: 'ithāma rasayi!', english: 'Very delicious!', example: 'මේ කෑම ඉතාම රසයි!', exampleTranslation: 'This food is very delicious!' },
      { sinhala: 'බඩගිනියි', transliteration: 'baḍaginiyi', english: 'I\'m hungry', example: 'මට බඩගිනියි, කෑම ඕනේ', exampleTranslation: 'I\'m hungry, I need food' },
      { sinhala: 'බිල්පත', transliteration: 'bilpatha', english: 'The bill', example: 'බිල්පත දෙන්න, කරුණාකරලා', exampleTranslation: 'The bill please' },
      { sinhala: 'කීයද?', transliteration: 'kīyada?', english: 'How much?', example: 'මේක කීයද?', exampleTranslation: 'How much is this?' },
      { sinhala: 'සීනි නැතුව', transliteration: 'sīni næthva', english: 'Without sugar', example: 'තේ එකක් සීනි නැතුව', exampleTranslation: 'A tea without sugar' },
      { sinhala: 'මිරිස් අඩුවෙන්', transliteration: 'miris aḍuven', english: 'Less spicy', example: 'කරුණාකරලා මිරිස් අඩුවෙන්', exampleTranslation: 'Less spicy please' },
      { sinhala: 'එළවළු විතරක්', transliteration: 'eḷavaḷu vitharak', english: 'Vegetables only', example: 'මම එළවළු විතරක් කනවා', exampleTranslation: 'I eat vegetables only' },
      { sinhala: 'තව ටිකක්', transliteration: 'thava ṭikak', english: 'A little more', example: 'බත් තව ටිකක් දෙන්න', exampleTranslation: 'Give me a little more rice' },
    ],
  },
  {
    id: 3,
    title: 'Getting Around',
    titleSinhala: 'ගමන් බිමන්',
    description: 'Navigate tuk-tuks, buses, trains & taxis. Ask directions, negotiate fares, find your hotel',
    icon: '🛺',
    color: 'from-blue-400 to-blue-600',
    bgPattern: 'radial-gradient(circle at 50% 80%, rgba(59,130,246,0.12) 0%, transparent 50%)',
    difficulty: 'beginner',
    words: [
      { sinhala: 'කොහේද?', transliteration: 'kohēda?', english: 'Where?', example: 'බස් නැවතුම්පොළ කොහේද?', exampleTranslation: 'Where is the bus stop?' },
      { sinhala: 'ඉදිරියට යන්න', transliteration: 'idiriyaṭa yanna', english: 'Go straight', example: 'ඉදිරියට යන්න, ඊට පස්සේ වමට', exampleTranslation: 'Go straight, then turn left' },
      { sinhala: 'වමට හැරෙන්න', transliteration: 'vamaṭa hærenna', english: 'Turn left' },
      { sinhala: 'දකුණට හැරෙන්න', transliteration: 'dakuṇaṭa hærenna', english: 'Turn right' },
      { sinhala: 'මෙතන නවත්තන්න', transliteration: 'methana navaththanna', english: 'Stop here', example: 'කරුණාකරලා මෙතන නවත්තන්න', exampleTranslation: 'Please stop here' },
      { sinhala: 'කොච්චර දුරද?', transliteration: 'kochchara durada?', english: 'How far is it?', example: 'කොළඹට කොච්චර දුරද?', exampleTranslation: 'How far is it to Colombo?' },
      { sinhala: 'ත්‍රී වීල් එකක්', transliteration: 'thrī vīl ekak', english: 'A tuk-tuk / three-wheeler', example: 'මට ත්‍රී වීල් එකක් ඕනේ', exampleTranslation: 'I need a tuk-tuk' },
      { sinhala: 'මීටරය දාන්න', transliteration: 'mīṭaraya dānna', english: 'Turn on the meter', example: 'කරුණාකරලා මීටරය දාන්න', exampleTranslation: 'Please turn on the meter' },
      { sinhala: 'ගුවන් තොටුපොළට', transliteration: 'guvan toṭupoḷaṭa', english: 'To the airport', example: 'මට ගුවන් තොටුපොළට යන්න ඕනේ', exampleTranslation: 'I need to go to the airport' },
      { sinhala: 'හෝටලයට', transliteration: 'hōṭalayaṭa', english: 'To the hotel', example: 'මේ හෝටලයට යන්න', exampleTranslation: 'Go to this hotel' },
      { sinhala: 'කොපමණ වෙලාවද?', transliteration: 'kopamaṇa velāvada?', english: 'How long does it take?', example: 'ගාල්ලට කොපමණ වෙලාවද?', exampleTranslation: 'How long to Galle?' },
      { sinhala: 'ළඟම ස්ථානය', transliteration: 'laṅgama sthānaya', english: 'Nearest place/stop', example: 'ළඟම බස් නැවතුම?', exampleTranslation: 'The nearest bus stop?' },
    ],
  },
  {
    id: 4,
    title: 'Shopping & Money',
    titleSinhala: 'සාප්පු සහ මුදල්',
    description: 'Bargain at markets, buy souvenirs, understand prices, and handle money like a local',
    icon: '🛒',
    color: 'from-pink-400 to-rose-600',
    bgPattern: 'radial-gradient(circle at 20% 20%, rgba(244,114,182,0.12) 0%, transparent 50%)',
    difficulty: 'intermediate',
    words: [
      { sinhala: 'මේක කීයද?', transliteration: 'mēka kīyada?', english: 'How much is this?', example: 'මේ ටී ෂර්ට් එක කීයද?', exampleTranslation: 'How much is this T-shirt?' },
      { sinhala: 'ගොඩක් වැඩියි', transliteration: 'goḍak vædiyi', english: 'Too expensive', example: 'නැහැ, ගොඩක් වැඩියි!', exampleTranslation: 'No, too expensive!' },
      { sinhala: 'අඩු කරන්න', transliteration: 'aḍu karanna', english: 'Reduce (the price)', example: 'ටිකක් අඩු කරන්න පුළුවන්ද?', exampleTranslation: 'Can you reduce a little?' },
      { sinhala: 'මට මේක ඕනේ', transliteration: 'maṭa mēka ōnē', english: 'I want this', example: 'මට මේ එක ඕනේ', exampleTranslation: 'I want this one' },
      { sinhala: 'බලන්න පුළුවන්ද?', transliteration: 'balanna puḷuvanda?', english: 'Can I look/try?', example: 'මේක බලන්න පුළුවන්ද?', exampleTranslation: 'Can I look at this?' },
      { sinhala: 'රුපියල්', transliteration: 'rupiyal', english: 'Rupees (currency)', example: 'රුපියල් පන්සීයක්', exampleTranslation: 'Five hundred rupees' },
      { sinhala: 'කාඩ් පත ගන්නවද?', transliteration: 'kāḍ patha gannavada?', english: 'Do you take cards?', example: 'ක්‍රෙඩිට් කාඩ් පත ගන්නවද?', exampleTranslation: 'Do you accept credit cards?' },
      { sinhala: 'සිල්ලර', transliteration: 'sillara', english: 'Change (coins/notes)', example: 'සිල්ලර තියෙනවද?', exampleTranslation: 'Do you have change?' },
      { sinhala: 'ලොකු / පොඩි', transliteration: 'loku / poḍi', english: 'Big / Small', example: 'ලොකු එක දෙන්න', exampleTranslation: 'Give me the big one' },
      { sinhala: 'වෙනත් පාටක්', transliteration: 'venath pāṭak', english: 'A different color', example: 'වෙනත් පාටක් තියෙනවද?', exampleTranslation: 'Do you have a different color?' },
      { sinhala: 'බෑගය', transliteration: 'bægaya', english: 'Bag', example: 'බෑගයක් දෙන්න', exampleTranslation: 'Give me a bag' },
      { sinhala: 'රිසිට්පත', transliteration: 'risiṭpatha', english: 'Receipt', example: 'රිසිට්පත දෙන්න', exampleTranslation: 'Give me a receipt' },
    ],
  },
  {
    id: 5,
    title: 'Health & Emergency',
    titleSinhala: 'සෞඛ්‍ය සහ හදිසි',
    description: 'Critical phrases for doctors, pharmacies, and emergencies — could save your life',
    icon: '🏥',
    color: 'from-red-400 to-red-600',
    bgPattern: 'radial-gradient(circle at 80% 80%, rgba(239,68,68,0.12) 0%, transparent 50%)',
    difficulty: 'intermediate',
    words: [
      { sinhala: 'මට උදව් කරන්න!', transliteration: 'maṭa udav karanna!', english: 'Help me!', example: 'කරුණාකරලා මට උදව් කරන්න!', exampleTranslation: 'Please help me!' },
      { sinhala: 'මම අසනීපයි', transliteration: 'mama asanīpayi', english: 'I am sick', example: 'මම ගොඩක් අසනීපයි', exampleTranslation: 'I am very sick' },
      { sinhala: 'වෛද්‍යවරයෙක් ඕනේ', transliteration: 'vaidyavarayek ōnē', english: 'I need a doctor', example: 'මට වෛද්‍යවරයෙක් ඕනේ, කරුණාකරලා', exampleTranslation: 'I need a doctor, please' },
      { sinhala: 'රෝහල කොහේද?', transliteration: 'rōhala kohēda?', english: 'Where is the hospital?', example: 'ළඟම රෝහල කොහේද?', exampleTranslation: 'Where is the nearest hospital?' },
      { sinhala: 'මට රිදෙනවා', transliteration: 'maṭa ridenavā', english: 'I have pain', example: 'මගේ බඩ රිදෙනවා', exampleTranslation: 'My stomach hurts' },
      { sinhala: 'ඖෂධ ශාලාව', transliteration: 'auṣadha śālāva', english: 'Pharmacy', example: 'ඖෂධ ශාලාව විවෘතද?', exampleTranslation: 'Is the pharmacy open?' },
      { sinhala: 'අසාත්මිකතාවයක්', transliteration: 'asāthmikathāvayak', english: 'An allergy', example: 'මට ඇට වර්ග වලට අසාත්මිකතාවයක් තියෙනවා', exampleTranslation: 'I have a nut allergy' },
      { sinhala: 'පොලීසිය කැඳවන්න', transliteration: 'polīsiya kændavanna', english: 'Call the police', example: 'කරුණාකරලා පොලීසිය කැඳවන්න!', exampleTranslation: 'Please call the police!' },
      { sinhala: 'ගිනි නිවීම', transliteration: 'gini nivīma', english: 'Fire brigade', example: 'ගිනි නිවීම් ඒකකය කැඳවන්න', exampleTranslation: 'Call the fire brigade' },
      { sinhala: 'ඇම්බියුලන්ස්', transliteration: 'æmbiyulans', english: 'Ambulance', example: 'ඇම්බියුලන්ස් එකක් ඕනේ!', exampleTranslation: 'We need an ambulance!' },
      { sinhala: 'මගේ පාස්පෝට් එක', transliteration: 'magē pāspōṭ eka', english: 'My passport', example: 'මගේ පාස්පෝට් එක නැතිවුනා', exampleTranslation: 'I lost my passport' },
      { sinhala: 'තානාපති කාර්යාලය', transliteration: 'thānāpathi kāryālaya', english: 'Embassy', example: 'ආසන්නම තානාපති කාර්යාලය කොහේද?', exampleTranslation: 'Where is the nearest embassy?' },
    ],
  },
  {
    id: 6,
    title: 'Making Friends',
    titleSinhala: 'මිතුරන් හදාගැනීම',
    description: 'Build real relationships — share feelings, make plans, express yourself naturally',
    icon: '🤝',
    color: 'from-purple-400 to-purple-600',
    bgPattern: 'radial-gradient(circle at 30% 40%, rgba(147,51,234,0.12) 0%, transparent 50%)',
    difficulty: 'intermediate',
    words: [
      { sinhala: 'ඔයාගේ නම මොකද?', transliteration: 'oyāgē nama mokada?', english: 'What is your name?', example: 'ආයුබෝවන්! ඔයාගේ නම මොකද?', exampleTranslation: 'Hello! What is your name?' },
      { sinhala: 'ඔබව දැකීම සතුටක්', transliteration: 'obava dækīma sathutakǃ', english: 'Nice to meet you' },
      { sinhala: 'ඔයා කොහෙන්ද?', transliteration: 'oyā kohenda?', english: 'Where are you from?', example: 'ඔයා මුලින්ම කොහෙන්ද?', exampleTranslation: 'Where are you originally from?' },
      { sinhala: 'මම ... වලින්', transliteration: 'mama ... valin', english: 'I am from ...', example: 'මම ඕස්ට්‍රේලියාවෙන්', exampleTranslation: 'I am from Australia' },
      { sinhala: 'අපි යාළුවෝ', transliteration: 'api yāḷuvō', english: 'We are friends', example: 'දැන් අපි හොඳ යාළුවෝ!', exampleTranslation: 'Now we are good friends!' },
      { sinhala: 'මට ආදරෙයි', transliteration: 'maṭa ādareyi', english: 'I love/like it', example: 'මට ශ්‍රී ලංකාවට ආදරෙයි', exampleTranslation: 'I love Sri Lanka' },
      { sinhala: 'සතුටුයි', transliteration: 'sathutui', english: 'Happy', example: 'මම ගොඩක් සතුටුයි', exampleTranslation: 'I am very happy' },
      { sinhala: 'හෙට හමුවෙමු', transliteration: 'heṭa hamuvemu', english: 'Let\'s meet tomorrow', example: 'හරි, හෙට උදේ හමුවෙමු', exampleTranslation: 'OK, let\'s meet tomorrow morning' },
      { sinhala: 'ඔයාගේ නම්බරේ දෙන්න', transliteration: 'oyāgē nambarē denna', english: 'Give me your number', example: 'ඔයාගේ ෆෝන් නම්බරේ දෙන්න', exampleTranslation: 'Give me your phone number' },
      { sinhala: 'සෙල්ෆි එකක් ගමුද?', transliteration: 'selfi ekak gamuda?', english: 'Shall we take a selfie?', example: 'එන්න, සෙල්ෆි එකක් ගමු!', exampleTranslation: 'Come, let\'s take a selfie!' },
      { sinhala: 'ලස්සනයි', transliteration: 'lassanayi', english: 'Beautiful', example: 'මේ තැන හරි ලස්සනයි', exampleTranslation: 'This place is very beautiful' },
      { sinhala: 'බොහොම කාරුණිකයි', transliteration: 'bohoma kāruṇikayi', english: 'Very kind', example: 'ඔයා බොහොම කාරුණිකයි, ස්තූතියි', exampleTranslation: 'You are very kind, thank you' },
    ],
  },
  {
    id: 7,
    title: 'At the Hotel',
    titleSinhala: 'හෝටලයේ',
    description: 'Check in, ask for services, report problems, and handle your stay smoothly',
    icon: '🏨',
    color: 'from-cyan-400 to-teal-600',
    bgPattern: 'radial-gradient(circle at 80% 40%, rgba(6,182,212,0.12) 0%, transparent 50%)',
    difficulty: 'advanced',
    words: [
      { sinhala: 'මට වෙන්කිරීමක් තියෙනවා', transliteration: 'maṭa venkiriimak thiyenavā', english: 'I have a reservation', example: 'ආයුබෝවන්, මට වෙන්කිරීමක් තියෙනවා', exampleTranslation: 'Hello, I have a reservation' },
      { sinhala: 'කාමරය', transliteration: 'kāmaraya', english: 'Room', example: 'මගේ කාමරය කීවෙනි මහලේද?', exampleTranslation: 'What floor is my room on?' },
      { sinhala: 'WiFi මුරපදය', transliteration: 'WiFi murapadaya', english: 'WiFi password', example: 'WiFi මුරපදය මොකද?', exampleTranslation: 'What is the WiFi password?' },
      { sinhala: 'උණුවතුර නැහැ', transliteration: 'uṇuvathura næhæ', english: 'No hot water', example: 'සමාවෙන්න, කාමරයේ උණුවතුර නැහැ', exampleTranslation: 'Sorry, there is no hot water in the room' },
      { sinhala: 'එයාර් කන්ඩිශන්', transliteration: 'eyār kanḍiśan', english: 'Air conditioning', example: 'එයාර් කන්ඩිශන් එක වැඩ කරන්නේ නැහැ', exampleTranslation: 'The air conditioning doesn\'t work' },
      { sinhala: 'උදේ කෑම', transliteration: 'udē kǣma', english: 'Breakfast', example: 'උදේ කෑම කීයටද?', exampleTranslation: 'What time is breakfast?' },
      { sinhala: 'තවත් එක රැයක්', transliteration: 'thavath eka ræyak', english: 'One more night', example: 'තවත් එක රැයක් ඉන්න පුළුවන්ද?', exampleTranslation: 'Can I stay one more night?' },
      { sinhala: 'ටැක්සියක් කැඳවන්න', transliteration: 'ṭæksiyak kændavanna', english: 'Call a taxi', example: 'මට ටැක්සියක් කැඳවන්න පුළුවන්ද?', exampleTranslation: 'Can you call me a taxi?' },
      { sinhala: 'චෙක්-අවුට්', transliteration: 'ček-avuṭ', english: 'Check-out', example: 'චෙක්-අවුට් කීයටද?', exampleTranslation: 'What time is check-out?' },
      { sinhala: 'මගේ බෑග් තියාගන්න', transliteration: 'magē bæg thiyāganna', english: 'Keep my bags', example: 'චෙක්-අවුට් පස්සේ මගේ බෑග් තියාගන්න පුළුවන්ද?', exampleTranslation: 'Can you keep my bags after check-out?' },
      { sinhala: 'සේප්පුව', transliteration: 'sēppuva', english: 'Safe / Locker', example: 'කාමරයේ සේප්පුවක් තියෙනවද?', exampleTranslation: 'Is there a safe in the room?' },
      { sinhala: 'ස්තුතියි, හරිම හොඳයි', transliteration: 'sthuthiyi, harima hoňdayi', english: 'Thanks, it was great', example: 'ඔයාගේ සේවයට බොහොම ස්තුතියි!', exampleTranslation: 'Thank you very much for your service!' },
    ],
  },
  {
    id: 8,
    title: 'Work & Daily Routine',
    titleSinhala: 'වැඩ සහ දිනචරියාව',
    description: 'Talk about your job, daily schedule, and handle workplace interactions confidently',
    icon: '💼',
    color: 'from-amber-400 to-orange-600',
    bgPattern: 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.12) 0%, transparent 50%)',
    difficulty: 'advanced',
    words: [
      { sinhala: 'මම වැඩ කරනවා', transliteration: 'mama væḍa karanavā', english: 'I work / I am working', example: 'මම IT සමාගමක වැඩ කරනවා', exampleTranslation: 'I work at an IT company' },
      { sinhala: 'මගේ රැකියාව', transliteration: 'magē rækiyāva', english: 'My job/occupation', example: 'මගේ රැකියාව ඉංජිනේරු', exampleTranslation: 'My job is engineer' },
      { sinhala: 'රැස්වීම', transliteration: 'ræsvīma', english: 'Meeting', example: 'මට රැස්වීමක් තියෙනවා', exampleTranslation: 'I have a meeting' },
      { sinhala: 'මම පරිගණක ක්‍රමලේඛකයෙක්', transliteration: 'mama parigaṇaka kramalēkhakek', english: 'I am a programmer', example: 'මම software ක්‍රමලේඛකයෙක්', exampleTranslation: 'I am a software programmer' },
      { sinhala: 'උදේ නැගිටිනවා', transliteration: 'udē nægiṭinavā', english: 'Wake up in the morning', example: 'මම උදේ 6ට නැගිටිනවා', exampleTranslation: 'I wake up at 6 AM' },
      { sinhala: 'පාසලට / වැඩට යනවා', transliteration: 'pāsalaṭa / væḍaṭa yanavā', english: 'Going to school / work', example: 'මම 8ට වැඩට යනවා', exampleTranslation: 'I go to work at 8' },
      { sinhala: 'විවේකය', transliteration: 'vivēkaya', english: 'Break / Rest', example: 'දැන් මගේ දිවා කෑම විවේකය', exampleTranslation: 'Now is my lunch break' },
      { sinhala: 'නිවාඩු දවස', transliteration: 'nivāḍu davasa', english: 'Holiday / Day off', example: 'හෙට නිවාඩු දවසක්', exampleTranslation: 'Tomorrow is a holiday' },
      { sinhala: 'වැටුප', transliteration: 'væṭupa', english: 'Salary', example: 'වැටුප මාසෙට එන්නේ', exampleTranslation: 'Salary comes monthly' },
      { sinhala: 'අද / හෙට / ඊයේ', transliteration: 'ada / heṭa / īyē', english: 'Today / Tomorrow / Yesterday', example: 'අද සඳුදා, හෙට අඟහරුවාදා', exampleTranslation: 'Today is Monday, tomorrow is Tuesday' },
      { sinhala: 'මට ප්‍රමාද වුණා', transliteration: 'maṭa pramāda vuṇā', english: 'I am late', example: 'සමාවෙන්න, මට ප්‍රමාද වුණා', exampleTranslation: 'Sorry, I am late' },
      { sinhala: 'වැඩ ඉවරයි', transliteration: 'væḍa ivarayi', english: 'Work is done/finished', example: 'අද වැඩ ඉවරයි, ගෙදර යනවා', exampleTranslation: 'Work is done today, going home' },
    ],
  },
  {
    id: 9,
    title: 'Sightseeing & Culture',
    titleSinhala: 'සංචාරය සහ සංස්කෘතිය',
    description: 'Visit temples, beaches, ruins — talk about culture, take photos, and enjoy Sri Lanka like a local',
    icon: '🏛️',
    color: 'from-indigo-400 to-indigo-600',
    bgPattern: 'radial-gradient(circle at 60% 30%, rgba(99,102,241,0.12) 0%, transparent 50%)',
    difficulty: 'intermediate',
    words: [
      { sinhala: 'පන්සල', transliteration: 'pansala', english: 'Buddhist temple', example: 'අපි පන්සලට යමු', exampleTranslation: 'Let\'s go to the temple' },
      { sinhala: 'මුහුදු වෙරළ', transliteration: 'muhudu veraḷa', english: 'Beach', example: 'මුහුදු වෙරළ ලස්සනයි', exampleTranslation: 'The beach is beautiful' },
      { sinhala: 'ඡායාරූපයක් ගන්න පුළුවන්ද?', transliteration: 'chāyārūpayak ganna puḷuvanda?', english: 'Can I take a photo?', example: 'මෙතන ඡායාරූපයක් ගන්න පුළුවන්ද?', exampleTranslation: 'Can I take a photo here?' },
      { sinhala: 'සපත්තු මුත්තන්න', transliteration: 'sapaththu muththanna', english: 'Remove shoes', example: 'පන්සලට යන්නට පෙර සපත්තු මුත්තන්න', exampleTranslation: 'Remove shoes before entering the temple' },
      { sinhala: 'ප්‍රවේශ පත්‍ර', transliteration: 'pravēśa pathra', english: 'Entry ticket', example: 'ප්‍රවේශ පත්‍ර කීයද?', exampleTranslation: 'How much is the entry ticket?' },
      { sinhala: 'මාර්ගෝපදේශකයෙක්', transliteration: 'mārgōpadēśakayek', english: 'Tour guide', example: 'මට මාර්ගෝපදේශකයෙක් ඕනේද?', exampleTranslation: 'Do I need a tour guide?' },
      { sinhala: 'සිගිරිය', transliteration: 'Sigiriya', english: 'Sigiriya (Lion Rock)', example: 'සිගිරිය ලෝක උරුම අඩවියක්', exampleTranslation: 'Sigiriya is a World Heritage site' },
      { sinhala: 'වෙළඳ පොළ', transliteration: 'veḷanda poḷa', english: 'Market', example: 'ළඟම වෙළඳ පොළ කොහේද?', exampleTranslation: 'Where is the nearest market?' },
      { sinhala: 'අපූරුයි!', transliteration: 'apūruyi!', english: 'Amazing / Wonderful!', example: 'මේ දර්ශනය අපූරුයි!', exampleTranslation: 'This view is amazing!' },
      { sinhala: 'ඉතිහාසය', transliteration: 'ithihāsaya', english: 'History', example: 'ලංකාවේ ඉතිහාසය පුදුමාකාරයි', exampleTranslation: 'Sri Lanka\'s history is wonderful' },
      { sinhala: 'සුවනීර්', transliteration: 'suvanīr', english: 'Souvenir', example: 'මට සුවනීර් එකක් ඕනේ', exampleTranslation: 'I want a souvenir' },
      { sinhala: 'විවෘත වෙන්නේ කීයටද?', transliteration: 'vivrutha vennē kīyaṭada?', english: 'What time does it open?', example: 'කෞතුකාගාරය විවෘත වෙන්නේ කීයටද?', exampleTranslation: 'What time does the museum open?' },
    ],
  },
  {
    id: 10,
    title: 'Feelings & Opinions',
    titleSinhala: 'හැඟීම් සහ අදහස්',
    description: 'Express emotions, give opinions, agree and disagree — have deeper conversations',
    icon: '💭',
    color: 'from-fuchsia-400 to-pink-600',
    bgPattern: 'radial-gradient(circle at 40% 70%, rgba(217,70,239,0.12) 0%, transparent 50%)',
    difficulty: 'advanced',
    words: [
      { sinhala: 'මට සතුටුයි', transliteration: 'maṭa sathutui', english: 'I am happy', example: 'ඔයාව දැක්කම මට සතුටුයි', exampleTranslation: 'I am happy to see you' },
      { sinhala: 'මට දුකයි', transliteration: 'maṭa dukayi', english: 'I am sad', example: 'ගිහින් එන්නම් කියද්දි මට දුකයි', exampleTranslation: 'I am sad when you say goodbye' },
      { sinhala: 'මට බයයි', transliteration: 'maṭa bayayi', english: 'I am scared', example: 'අඳුරේ මට බයයි', exampleTranslation: 'I am scared of the dark' },
      { sinhala: 'මට කැමතියි', transliteration: 'maṭa kæmathiyi', english: 'I like it', example: 'මට ලංකාවේ කෑම වලට කැමතියි', exampleTranslation: 'I like Sri Lankan food' },
      { sinhala: 'මට කැමති නැහැ', transliteration: 'maṭa kæmathi næhæ', english: 'I don\'t like it', example: 'මට මිරිස් කෑම වලට කැමති නැහැ', exampleTranslation: 'I don\'t like spicy food' },
      { sinhala: 'මම එකඟයි', transliteration: 'mama ekangayi', english: 'I agree', example: 'ඔව්, මම හරියටම එකඟයි', exampleTranslation: 'Yes, I completely agree' },
      { sinhala: 'මම එකඟ නැහැ', transliteration: 'mama ekanga næhæ', english: 'I disagree' },
      { sinhala: 'ඉතාම හොඳයි', transliteration: 'ithāma hoňdayi', english: 'Very good / Excellent', example: 'ඔයාගේ සිංහල ඉතාම හොඳයි!', exampleTranslation: 'Your Sinhala is very good!' },
      { sinhala: 'ඒක හරි', transliteration: 'ēka hari', english: 'That\'s right / correct', example: 'ඔව්, ඒක හරි!', exampleTranslation: 'Yes, that\'s right!' },
      { sinhala: 'මට පුදුමයි', transliteration: 'maṭa pudumayi', english: 'I am surprised', example: 'මේ ප්‍රමාණයට මට පුදුමයි', exampleTranslation: 'I am surprised by the size' },
      { sinhala: 'කමක් නැහැ', transliteration: 'kamak næhæ', english: 'No problem / It\'s OK', example: 'සමාවෙන්න — කමක් නැහැ!', exampleTranslation: 'Sorry — No problem!' },
      { sinhala: 'වාසනාවන්ත!', transliteration: 'vāsanāvantha!', english: 'Lucky!', example: 'ඔයා ගොඩක් වාසනාවන්ත!', exampleTranslation: 'You are very lucky!' },
    ],
  },
  {
    id: 11,
    title: 'Tech & Modern Life',
    titleSinhala: 'තාක්ෂණය සහ නවීන ජීවිතය',
    description: 'WiFi, phones, social media, apps — modern vocabulary every visitor needs',
    icon: '📱',
    color: 'from-sky-400 to-blue-600',
    bgPattern: 'radial-gradient(circle at 70% 20%, rgba(14,165,233,0.12) 0%, transparent 50%)',
    difficulty: 'advanced',
    words: [
      { sinhala: 'WiFi', transliteration: 'WiFi', english: 'WiFi', example: 'මෙතන free WiFi තියෙනවද?', exampleTranslation: 'Is there free WiFi here?' },
      { sinhala: 'චාර්ජර්', transliteration: 'chārjar', english: 'Charger', example: 'මගේ ෆෝන් චාර්ජර් එක නැතිවුණා', exampleTranslation: 'I lost my phone charger' },
      { sinhala: 'සිම් කාඩ්', transliteration: 'sim kāḍ', english: 'SIM card', example: 'මට සිම් කාඩ් එකක් ගන්න ඕනේ', exampleTranslation: 'I need to buy a SIM card' },
      { sinhala: 'ඡායාරූපය', transliteration: 'chāyārūpaya', english: 'Photo / Picture', example: 'මට ඡායාරූපයක් ගන්න පුළුවන්ද?', exampleTranslation: 'Can I take a photo?' },
      { sinhala: 'ගූගල් මැප්ස්', transliteration: 'gūgal mæps', english: 'Google Maps', example: 'ගූගල් මැප්ස් වලින් බලන්න', exampleTranslation: 'Check on Google Maps' },
      { sinhala: 'ඔන්ලයින්', transliteration: 'onlayin', english: 'Online', example: 'ඔන්ලයින් බුකිං කරන්න', exampleTranslation: 'Book online' },
      { sinhala: 'පාස්වර්ඩ්', transliteration: 'pāsvārḍ', english: 'Password', example: 'WiFi පාස්වර්ඩ් එක මොකද?', exampleTranslation: 'What is the WiFi password?' },
      { sinhala: 'ඇප් එක', transliteration: 'æp eka', english: 'The app', example: 'මේ ඇප් එක ඩවුන්ලෝඩ් කරන්න', exampleTranslation: 'Download this app' },
      { sinhala: 'ඩේටා', transliteration: 'ḍēṭā', english: 'Data (mobile)', example: 'මගේ ඩේටා ඉවරයි', exampleTranslation: 'My data is finished' },
      { sinhala: 'වීඩියෝ', transliteration: 'vīḍiyō', english: 'Video', example: 'වීඩියෝ එකක් ගමුද?', exampleTranslation: 'Shall we record a video?' },
      { sinhala: 'ඊ-මේල්', transliteration: 'ī-mēl', english: 'Email', example: 'ඔයාගේ ඊ-මේල් මොකද?', exampleTranslation: 'What is your email?' },
      { sinhala: 'QR කෝඩ්', transliteration: 'QR kōḍ', english: 'QR code', example: 'QR කෝඩ් එක ස්කෑන් කරන්න', exampleTranslation: 'Scan the QR code' },
    ],
  },
  {
    id: 12,
    title: 'Weather & Nature',
    titleSinhala: 'කාලගුණය සහ ස්වභාවය',
    description: 'Talk about weather, wildlife, geography — perfect for outdoor adventures in Sri Lanka',
    icon: '🌴',
    color: 'from-lime-400 to-green-600',
    bgPattern: 'radial-gradient(circle at 20% 60%, rgba(132,204,22,0.12) 0%, transparent 50%)',
    difficulty: 'beginner',
    words: [
      { sinhala: 'අද කාලගුණය', transliteration: 'ada kālaguṇaya', english: 'Today\'s weather', example: 'අද කාලගුණය කොහොමද?', exampleTranslation: 'How is today\'s weather?' },
      { sinhala: 'උෂ්ණයි', transliteration: 'uṣṇayi', english: 'It\'s hot', example: 'අද ගොඩක් උෂ්ණයි', exampleTranslation: 'Today is very hot' },
      { sinhala: 'වැස්ස වහිනවා', transliteration: 'væssa vahinavā', english: 'It\'s raining', example: 'වැස්ස වහිනවා, කුඩය ගන්න', exampleTranslation: 'It\'s raining, take an umbrella' },
      { sinhala: 'හිරු', transliteration: 'hiru', english: 'Sun', example: 'හිරු ගොඩක් තද', exampleTranslation: 'The sun is very strong' },
      { sinhala: 'මුහුද', transliteration: 'muhuda', english: 'Sea / Ocean', example: 'මුහුදේ පීනන්න යමු', exampleTranslation: 'Let\'s go swim in the sea' },
      { sinhala: 'කන්ද', transliteration: 'kanda', english: 'Mountain / Hill', example: 'ඒ කන්ද උස', exampleTranslation: 'That mountain is tall' },
      { sinhala: 'අලියා', transliteration: 'aliyā', english: 'Elephant', example: 'අලියා ගොඩක් ලොකුයි!', exampleTranslation: 'The elephant is very big!' },
      { sinhala: 'මීයා', transliteration: 'mīyā', english: 'Monkey', example: 'මීයෝ ගස් උඩ', exampleTranslation: 'Monkeys are on the trees' },
      { sinhala: 'ගස', transliteration: 'gasa', english: 'Tree', example: 'පොල් ගස් ලස්සනයි', exampleTranslation: 'Palm trees are beautiful' },
      { sinhala: 'මල', transliteration: 'mala', english: 'Flower', example: 'මේ මල ලස්සනයි', exampleTranslation: 'This flower is beautiful' },
      { sinhala: 'සීතලයි', transliteration: 'sīthalayi', english: 'It\'s cold', example: 'නුවරඑළියේ සීතලයි', exampleTranslation: 'It\'s cold in Nuwara Eliya' },
      { sinhala: 'කුඩය', transliteration: 'kuḍaya', english: 'Umbrella', example: 'මගේ කුඩය ගෙනිල්ල නැහැ', exampleTranslation: 'I didn\'t bring my umbrella' },
    ],
  },
];

export function generateQuiz(lessonId: number): QuizQuestion[] {
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) return [];
  const questions: QuizQuestion[] = [];
  const words = [...lesson.words];
  const questionCount = Math.min(5, words.length);
  for (let i = 0; i < questionCount; i++) {
    const wordIndex = Math.floor(Math.random() * words.length);
    const word = words[wordIndex];
    words.splice(wordIndex, 1);
    const isSinhalaToEnglish = Math.random() > 0.5;
    if (isSinhalaToEnglish) {
      const otherWords = lesson.words.filter(w => w.sinhala !== word.sinhala);
      const shuffled = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = shuffled.map(w => w.english);
      const correctIndex = Math.floor(Math.random() * 4);
      options.splice(correctIndex, 0, word.english);
      questions.push({ question: 'What does this mean?', questionSinhala: word.sinhala, options, correctIndex, type: 'sinhala-to-english' });
    } else {
      const otherWords = lesson.words.filter(w => w.sinhala !== word.sinhala);
      const shuffled = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = shuffled.map(w => w.sinhala);
      const correctIndex = Math.floor(Math.random() * 4);
      options.splice(correctIndex, 0, word.sinhala);
      questions.push({ question: `How do you say "${word.english}" in Sinhala?`, questionSinhala: '', options, correctIndex, type: 'english-to-sinhala' });
    }
  }
  return questions;
}

export const culturalFacts = [
  { emoji: '🇱🇰', fact: 'Sinhala (සිංහල) is the native language of the Sinhalese people, who make up about 75% of Sri Lanka\'s population.' },
  { emoji: '📜', fact: 'The Sinhala script has its origins in the ancient Brahmi script, dating back over 2,300 years.' },
  { emoji: '🏝️', fact: 'Sri Lanka, formerly known as Ceylon, is a teardrop-shaped island nation in the Indian Ocean.' },
  { emoji: '🫖', fact: 'Sri Lanka is one of the world\'s largest tea exporters. "Ceylon Tea" is famous worldwide!' },
  { emoji: '🐘', fact: 'The elephant is a national symbol of Sri Lanka. The Sinhala word for elephant is "අලියා" (aliyā).' },
  { emoji: '🌺', fact: 'The blue water lily (නිල් මහනෙල්) is the national flower of Sri Lanka.' },
  { emoji: '🏏', fact: 'Cricket is the most popular sport in Sri Lanka. They won the Cricket World Cup in 1996!' },
  { emoji: '📖', fact: 'Sinhala has its own unique alphabet with 60 letters — 18 vowels and 42 consonants!' },
  { emoji: '🏔️', fact: 'Sigiriya Rock Fortress is a UNESCO World Heritage site built in the 5th century.' },
  { emoji: '🛺', fact: 'Tuk-tuks (ත්‍රී වීල්) are the most popular transport in Sri Lanka. Always ask for the meter!' },
];

export const conversations = [
  {
    id: 1, title: 'At the Pharmacy', titleSinhala: 'ඖෂධ ශාලාවේ', icon: '💊',
    lines: [
      { speaker: 'A', sinhala: 'ආයුබෝවන්, මට බෙහෙත් ටිකක් ඕනේ.', english: 'Hello, I need some medicine.', transliteration: 'āyubōvan, maṭa beheth ṭikak ōnē.' },
      { speaker: 'B', sinhala: 'මොන වගේ බෙහෙත්ද?', english: 'What kind of medicine?', transliteration: 'mona vagē behethda?' },
      { speaker: 'A', sinhala: 'මගේ හිස රිදෙනවා, උණ තියෙනවා.', english: 'I have a headache and fever.', transliteration: 'magē hisa ridenavā, uṇa thiyenavā.' },
      { speaker: 'B', sinhala: 'මේ පැරසිටමෝල් ටැබ්ලට් ගන්න.', english: 'Take these paracetamol tablets.', transliteration: 'mē pærasiṭamōl ṭæbleṭ ganna.' },
      { speaker: 'A', sinhala: 'කීයද?', english: 'How much?', transliteration: 'kīyada?' },
      { speaker: 'B', sinhala: 'රුපියල් දෙසීයක්. සුව වේවා!', english: 'Two hundred rupees. Get well soon!', transliteration: 'rupiyal desīyak. suva vēvā!' },
    ],
  },
  {
    id: 2, title: 'Hiring a Tuk-Tuk', titleSinhala: 'ත්‍රී වීල් ගමන', icon: '🛺',
    lines: [
      { speaker: 'A', sinhala: 'මට ගාල්ල කොටුවට යන්න ඕනේ.', english: 'I need to go to Galle Fort.', transliteration: 'maṭa Gālla koṭuvaṭa yanna ōnē.' },
      { speaker: 'B', sinhala: 'හරි, රුපියල් අටසීයක්.', english: 'OK, eight hundred rupees.', transliteration: 'hari, rupiyal aṭasīyak.' },
      { speaker: 'A', sinhala: 'වැඩියි! මීටරේ දාන්න පුළුවන්ද?', english: 'Too much! Can you put the meter?', transliteration: 'vædiyi! mīṭarē dānna puḷuvanda?' },
      { speaker: 'B', sinhala: 'හරි, මීටරේ දානම්.', english: 'OK, I\'ll put the meter.', transliteration: 'hari, mīṭarē dānam.' },
      { speaker: 'A', sinhala: 'කොපමණ වෙලාවක් යයිද?', english: 'How long will it take?', transliteration: 'kopamaṇa velāvak yayida?' },
      { speaker: 'B', sinhala: 'මිනිත්තු විස්සක් විතර. යමු!', english: 'About twenty minutes. Let\'s go!', transliteration: 'miniththu vissak vithara. yamu!' },
    ],
  },
  {
    id: 3, title: 'Checking into a Hotel', titleSinhala: 'හෝටලයට පැමිණීම', icon: '🏨',
    lines: [
      { speaker: 'A', sinhala: 'ආයුබෝවන්, මට වෙන්කිරීමක් තියෙනවා. මගේ නම ...', english: 'Hello, I have a reservation. My name is ...', transliteration: 'āyubōvan, maṭa venkiriimak thiyenavā. magē nama ...' },
      { speaker: 'B', sinhala: 'ආයුබෝවන්! ඔව්, දින තුනකට, නේද?', english: 'Hello! Yes, for three nights, right?', transliteration: 'āyubōvan! ov, dina thunakṭa, nēda?' },
      { speaker: 'A', sinhala: 'ඔව්. WiFi මුරපදය මොකද?', english: 'Yes. What is the WiFi password?', transliteration: 'ov. WiFi murapadaya mokada?' },
      { speaker: 'B', sinhala: 'මුරපදය "srilanka2025". උදේ කෑම 7ට ඉඳන් 10ට.', english: 'Password is "srilanka2025". Breakfast 7 to 10.', transliteration: 'murapadaya "srilanka2025". udē kǣma 7ṭa iňdan 10ṭa.' },
      { speaker: 'A', sinhala: 'බොහොම ස්තූතියි! කාමරය ලස්සනයි.', english: 'Thank you very much! The room is lovely.', transliteration: 'bohoma sthūthiyi! kāmaraya lassanayi.' },
    ],
  },
  {
    id: 4, title: 'At a Market (Bargaining)', titleSinhala: 'වෙළඳ පොළේ', icon: '🛒',
    lines: [
      { speaker: 'A', sinhala: 'ආයුබෝවන්! මේ ටී ෂර්ට් එක කීයද?', english: 'Hello! How much is this T-shirt?', transliteration: 'āyubōvan! mē ṭī śarṭ eka kīyada?' },
      { speaker: 'B', sinhala: 'රුපියල් දෙදහසක්.', english: 'Two thousand rupees.', transliteration: 'rupiyal dedahasak.' },
      { speaker: 'A', sinhala: 'ගොඩක් වැඩියි! රුපියල් දහසකට දෙන්න පුළුවන්ද?', english: 'Too expensive! Can you give it for a thousand?', transliteration: 'goḍak vædiyi! rupiyal dahasakaṭa denna puḷuvanda?' },
      { speaker: 'B', sinhala: 'බැහැ, රුපියල් එක්දහස් පන්සීයකට.', english: 'No, for one thousand five hundred.', transliteration: 'bæhæ, rupiyal ekdahas pansīyakaṭa.' },
      { speaker: 'A', sinhala: 'හරි, එක්දහස් දෙසීයට?', english: 'OK, for twelve hundred?', transliteration: 'hari, ekdahas desīyaṭa?' },
      { speaker: 'B', sinhala: 'හරි හරි, ගන්න! බෑගයක් දෙන්නද?', english: 'OK OK, take it! Shall I give a bag?', transliteration: 'hari hari, ganna! bægayak dennadaǃ' },
    ],
  },
  {
    id: 5, title: 'Making a Friend', titleSinhala: 'යාළුකම', icon: '🤝',
    lines: [
      { speaker: 'A', sinhala: 'ආයුබෝවන්! ඔයාගේ නම මොකද?', english: 'Hello! What is your name?', transliteration: 'āyubōvan! oyāgē nama mokada?' },
      { speaker: 'B', sinhala: 'මගේ නම නිමල්. ඔයාගේ?', english: 'My name is Nimal. Yours?', transliteration: 'magē nama Nimal. oyāgē?' },
      { speaker: 'A', sinhala: 'මගේ නම ජෝන්. මම ඕස්ට්‍රේලියාවෙන්.', english: 'My name is John. I am from Australia.', transliteration: 'magē nama Jōn. mama ōsṭrēliyāven.' },
      { speaker: 'B', sinhala: 'මම කොළඹින්. ඔයාට ලංකාව කැමතිද?', english: 'I am from Colombo. Do you like Sri Lanka?', transliteration: 'mama koḷambin. oyāṭa Lankāva kæmathida?' },
      { speaker: 'A', sinhala: 'ඔව්, මට ගොඩක් කැමතියි! ලස්සන රටක්.', english: 'Yes, I like it a lot! Beautiful country.', transliteration: 'ov, maṭa goḍak kæmathiyi! lassana raṭak.' },
      { speaker: 'B', sinhala: 'හෙට අපි සිගිරිය බලන්න යමුද? මගේ නම්බරේ ගන්න!', english: 'Shall we visit Sigiriya tomorrow? Take my number!', transliteration: 'heṭa api Sigiriya balanna yamuda? magē nambarē ganna!' },
    ],
  },
  {
    id: 6, title: 'At the Doctor', titleSinhala: 'වෛද්‍යවරයා ළඟ', icon: '🩺',
    lines: [
      { speaker: 'A', sinhala: 'ආයුබෝවන් දොස්තර, මම අසනීපයි.', english: 'Hello doctor, I am sick.', transliteration: 'āyubōvan dosthar, mama asanīpayi.' },
      { speaker: 'B', sinhala: 'මොන වගේ අසනීපයක්ද?', english: 'What kind of sickness?', transliteration: 'mona vagē asanīpayakda?' },
      { speaker: 'A', sinhala: 'මගේ බඩ රිදෙනවා, උණත් තියෙනවා.', english: 'My stomach hurts and I have a fever.', transliteration: 'magē baḍa ridenavā, uṇath thiyenavā.' },
      { speaker: 'B', sinhala: 'කවදා ඉඳන්ද?', english: 'Since when?', transliteration: 'kavadā iňdanda?' },
      { speaker: 'A', sinhala: 'ඊයේ ඉඳන්. මට ඖෂධ වලට අසාත්මිකතාවයක් තියෙනවා.', english: 'Since yesterday. I have a medicine allergy.', transliteration: 'īyē iňdan. maṭa auṣadha valaṭa asāthmikathāvayak thiyenavā.' },
      { speaker: 'B', sinhala: 'හරි, මේ බෙහෙත් ගන්න. දින තුනකින් සුව වෙයි.', english: 'OK, take this medicine. You\'ll recover in three days.', transliteration: 'hari, mē beheth ganna. dina thunakǐn suva veyi.' },
    ],
  },
];
