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

const socials = [
    { name: 'WhatsApp', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
    ), url: 'https://wa.me/94702507330', color: 'hover:text-green-500' },
    { name: 'GitHub', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    ), url: 'https://github.com/SalagduMAI', color: darkMode ? 'hover:text-white' : 'hover:text-slate-900' },
    { name: 'LinkedIn', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    ), url: 'https://www.linkedin.com/in/amantha-i-salgadu-802bbb30b', color: 'hover:text-blue-500' },
    { name: 'Facebook', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ), url: 'https://www.facebook.com/ishan.salgadu.9', color: 'hover:text-blue-600' },
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
                <div>
                  <span className="text-white font-bold text-sm font-space">Sinhala Puluwanda</span>
                  <span className="block text-saffron-500 text-[10px] font-semibold">v6.1</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
                The most beautiful and interactive way to learn Sinhala.
                Free, open-source, and crafted with ❤️ for language lovers.
              </p>
              {/* Social icons */}
              <div className="flex gap-2">
                {socials.map((s, i) => (
                  <a key={i} href={s.url} aria-label={s.name}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-800/80 text-slate-400 hover:text-saffron-400 hover:bg-slate-800 border border-slate-700/50 hover:border-saffron-800/50 transition-all duration-300 hover:scale-110">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {footerLinks.map((group, i) => (
              <div key={i}>
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
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 font-space">Quick Sinhala</h4>
              <div className="space-y-2.5">
                {sinhalaQuotes.map((q, i) => (
                  <div key={i} className="flex items-center gap-1.5 group">
                    <span className="sinhala-text text-saffron-400/80 text-sm font-medium group-hover:text-saffron-400 transition-colors">{q.si}</span>
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
              © {currentYear} <span className="sinhala-text text-saffron-500/70">සිංහල පුළුවන්ද?</span> — All rights reserved. Made with 🇱🇰
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
