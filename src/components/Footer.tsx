import { APP_VERSION, SOCIALS } from '../constants';

interface FooterProps {
  darkMode: boolean;
  onNavigate: (section: string) => void;
}

export default function Footer({ darkMode, onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Learn',
      links: [
        { label: 'Alphabet', id: 'alphabet' },
        { label: 'Lessons', id: 'lessons' },
        { label: 'Practice', id: 'practice' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { label: 'About', id: 'about' },
        { label: 'Contact', id: 'contact' },
      ],
    },
  ];

  const sinhalaQuotes = [
    { si: 'ආයුබෝවන්', en: 'Welcome' },
    { si: 'ස්තූතියි', en: 'Thank you' },
    { si: 'සුබ දවසක්!', en: 'Good day!' },
    { si: 'අපි හමුවෙමු!', en: 'Let\'s meet!' },
    { si: 'ගිහින් එන්නම්', en: 'See you!' },
  ];

  return (
    <footer className={`relative overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-900'}`}>
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-saffron-500/5 rounded-full blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6">
        {/* Main footer content */}
        <div className="pt-14 sm:pt-20 pb-10 sm:pb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-lg shadow-saffron-500/20">
                  <span className="text-white text-xs font-bold sinhala-text">සිං</span>
                </div>
                <div className="text-left">
                  <span className="text-white font-bold text-sm font-space">Sinhala Puluwanda</span>
                  <span className="block text-saffron-500 text-[10px] font-semibold">v{APP_VERSION}</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs text-left">
                The most beautiful and interactive way to learn Sinhala.
                Free, open-source, and crafted with ❤️ for language lovers.
              </p>
              {/* Social icons */}
              <div className="flex gap-2">
                {SOCIALS.map((s, i) => {
                  const colorClass = typeof s.color === 'function' ? s.color(darkMode) : s.color;
                  return (
                    <a key={i} href={s.url} aria-label={s.name} target="_blank" rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center bg-slate-800/80 text-slate-400 hover:bg-slate-800 border border-slate-700/50 transition-all duration-300 hover:scale-110 ${colorClass}`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={s.iconPath} />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links */}
            {footerLinks.map((group, i) => (
              <div key={i} className="text-left">
                <h4 className="text-white font-semibold text-sm mb-4 font-space">{group.title}</h4>
                <ul className="space-y-2.5">
                  {group.links.map((link, j) => (
                    <li key={j}>
                      <button onClick={() => onNavigate(link.id)}
                        className="text-slate-400 hover:text-saffron-400 text-sm transition-colors duration-200">
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Quick Sinhala */}
            <div className="text-left">
              <h4 className="text-white font-semibold text-sm mb-4 font-space">Quick Sinhala</h4>
              <div className="space-y-2.5">
                {sinhalaQuotes.map((q, i) => (
                  <div key={i} className="flex items-center gap-1.5 group">
                    <span className="sinhala-text text-saffron-400/80 text-sm font-medium group-hover:text-saffron-400 transition-colors" lang="si">{q.si}</span>
                    <span className="text-slate-700 text-xs">—</span>
                    <span className="text-slate-500 text-xs">{q.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/60 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} <span className="sinhala-text text-saffron-500/70" lang="si">සිංහල පුළුවන්ද?</span> — All rights reserved. Made by Amantha I. Salgadu.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-slate-500 hover:text-saffron-400 transition-colors text-xs flex items-center gap-1.5 group">
                Back to top
                <svg className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}