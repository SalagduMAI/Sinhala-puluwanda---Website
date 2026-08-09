import { useState, useRef, useEffect } from 'react';
import { APP_VERSION, SOCIALS } from '../constants';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdajnqee';

interface ContactSectionProps {
  darkMode: boolean;
}

export default function ContactSection({ darkMode }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  
  const submitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current !== null) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
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
        setSubmitted(true);
        if (submitTimeoutRef.current !== null) {
          window.clearTimeout(submitTimeoutRef.current);
        }
        submitTimeoutRef.current = window.setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert("Oops! There was a problem submitting your form");
      }
    } catch (error) {
      alert("Error sending message. Please try again later.");
    }
  };

  const inputStyles = `w-full px-4 py-3.5 rounded-xl text-sm transition-all duration-300 outline-none ${darkMode
      ? 'bg-slate-800/60 border border-slate-700/50 text-white placeholder:text-slate-600 focus:border-saffron-500/50 focus:bg-slate-800'
      : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-saffron-400 focus:shadow-lg focus:shadow-saffron-100/30'
    }`;

  return (
    <section id="contact" className={`py-16 sm:py-24 px-5 sm:px-6 ${darkMode ? 'bg-slate-900/50' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-5 ${darkMode ? 'glass-glow text-saffron-400' : 'bg-saffron-100 text-saffron-700'
            }`}>
            ✉️ Get In Touch
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 font-space tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Contact <span className="text-saffron-500">Us</span>
          </h2>
          <p className={`text-base sm:text-lg max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Have feedback, suggestions, or just want to say <span className="sinhala-text text-saffron-500 font-medium" lang="si">ආයුබෝවන්</span>?
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
                    <span className="sinhala-text" lang="si">ස්තූතියි!</span> Thank you!
                  </h3>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your message has been received. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="contact-name" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Name
                      </label>
                      <input id="contact-name" type="text" required placeholder="Your name" value={formData.name}
                        onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                        className={inputStyles} />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Email
                      </label>
                      <input id="contact-email" type="email" required placeholder="you@example.com" value={formData.email}
                        onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                        className={inputStyles} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Message
                    </label>
                    <textarea id="contact-message" required rows={5} placeholder="Tell us what you think, or ask a question..."
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
                  { label: 'Project', value: 'සිංහල පුළුවන්ද? v' + APP_VERSION, isSinhala: true },
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
                {SOCIALS.map((s, i) => {
                  const colorClass = typeof s.color === 'function' ? s.color(darkMode) : s.color;
                  return (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${darkMode
                          ? `bg-slate-800/50 border border-slate-700/40 text-slate-400 ${colorClass} hover:border-slate-600`
                          : `bg-white border border-slate-200 text-slate-500 ${colorClass} hover:border-slate-300 hover:shadow-sm`
                        }`}>
                      <span className="transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d={s.iconPath} />
                        </svg>
                      </span>
                      <span className="text-xs">{s.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Sinhala greeting */}
            <div className={`rounded-2xl p-5 text-center ${darkMode ? 'glass-glow' : 'bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-200'}`}>
              <p className="sinhala-text text-2xl font-bold text-saffron-500 mb-1" lang="si">ඔබට ස්තූතියි!</p>
              <p className={`text-sm ${darkMode ? 'text-saffron-400/60' : 'text-saffron-600'}`}>Thank you for visiting!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}