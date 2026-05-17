import { Lesson } from '../data/lessons';

interface LessonCardProps {
  lesson: Lesson;
  progress: number;
  darkMode: boolean;
  onSelect: (lesson: Lesson) => void;
}

export default function LessonCard({ lesson, progress, darkMode, onSelect }: LessonCardProps) {
  const difficultyColors = {
    beginner: darkMode ? 'bg-leaf-500/10 text-leaf-400 border border-leaf-500/20' : 'bg-leaf-100 text-leaf-700',
    intermediate: darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-700',
    advanced: darkMode ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-purple-100 text-purple-700',
  };

  return (
    <button onClick={() => onSelect(lesson)}
      className={`group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-left transition-all duration-400 card-3d ${
        darkMode ? 'glass-dark hover:border-saffron-700/30' : 'glass-card hover:shadow-xl hover:shadow-saffron-100/30'
      }`}
      style={{ backgroundImage: lesson.bgPattern }}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${difficultyColors[lesson.difficulty]}`}>
          {lesson.difficulty}
        </span>
        <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${
          darkMode ? 'bg-slate-800/80 text-slate-500' : 'bg-slate-100 text-slate-400'
        }`}>{lesson.words.length} words</span>
      </div>

      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${lesson.color} flex items-center justify-center text-xl sm:text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
        {lesson.icon}
      </div>

      <h3 className={`text-base sm:text-lg font-bold mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{lesson.title}</h3>
      <p className="sinhala-text text-saffron-500 text-xs sm:text-sm font-medium mb-2">{lesson.titleSinhala}</p>
      <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{lesson.description}</p>

      <div className="flex items-center gap-3">
        <div className={`flex-1 h-1.5 sm:h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div className={`h-full rounded-full bg-gradient-to-r ${lesson.color} transition-all duration-700`} style={{ width: `${progress}%` }} />
        </div>
        <span className={`text-[10px] sm:text-xs font-bold ${progress === 100 ? 'text-leaf-500' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {progress === 100 ? '✓' : `${progress}%`}
        </span>
      </div>

      <div className="absolute bottom-5 sm:bottom-6 right-5 sm:right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <svg className="w-5 h-5 text-saffron-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
      </div>
    </button>
  );
}
