const ADVANCED_TIPS = [
  { icon: '📖', title: '60-Letter Alphabet', desc: 'Master all 18 vowels + 42 consonants with male/female voice pronunciation' },
  { icon: '📐', title: 'Grammar via Chatbot', desc: 'Ask the AI about word order (SOV), verb tenses, pronouns, and plurals' },
  { icon: '🔁', title: 'Spaced Repetition', desc: 'Review lessons multiple times — flip cards, then quiz to lock in memory' },
  { icon: '🎯', title: 'Daily XP Goal', desc: 'Hit 50 XP daily to maintain your streak and unlock achievements' },
];

interface PracticeSectionProps {
  darkMode: boolean;
  level: number;
  onOpenGame: () => void;
  onOpenConversation: () => void;
  onOpenChatbot: () => void;
  onOpenWritingPractice: () => void;
  onOpenFlashcards: () => void;
}

export default function PracticeSection({
  darkMode, level, onOpenGame, onOpenConversation, onOpenChatbot, onOpenWritingPractice, onOpenFlashcards
}: PracticeSectionProps) {
  const activities = [
    {
      title: 'AI Sinhala Helper',
      titleSinhala: 'AI සිංහල සහායක',
      description: 'Chat with our deep AI assistant! Grammar, translations, cultural tips, pronunciation guides — ask anything.',
      icon: '🤖',
      color: 'from-saffron-50 to-orange-100 dark:from-saffron-950/20 dark:to-orange-950/10 border border-saffron-200/50 dark:border-saffron-900/30',
      action: onOpenChatbot,
      cta: 'Chat Now',
      badge: 'ENHANCED',
      locked: level < 2,
      lockMessage: 'Level 2 Required'
    },
    {
      title: 'Writing Practice',
      titleSinhala: 'අකුරු ලිවීම',
      description: 'Practice writing Sinhala letters on an interactive canvas. Track your brush strokes and get pronunciation guides.',
      icon: '✍️',
      color: 'from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-950/10 border border-amber-200/50 dark:border-amber-900/30',
      action: onOpenWritingPractice,
      cta: 'Practice Writing',
      locked: false
    },
    {
      title: 'Leitner Flashcards',
      titleSinhala: 'මතක පුවරු',
      description: 'Spaced repetition flashcards with 3D card flips. The smart algorithm schedules words you need to review.',
      icon: '🎯',
      color: 'from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/30',
      action: onOpenFlashcards,
      cta: 'Start Review',
      locked: false
    },
    {
      title: 'Real Conversations',
      titleSinhala: 'සංවාද පුහුණුව',
      description: '6 real-world dialogues — pharmacy, tuk-tuk, hotel, market, doctor, making friends. Step-by-step reveal with audio.',
      icon: '💬',
      color: 'from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-950/10 border border-blue-200/50 dark:border-blue-900/30',
      action: onOpenConversation,
      cta: 'Practice Dialogues',
      locked: false
    },
    {
      title: 'Word Match Game',
      titleSinhala: 'වචන ගැලපීම',
      description: 'Memory-style card game matching Sinhala to English. Timer, star rating, XP rewards. Tests recall under pressure.',
      icon: '🃏',
      color: 'from-violet-50 to-purple-100 dark:from-violet-950/20 dark:to-purple-950/10 border border-violet-200/50 dark:border-violet-900/30',
      action: onOpenGame,
      cta: 'Play Now',
      locked: false
    },
  ];

  return (
    <section id="practice" className={`py-16 sm:py-24 px-5 sm:px-6 ${darkMode ? 'bg-slate-900/50' : 'bg-gradient-to-b from-saffron-50/30 to-white'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-5 ${
            darkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30' : 'bg-purple-100 text-purple-700'
          }`}>
            🎮 Practice & Play
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-3 font-space tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <span className="sinhala-text">පුහුණුව</span> — Practice
          </h2>
          <p className={`text-base sm:text-lg max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            AI chatbot, canvas writing practice, Leitner flashcards, conversations, and games
          </p>
        </div>

        {/* Main activities grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {activities.map((activity, i) => (
            <button
              key={i}
              onClick={activity.locked ? undefined : activity.action}
              disabled={activity.locked}
              className={`group text-left rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all duration-400 card-3d relative overflow-hidden ${
                activity.locked
                  ? 'opacity-60 cursor-not-allowed border-dashed'
                  : ''
              } ${
                darkMode ? 'glass-dark hover:border-saffron-700/30' : 'glass-card hover:shadow-xl hover:shadow-purple-100/30'
              }`}
            >
              {activity.locked && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-4 z-20">
                  <span className="text-3xl mb-2">🔒</span>
                  <h4 className="text-white font-bold text-sm font-space">{activity.lockMessage}</h4>
                  <p className="text-slate-400 text-[10px] mt-1">Complete lessons and earn XP to unlock</p>
                </div>
              )}

              {'badge' in activity && activity.badge && !activity.locked && (
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-saffron-500 to-orange-500 text-white text-[8px] font-bold rounded-full uppercase tracking-wider shadow-lg animate-pulse">
                  {activity.badge}
                </span>
              )}
              
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center text-xl sm:text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                {activity.icon}
              </div>
              
              <h3 className={`text-base sm:text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {activity.title}
              </h3>
              
              <p className="sinhala-text text-saffron-500 text-xs sm:text-sm font-medium mb-2">
                {activity.titleSinhala}
              </p>
              
              <p className={`text-[11px] sm:text-xs leading-relaxed mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {activity.description}
              </p>
              
              <span className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              } group-hover:gap-3 transition-all`}>
                {activity.cta}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        {/* Advanced learning tips */}
        <div>
          <h3 className={`text-lg sm:text-xl font-bold text-center mb-6 sm:mb-8 font-space ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            🎓 Advanced Learning Path
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {ADVANCED_TIPS.map((tip, i) => (
              <div key={i} className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 ${
                darkMode ? 'glass-dark' : 'glass-card'
              }`}>
                <span className="text-2xl sm:text-3xl block mb-2">{tip.icon}</span>
                <h4 className={`text-xs sm:text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{tip.title}</h4>
                <p className={`text-[10px] sm:text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
