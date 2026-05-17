import { lessons, Lesson } from '../data/lessons';
import LessonCard from './LessonCard';

interface LessonsSectionProps {
  onSelectLesson: (lesson: Lesson) => void;
  progress: Record<number, number[]>;
  darkMode: boolean;
}

export default function LessonsSection({ onSelectLesson, progress, darkMode }: LessonsSectionProps) {
  return (
    <section id="lessons" className={`py-16 sm:py-24 px-5 sm:px-6 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-5 ${
            darkMode ? 'glass-glow text-saffron-400' : 'bg-saffron-100 text-saffron-700'
          }`}>
            📚 Interactive Lessons
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-3 font-space tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <span className="sinhala-text">පාඩම්</span> — Lessons
          </h2>
          <p className={`text-base sm:text-lg max-w-xl mx-auto ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            12 real-world scenarios with 144 practical phrases. From survival basics to
            tech vocabulary — learn exactly what you need for Sri Lanka.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {lessons.map(lesson => {
            const learned = progress[lesson.id]?.length || 0;
            const total = lesson.words.length;
            const progressPercent = Math.round((learned / total) * 100);
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progressPercent}
                darkMode={darkMode}
                onSelect={onSelectLesson}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
