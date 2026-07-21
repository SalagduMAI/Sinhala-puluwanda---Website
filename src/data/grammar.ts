export interface GrammarExample {
  sinhala: string;
  transliteration: string;
  english: string;
  explanation?: string;
}

export interface GrammarQuiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  titleSinhala: string;
  description: string;
  icon: string;
  rules: string[];
  examples: GrammarExample[];
  quizzes: GrammarQuiz[];
}

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: 'sov-structure',
    title: 'Sentence Order (SOV Rule)',
    titleSinhala: 'වාක්‍ය රචනය (SOV නීතිය)',
    description: 'Unlike English which uses Subject-Verb-Object (SVO), Sinhala sentences follow Subject-Object-Verb (SOV).',
    icon: '🔤',
    rules: [
      'Subject comes FIRST in the sentence.',
      'Object comes SECOND in the sentence.',
      'Verb always comes LAST at the end of the sentence.',
      'English: "I eat rice" (S + V + O) ➔ Sinhala: "I rice eat" (S + O + V).'
    ],
    examples: [
      {
        sinhala: 'මම බත් කනවා.',
        transliteration: 'Mama bath kanawa.',
        english: 'I eat rice.',
        explanation: 'මම (I) + බත් (rice) + කනවා (eat).'
      },
      {
        sinhala: 'ඔහු තේ බොනවා.',
        transliteration: 'Ohu the bonawa.',
        english: 'He drinks tea.',
        explanation: 'ඔහු (He) + තේ (tea) + බොනවා (drinks).'
      },
      {
        sinhala: 'ඇය පොත කියවනවා.',
        transliteration: 'Aya potha kiyawanawa.',
        english: 'She reads the book.',
        explanation: 'ඇය (She) + පොත (book) + කියවනවා (reads).'
      }
    ],
    quizzes: [
      {
        id: 'q1',
        question: 'Translate "I drink water" into Sinhala using SOV order (I = මම, water = වතුර, drink = බොනවා):',
        options: ['මම බොනවා වතුර', 'මම වතුර බොනවා', 'වතුර මම බොනවා', 'බොනවා මම වතුර'],
        correctIndex: 1,
        explanation: 'Correct! Subject (මම) + Object (වතුර) + Verb (බොනවා).'
      },
      {
        id: 'q2',
        question: 'Where does the main verb go in a standard Sinhala sentence?',
        options: ['At the beginning', 'In the middle', 'At the very end', 'It can go anywhere'],
        correctIndex: 2,
        explanation: 'Correct! In Sinhala (SOV), verbs always conclude the sentence.'
      }
    ]
  },
  {
    id: 'verb-tenses',
    title: 'Verb Tenses (Past, Present, Future)',
    titleSinhala: 'ක්‍රියාපද සහ කාල (Past / Present / Future)',
    description: 'Learn how Sinhala verbs change depending on time (Present tense ending in -නවා, Past tense, Future tense).',
    icon: '⏳',
    rules: [
      'Present tense verbs end in "-නවා" (-nawa). Example: කනවා (kanawa = eating).',
      'Past tense verbs drop "-නවා" and change vowel ending to "-ආ" / "-එව්වා" / "-ඇවා". Example: කෑවා (kaewa = ate).',
      'Future/Intentional verbs end in "-න්නම්" (-nnam) or "-වී" (-wee). Example: කන්නම් (kannam = will eat).'
    ],
    examples: [
      {
        sinhala: 'මම යනවා.',
        transliteration: 'Mama yanawa.',
        english: 'I am going. (Present)',
      },
      {
        sinhala: 'මම ගියා.',
        transliteration: 'Mama giya.',
        english: 'I went. (Past)',
      },
      {
        sinhala: 'මම යන්නම්.',
        transliteration: 'Mama yannam.',
        english: 'I will go. (Future)',
      }
    ],
    quizzes: [
      {
        id: 'q3',
        question: 'What is the past tense of "යනවා" (yanawa = go)?',
        options: ['යනවාම', 'ගියා (giya)', 'යන්නම්', 'යන්නේ'],
        correctIndex: 1,
        explanation: '"ගියා" (giya) means "went" in past tense.'
      }
    ]
  },
  {
    id: 'pronouns-honorifics',
    title: 'Pronouns & Respectful Speech',
    titleSinhala: 'සර්වනාම සහ ගෞරවාර්ථ නාම',
    description: 'Master Sinhala pronouns and how to address elders or strangers with respect.',
    icon: '🤝',
    rules: [
      'Informal "You": ඔයා (oya) - used for friends, peers, and younger people.',
      'Formal/Respectful "You": ඔබ / ඔබතුමා (oba / obathuma) - used for elders, officials, and elders.',
      'Plural "We": අපි (api), "They": ඔවුන් / එයාලා (owun / eyala).'
    ],
    examples: [
      {
        sinhala: 'ඔයා කොහෙද යන්නේ?',
        transliteration: 'Oya koheda yanne?',
        english: 'Where are you going? (Friendly)',
      },
      {
        sinhala: 'ඔබතුමා සුවෙන් සිටිනවාද?',
        transliteration: 'Obathuma suwen sitinawada?',
        english: 'Are you doing well, sir? (Respectful)',
      }
    ],
    quizzes: [
      {
        id: 'q4',
        question: 'Which word means "We" in Sinhala?',
        options: ['මම (Mama)', 'ඔයා (Oya)', 'අපි (Api)', 'ඔවුන් (Owun)'],
        correctIndex: 2,
        explanation: '"අපි" (Api) means "We".'
      }
    ]
  },
  {
    id: 'plurals-nouns',
    title: 'Plurals & Noun Forms',
    titleSinhala: 'බහුවචන සහ නාමපද',
    description: 'Transforming singular nouns into plural forms.',
    icon: '📚',
    rules: [
      'Inanimate singular nouns ending in "-අ" drop the ending vowel to become plural: පොත (book) ➔ පොත් (books).',
      'Animate human nouns add "-ලා" (-la): ළමයා (child) ➔ ළමයි / ළමයිලා (children).'
    ],
    examples: [
      {
        sinhala: 'මල් (mal) - Flowers',
        transliteration: 'Mala ➔ Mal',
        english: 'Flower ➔ Flowers',
      },
      {
        sinhala: 'යාළුවෝ (yaaluwo) - Friends',
        transliteration: 'Yaaluwa ➔ Yaaluwo',
        english: 'Friend ➔ Friends',
      }
    ],
    quizzes: [
      {
        id: 'q5',
        question: 'What is the plural of "පොත" (potha = book)?',
        options: ['පොත් (poth)', 'පොතලා (pothala)', 'පොතම (pothama)', 'පොතී (pothee)'],
        correctIndex: 0,
        explanation: '"පොත්" (poth) is the plural form of book.'
      }
    ]
  }
];
