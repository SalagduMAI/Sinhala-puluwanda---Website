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
  },
  {
    id: 'negation',
    title: 'Negation (නැත/නෑ)',
    titleSinhala: 'ප්‍රතික්ෂේපය (නැත/නෑ)',
    description: 'How to say "no", "not", "don\'t" in Sinhala',
    icon: '🚫',
    rules: [
      'Present negation adds "නෑ/නැහැ" (nae/naehae) at the end.',
      'Past negation uses "නැත" (natha).'
    ],
    examples: [
      {
        sinhala: 'මම යන්නේ නෑ.',
        transliteration: 'Mama yanne nae.',
        english: 'I\'m not going.',
        explanation: 'Present negation with නෑ.'
      },
      {
        sinhala: 'ඔහු කෑවේ නැත.',
        transliteration: 'Ohu kaewe natha.',
        english: 'He didn\'t eat.',
        explanation: 'Past negation with නැත.'
      }
    ],
    quizzes: [
      {
        id: 'q6',
        question: 'How do you say "I am not going" in Sinhala?',
        options: ['මම යන්නේ නැත', 'මම යන්නේ නෑ', 'මම යන්නේ', 'මම යන්න එපා'],
        correctIndex: 1,
        explanation: 'Present negation uses නෑ (nae) or නැහැ (naehae).'
      },
      {
        id: 'q7',
        question: 'Which word is used for past negation?',
        options: ['නෑ (nae)', 'එපා (epa)', 'නැත (natha)', 'බෑ (bae)'],
        correctIndex: 2,
        explanation: 'නැත (natha) is typically used for past negation.'
      }
    ]
  },
  {
    id: 'adjectives',
    title: 'Adjectives & Descriptions',
    titleSinhala: 'නාම විශේෂණ',
    description: 'Adjective placement (before noun), common adjectives',
    icon: '🎨',
    rules: [
      'Adjectives come BEFORE the noun, just like in English.',
      'Unlike some languages, adjectives in Sinhala don\'t typically change based on noun gender.'
    ],
    examples: [
      {
        sinhala: 'ලොකු ගස',
        transliteration: 'Loku gasa',
        english: 'big tree',
        explanation: 'ලොකු (big) comes before ගස (tree).'
      },
      {
        sinhala: 'ලස්සන මල',
        transliteration: 'Lassana mala',
        english: 'beautiful flower',
        explanation: 'ලස්සන (beautiful) comes before මල (flower).'
      }
    ],
    quizzes: [
      {
        id: 'q8',
        question: 'Where is the adjective placed in a Sinhala sentence?',
        options: ['After the verb', 'After the noun', 'Before the noun', 'At the end of the sentence'],
        correctIndex: 2,
        explanation: 'Adjectives are placed before the noun they describe.'
      },
      {
        id: 'q9',
        question: 'Translate "Beautiful flower" into Sinhala:',
        options: ['මල ලස්සන', 'ලස්සන මල', 'ලොකු මල', 'මල ලොකු'],
        correctIndex: 1,
        explanation: 'ලස්සන (lassana) means beautiful, and මල (mala) means flower.'
      }
    ]
  },
  {
    id: 'questions',
    title: 'Asking Questions',
    titleSinhala: 'ප්‍රශ්න ඇසීම',
    description: 'ද particle, question words (කවුද, මොකද, කොහෙද, ඇයි, කීයද)',
    icon: '❓',
    rules: [
      'For Yes/No questions, add the particle "ද" (da) at the end of the sentence.',
      'Use question words like කවුද (Who), මොකද (What), කොහෙද (Where), ඇයි (Why), කීයද (How much/many).'
    ],
    examples: [
      {
        sinhala: 'ඔයා කොහෙද යන්නේ?',
        transliteration: 'Oya koheda yanne?',
        english: 'Where are you going?',
        explanation: 'කොහෙද (koheda) means where.'
      },
      {
        sinhala: 'මේක මොකද?',
        transliteration: 'Meka mokada?',
        english: 'What is this?',
        explanation: 'මොකද (mokada) means what.'
      }
    ],
    quizzes: [
      {
        id: 'q10',
        question: 'Which particle is added to form a Yes/No question?',
        options: ['ට (ta)', 'ගේ (ge)', 'ද (da)', 'න් (n)'],
        correctIndex: 2,
        explanation: 'The particle ද (da) is used to form questions.'
      },
      {
        id: 'q11',
        question: 'What does "ඇයි" (ayi) mean?',
        options: ['Who', 'What', 'Where', 'Why'],
        correctIndex: 3,
        explanation: 'ඇයි (ayi) translates to "Why".'
      }
    ]
  },
  {
    id: 'cases',
    title: 'Grammatical Cases (Dative & Genitive)',
    titleSinhala: 'විභක්ති',
    description: '-ට (dative/to), -ගේ (genitive/possessive), -න් (instrumental/by)',
    icon: '📐',
    rules: [
      'The Dative case uses the suffix -ට (-ta) to indicate "to" or "for".',
      'The Genitive case uses the suffix -ගේ (-ge) to indicate possession ("of" or "\'s").',
      'The Instrumental case uses the suffix -න් (-n) to indicate "by" or "with".'
    ],
    examples: [
      {
        sinhala: 'මට වතුර දෙන්න.',
        transliteration: 'Mata wathura denna.',
        english: 'Give me water (to me).',
        explanation: 'මම (I) + ට = මට (to me).'
      },
      {
        sinhala: 'මේක මගේ පොත.',
        transliteration: 'Meka mage potha.',
        english: 'This is my book.',
        explanation: 'මම (I) + ගේ = මගේ (my).'
      }
    ],
    quizzes: [
      {
        id: 'q12',
        question: 'Which suffix represents the Genitive (possessive) case?',
        options: ['-ට (-ta)', '-ගේ (-ge)', '-න් (-n)', '-ද (-da)'],
        correctIndex: 1,
        explanation: 'The suffix -ගේ (-ge) indicates possession, like "my" or "your".'
      },
      {
        id: 'q13',
        question: 'Translate "to me" into Sinhala:',
        options: ['මම (mama)', 'මගේ (mage)', 'මට (mata)', 'මන් (man)'],
        correctIndex: 2,
        explanation: 'මට (mata) combines "I" with the dative suffix "-ට" meaning "to me".'
      }
    ]
  },
  {
    id: 'honorific-verbs',
    title: 'Polite & Honorific Verb Forms',
    titleSinhala: 'ගෞරවාර්ථ ක්‍රියාපද',
    description: 'Formal vs informal verb endings, respectful speech patterns',
    icon: '🙏',
    rules: [
      'Informal speech uses standard verb endings like -නවා (-nawa) for present tense.',
      'Formal speech often uses more respectful vocabulary or auxiliary verbs to indicate politeness.'
    ],
    examples: [
      {
        sinhala: 'කනවා',
        transliteration: 'Kanawa',
        english: 'eat-informal',
        explanation: 'Standard informal verb for eat.'
      },
      {
        sinhala: 'කන්න සේවය කරනවා',
        transliteration: 'Kanna sewaya karanawa',
        english: 'eat-formal',
        explanation: 'Respectful way of expressing eating.'
      }
    ],
    quizzes: [
      {
        id: 'q14',
        question: 'What is the informal way to say "eat"?',
        options: ['කනවා (kanawa)', 'කන්න සේවය කරනවා', 'වැඩම කරනවා', 'සිටිනවා'],
        correctIndex: 0,
        explanation: 'කනවා (kanawa) is the standard, informal verb for eating.'
      },
      {
        id: 'q15',
        question: 'Why are honorific verbs used in Sinhala?',
        options: ['To speak faster', 'To show respect to elders or officials', 'To talk to friends', 'They are not used'],
        correctIndex: 1,
        explanation: 'Honorifics are an important part of Sinhala culture to show respect.'
      }
    ]
  },
  {
    id: 'conjunctions',
    title: 'Connecting Sentences',
    titleSinhala: 'සම්බන්ධක පද',
    description: 'සහ (and), නමුත් (but), නිසා (because), එහෙනම් (then/so)',
    icon: '🔗',
    rules: [
      'Use සහ (saha) to mean "and".',
      'Use නමුත් (namuth) to mean "but" and නිසා (nisa) for "because".'
    ],
    examples: [
      {
        sinhala: 'මම කෑවා සහ බීවා.',
        transliteration: 'Mama kaewa saha beewa.',
        english: 'I ate and drank.',
        explanation: 'සහ (saha) connects the two actions.'
      },
      {
        sinhala: 'වැස්ස නිසා මම ගෙදර ඉන්නවා.',
        transliteration: 'Wessa nisa mama gedara innawa.',
        english: 'I am staying home because of the rain.',
        explanation: 'නිසා (nisa) explains the reason.'
      }
    ],
    quizzes: [
      {
        id: 'q16',
        question: 'Which word translates to "but"?',
        options: ['සහ (saha)', 'නමුත් (namuth)', 'නිසා (nisa)', 'එහෙනම් (ehenam)'],
        correctIndex: 1,
        explanation: 'නමුත් (namuth) is used to say "but".'
      },
      {
        id: 'q17',
        question: 'What does "සහ" (saha) mean?',
        options: ['But', 'Because', 'And', 'Then'],
        correctIndex: 2,
        explanation: 'සහ (saha) is the conjunction for "and".'
      }
    ]
  }
];
