import { useState } from 'react';

interface ContactSectionProps {
  darkMode: boolean;
}

export default function ContactSection({ darkMode }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Formspree එකට ඩේටා යවන අලුත් handleSubmit එක
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://formspree.io/f/mdajnqee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        // මැසේජ් එක යැව්වට පස්සේ success UI එක පෙන්නනවා
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert("Oops! There was a problem submitting your form");
      }
    } catch (error) {
      alert("Error sending message. Please try again later.");
    }
  };

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

  const inputStyles = `w-full px-4 py-3.5 rounded-xl text-sm transition-all duration-300 outline-none ${
    darkMode
      ? 'bg-slate-800/60 border border-slate-700/50 text-white placeholder:text-slate-600 focus:border-saffron-500/50 focus:bg-slate-800'
      : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-saffron-400 focus:shadow-lg focus:shadow-saffron-100/30'
  }`;

  return (
    <section id="contact" className={`py-16 sm:py-24 px-5 sm:px-6 ${darkMode ? 'bg-slate-900/50' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-5 ${
            darkMode ? 'glass-glow text-saffron-400' : 'bg-saffron-100 text-saffron-700'
          }`}>
            ✉️ Get In Touch
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 font-space tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Contact <span className="text-saffron-500">Us</span>
          </h2>
          <p className={`text-base sm:text-lg max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Have feedback, suggestions, or just want to say <span className="sinhala-text text-saffron-500 font-medium">ආයුබෝවන්</span>?
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className={`rounded-3xl p-6 sm:p-8 ${darkMode ? 'glass-dark' : 'glass-card'}`}>
              {submitted ? (
                <div className="text-center py-12 animate-scale-in">
                  <span className="text-6xl block mb-4">🎉</span>
                  <h3 className={`text-2xl font-bold mb-2 font-space ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <span className="sinhala-text">ස්තූතියි!</span> Thank you!
                  </h3>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your message has been received. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Name
                      </label>
                      <input type="text" required placeholder="Your name" value={formData.name}
                        onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                        className={inputStyles} />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Email
                      </label>
                      <input type="email" required placeholder="you@example.com" value={formData.email}
                        onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                        className={inputStyles} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Message
                    </label>
                    <textarea required rows={5} placeholder="Tell us what you think, or ask a question..."
                      value={formData.message}
                      onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                      className={`${inputStyles} resize-none`} />
                  </div>
                  <button type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold rounded-xl shadow-lg shadow-saffron-500/20 hover:shadow-saffron-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm">
                    Send Message 🚀
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick info cards */}
            <div className={`rounded-2xl p-6 ${darkMode ? 'glass-dark' : 'glass-card'}`}>
              <h4 className={`font-bold mb-4 font-space ${darkMode ? 'text-white' : 'text-slate-900'}`}>📍 Quick Info</h4>
              <div className="space-y-4">
                {[
                  { label: 'Project', value: 'සිංහල පුළුවන්ද? v6.1', isSinhala: true },
                  { label: 'Type', value: 'Open-Source Language Learning' },
                  { label: 'Language', value: 'Sinhala (Sri Lanka)' },
                  { label: 'Status', value: '🟢 Active Development' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</span>
                    <span className={`text-sm text-right font-medium ${item.isSinhala ? 'sinhala-text text-saffron-500' : darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className={`rounded-2xl p-6 ${darkMode ? 'glass-dark' : 'glass-card'}`}>
              <h4 className={`font-bold mb-4 font-space ${darkMode ? 'text-white' : 'text-slate-900'}`}>🌐 Connect With Us</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      darkMode
                        ? `bg-slate-800/50 border border-slate-700/40 text-slate-400 ${s.color} hover:border-slate-600`
                        : `bg-white border border-slate-200 text-slate-500 ${s.color} hover:border-slate-300 hover:shadow-sm`
                    }`}>
                    <span className="transition-transform duration-300 group-hover:scale-110">{s.icon}</span>
                    <span className="text-xs">{s.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Sinhala greeting */}
            <div className={`rounded-2xl p-5 text-center ${darkMode ? 'glass-glow' : 'bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-200'}`}>
              <p className="sinhala-text text-2xl font-bold text-saffron-500 mb-1">ඔබට ස්තූතියි!</p>
              <p className={`text-sm ${darkMode ? 'text-saffron-400/60' : 'text-saffron-600'}`}>Thank you for visiting!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}