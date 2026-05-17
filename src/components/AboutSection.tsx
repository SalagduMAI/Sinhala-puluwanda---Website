interface AboutSectionProps {
  darkMode: boolean;
}

export default function AboutSection({ darkMode }: AboutSectionProps) {
  const features = [
    { icon: '📖', title: 'Complete Alphabet', desc: 'Learn all 33 essential letters with pronunciation guides, audio playback, and visual breakdowns' },
    { icon: '🎯', title: 'XP & Leveling', desc: 'Earn experience points, level up through 10+ levels, and unlock 14 achievement badges' },
    { icon: '🃏', title: 'Word Match Game', desc: 'Memory-style matching game that reinforces vocabulary through fun, competitive play' },
    { icon: '💬', title: 'Real Conversations', desc: '3 interactive dialogues for travel, dining, and daily life with step-by-step reveal' },
    { icon: '🧪', title: 'Smart Quizzes', desc: 'Bi-directional quizzes testing both Sinhala-to-English and English-to-Sinhala recall' },
    { icon: '🌙', title: 'Dark Mode', desc: 'Stunning dark glassmorphism UI with animated gradients that\'s beautiful day and night' },
    { icon: '🤖', title: 'AI Chatbot', desc: 'Ask anything about Sinhala in English — get instant translations, phrases, and cultural tips' },
    { icon: '🎬', title: 'Cinematic Video', desc: 'Stunning ocean wave video hero with multi-layer particle effects and typewriter animation' },
  ];

  const skills = [
    { name: 'React & TypeScript', level: 95 },
    { name: 'Tailwind CSS', level: 92 },
    { name: 'UI/UX Design', level: 88 },
    { name: 'Sinhala Language', level: 100 },
  ];

  const timeline = [
    { version: '1.0', desc: 'Core alphabet, 6 lessons, vocabulary cards', color: 'from-blue-400 to-blue-600' },
    { version: '2.0', desc: 'XP system, games, dashboard, achievements', color: 'from-purple-400 to-purple-600' },
    { version: '3.0', desc: 'Glassmorphism UI, About, Contact, mobile', color: 'from-emerald-400 to-emerald-600' },
    { version: '4.0', desc: 'Animated hero, 96 words, 8 lessons, upgraded', color: 'from-saffron-400 to-saffron-600' },
    { version: '5.0', desc: 'Cinematic video, real-world practical lessons', color: 'from-rose-400 to-red-600' },
    { version: '6.0', desc: 'AI Chatbot, 12 lessons, 144 words, 6 convos', color: 'from-saffron-400 to-saffron-600' },
    { version: '6.1', desc: 'Sri Lankan cultural video showcase', color: 'from-maroon-400 to-maroon-600' },
  ];

  return (
    <section id="about" className={`py-16 sm:py-24 px-5 sm:px-6 relative overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-white to-slate-50'}`}>
      {/* BG decoration */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] ${darkMode ? 'bg-saffron-500/5' : 'bg-saffron-500/8'}`} />
      <div className={`absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[120px] ${darkMode ? 'bg-purple-500/5' : 'bg-purple-500/5'}`} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-5 ${darkMode ? 'glass-glow text-saffron-400' : 'bg-saffron-100 text-saffron-700'}`}>
            👤 About Me
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 font-space tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Meet the <span className="text-saffron-500">Creator</span>
          </h2>
        </div>

        {/* === PERSONAL ABOUT CARD === */}
        <div className={`rounded-3xl p-6 sm:p-8 md:p-10 mb-14 sm:mb-20 ${darkMode ? 'glass-dark' : 'glass-card'}`}>
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Photo / Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-saffron-400 via-saffron-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-saffron-500/25 overflow-hidden">
                
                {/* object-top කියන class එක add කළා */}
                <img 
                  src="/images/Gemini_Generated_Image_2ztzi02ztzi02ztz.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover object-top"
                />

              </div>
              {/* Status dot */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-leaf-500 rounded-xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg">
                <span className="text-xs">🇱🇰</span>
              </div>
            </div>

            {/* Bio */}
            <div className="text-center lg:text-left flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-3">
                <h3 className={`text-2xl sm:text-3xl font-black font-space ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Amantha I. Salgadu
                </h3>
                <span className={`inline-flex items-center gap-1 self-center lg:self-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'bg-saffron-500/15 text-saffron-400 border border-saffron-500/20' : 'bg-saffron-100 text-saffron-700'}`}>
                  ✦ Full-Stack Developer
                </span>
              </div>

              <p className={`text-sm sm:text-base leading-relaxed mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                I'm a passionate developer from 🇱🇰 Sri Lanka with a deep love for building beautiful,
                interactive web experiences. I created <span className="sinhala-text text-saffron-500 font-semibold">සිංහල පුළුවන්ද?</span> to
                share my native language with the world — making Sinhala learning accessible,
                fun, and modern through gamification and stunning design.
              </p>
              <p className={`text-sm sm:text-base leading-relaxed mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                With expertise in React, TypeScript, and modern CSS, I specialize in crafting
                pixel-perfect UIs with smooth animations and thoughtful user experiences.
                This v6.1 features Sri Lankan cultural video showcase, AI chatbot, 12 real-world
                scenario lessons, 144 practical phrases, 6 conversation dialogues, interactive
                games, a full XP system, and glassmorphism that works on every device.
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                {['Java', 'C#', 'Php/Laravel', 'Python', 'React', 'Javascript', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'Web Speech API', 'Figma'].map(t => (
                  <span key={t} className={`px-3 py-1 rounded-lg text-[10px] sm:text-xs font-medium ${darkMode ? 'bg-slate-800/80 text-slate-400 border border-slate-700/50' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{t}</span>
                ))}
              </div>

              {/* Skills bars */}
              <div className="space-y-3 max-w-md mx-auto lg:mx-0">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{skill.name}</span>
                      <span className={`text-[10px] font-bold ${darkMode ? 'text-saffron-400' : 'text-saffron-600'}`}>{skill.level}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600 transition-all duration-1000"
                        style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* === FEATURES === */}
        <div className="mb-14 sm:mb-20">
          <h3 className={`text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-10 font-space ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            ✨ What's Inside v6.1
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {features.map((f, i) => (
              <div key={i}
                className={`animate-slide-up rounded-2xl p-4 sm:p-6 transition-all duration-300 card-3d ${darkMode ? 'glass-dark hover:border-saffron-800/30' : 'glass-card hover:shadow-lg'}`}
                style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="text-2xl sm:text-3xl block mb-2 sm:mb-3">{f.icon}</span>
                <h4 className={`text-sm sm:text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{f.title}</h4>
                <p className={`text-[10px] sm:text-xs leading-relaxed ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === VERSION TIMELINE === */}
        <div>
          <h3 className={`text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-10 font-space ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            🚀 Evolution
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {timeline.map((t, i) => (
              <div key={i} className={`rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 ${
                i === timeline.length - 1
                  ? darkMode ? 'glass-glow' : 'bg-gradient-to-br from-saffron-50 to-orange-50 border-2 border-saffron-200 shadow-lg shadow-saffron-100/40'
                  : darkMode ? 'glass-dark' : 'glass-card'
              }`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg mx-auto mb-3`}>
                  {t.version}
                </div>
                <p className={`text-[10px] sm:text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.desc}</p>
                {i === timeline.length - 1 && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-saffron-500 text-white">LATEST</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
