export type Language = 'en' | 'si' | 'ta' | 'de' | 'fr';

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'si', name: 'සිංහල (Sinhala)', flag: '🇱🇰' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇱🇰' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.alphabet': 'Alphabet',
    'nav.lessons': 'Lessons',
    'nav.grammar': 'Grammar',
    'nav.practice': 'Practice',
    'nav.dashboard': 'Dashboard',
    'nav.about': 'About',
    'nav.chatbot': 'AI Assistant',

    // Hero
    'hero.title': 'Master Sinhala Language Easily',
    'hero.subtitle': 'Learn letters, vocabulary, grammar, and speak naturally with AI interactive tools.',
    'hero.start': 'Start Learning Free',
    'hero.explore': 'Explore Alphabet',

    // Speech & Practice
    'speech.listen': 'Listen',
    'speech.speak': 'Pronounce Mic',
    'speech.recording': 'Listening... Speak now!',
    'speech.evaluating': 'Evaluating accuracy...',
    'speech.match': 'Accuracy Score',
    'speech.tryAgain': 'Try pronouncing again',

    // Canvas Writing
    'writing.title': 'Sinhala Handwriting Practice',
    'writing.checkAccuracy': 'Check Accuracy',
    'writing.clear': 'Clear Canvas',
    'writing.accuracyScore': 'Handwriting Accuracy',

    // Chatbot
    'chatbot.title': 'Sinhala AI Tutor',
    'chatbot.offlineMode': 'Offline Mode (Local Pattern Matching)',
    'chatbot.geminiMode': 'Live Gemini AI Mode',
    'chatbot.enterApiKey': 'Enter Google Gemini API Key',
    'chatbot.apiKeyPlaceholder': 'AIzaSy...',
    'chatbot.saveKey': 'Save API Key',

    // Common
    'common.xp': 'XP',
    'common.streak': 'Day Streak',
    'common.level': 'Level',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.completed': 'Completed',
    'common.back': 'Back',

    // Alphabet Section
    'alphabet.title': 'The Complete Sinhala Alphabet',
    'alphabet.subtitle': 'Click any letter to see details and hear pronunciation',
    'alphabet.allLetters': 'All',
    'alphabet.vowels': 'Vowels',
    'alphabet.consonants': 'Consonants',
    'alphabet.customWord': 'Custom Sinhala Word Pronouncer',
    'alphabet.customWordDesc': 'Type or paste any Sinhala word to hear pronunciation',
    'alphabet.speak': 'Speak',
    'alphabet.hearPronunciation': 'Hear Pronunciation',
    'alphabet.maleVoice': 'Male Voice',
    'alphabet.femaleVoice': 'Female Voice',
    'alphabet.switchMale': 'Switch to Male',
    'alphabet.switchFemale': 'Switch to Female',

    // Lessons
    'lessons.title': 'Lessons',
    'lessons.backToLessons': 'Back to Lessons',
    'lessons.vocabulary': 'Vocabulary',
    'lessons.tapToReveal': 'Tap each card to reveal • Learn all to complete',
    'lessons.takeQuiz': 'Take Quiz',
    'lessons.markLearned': 'Mark as Learned (+10 XP)',
    'lessons.words': 'words',
    'lessons.completed': 'Lesson Completed!',
    'lessons.completedSinhala': 'පාඩම සම්පූර්ණයි!',
    'lessons.keepStudying': 'Keep Studying',
    'lessons.takeLessonQuiz': 'Take Lesson Quiz',

    // Quiz
    'quiz.question': 'Question',
    'quiz.of': 'of',
    'quiz.correct': 'Correct!',
    'quiz.incorrect': 'Not quite!',
    'quiz.perfectScore': 'Perfect Score!',
    'quiz.excellent': 'Excellent!',
    'quiz.goodTry': 'Good Try!',
    'quiz.keepPracticing': 'Keep Practicing!',
    'quiz.tryAgain': 'Try Again',
    'quiz.seeResults': 'See Results',
    'quiz.nextQuestion': 'Next Question',
    'quiz.correctAnswers': 'Correct Answers',
    'quiz.streak': 'streak',

    // Practice
    'practice.title': 'Practice & Play',
    'practice.advancedPath': 'Advanced Learning Path',

    // Grammar
    'grammar.title': 'Grammar',
    'grammar.practiceQuizzes': 'Practice Quizzes (+15 XP)',
    'grammar.checkAnswer': 'Check Answer',
    'grammar.correct': 'Correct!',
    'grammar.incorrect': 'Incorrect',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.stats': 'Stats',
    'dashboard.starred': 'Starred',
    'dashboard.leaderboard': 'Leaderboard',
    'dashboard.cloud': 'Cloud',
    'dashboard.settings': 'Settings',
    'dashboard.dailyGoal': 'Daily Goal',
    'dashboard.achievements': 'Achievements',
    'dashboard.export': 'Export Backup',
    'dashboard.import': 'Import Backup',

    // Conversations
    'conversations.title': 'Conversations',
    'conversations.subtitle': 'Practice real-world dialogues',
    'conversations.showPronunciation': 'Show pronunciation',
    'conversations.revealNext': 'Reveal Next Line',
    'conversations.reset': 'Reset',

    // About
    'about.title': 'About',
    'about.meetCreator': 'Meet the Creator',
    'about.whatsInside': "What's Inside",
    'about.evolution': 'Evolution',

    // Contact
    'contact.title': 'Contact',
    'contact.getInTouch': 'Get In Touch',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.thankYou': 'Thank you!',

    // Flashcards
    'flashcards.title': 'Leitner Flashcards',
    'flashcards.dueForReview': 'Due for Review',
    'flashcards.reviewAll': 'Review All',
    'flashcards.flipCard': 'Tap to flip',

    // Game
    'game.title': 'Word Match Game',
    'game.findPairs': 'Find all pairs!',
    'game.moves': 'Moves',
    'game.time': 'Time',
    'game.newGame': 'New Game',
  },
  si: {
    'nav.home': 'මුල පිටුව',
    'nav.alphabet': 'අක්ෂර මාලාව',
    'nav.lessons': 'පාඩම්',
    'nav.grammar': 'ව්‍යාකරණ',
    'nav.practice': 'පුහුණුව',
    'nav.dashboard': 'දත්ත පුවරුව',
    'nav.about': 'අපි ගැන',
    'nav.chatbot': 'AI සහායක',

    'hero.title': 'සිංහල භාෂාව ලෙහෙසියෙන්ම ප්‍රගුණ කරන්න',
    'hero.subtitle': 'අකුරු, වචන මාලාව, ව්‍යාකරණ සහ ස්වාභාවික කථනය AI මෙවලම් මඟින් ඉගෙන ගන්න.',
    'hero.start': 'නොමිලේ ඉගෙනීම අරඹන්න',
    'hero.explore': 'අක්ෂර මාලාව බලන්න',

    'speech.listen': 'සවන් දෙන්න',
    'speech.speak': 'මයික්‍රෆෝනයෙන් කියන්න',
    'speech.recording': 'සවන් දෙමින්... දැන් පවසන්න!',
    'speech.evaluating': 'උච්චාරණය පරීක්ෂා කරමින්...',
    'speech.match': 'නිවැරදිතා ලකුණු',
    'speech.tryAgain': 'නැවත උත්සාහ කරන්න',

    'writing.title': 'සිංහල අකුරු ලිවීමේ පුහුණුව',
    'writing.checkAccuracy': 'ලියූ අකුර පරීක්ෂා කරන්න',
    'writing.clear': 'මකන්න',
    'writing.accuracyScore': 'අකුරේ නිවැරදිතාවය',

    'chatbot.title': 'සිංහල AI ගුරුතුමා',
    'chatbot.offlineMode': 'Offline Mode (දේශීය රටා පද්ධතිය)',
    'chatbot.geminiMode': 'Live Gemini AI Mode',
    'chatbot.enterApiKey': 'Google Gemini API Key එක ඇතුළත් කරන්න',
    'chatbot.apiKeyPlaceholder': 'AIzaSy...',
    'chatbot.saveKey': 'Key එක සුරකින්න',

    'common.xp': 'ලකුණු (XP)',
    'common.streak': 'දින සාර්ථකත්වය',
    'common.level': 'මට්ටම',
    'common.next': 'ඊළඟ',
    'common.previous': 'පසුගිය',
    'common.completed': 'සම්පූර්ණයි',
    'common.back': 'ආපසු',

    // Alphabet Section
    'alphabet.title': 'සම්පූර්ණ සිංහල අක්ෂර මාලාව',
    'alphabet.subtitle': 'අකුරක් මත ක්ලික් කර විස්තර සහ උච්චාරණය අසන්න',
    'alphabet.allLetters': 'සියල්ල',
    'alphabet.vowels': 'ස්වර',
    'alphabet.consonants': 'ව්‍යඤ්ජන',
    'alphabet.customWord': 'සිංහල වචන උච්චාරණය',
    'alphabet.customWordDesc': 'ඕනෑම සිංහල වචනයක් ටයිප් කර එහි උච්චාරණය අසන්න',
    'alphabet.speak': 'කියන්න',
    'alphabet.hearPronunciation': 'උච්චාරණය අසන්න',
    'alphabet.maleVoice': 'පිරිමි කටහඬ',
    'alphabet.femaleVoice': 'කාන්තා කටහඬ',
    'alphabet.switchMale': 'පිරිමි කටහඬට මාරුවන්න',
    'alphabet.switchFemale': 'කාන්තා කටහඬට මාරුවන්න',

    // Lessons
    'lessons.title': 'පාඩම්',
    'lessons.backToLessons': 'ආපසු පාඩම් වලට',
    'lessons.vocabulary': 'වචන මාලාව',
    'lessons.tapToReveal': 'අනාවරණය කිරීමට කාඩ්පත මත තට්ටු කරන්න • සියල්ල ඉගෙන ගෙන අවසන් කරන්න',
    'lessons.takeQuiz': 'ප්‍රශ්නාවලියට යන්න',
    'lessons.markLearned': 'ඉගෙන ගත් ලෙස සලකුණු කරන්න (+10 XP)',
    'lessons.words': 'වචන',
    'lessons.completed': 'පාඩම සම්පූර්ණයි!',
    'lessons.completedSinhala': 'පාඩම සම්පූර්ණයි!',
    'lessons.keepStudying': 'දිගටම ඉගෙන ගන්න',
    'lessons.takeLessonQuiz': 'පාඩම් ප්‍රශ්නාවලියට යන්න',

    // Quiz
    'quiz.question': 'ප්‍රශ්නය',
    'quiz.of': 'වෙතින්',
    'quiz.correct': 'නිවැරදියි!',
    'quiz.incorrect': 'වැරදියි!',
    'quiz.perfectScore': 'පරිපූර්ණ ලකුණු!',
    'quiz.excellent': 'විශිෂ්ටයි!',
    'quiz.goodTry': 'හොඳ උත්සාහයක්!',
    'quiz.keepPracticing': 'දිගටම පුහුණු වන්න!',
    'quiz.tryAgain': 'නැවත උත්සාහ කරන්න',
    'quiz.seeResults': 'ප්‍රතිඵල බලන්න',
    'quiz.nextQuestion': 'ඊළඟ ප්‍රශ්නය',
    'quiz.correctAnswers': 'නිවැරදි පිළිතුරු',
    'quiz.streak': 'දින ගණන',

    // Practice
    'practice.title': 'පුහුණුව සහ ක්‍රීඩා',
    'practice.advancedPath': 'උසස් ඉගෙනුම් මාර්ගය',

    // Grammar
    'grammar.title': 'ව්‍යාකරණ',
    'grammar.practiceQuizzes': 'පුහුණු ප්‍රශ්නාවලි (+15 XP)',
    'grammar.checkAnswer': 'පිළිතුර පරීක්ෂා කරන්න',
    'grammar.correct': 'නිවැරදියි!',
    'grammar.incorrect': 'වැරදියි!',

    // Dashboard
    'dashboard.title': 'දත්ත පුවරුව',
    'dashboard.stats': 'සංඛ්‍යාලේඛන',
    'dashboard.starred': 'තරු කළ',
    'dashboard.leaderboard': 'ප්‍රමුඛ පුවරුව',
    'dashboard.cloud': 'Cloud',
    'dashboard.settings': 'සැකසුම්',
    'dashboard.dailyGoal': 'දෛනික ඉලක්කය',
    'dashboard.achievements': 'ජයග්‍රහණ',
    'dashboard.export': 'දත්ත අපනයනය කරන්න',
    'dashboard.import': 'දත්ත ආනයනය කරන්න',

    // Conversations
    'conversations.title': 'සංවාද',
    'conversations.subtitle': 'සැබෑ ලෝකයේ සංවාද පුහුණු වන්න',
    'conversations.showPronunciation': 'උච්චාරණය පෙන්වන්න',
    'conversations.revealNext': 'ඊළඟ පේළිය පෙන්වන්න',
    'conversations.reset': 'නැවත සකසන්න',

    // About
    'about.title': 'අපි ගැන',
    'about.meetCreator': 'නිර්මාපකයා හමුවන්න',
    'about.whatsInside': 'ඇතුළත් දේවල්',
    'about.evolution': 'පරිණාමය',

    // Contact
    'contact.title': 'සම්බන්ධ වන්න',
    'contact.getInTouch': 'අප හා සම්බන්ධ වන්න',
    'contact.name': 'නම',
    'contact.email': 'විද්‍යුත් තැපෑල',
    'contact.message': 'පණිවිඩය',
    'contact.send': 'පණිවිඩය යවන්න',
    'contact.thankYou': 'ස්තූතියි!',

    // Flashcards
    'flashcards.title': 'Leitner ෆ්ලෑෂ් කාඩ්පත්',
    'flashcards.dueForReview': 'සමාලෝචනය සඳහා',
    'flashcards.reviewAll': 'සියල්ල සමාලෝචනය කරන්න',
    'flashcards.flipCard': 'හැරවීමට තට්ටු කරන්න',

    // Game
    'game.title': 'වචන ගැලපීමේ ක්‍රීඩාව',
    'game.findPairs': 'සියලුම යුගල සොයන්න!',
    'game.moves': 'චලන',
    'game.time': 'කාලය',
    'game.newGame': 'නව ක්‍රීඩාවක්',
  },
  ta: {
    'nav.home': 'முகப்பு',
    'nav.alphabet': 'எழுத்துக்கள்',
    'nav.lessons': 'பாடங்கள்',
    'nav.grammar': 'இலக்கணம்',
    'nav.practice': 'பயிற்சி',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.about': 'எங்களைப் பற்றி',
    'nav.chatbot': 'AI உதவியாளர்',

    'hero.title': 'சிங்கள மொழியை எளிதாகக் கற்றுக்கொள்ளுங்கள்',
    'hero.subtitle': 'எழுத்துக்கள், சொற்கள் மற்றும் இலக்கணத்தை AI கருவிகள் மூலம் கற்றுக்கொள்ளுங்கள்.',
    'hero.start': 'இலவசமாக தொடங்குங்கள்',
    'hero.explore': 'எழுத்துக்களை ஆராயுங்கள்',

    'speech.listen': 'கேளுங்கள்',
    'speech.speak': 'பேசுங்கள்',
    'speech.recording': 'கேட்கிறது... பேசுங்கள்!',
    'speech.evaluating': 'மதிப்பிடுகிறது...',
    'speech.match': 'துல்லிய மதிப்பெண்',
    'speech.tryAgain': 'மீண்டும் முயற்சிக்கவும்',

    'writing.title': 'சிங்கள எழுத்துப் பயிற்சி',
    'writing.checkAccuracy': 'துல்லியத்தைச் சரிபார்க்கவும்',
    'writing.clear': 'அழி',
    'writing.accuracyScore': 'எழுத்து துல்லியம்',

    'chatbot.title': 'சிங்கள AI ஆசிரியர்',
    'chatbot.offlineMode': 'ஆஃப்லைன் பயன்முறை',
    'chatbot.geminiMode': 'லைவ் Gemini AI பயன்முறை',
    'chatbot.enterApiKey': 'Gemini API Key ஐ உள்ளிடவும்',
    'chatbot.apiKeyPlaceholder': 'AIzaSy...',
    'chatbot.saveKey': 'சேமிக்க',

    'common.xp': 'XP',
    'common.streak': 'நாட்கள்',
    'common.level': 'நிலை',
    'common.next': 'அடுத்தது',
    'common.previous': 'முந்தையது',
    'common.completed': 'முடிந்தது',
    'common.back': 'பின்னால்',

    // Alphabet Section
    'alphabet.title': 'முழுமையான சிங்கள நெடுங்கணக்கு',
    'alphabet.subtitle': 'விவரங்கள் மற்றும் உச்சரிப்பைக் கேட்க எந்தவொரு எழுத்தையும் கிளிக் செய்க',
    'alphabet.allLetters': 'அனைத்தும்',
    'alphabet.vowels': 'உயிரெழுத்துக்கள்',
    'alphabet.consonants': 'மெய்யெழுத்துக்கள்',
    'alphabet.customWord': 'தனிப்பயன் சிங்கள சொல் உச்சரிப்பாளர்',
    'alphabet.customWordDesc': 'உச்சரிப்பைக் கேட்க எந்தவொரு சிங்கள வார்த்தையையும் உள்ளிடவும்',
    'alphabet.speak': 'பேசுக',
    'alphabet.hearPronunciation': 'உச்சரிப்பைக் கேளுங்கள்',
    'alphabet.maleVoice': 'ஆண் குரல்',
    'alphabet.femaleVoice': 'பெண் குரல்',
    'alphabet.switchMale': 'ஆண் குரலுக்கு மாறு',
    'alphabet.switchFemale': 'பெண் குரலுக்கு மாறு',

    // Lessons
    'lessons.title': 'பாடங்கள்',
    'lessons.backToLessons': 'பாடங்களுக்குத் திரும்பு',
    'lessons.vocabulary': 'சொற்களஞ்சியம்',
    'lessons.tapToReveal': 'வெளிப்படுத்த ஒவ்வொரு அட்டையையும் தட்டவும்',
    'lessons.takeQuiz': 'வினாடி வினா எடு',
    'lessons.markLearned': 'கற்றுக்கொண்டதாகக் குறிக்கவும் (+10 XP)',
    'lessons.words': 'சொற்கள்',
    'lessons.completed': 'பாடம் முடிந்தது!',
    'lessons.completedSinhala': 'පාඩම සම්පූර්ණයි!',
    'lessons.keepStudying': 'தொடர்ந்து படியுங்கள்',
    'lessons.takeLessonQuiz': 'பாட வினாடி வினா எடு',

    // Quiz
    'quiz.question': 'கேள்வி',
    'quiz.of': 'இல்',
    'quiz.correct': 'சரியானது!',
    'quiz.incorrect': 'தவறு!',
    'quiz.perfectScore': 'சரியான மதிப்பெண்!',
    'quiz.excellent': 'சிறப்பானது!',
    'quiz.goodTry': 'நல்ல முயற்சி!',
    'quiz.keepPracticing': 'தொடர்ந்து பயிற்சி செய்யுங்கள்!',
    'quiz.tryAgain': 'மீண்டும் முயற்சிக்கவும்',
    'quiz.seeResults': 'முடிவுகளைக் காண்க',
    'quiz.nextQuestion': 'அடுத்த கேள்வி',
    'quiz.correctAnswers': 'சரியான பதில்கள்',
    'quiz.streak': 'தொடர்',

    // Practice
    'practice.title': 'பயிற்சி & விளையாட்டு',
    'practice.advancedPath': 'மேம்பட்ட கற்றல் பாதை',

    // Grammar
    'grammar.title': 'இலக்கணம்',
    'grammar.practiceQuizzes': 'பயிற்சி வினாடி வினாக்கள் (+15 XP)',
    'grammar.checkAnswer': 'பதிலைச் சரிபார்க்கவும்',
    'grammar.correct': 'சரியானது!',
    'grammar.incorrect': 'தவறு',

    // Dashboard
    'dashboard.title': 'டாஷ்போர்டு',
    'dashboard.stats': 'புள்ளிவிவரங்கள்',
    'dashboard.starred': 'நட்சத்திரமிட்டவை',
    'dashboard.leaderboard': 'லீடர்போர்டு',
    'dashboard.cloud': 'கிளவுட்',
    'dashboard.settings': 'அமைப்புகள்',
    'dashboard.dailyGoal': 'தினசரி இலக்கு',
    'dashboard.achievements': 'சாதனைகள்',
    'dashboard.export': 'காப்புப்பிரதியை ஏற்றுமதி செய்',
    'dashboard.import': 'காப்புப்பிரதியை இறக்குமதி செய்',

    // Conversations
    'conversations.title': 'உரையாடல்கள்',
    'conversations.subtitle': 'உண்மையான உரையாடல்களைப் பயிற்சி செய்யுங்கள்',
    'conversations.showPronunciation': 'உச்சரிப்பைக் காட்டு',
    'conversations.revealNext': 'அடுத்த வரியை வெளிப்படுத்து',
    'conversations.reset': 'மீட்டமை',

    // About
    'about.title': 'பற்றி',
    'about.meetCreator': 'உருவாக்கியவரை சந்திக்கவும்',
    'about.whatsInside': 'உள்ளே என்ன இருக்கிறது',
    'about.evolution': 'பரிணாமம்',

    // Contact
    'contact.title': 'தொடர்பு கொள்ள',
    'contact.getInTouch': 'தொடர்பு கொள்ளுங்கள்',
    'contact.name': 'பெயர்',
    'contact.email': 'மின்னஞ்சல்',
    'contact.message': 'செய்தி',
    'contact.send': 'செய்தியை அனுப்பு',
    'contact.thankYou': 'நன்றி!',

    // Flashcards
    'flashcards.title': 'லீட்னர் ஃபிளாஷ் கார்டுகள்',
    'flashcards.dueForReview': 'மதிப்பாய்வு செய்ய வேண்டியவை',
    'flashcards.reviewAll': 'அனைத்தையும் மதிப்பாய்வு செய்',
    'flashcards.flipCard': 'புரட்டத் தட்டவும்',

    // Game
    'game.title': 'சொல் பொருத்துதல் விளையாட்டு',
    'game.findPairs': 'அனைத்து ஜோடிகளையும் கண்டுபிடி!',
    'game.moves': 'நகர்வுகள்',
    'game.time': 'நேரம்',
    'game.newGame': 'புதிய விளையாட்டு',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.alphabet': 'Alphabet',
    'nav.lessons': 'Lektionen',
    'nav.grammar': 'Grammatik',
    'nav.practice': 'Üben',
    'nav.dashboard': 'Dashboard',
    'nav.about': 'Über uns',
    'nav.chatbot': 'AI-Assistent',

    'hero.title': 'Sinhala Sprache leicht meistern',
    'hero.subtitle': 'Lernen Sie Buchstaben, Vokabeln und Grammatik mit interaktiven KI-Tools.',
    'hero.start': 'Kostenlos starten',
    'hero.explore': 'Alphabet erkunden',

    'speech.listen': 'Anhören',
    'speech.speak': 'Sprechen',
    'speech.recording': 'Zuhören... Jetzt sprechen!',
    'speech.evaluating': 'Genauigkeit bewerten...',
    'speech.match': 'Genauigkeitswert',
    'speech.tryAgain': 'Erneut versuchen',

    'writing.title': 'Sinhala Schreibübungen',
    'writing.checkAccuracy': 'Genauigkeit prüfen',
    'writing.clear': 'Löschen',
    'writing.accuracyScore': 'Schreibgenauigkeit',

    'chatbot.title': 'Sinhala KI-Tutor',
    'chatbot.offlineMode': 'Offline-Modus',
    'chatbot.geminiMode': 'Live Gemini KI-Modus',
    'chatbot.enterApiKey': 'Gemini API-Schlüssel eingeben',
    'chatbot.apiKeyPlaceholder': 'AIzaSy...',
    'chatbot.saveKey': 'Speichern',

    'common.xp': 'XP',
    'common.streak': 'Tage-Streak',
    'common.level': 'Level',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.completed': 'Abgeschlossen',
    'common.back': 'Zurück',

    // Alphabet Section
    'alphabet.title': 'Das komplette Sinhala-Alphabet',
    'alphabet.subtitle': 'Klicken Sie auf einen Buchstaben, um Details zu sehen und die Aussprache zu hören',
    'alphabet.allLetters': 'Alle',
    'alphabet.vowels': 'Vokale',
    'alphabet.consonants': 'Konsonanten',
    'alphabet.customWord': 'Benutzerdefinierter Sinhala-Wort-Aussprachet',
    'alphabet.customWordDesc': 'Geben Sie ein beliebiges Sinhala-Wort ein, um die Aussprache zu hören',
    'alphabet.speak': 'Sprechen',
    'alphabet.hearPronunciation': 'Aussprache hören',
    'alphabet.maleVoice': 'Männliche Stimme',
    'alphabet.femaleVoice': 'Weibliche Stimme',
    'alphabet.switchMale': 'Zu männlich wechseln',
    'alphabet.switchFemale': 'Zu weiblich wechseln',

    // Lessons
    'lessons.title': 'Lektionen',
    'lessons.backToLessons': 'Zurück zu Lektionen',
    'lessons.vocabulary': 'Wortschatz',
    'lessons.tapToReveal': 'Tippen, um aufzudecken • Alle lernen, um abzuschließen',
    'lessons.takeQuiz': 'Quiz machen',
    'lessons.markLearned': 'Als gelernt markieren (+10 XP)',
    'lessons.words': 'Wörter',
    'lessons.completed': 'Lektion abgeschlossen!',
    'lessons.completedSinhala': 'පාඩම සම්පූර්ණයි!',
    'lessons.keepStudying': 'Weiter lernen',
    'lessons.takeLessonQuiz': 'Lektions-Quiz machen',

    // Quiz
    'quiz.question': 'Frage',
    'quiz.of': 'von',
    'quiz.correct': 'Richtig!',
    'quiz.incorrect': 'Nicht ganz!',
    'quiz.perfectScore': 'Perfektes Ergebnis!',
    'quiz.excellent': 'Ausgezeichnet!',
    'quiz.goodTry': 'Guter Versuch!',
    'quiz.keepPracticing': 'Weiter üben!',
    'quiz.tryAgain': 'Erneut versuchen',
    'quiz.seeResults': 'Ergebnisse ansehen',
    'quiz.nextQuestion': 'Nächste Frage',
    'quiz.correctAnswers': 'Richtige Antworten',
    'quiz.streak': 'Streak',

    // Practice
    'practice.title': 'Üben & Spielen',
    'practice.advancedPath': 'Erweiterter Lernpfad',

    // Grammar
    'grammar.title': 'Grammatik',
    'grammar.practiceQuizzes': 'Übungs-Quizze (+15 XP)',
    'grammar.checkAnswer': 'Antwort prüfen',
    'grammar.correct': 'Richtig!',
    'grammar.incorrect': 'Falsch',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.stats': 'Statistiken',
    'dashboard.starred': 'Markiert',
    'dashboard.leaderboard': 'Bestenliste',
    'dashboard.cloud': 'Cloud',
    'dashboard.settings': 'Einstellungen',
    'dashboard.dailyGoal': 'Tagesziel',
    'dashboard.achievements': 'Erfolge',
    'dashboard.export': 'Backup exportieren',
    'dashboard.import': 'Backup importieren',

    // Conversations
    'conversations.title': 'Gespräche',
    'conversations.subtitle': 'Echte Dialoge üben',
    'conversations.showPronunciation': 'Aussprache anzeigen',
    'conversations.revealNext': 'Nächste Zeile aufdecken',
    'conversations.reset': 'Zurücksetzen',

    // About
    'about.title': 'Über uns',
    'about.meetCreator': 'Triff den Entwickler',
    'about.whatsInside': 'Was drin ist',
    'about.evolution': 'Entwicklung',

    // Contact
    'contact.title': 'Kontakt',
    'contact.getInTouch': 'Kontakt aufnehmen',
    'contact.name': 'Name',
    'contact.email': 'E-Mail',
    'contact.message': 'Nachricht',
    'contact.send': 'Nachricht senden',
    'contact.thankYou': 'Danke!',

    // Flashcards
    'flashcards.title': 'Leitner-Lernkarten',
    'flashcards.dueForReview': 'Zur Überprüfung fällig',
    'flashcards.reviewAll': 'Alle überprüfen',
    'flashcards.flipCard': 'Zum Umdrehen tippen',

    // Game
    'game.title': 'Wort-Match-Spiel',
    'game.findPairs': 'Finde alle Paare!',
    'game.moves': 'Züge',
    'game.time': 'Zeit',
    'game.newGame': 'Neues Spiel',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.alphabet': 'Alphabet',
    'nav.lessons': 'Leçons',
    'nav.grammar': 'Grammaire',
    'nav.practice': 'Pratique',
    'nav.dashboard': 'Tableau de bord',
    'nav.about': 'À propos',
    'nav.chatbot': 'Assistant IA',

    'hero.title': 'Maîtrisez la langue cingalaise facilement',
    'hero.subtitle': 'Apprenez les lettres, le vocabulaire et la grammaire avec des outils IA.',
    'hero.start': 'Commencer gratuitement',
    'hero.explore': 'Explorer l\'alphabet',

    'speech.listen': 'Écouter',
    'speech.speak': 'Prononcer',
    'speech.recording': 'Écoute en cours...',
    'speech.evaluating': 'Évaluation...',
    'speech.match': 'Score de précision',
    'speech.tryAgain': 'Réessayer',

    'writing.title': 'Pratique de l\'écriture cingalaise',
    'writing.checkAccuracy': 'Vérifier la précision',
    'writing.clear': 'Effacer',
    'writing.accuracyScore': 'Précision d\'écriture',

    'chatbot.title': 'Tuteur IA Cingalais',
    'chatbot.offlineMode': 'Mode Hors Ligne',
    'chatbot.geminiMode': 'Mode Gemini IA en direct',
    'chatbot.enterApiKey': 'Entrez la clé API Gemini',
    'chatbot.apiKeyPlaceholder': 'AIzaSy...',
    'chatbot.saveKey': 'Enregistrer',

    'common.xp': 'XP',
    'common.streak': 'Jours consécutifs',
    'common.level': 'Niveau',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.completed': 'Terminé',
    'common.back': 'Retour',

    // Alphabet Section
    'alphabet.title': 'L\'alphabet cinghalais complet',
    'alphabet.subtitle': 'Cliquez sur n\'importe quelle lettre pour voir les détails et entendre la prononciation',
    'alphabet.allLetters': 'Tous',
    'alphabet.vowels': 'Voyelles',
    'alphabet.consonants': 'Consonnes',
    'alphabet.customWord': 'Prononciateur de mots cinghalais',
    'alphabet.customWordDesc': 'Tapez un mot cinghalais pour entendre la prononciation',
    'alphabet.speak': 'Parler',
    'alphabet.hearPronunciation': 'Entendre la prononciation',
    'alphabet.maleVoice': 'Voix masculine',
    'alphabet.femaleVoice': 'Voix féminine',
    'alphabet.switchMale': 'Passer à l\'homme',
    'alphabet.switchFemale': 'Passer à la femme',

    // Lessons
    'lessons.title': 'Leçons',
    'lessons.backToLessons': 'Retour aux leçons',
    'lessons.vocabulary': 'Vocabulaire',
    'lessons.tapToReveal': 'Appuyez pour révéler • Tout apprendre pour terminer',
    'lessons.takeQuiz': 'Faire le quiz',
    'lessons.markLearned': 'Marquer comme appris (+10 XP)',
    'lessons.words': 'mots',
    'lessons.completed': 'Leçon terminée !',
    'lessons.completedSinhala': 'පාඩම සම්පූර්ණයි!',
    'lessons.keepStudying': 'Continuer à étudier',
    'lessons.takeLessonQuiz': 'Faire le quiz de la leçon',

    // Quiz
    'quiz.question': 'Question',
    'quiz.of': 'sur',
    'quiz.correct': 'Correct !',
    'quiz.incorrect': 'Pas tout à fait !',
    'quiz.perfectScore': 'Score parfait !',
    'quiz.excellent': 'Excellent !',
    'quiz.goodTry': 'Bel essai !',
    'quiz.keepPracticing': 'Continuez à pratiquer !',
    'quiz.tryAgain': 'Réessayer',
    'quiz.seeResults': 'Voir les résultats',
    'quiz.nextQuestion': 'Question suivante',
    'quiz.correctAnswers': 'Bonnes réponses',
    'quiz.streak': 'série',

    // Practice
    'practice.title': 'Pratique & Jeu',
    'practice.advancedPath': 'Parcours d\'apprentissage avancé',

    // Grammar
    'grammar.title': 'Grammaire',
    'grammar.practiceQuizzes': 'Quiz de pratique (+15 XP)',
    'grammar.checkAnswer': 'Vérifier la réponse',
    'grammar.correct': 'Correct !',
    'grammar.incorrect': 'Incorrect',

    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.stats': 'Statistiques',
    'dashboard.starred': 'Favoris',
    'dashboard.leaderboard': 'Classement',
    'dashboard.cloud': 'Nuage',
    'dashboard.settings': 'Paramètres',
    'dashboard.dailyGoal': 'Objectif quotidien',
    'dashboard.achievements': 'Réalisations',
    'dashboard.export': 'Exporter la sauvegarde',
    'dashboard.import': 'Importer la sauvegarde',

    // Conversations
    'conversations.title': 'Conversations',
    'conversations.subtitle': 'Pratiquer des dialogues réels',
    'conversations.showPronunciation': 'Afficher la prononciation',
    'conversations.revealNext': 'Révéler la ligne suivante',
    'conversations.reset': 'Réinitialiser',

    // About
    'about.title': 'À propos',
    'about.meetCreator': 'Rencontrez le créateur',
    'about.whatsInside': 'Ce qu\'il y a à l\'intérieur',
    'about.evolution': 'Évolution',

    // Contact
    'contact.title': 'Contact',
    'contact.getInTouch': 'Entrer en contact',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le message',
    'contact.thankYou': 'Merci !',

    // Flashcards
    'flashcards.title': 'Cartes mémoire Leitner',
    'flashcards.dueForReview': 'À réviser',
    'flashcards.reviewAll': 'Tout réviser',
    'flashcards.flipCard': 'Appuyez pour retourner',

    // Game
    'game.title': 'Jeu d\'association de mots',
    'game.findPairs': 'Trouvez toutes les paires !',
    'game.moves': 'Coups',
    'game.time': 'Temps',
    'game.newGame': 'Nouvelle partie',
  },
};
